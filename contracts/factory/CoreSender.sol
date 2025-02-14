// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "../ccip/CCIPReceiver.sol";
import "./IndexFactoryStorage.sol";
import "./FunctionsOracle.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../libraries/FeeCalculation.sol";
import "../libraries/MessageSender.sol";
import "../libraries/SwapHelpers.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CoreSender is
    Initializable,
    CCIPReceiver,
    ProposableOwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using MessageSender for *;


    IndexToken public indexToken;
    IndexFactoryStorage public factoryStorage;
    FunctionsOracle public functionsOracle;

    IWETH public weth;

    

    event Issuanced(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address inputToken,
        uint inputAmount,
        uint outputAmount,
        uint price,
        uint time
    );


    event Redemption(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address outputToken,
        uint inputAmount,
        uint outputAmount,
        uint price,
        uint time
    );
    event MessageSent(bytes32 messageId);

    modifier onlyFactory() {
        require(
            msg.sender == factoryStorage.indexFactory(),
            "Only factory can call this function"
        );
        _;
    }

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _token The address of the IndexToken contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        address payable _token,
        address _indexFactoryStorage,
        address _functionsOracle,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_token != address(0), "Invalid token address");
        require(
            _chainlinkToken != address(0),
            "Invalid Chainlink token address"
        );
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");

        __ccipReceiver_init(_router);
        __Ownable_init();
        __ReentrancyGuard_init();
        __ReentrancyGuard_init_unchained();
        indexToken = IndexToken(_token);
        factoryStorage = IndexFactoryStorage(_indexFactoryStorage);
        functionsOracle = FunctionsOracle(_functionsOracle);
        
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

    /**
     * @dev Sets the FunctionsOracle contract address.
     * @param _functionsOracle The address of the FunctionsOracle contract.
     */
    function setFunctionsOracle(address _functionsOracle) public onlyOwner {
        functionsOracle = FunctionsOracle(_functionsOracle);
    }

    function withdrawLink() external onlyOwner {
        IERC20(factoryStorage.linkToken()).transfer(
            msg.sender,
            IERC20(factoryStorage.linkToken()).balanceOf(address(this))
        );
    }

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    /**
     * @dev Swaps tokens.
     * @param path The path of the tokens.
     * @param fees The fees of the tokens.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn,
        address _recipient
    ) internal returns (uint outputAmount) {
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(
            swapRouterV3,
            swapRouterV2,
            path,
            fees,
            amountIn,
            _recipient
        );
    }

    function _encodeIssuanceData(
        uint _issuanceNonce,
        address[] memory _tokenAddresses,
        uint[] memory _tokenShares,
        uint[] memory _totalSharesArr
    ) internal view returns (bytes memory) {
        return
            abi.encode(
            0,
            _tokenAddresses,
            new address[](0),
            functionsOracle.getFromETHPathBytesForTokens(_tokenAddresses),
            functionsOracle.getFromETHPathBytesForTokens(new address[](0)),
            _issuanceNonce,
            _tokenShares,
            _totalSharesArr
        );
    }

    function sendIssuanceRequest(
        uint _wethAmount,
        uint _issuanceNonce,
        uint64 _chainSelector,
        uint _latestCount
    ) public onlyFactory {
        weth.transferFrom(msg.sender, address(this), _wethAmount);
        // swap to cross chain token
        (
            address[] memory fromETHPath,
            uint24[] memory fromETHFees
        ) = factoryStorage.getFromETHPathData(factoryStorage.crossChainToken(_chainSelector));
        uint crossChainTokenAmount = swap(
            fromETHPath,
            fromETHFees,
            // (_wethAmount * totalShares) / 100e18,
            _wethAmount,
            address(this)
        );

        
        uint[] memory totalSharesArr = new uint[](1);
        totalSharesArr[0] = functionsOracle.getCurrentChainSelectorTotalShares(
            _latestCount,
            _chainSelector
        );
        address crossChainIndexFactory = factoryStorage.crossChainFactoryBySelector(
            _chainSelector
        );
        //encode data
        bytes memory data = _encodeIssuanceData(
            _issuanceNonce,
            functionsOracle.allCurrentChainSelectorTokens(_chainSelector),
            functionsOracle.allCurrentChainSelectorTokenShares(_chainSelector),
            totalSharesArr
        );
        // send issuance request
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = factoryStorage.crossChainToken(_chainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;
        
        // send token and data
        bytes32 messageId = sendToken(
            _chainSelector,
            data,
            crossChainIndexFactory,
            tokensToSendArray,
            MessageSender.PayFeesIn.LINK
        );
        emit MessageSent(messageId);
        factoryStorage.setIssuanceMessageId(_issuanceNonce, messageId);
        
    }

    function completeIssuanceRequest(uint _issuanceNonce, bytes32 _messageId) internal {
        uint totalOldVaules;
        uint totalNewVaules;
        uint totalCurrentList = functionsOracle.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = functionsOracle.currentList(i);
            totalOldVaules += factoryStorage.getIssuanceOldTokenValue(
                _issuanceNonce,
                tokenAddress
            );
            totalNewVaules += factoryStorage.getIssuanceNewTokenValue(
                _issuanceNonce,
                tokenAddress
            );
        }

        uint amountToMint;
        if (indexToken.totalSupply() > 0) {
            amountToMint =
                (indexToken.totalSupply() * totalNewVaules) /
                totalOldVaules -
                indexToken.totalSupply();
        } else {
            amountToMint = (totalNewVaules) * 100;
        }
        indexToken.mint(factoryStorage.getIssuanceRequester(_issuanceNonce), amountToMint);
        uint indexTokenPrice = (totalNewVaules * 1e18) /
            indexToken.totalSupply();
        emit Issuanced(
            _messageId,
            _issuanceNonce,
            factoryStorage.getIssuanceRequester(_issuanceNonce),
            factoryStorage.getIssuanceInputToken(_issuanceNonce),
            factoryStorage.getIssuanceInputAmount(_issuanceNonce),
            amountToMint,
            indexTokenPrice,
            block.timestamp
        );
    }

    function _handleReceivedIssuance(
        uint nonce,
        address[] memory tokenAddresses,
        uint[] memory value1,
        uint[] memory value2,
        uint totalCurrentList,
        bytes32 messageId
    ) internal {
        uint requestIssuanceNonce = nonce;
        for (uint i; i < tokenAddresses.length; i++) {
            uint oldTokenValue = value1[i];
            uint newTokenValue = value2[i];
            factoryStorage.setIssuanceOldTokenValue(
                requestIssuanceNonce,
                tokenAddresses[i],
                oldTokenValue
            );
            factoryStorage.setIssuanceNewTokenValue(
                requestIssuanceNonce,
                tokenAddresses[i],
                newTokenValue
            );
            factoryStorage.issuanceIncreaseCompletedTokensCount(
                requestIssuanceNonce
            );
        }
        if (
            // totalCurrentList
            factoryStorage.getIssuanceCompletedTokensCount(
                requestIssuanceNonce
            ) == totalCurrentList
        ) {
            completeIssuanceRequest(requestIssuanceNonce, messageId);
        }
    }

    function sendRedemptionRequest(
        uint _burnPercent,
        uint _redemptionNonce,
        uint64 _chainSelector
    ) public onlyFactory {
        // get data
        address crossChainIndexFactory = factoryStorage.crossChainFactoryBySelector(
            _chainSelector
        );
        address[] memory tokenAddresses = functionsOracle
            .allCurrentChainSelectorTokens(_chainSelector);
        uint[] memory burnPercentages = new uint[](1);
        burnPercentages[0] = _burnPercent;
        //encode data
        bytes memory data = abi.encode(
            1,
            tokenAddresses,
            new address[](0),
            functionsOracle.getFromETHPathBytesForTokens(tokenAddresses),
            new bytes[](0),
            _redemptionNonce,
            new uint[](0),
            burnPercentages
        );
        // send message
        bytes32 messageId = sendMessage(
            _chainSelector,
            crossChainIndexFactory,
            data,
            MessageSender.PayFeesIn.LINK
        );
        factoryStorage.setRedemptionMessageId(_redemptionNonce, messageId);
    }

    uint public testData;
    function completeRedemptionRequest(
        uint nonce,
        bytes32 _messageId
    ) internal {
        uint wethAmount = factoryStorage.getRedemptionTotalValue(nonce);
        uint totalPortfolioValues = factoryStorage.getRedemptionTotalPortfolioValues(
            nonce
        );
        address requester = factoryStorage.getRedemptionRequester(nonce);
        address outputToken = factoryStorage.getRedemptionOutputToken(nonce);
        uint fee = FeeCalculation.calculateFee(wethAmount, factoryStorage.feeRate());
        testData = fee;
        require(
            weth.transfer(address(factoryStorage.feeReceiver()), fee),
            "Fee transfer failed"
        );
        uint indexTokenPrice = indexToken.totalSupply() != 0
            ? (totalPortfolioValues * 1e18) / indexToken.totalSupply()
            : 0;
        if (outputToken == address(weth)) {
            weth.withdraw(wethAmount - fee);
            (bool _requesterSuccess, ) = requester.call{
                value: wethAmount - fee
            }("");
            require(_requesterSuccess, "transfer eth to the requester failed");
            emit Redemption(
                _messageId,
                nonce,
                requester,
                outputToken,
                factoryStorage.getRedemptionInputAmount(nonce),
                wethAmount - fee,
                indexTokenPrice,
                block.timestamp
            );
        } else {
            uint reallOut = swap(
                factoryStorage.getRedemptionOutputTokenPath(nonce),
                factoryStorage.getRedemptionOutputTokenFees(nonce),
                wethAmount - fee,
                requester
            );
            emit Redemption(
                _messageId,
                nonce,
                requester,
                outputToken,
                factoryStorage.getRedemptionInputAmount(nonce),
                reallOut,
                indexTokenPrice,
                block.timestamp
            );
        }
    }

    uint public testData2;
    function _handleReceivedRedemption(
        uint nonce,
        Client.Any2EVMMessage memory any2EvmMessage,
        address[] memory tokenAddresses,
        uint totalCurrentList,
        uint crossChainPortfolioValue,
        uint64 sourceChainSelector,
        bytes32 messageId
    ) internal {
        uint requestRedemptionNonce = nonce;
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
            .destTokenAmounts;
        address token = tokenAmounts[0].token;
        uint256 amount = tokenAmounts[0].amount;
        (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage
            .getToETHPathData(token);
        uint wethAmount = swap(toETHPath, toETHFees, amount, address(this));
        
        factoryStorage.increaseRedemptionTotalValue(
            requestRedemptionNonce,
            wethAmount
        );
        testData2 = factoryStorage.getRedemptionTotalValue(requestRedemptionNonce);
        factoryStorage.increaseRedemptionTotalPortfolioValues(
            requestRedemptionNonce,
            crossChainPortfolioValue
        );
        factoryStorage.increaseRedemptionCompletedTokensCount(
            requestRedemptionNonce,
            tokenAddresses.length
        );
        if (
            factoryStorage.getRedemptionCompletedTokensCount(
                requestRedemptionNonce
            ) == totalCurrentList
        ) {
            completeRedemptionRequest(requestRedemptionNonce, messageId);
        }
    }

    /**
     * @dev Sends tokens to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param _data The data to send.
     * @param receiver The address of the receiver.
     * @param tokensToSendDetails The details of the tokens to send.
     * @param payFeesIn The fee payment method.
     * @return The message ID.
     */
    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        MessageSender.PayFeesIn payFeesIn
    ) internal nonReentrant returns (bytes32) {
        bytes32 messageId = MessageSender.sendToken(
            getRouter(),
            factoryStorage.linkToken(),
            factoryStorage.MAX_TOKENS_LENGTH(),
            destinationChainSelector,
            _data,
            receiver,
            tokensToSendDetails,
            payFeesIn,
            3_000_000
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
     * @return The message ID.
     */
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        MessageSender.PayFeesIn payFeesIn
    ) internal returns (bytes32) {
        // Validate input parameters
        require(
            destinationChainSelector > 0,
            "Invalid destination chain selector"
        );
        require(receiver != address(0), "Invalid receiver address");
        require(_data.length > 0, "Data cannot be empty");
        return
            MessageSender.sendMessage(
                getRouter(),
                factoryStorage.linkToken(),
                destinationChainSelector,
                receiver,
                _data,
                payFeesIn,
                3_000_000
            );
    }
    /**
     * @dev Handles received messages.
     * @param any2EvmMessage The received message.
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId;
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector;
        uint totalCurrentList = functionsOracle.totalCurrentList();
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        require(
            sender == factoryStorage.crossChainFactoryBySelector(sourceChainSelector),
            "Invalid sender for the factory ccip recieve"
        );
        (
            uint actionType,
            address[] memory tokenAddresses,
            ,
            ,
            ,
            uint nonce,
            uint[] memory value1,
            uint[] memory value2
        ) = abi.decode(
                any2EvmMessage.data,
                (
                    uint,
                    address[],
                    address[],
                    bytes[],
                    bytes[],
                    uint,
                    uint[],
                    uint[]
                )
            );
        if (actionType == 0) {
            _handleReceivedIssuance(
                nonce,
                tokenAddresses,
                value1,
                value2,
                totalCurrentList,
                messageId
            );
        } else if (actionType == 1) {
            _handleReceivedRedemption(
                nonce,
                any2EvmMessage,
                tokenAddresses,
                totalCurrentList,
                value1[0],
                sourceChainSelector,
                messageId
            );
        }
    }

    
}
