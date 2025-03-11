// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
// import "../chainlink/ChainlinkClient.sol";
import "../chainlink/FunctionsClient.sol";
import "../chainlink/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "../libraries/PathHelpers.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "./IPriceOracle.sol";
import "../vault/Vault.sol";
import "../interfaces/IWETH.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract FunctionsOracle is Initializable, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    address public indexFactoryBalancer;
    address public balancerSender;

    string baseUrl;
    string urlParams;

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent
    address public functionsRouterAddress;

    AggregatorV3Interface public toUsdPriceFeed;

    uint public lastUpdateTime;

    uint public totalOracleList;
    uint public totalCurrentList;

    uint public totalOracleChainSelectors;
    uint public totalCurrentChainSelectors;

    mapping(uint => address) public oracleList;
    mapping(uint => address) public currentList;

    mapping(address => uint) public tokenOracleListIndex;
    mapping(address => uint) public tokenCurrentListIndex;

    mapping(address => uint) public tokenCurrentMarketShare;
    mapping(address => uint) public tokenOracleMarketShare;
    mapping(address => uint64) public tokenChainSelector;

    mapping(address => address[]) public fromETHPath;
    mapping(address => address[]) public toETHPath;
    mapping(address => uint24[]) public fromETHFees;
    mapping(address => uint24[]) public toETHFees;

    //new mappings
    uint public oracleFilledCount;
    uint public currentFilledCount;

    struct OracleData {
        address[] tokens;
        uint[] marketShares;
        uint64[] chainSelectors;
        mapping(uint64 => bool) isOracleChainSelectorStored;
        mapping(uint64 => address[]) oracleChainSelectorTokens;
        mapping(uint64 => uint[]) oracleChainSelectorVersions;
        mapping(uint64 => uint[]) oracleChainSelectorTokenShares;
        mapping(uint64 => uint) oracleChainSelectorTotalShares;
    }

    struct CurrentData {
        address[] tokens;
        uint[] marketShares;
        uint64[] chainSelectors;
        mapping(uint64 => bool) isCurrentChainSelectorStored;
        mapping(uint64 => address[]) currentChainSelectorTokens;
        mapping(uint64 => uint[]) currentChainSelectorVersions;
        mapping(uint64 => uint[]) currentChainSelectorTokenShares;
        mapping(uint64 => uint) currentChainSelectorTotalShares;
    }

    mapping(uint => OracleData) internal oracleData;
    mapping(uint => CurrentData) internal currentData;

    modifier onlyIndexFactoryBalancer() {
        require(
            msg.sender == indexFactoryBalancer || msg.sender == balancerSender,
            "Caller is not index factory balancer contract."
        );
        _;
    }

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _functionsRouterAddress The address of the Chainlink functions router.
     * @param _newDonId The external don ID for the Chainlink request.
     */
    function initialize(
        address _chainlinkToken,
        address _functionsRouterAddress,
        bytes32 _newDonId
    ) external initializer {
        // Validate input parameters
        require(
            _chainlinkToken != address(0),
            "Invalid Chainlink token address"
        );
        require(
            _functionsRouterAddress != address(0),
            "Invalid functions router address"
        );
        require(_newDonId != "", "Invalid external don ID");

        // __Ownable_init();
        __FunctionsClient_init(_functionsRouterAddress);
        __ConfirmedOwner_init(msg.sender);
        donId = _newDonId;
        functionsRouterAddress = _functionsRouterAddress;

        //oracle url
        baseUrl = "https://app.nexlabs.io/api/allFundingRates";
        urlParams = "?multiplyFunc=18&timesNegFund=true&arrays=true";
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    /**
     * @dev Sets the IndexFactoryBalancer contract address.
     * @param _indexFactoryBalancer The address of the IndexFactoryBalancer contract.
     */
    function setIndexFactoryBalancer(
        address _indexFactoryBalancer
    ) public onlyOwner {
        indexFactoryBalancer = _indexFactoryBalancer;
    }

    /**
     * @dev Sets the balancer sender address.
     * @param _balancerSender The address of the balancer sender.
     */
    function setBalancerSender(address _balancerSender) public onlyOwner {
        balancerSender = _balancerSender;
    }

    /**
     * @dev Returns the count of oracle chain selectors.
     * @return The count of oracle chain selectors.
     */
    function oracleChainSelectorsCount() public view returns (uint) {
        return oracleData[oracleFilledCount].chainSelectors.length;
    }

    /**
     * @dev Returns the count of current chain selectors.
     * @return The count of current chain selectors.
     */
    function currentChainSelectorsCount() public view returns (uint) {
        return currentData[currentFilledCount].chainSelectors.length;
    }

    /**
     * @dev Returns the count of tokens in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return The count of tokens in the oracle chain selector.
     */
    function oracleChainSelectorTokensCount(
        uint64 _chainSelector
    ) public view returns (uint) {
        return
            oracleData[oracleFilledCount]
                .oracleChainSelectorTokens[_chainSelector]
                .length;
    }

    /**
     * @dev Returns the count of tokens in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return The count of tokens in the current chain selector.
     */
    function currentChainSelectorTokensCount(
        uint64 _chainSelector
    ) public view returns (uint) {
        return
            currentData[currentFilledCount]
                .currentChainSelectorTokens[_chainSelector]
                .length;
    }

    /**
     * @dev Returns all tokens in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return tokens The addresses of the tokens.
     */
    function allOracleChainSelectorTokens(
        uint64 _chainSelector
    ) public view returns (address[] memory tokens) {
        tokens = oracleData[oracleFilledCount].oracleChainSelectorTokens[
            _chainSelector
        ];
    }

    /**
     * @dev Returns all tokens in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return tokens The addresses of the tokens.
     */
    function allCurrentChainSelectorTokens(
        uint64 _chainSelector
    ) public view returns (address[] memory tokens) {
        tokens = currentData[currentFilledCount].currentChainSelectorTokens[
            _chainSelector
        ];
    }

    /**
     * @dev Returns all versions in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return versions The versions of the tokens.
     */
    function allOracleChainSelectorVersions(
        uint64 _chainSelector
    ) public view returns (uint[] memory versions) {
        versions = oracleData[oracleFilledCount].oracleChainSelectorVersions[
            _chainSelector
        ];
    }

    /**
     * @dev Returns all versions in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return versions The versions of the tokens.
     */
    function allCurrentChainSelectorVersions(
        uint64 _chainSelector
    ) public view returns (uint[] memory versions) {
        versions = currentData[currentFilledCount].currentChainSelectorVersions[
            _chainSelector
        ];
    }

    /**
     * @dev Returns all token shares in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return The token shares.
     */
    function allOracleChainSelectorTokenShares(
        uint64 _chainSelector
    ) public view returns (uint[] memory) {
        return
            oracleData[oracleFilledCount].oracleChainSelectorTokenShares[
                _chainSelector
            ];
    }

    /**
     * @dev Returns all token shares in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return The token shares.
     */
    function allCurrentChainSelectorTokenShares(
        uint64 _chainSelector
    ) public view returns (uint[] memory) {
        return
            currentData[currentFilledCount].currentChainSelectorTokenShares[
                _chainSelector
            ];
    }

    /**
     * @dev The contract's fallback function that does not allow direct payments to the contract.
     * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
     */
    // receive() external payable {
    //     // revert DoNotSendFundsDirectlyToTheContract();
    // }

    /**
     * @dev Sets the URL for the oracle request.
     * @param _beforeAddress The base URL.
     * @param _afterAddress The URL parameters.
     */
    function setUrl(
        string memory _beforeAddress,
        string memory _afterAddress
    ) public onlyOwner {
        baseUrl = _beforeAddress;
        urlParams = _afterAddress;
    }

    function requestAssetsData(
        string calldata source,
        // FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) public returns (bytes32) {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );
        // req.secretsLocation = secretsLocation;
        req.secretsLocation = FunctionsRequest.Location.Remote;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }
        return
            _sendRequest(
                req.encodeCBOR(),
                subscriptionId,
                callbackGasLimit,
                donId
            );
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        (
            address[] memory _tokens,
            bytes[] memory _pathBytes,
            uint256[] memory _marketShares,
            uint64[] memory _chainSelectors
        ) = abi.decode(response, (address[], bytes[], uint256[], uint64[]));
        require(_tokens.length > 0, "Tokens array cannot be empty");
        require(
            _marketShares.length == _tokens.length,
            "Market shares array length must match tokens array length"
        );
        require(
            _chainSelectors.length == _tokens.length,
            "Chain selectors array length must match tokens array length"
        );

        insertOracleData(_tokens, _pathBytes, _marketShares, _chainSelectors);
    }

   

    /**
     * @dev Inserts oracle data into the contract.
     * @param _tokens The addresses of the tokens.
     * @param _marketShares The market shares of the tokens.
     * @param _chainSelectors The chain selectors of the tokens.
     */
    function insertOracleData(
        address[] memory _tokens,
        bytes[] memory _pathBytes,
        uint256[] memory _marketShares,
        uint64[] memory _chainSelectors
    ) private {
        address[] memory tokens0 = _tokens;
        bytes[] memory pathBytes0 = _pathBytes;
        uint[] memory marketShares0 = _marketShares;
        uint64[] memory chainSelectors0 = _chainSelectors;

        oracleFilledCount += 1;
        if (totalCurrentList == 0) {
            currentFilledCount += 1;
        }
        //save mappings
        for (uint i = 0; i < tokens0.length; i++) {
            //update path
            _initPathData(tokens0[i], pathBytes0[i]);
            //update token data
            oracleList[i] = tokens0[i];
            tokenOracleListIndex[tokens0[i]] = i;
            tokenOracleMarketShare[tokens0[i]] = marketShares0[i];
            tokenChainSelector[tokens0[i]] = chainSelectors0[i];
            // oracle chain selector actions
            if (
                !oracleData[oracleFilledCount].isOracleChainSelectorStored[
                    chainSelectors0[i]
                ]
            ) {
                oracleData[oracleFilledCount].chainSelectors.push(
                    chainSelectors0[i]
                );
                oracleData[oracleFilledCount].isOracleChainSelectorStored[
                    chainSelectors0[i]
                ] = true;
            }
            oracleData[oracleFilledCount]
                .oracleChainSelectorTokens[chainSelectors0[i]]
                .push(tokens0[i]);
            oracleData[oracleFilledCount].oracleChainSelectorTotalShares[
                chainSelectors0[i]
            ] += marketShares0[i];

            oracleData[oracleFilledCount]
                .oracleChainSelectorTokenShares[chainSelectors0[i]]
                .push(marketShares0[i]);

            if (totalCurrentList == 0) {
                currentList[i] = tokens0[i];
                tokenCurrentMarketShare[tokens0[i]] = marketShares0[i];
                tokenCurrentListIndex[tokens0[i]] = i;

                // uint64 token
                // current chain selector actions

                if (
                    !currentData[currentFilledCount]
                        .isCurrentChainSelectorStored[chainSelectors0[i]]
                ) {
                    currentData[currentFilledCount]
                        .isCurrentChainSelectorStored[
                            chainSelectors0[i]
                        ] = true;
                    currentData[currentFilledCount].chainSelectors.push(
                        chainSelectors0[i]
                    );
                }
                currentData[currentFilledCount]
                    .currentChainSelectorTokens[chainSelectors0[i]]
                    .push(tokens0[i]);
                currentData[currentFilledCount].currentChainSelectorTotalShares[
                    chainSelectors0[i]
                ] += marketShares0[i];
                currentData[currentFilledCount]
                    .currentChainSelectorTokenShares[chainSelectors0[i]]
                    .push(marketShares0[i]);
            }
        }
        totalOracleList = tokens0.length;
        if (totalCurrentList == 0) {
            totalCurrentList = tokens0.length;
        }
        lastUpdateTime = block.timestamp;
    }

    function _initPathData(
        address _tokenAddress,
        bytes memory _pathBytes
    ) internal {
        // decode pathBytes to get fromETHPath and fromETHFees
        (address[] memory _fromETHPath, uint24[] memory _fromETHFees) = abi
            .decode(_pathBytes, (address[], uint24[]));
        require(
            _fromETHPath.length == _fromETHFees.length + 1,
            "Invalid input arrays"
        );
        fromETHPath[_tokenAddress] = _fromETHPath;
        fromETHFees[_tokenAddress] = _fromETHFees;
        // update toETHPath and toETHFees
        address[] memory _toETHPath = PathHelpers.reverseAddressArray(
            _fromETHPath
        );
        uint24[] memory _toETHFees = PathHelpers.reverseUint24Array(
            _fromETHFees
        );
        toETHPath[_tokenAddress] = _toETHPath;
        toETHFees[_tokenAddress] = _toETHFees;
    }

    /**
     * @dev Updates the current list of tokens.
     */
    function _updateCurrenctList() internal {
        currentFilledCount += 1;
        for (uint i = 0; i < totalOracleList; i++) {
            currentList[i] = oracleList[i];
            tokenCurrentMarketShare[currentList[i]] = tokenOracleMarketShare[
                oracleList[i]
            ];
            tokenCurrentListIndex[currentList[i]] = tokenOracleListIndex[
                oracleList[i]
            ];

            // current chain selector actions
            uint64 chainSelector = tokenChainSelector[oracleList[i]];
            if (
                !currentData[currentFilledCount].isCurrentChainSelectorStored[
                    chainSelector
                ]
            ) {
                currentData[currentFilledCount].isCurrentChainSelectorStored[
                    chainSelector
                ] = true;
                currentData[currentFilledCount].chainSelectors.push(
                    chainSelector
                );
            }
            currentData[currentFilledCount]
                .currentChainSelectorTokens[chainSelector]
                .push(oracleList[i]);
            currentData[currentFilledCount].currentChainSelectorTotalShares[
                chainSelector
            ] += tokenOracleMarketShare[oracleList[i]];
            currentData[currentFilledCount]
                .currentChainSelectorTokenShares[chainSelector]
                .push(tokenOracleMarketShare[oracleList[i]]);
        }
        totalCurrentList = totalOracleList;
    }

    /**
     * @dev Updates the current list of tokens (external function).
     */
    function updateCurrentList() public onlyIndexFactoryBalancer {
        _updateCurrenctList();
    }

    

    function getFromETHPathData(
        address _tokenAddress
    ) public view returns (address[] memory, uint24[] memory) {
        return (fromETHPath[_tokenAddress], fromETHFees[_tokenAddress]);
    }

    function getToETHPathData(
        address _tokenAddress
    ) public view returns (address[] memory, uint24[] memory) {
        return (toETHPath[_tokenAddress], toETHFees[_tokenAddress]);
    }

    function getFromETHPathBytesForTokens(
        address[] memory _tokens
    ) public view returns (bytes[] memory) {
        bytes[] memory pathBytes = new bytes[](_tokens.length);
        for (uint i = 0; i < _tokens.length; i++) {
            pathBytes[i] = PathHelpers.getFromETHPathBytes(
                fromETHPath[_tokens[i]],
                fromETHFees[_tokens[i]]
            );
        }

        return pathBytes;
    }

    function getOracleData(
        uint index
    )
        public
        view
        returns (
            address[] memory tokens,
            uint[] memory marketShares,
            uint64[] memory chainSelectors
        )
    {
        OracleData storage data = oracleData[index];
        return (data.tokens, data.marketShares, data.chainSelectors);
    }

    function getCurrentData(
        uint index
    )
        public
        view
        returns (
            address[] memory tokens,
            uint[] memory marketShares,
            uint64[] memory chainSelectors
        )
    {
        CurrentData storage data = currentData[index];
        return (data.tokens, data.marketShares, data.chainSelectors);
    }

    function getCurrentChainSelectorTotalShares(
        uint index,
        uint64 chainSelector
    ) public view returns (uint) {
        return
            currentData[index].currentChainSelectorTotalShares[chainSelector];
    }

    function getOracleChainSelectorTotalShares(
        uint index,
        uint64 chainSelector
    ) public view returns (uint) {
        return oracleData[index].oracleChainSelectorTotalShares[chainSelector];
    }
}
