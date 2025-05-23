// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "../ccip/CCIPReceiver.sol";
import "./IndexFactoryStorage.sol";
import "./FunctionsOracle.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libraries/SwapHelpers.sol";
import "../interfaces/IWETH.sol";
import "../libraries/MessageSender.sol";
import "./IndexFactory.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract BalancerSender is Initializable, CCIPReceiver, ProposableOwnableUpgradeable {
    using MessageSender for *;

    IndexFactoryStorage public factoryStorage;
    FunctionsOracle public functionsOracle;

    uint64 public currentChainSelector;

    IWETH public weth;

    event MessageSent(bytes32 messageId);
    event AskValuesCompleted(uint time);
    event FirstReweightActionCompleted(uint time);
    event SecondReweightActionCompleted(uint time);

    modifier onlyFactoryBalancer() {
        require(msg.sender == factoryStorage.indexFactoryBalancer(), "Only factory balancer can call this function");
        _;
    }

    


    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address _factoryStorage,
        address _functionsOracle,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_factoryStorage != address(0), "Invalid factory storage address");
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");
        __ccipReceiver_init(_router);
        __Ownable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        factoryStorage = IndexFactoryStorage(_factoryStorage);
        functionsOracle = FunctionsOracle(_functionsOracle);
        //approve router
        IERC20(_chainlinkToken).approve(i_router, type(uint256).max);
        //set addresses
        weth = IWETH(_weth);
    }

    /**
     * @dev Sets the IndexFactoryStorage contract address.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     */
    function setIndexFactoryStorage(address _factoryStorage) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Sets the FunctionsOracle contract address.
     * @param _functionsOracle The address of the FunctionsOracle contract.
     */
    function setFunctionsOracle(address _functionsOracle) public onlyOwner {
        functionsOracle = FunctionsOracle(_functionsOracle);
    }

    function withdrawLink() external onlyOwner {
        IERC20(factoryStorage.linkToken()).transfer(
            msg.sender, IERC20(factoryStorage.linkToken()).balanceOf(address(this))
        );
    }

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    function emitFirstReweightActionCompleted() external onlyFactoryBalancer {
        emit FirstReweightActionCompleted(block.timestamp);
    }

    function emitSecondReweightActionCompleted() external onlyFactoryBalancer {
        emit SecondReweightActionCompleted(block.timestamp);
    }
    
    function pauseIndexFactory() internal {
        address indexFactoryAddress = factoryStorage.indexFactory();
        IndexFactory indexFactory = IndexFactory(payable(indexFactoryAddress));
        if(!indexFactory.paused()){
        indexFactory.pause();
        }
    }

    // unpause index factory when rebalance is done
    function unpauseIndexFactory() internal {
        address indexFactoryAddress = factoryStorage.indexFactory();
        IndexFactory indexFactory = IndexFactory(payable(indexFactoryAddress));
        if(indexFactory.paused()){
        indexFactory.unpause();
        }
    }

    /**
     * @dev Swaps tokens.
     * @param path The path of the swap.
     * @param fees The fees of the swap.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(address[] memory path, uint24[] memory fees, uint256 amountIn, address _recipient)
        public
        returns (uint256 outputAmount)
    {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        uint256 amountOutMinimum = factoryStorage.getMinAmountOut(path, fees, amountIn);
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, path, fees, amountIn, amountOutMinimum, _recipient);
    }

    function sendAskValues(uint64 chainSelector) public onlyFactoryBalancer {
        address crossChainIndexFactory = factoryStorage.crossChainFactoryBySelector(chainSelector);

        address[] memory tokenAddresses = functionsOracle.allCurrentChainSelectorTokens(chainSelector);

        bytes memory data = abi.encode(
            2,
            tokenAddresses,
            new address[](0),
            functionsOracle.getFromETHPathBytesForTokens(tokenAddresses),
            new bytes[](0),
            factoryStorage.updatePortfolioNonce(),
            new uint256[](0),
            new uint256[](0)
        );
        sendMessage(chainSelector, crossChainIndexFactory, data, MessageSender.PayFeesIn.Native);
    }

    function _encodeFirstReweightAction(
        uint64 chainSelector,
        uint256 nonce,
        uint256[] memory oracleTokenShares,
        uint256[] memory extraData
    ) internal returns (bytes memory) {
        address[] memory currentTokenAddresses = functionsOracle.allCurrentChainSelectorTokens(chainSelector);
        address[] memory newTokenAddresses = functionsOracle.allOracleChainSelectorTokens(chainSelector);

        return abi.encode(
            3,
            currentTokenAddresses,
            newTokenAddresses,
            functionsOracle.getFromETHPathBytesForTokens(currentTokenAddresses),
            functionsOracle.getFromETHPathBytesForTokens(newTokenAddresses),
            nonce,
            oracleTokenShares,
            extraData
        );
    }

    function sendFirstReweightAction(
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 oracleChainSelectorTotalShares,
        uint256 chainValue,
        uint256[] memory oracleTokenShares
    ) public onlyFactoryBalancer {
        uint256 chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        factoryStorage.increaseReweightExtraPercentage(nonce, chainCurrentRealShare - oracleChainSelectorTotalShares);

        address crossChainIndexFactory = factoryStorage.crossChainFactoryBySelector(chainSelector);

        uint256[] memory extraData = new uint256[](3);
        extraData[0] = portfolioValue;
        extraData[1] = oracleChainSelectorTotalShares;
        extraData[2] = chainValue;

        bytes memory data = _encodeFirstReweightAction(chainSelector, nonce, oracleTokenShares, extraData);

        sendMessage(chainSelector, crossChainIndexFactory, data, MessageSender.PayFeesIn.Native);
    }

    function _encodeSecondReweightAction(
        uint64 _chainSelector,
        uint256 _nonce,
        uint256[] memory _oracleTokenShares,
        uint256[] memory _extraData
    ) internal returns (bytes memory) {
        address[] memory currentTokenAddresses = functionsOracle.allCurrentChainSelectorTokens(_chainSelector);
        address[] memory newTokenAddresses = functionsOracle.allOracleChainSelectorTokens(_chainSelector);

        return abi.encode(
            4,
            currentTokenAddresses,
            newTokenAddresses,
            functionsOracle.getFromETHPathBytesForTokens(currentTokenAddresses),
            functionsOracle.getFromETHPathBytesForTokens(newTokenAddresses),
            _nonce,
            _oracleTokenShares,
            _extraData
        );
    }

    function sendSecondReweightAction(
        uint256 nonce,
        uint256 _portfolioValue,
        uint64 _chainSelector,
        uint256 _oracleChainSelectorTotalShares,
        uint256[] memory _oracleTokenShares,
        uint256 _extraWethAmount
    ) public onlyFactoryBalancer {
        weth.transferFrom(msg.sender, address(this), _extraWethAmount);
        (address[] memory fromETHPath, uint24[] memory fromETHFees) =
            factoryStorage.getFromETHPathData(factoryStorage.crossChainToken(_chainSelector));
        uint256 crossChainTokenAmount = swap(fromETHPath, fromETHFees, _extraWethAmount, address(this));

        uint256[] memory extraData = new uint256[](2);
        extraData[0] = _portfolioValue;
        extraData[1] = _oracleChainSelectorTotalShares;

        address crossChainIndexFactory = factoryStorage.crossChainFactoryBySelector(_chainSelector);

        bytes memory data = _encodeSecondReweightAction(_chainSelector, nonce, _oracleTokenShares, extraData);

        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = factoryStorage.crossChainToken(_chainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;

        sendToken(_chainSelector, data, crossChainIndexFactory, tokensToSendArray, MessageSender.PayFeesIn.Native);
    }

    /**
     * @dev Sends tokens to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param _data The data to send.
     * @param receiver The address of the receiver.
     * @param tokensToSendDetails The details of the tokens to send.
     * @param payFeesIn The fee payment method.
     */
    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        MessageSender.PayFeesIn payFeesIn
    ) internal returns (bytes32) {
        factoryStorage.increaseTotalSentAmount(tokensToSendDetails[0].token, tokensToSendDetails[0].amount);
        bytes32 messageId = MessageSender.sendToken(
            // i_router,
            getRouter(),
            // i_link,
            factoryStorage.linkToken(),
            factoryStorage.MAX_TOKENS_LENGTH(),
            destinationChainSelector,
            _data,
            receiver,
            tokensToSendDetails,
            payFeesIn,
            2_000_000
        );
        emit MessageSent(messageId);
        return messageId;
    }

    /**
     * @dev Sends a message to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param receiver The address of the receiver.
     * @param _data The data to send.
     * @param payFeesIn The fee payment method.
     */
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        MessageSender.PayFeesIn payFeesIn
    ) public returns (bytes32) {
        // Validate input parameters
        require(destinationChainSelector > 0, "Invalid destination chain selector");
        require(receiver != address(0), "Invalid receiver address");
        require(_data.length > 0, "Data cannot be empty");
        return MessageSender.sendMessage(
            getRouter(), factoryStorage.linkToken(), destinationChainSelector, receiver, _data, payFeesIn, 2_000_000
        );
    }

    /**
     * @dev Handles received messages.
     * @param any2EvmMessage The received message.
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        require(
            sender == factoryStorage.crossChainFactoryBySelector(sourceChainSelector),
            "Invalid sender for the factory balancer ccip recieve"
        );
        (
            uint256 actionType,
            address[] memory tokenAddresses,
            address[] memory tokenAddresses2,
            bytes[] memory tokenPaths,
            bytes[] memory tokenPaths2,
            uint256 nonce,
            uint256[] memory value1,
            uint256[] memory value2
        ) = abi.decode(
            any2EvmMessage.data, (uint256, address[], address[], bytes[], bytes[], uint256, uint256[], uint256[])
        ); // abi-decoding of the sent string message
        if(any2EvmMessage.destTokenAmounts.length > 0) {
            factoryStorage.increaseTotalReceivedAmount(any2EvmMessage.destTokenAmounts[0].token, any2EvmMessage.destTokenAmounts[0].amount);
        }
        if (actionType == 0) {} else if (actionType == 1) {} else if (actionType == 2) {
            for (uint256 i = 0; i < value1.length; i++) {
                factoryStorage.increasePortfolioTotalValueByNonce(nonce, value1[i]);
                factoryStorage.increaseTokenValueByNonce(nonce, tokenAddresses[i], value1[i]);
                factoryStorage.increaseChainValueByNonce(nonce, sourceChainSelector, value1[i]);
                factoryStorage.increaseUpdatedTokensValueCount(nonce);
                emit AskValuesCompleted(block.timestamp);
            }
        } else if (actionType == 3) {
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage.destTokenAmounts;
            address token = tokenAmounts[0].token;
            uint256 amount = tokenAmounts[0].amount;
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(token);
            uint256 wethAmount = swap(toETHPath, toETHFees, amount, address(this));
            factoryStorage.increaseExtraWethByNonce(nonce, wethAmount);
            factoryStorage.increasePendingExtraWethByNonce(nonce, wethAmount);
            weth.transfer(factoryStorage.indexFactoryBalancer(), wethAmount);
            emit FirstReweightActionCompleted(block.timestamp);
        } else if (actionType == 4) {
            functionsOracle.updateCurrentList();
            unpauseIndexFactory();
            emit SecondReweightActionCompleted(block.timestamp);
        }
    }
}
