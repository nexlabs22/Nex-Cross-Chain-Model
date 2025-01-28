// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
// import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
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
contract IndexFactoryStorage is Initializable, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    enum PayFeesIn {
        Native,
        LINK
    }

    IndexToken public indexToken;
    address public indexFactory;
    address public indexFactoryBalancer;

    mapping(uint64 => address) public crossChainToken;
    mapping(uint64 => mapping(address => uint24)) public crossChainTokenSwapFee;
    mapping(uint64 => address) public crossChainFactoryBySelector;

    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;
    // uint256 internal constant SCALAR = 1e20;

    address public priceOracle;

    string baseUrl;
    string urlParams;

    // bytes32 public externalJobId;
    // uint256 public oraclePayment;
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

    // uint public latestOracleChainsCount;
    // uint public latestCurrentChainsCount;

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

    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;
    Vault public vault;

    //nonce

    modifier onlyIndexFactoryBalancer() {
        require(
            msg.sender == indexFactoryBalancer,
            "Caller is not index factory balancer contract."
        );
        _;
    }

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _token The address of the IndexToken contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _functionsRouterAddress The address of the Chainlink functions router.
     * @param _newDonId The external don ID for the Chainlink request.
     * @param _toUsdPriceFeed The address of the USD price feed.
     * @param _weth The address of the WETH token.
     * @param _swapRouterV3 The address of the Uniswap V3 swap router.
     * @param _factoryV3 The address of the Uniswap V3 factory.
     * @param _swapRouterV2 The address of the Uniswap V2 swap router.
     * @param _factoryV2 The address of the Uniswap V2 factory.
     */
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _chainlinkToken,
        address _functionsRouterAddress,
        // bytes32 _externalJobId,
        bytes32 _newDonId,
        address _toUsdPriceFeed,
        //ccip
        // address _router,
        //addresses
        address _weth,
        // address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        address _factoryV2
    ) external initializer {
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_token != address(0), "Invalid token address");
        require(
            _chainlinkToken != address(0),
            "Invalid Chainlink token address"
        );
        require(
            _functionsRouterAddress != address(0),
            "Invalid functions router address"
        );
        require(_newDonId != "", "Invalid external don ID");
        require(_toUsdPriceFeed != address(0), "Invalid price feed address");
        require(_weth != address(0), "Invalid WETH address");
        require(
            _swapRouterV3 != address(0),
            "Invalid Uniswap V3 swap router address"
        );
        require(_factoryV3 != address(0), "Invalid Uniswap V3 factory address");
        require(
            _swapRouterV2 != address(0),
            "Invalid Uniswap V2 swap router address"
        );
        require(_factoryV2 != address(0), "Invalid Uniswap V2 factory address");

        // __Ownable_init();
        __FunctionsClient_init(_functionsRouterAddress);
        __ConfirmedOwner_init(msg.sender);
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        donId = _newDonId;
        functionsRouterAddress = _functionsRouterAddress;
        //set oracle data
        // setChainlinkToken(_chainlinkToken);
        // setChainlinkOracle(_oracleAddress);
        // externalJobId = _externalJobId;
        // oraclePayment = ((1 * LINK_DIVISIBILITY) / 10); // n * 10**18
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPriceFeed);
        //set addressesd
        weth = IWETH(_weth);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        factoryV2 = IUniswapV2Factory(_factoryV2);
        //oracle url
        baseUrl = "https://app.nexlabs.io/api/allFundingRates";
        urlParams = "?multiplyFunc=18&timesNegFund=true&arrays=true";
    }

    /**
     * @notice Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
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
     * @dev Sets the cross-chain token and its swap version.
     * @param _chainSelector The chain selector.
     * @param _crossChainToken The address of the cross-chain token.
     */
    function setCrossChainToken(
        uint64 _chainSelector,
        address _crossChainToken,
        address[] memory _fromETHPath,
        uint24[] memory _fromETHFees
    ) public onlyOwner {
        crossChainToken[_chainSelector] = _crossChainToken;
        fromETHPath[_crossChainToken] = _fromETHPath;
        fromETHFees[_crossChainToken] = _fromETHFees;
        toETHPath[_crossChainToken] = PathHelpers.reverseAddressArray(_fromETHPath);
        toETHFees[_crossChainToken] = PathHelpers.reverseUint24Array(_fromETHFees);
    }

    /**
     * @dev Sets the cross-chain factory address for a given chain selector.
     * @param _crossChainFactoryAddress The address of the cross-chain factory.
     * @param _chainSelector The chain selector.
     */
    function setCrossChainFactory(
        address _crossChainFactoryAddress,
        uint64 _chainSelector
    ) public onlyOwner {
        crossChainFactoryBySelector[_chainSelector] = _crossChainFactoryAddress;
    }

    /**
     * @dev Sets the price feed address of the native coin to USD from the Chainlink oracle.
     * @param _toUsdPricefeed The address of native coin to USD price feed.
     */
    function setPriceFeed(address _toUsdPricefeed) external onlyOwner {
        require(
            _toUsdPricefeed != address(0),
            "ICO: Price feed address cannot be zero address"
        );
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPricefeed);
    }

    function setPriceOracle(address _priceOracle) external onlyOwner {
        require(
            _priceOracle != address(0),
            "Price oracle address cannot be zero address"
        );
        priceOracle = _priceOracle;
    }

    /**
     * @dev Sets the IndexFactory contract address.
     * @param _indexFactory The address of the IndexFactory contract.
     */
    function setIndexFactory(address _indexFactory) public onlyOwner {
        indexFactory = _indexFactory;
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
     * @dev Sets the vault address.
     * @param _vaultAddress The address of the vault.
     */
    function setVault(address _vaultAddress) public onlyOwner {
        vault = Vault(_vaultAddress);
    }

    /**
     * @dev Converts an amount to Wei.
     * @param _amount The amount to convert.
     * @param _amountDecimals The decimals of the amount.
     * @param _chainDecimals The decimals of the chain.
     * @return The amount in Wei.
     */
    function _toWei(
        int256 _amount,
        uint8 _amountDecimals,
        uint8 _chainDecimals
    ) private pure returns (int256) {
        if (_chainDecimals > _amountDecimals)
            return _amount * int256(10 ** (_chainDecimals - _amountDecimals));
        else return _amount * int256(10 ** (_amountDecimals - _chainDecimals));
    }

    /**
     * @dev Returns the price in Wei.
     * @return The price in Wei.
     */
    function priceInWei() public view returns (uint256) {
        (, int price, , , ) = toUsdPriceFeed.latestRoundData();
        uint8 priceFeedDecimals = toUsdPriceFeed.decimals();
        price = _toWei(price, priceFeedDecimals, 18);
        return uint256(price);
    }

    /**
     * @dev The contract's fallback function that does not allow direct payments to the contract.
     * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
     */
    // receive() external payable {
    //     // revert DoNotSendFundsDirectlyToTheContract();
    // }

    /**
     * @dev Concatenates two strings.
     * @param a The first string.
     * @param b The second string.
     * @return The concatenated string.
     */
    function concatenation(
        string memory a,
        string memory b
    ) public pure returns (string memory) {
        return string(bytes.concat(bytes(a), bytes(b)));
    }

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
     * @dev Mocks the fulfillment of asset data.
     * @param _tokens The addresses of the tokens.
     * @param _marketShares The market shares of the tokens.
     * @param _chainSelectors The chain selectors of the tokens.
     */
    function mockFillAssetsList(
        address[] memory _tokens,
        bytes[] memory _pathBytes,
        uint256[] memory _marketShares,
        uint64[] memory _chainSelectors
    ) public onlyOwner {
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

    function _initPathData(address _tokenAddress, bytes memory _pathBytes) internal {
        // decode pathBytes to get fromETHPath and fromETHFees
        (address[] memory _fromETHPath, uint24[] memory _fromETHFees) = abi.decode(_pathBytes, (address[], uint24[]));
        require(_fromETHPath.length == _fromETHFees.length + 1, "Invalid input arrays");
        fromETHPath[_tokenAddress] = _fromETHPath;
        fromETHFees[_tokenAddress] = _fromETHFees;
        // update toETHPath and toETHFees
        address[] memory _toETHPath = PathHelpers.reverseAddressArray(_fromETHPath);
        uint24[] memory _toETHFees = PathHelpers.reverseUint24Array(_fromETHFees);
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

    /**
     * @dev Mocks the update of the current list of tokens.
     */
    function mockUpdateCurrentList() public onlyOwner {
        _updateCurrenctList();
    }

    function getFromETHPathData(address _tokenAddress) public view returns (address[] memory, uint24[] memory) {
        return (fromETHPath[_tokenAddress], fromETHFees[_tokenAddress]);
    }

    function getToETHPathData(address _tokenAddress) public view returns (address[] memory, uint24[] memory) {
        return (toETHPath[_tokenAddress], toETHFees[_tokenAddress]);
    }

    

    function getFromETHPathBytesForTokens(address[] memory _tokens) public view returns (bytes[] memory) {
        bytes[] memory pathBytes = new bytes[](_tokens.length);
        for (uint i = 0; i < _tokens.length; i++) {
            pathBytes[i] = PathHelpers.getFromETHPathBytes(fromETHPath[_tokens[i]], fromETHFees[_tokens[i]]);
        }

        return pathBytes;
    }

    /**
     * @dev Returns the amount out for a given swap.
     * @param path The path of the swap.
     * @param fees The fees of the swap.
     * @param amountIn The amount of input token.
     * @return finalAmountOutValue The amount of output token.
     */
    function getAmountOut(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint finalAmountOutValue) {
        uint finalAmountOut;
        if (amountIn > 0) {
            if (fees.length > 0) {
                finalAmountOut = estimateAmountOutWithPath(
                    path,
                    fees,
                    amountIn
                );
            } else {
                uint[] memory v2amountOut = swapRouterV2.getAmountsOut(
                    amountIn,
                    path
                );
                finalAmountOut = v2amountOut[v2amountOut.length - 1];
            }
        }
        finalAmountOutValue = finalAmountOut;
    }

    /**
     * @dev Returns the portfolio balance.
     * @return The total portfolio balance.
     */
    function getPortfolioBalance() public view returns (uint) {
        uint totalValue;
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = currentList[i];
            if (tokenAddress == address(weth)) {
                totalValue += IERC20(tokenAddress).balanceOf(address(vault));
            } else {
            uint value = getAmountOut(
                toETHPath[tokenAddress],
                toETHFees[tokenAddress],
                IERC20(tokenAddress).balanceOf(address(vault))
            );
            totalValue += value;
            }
        }
        return totalValue;
    }


    /**
     * @dev Estimates the amount out for a given swap.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token.
     * @return amountOut The estimated amount of output token.
     */
    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint24 fee
    ) public view returns (uint amountOut) {
        amountOut = IPriceOracle(priceOracle).estimateAmountOut(
            address(factoryV3),
            tokenIn,
            tokenOut,
            amountIn,
            fee
        );
    }

    function estimateAmountOutWithPath(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint amountOut) {
        uint lastAmount = amountIn;
        for(uint i = 0; i < path.length - 1; i++) {
            lastAmount = IPriceOracle(priceOracle).estimateAmountOut(
                address(factoryV3),
                path[i],
                path[i+1],
                uint128(lastAmount),
                fees[i]
            );
        }
        amountOut = lastAmount;
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
        return (
            data.tokens,
            data.marketShares,
            data.chainSelectors
        );
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
        return (
            data.tokens,
            data.marketShares,
            data.chainSelectors
        );
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
