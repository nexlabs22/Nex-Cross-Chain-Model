// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

// import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "../chainlink/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../libraries/OracleLibrary.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
// import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "../ccip/CCIPReceiver.sol";
import "./CrossChainVault.sol";
// import {Withdraw} from "./utils/Withdraw.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CrossChainIndexFactory is
    CCIPReceiver,
    ChainlinkClient,
    ContextUpgradeable,
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{
    enum PayFeesIn {
        Native,
        LINK
    }
    using Chainlink for Chainlink.Request;

    struct Message {
        uint64 sourceChainSelector; // The chain selector of the source chain.
        address sender; // The address of the sender.
        string message; // The content of the message.
        address token; // received token.
        uint256 amount; // received amount.
    }

    // address public i_router;
    address public i_link;
    uint16 public i_maxTokensLength;
    bytes32[] public receivedMessages; // Array to keep track of the IDs of received messages.
    mapping(bytes32 => Message) public messageDetail; // Mapping from message ID to Message struct, storing details of each received message.

    // IndexToken public indexToken;
    CrossChainVault public crossChainVault;

    uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;
    uint256 internal constant SCALAR = 1e20;

    // Inflation rate (per day) on total supply, to be accrued to the feeReceiver.
    uint256 public feeRatePerDayScaled;

    // Most recent timestamp when fee was accured.
    uint256 public feeTimestamp;

    // Address that can claim fees accrued.
    address public feeReceiver;

    // Address that can publish a new methodology.
    address public methodologist;

    // Address that has privilege to mint and burn. It will be Controller and Admin to begin.
    address public minter;

    string public methodology;

    uint256 public supplyCeiling;

    mapping(address => bool) public isRestricted;

    
    uint256 public oraclePayment;
    

    
    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    address public crossChainToken;
    //nonce
    struct TokenOldAndNewValues{
        uint oldTokenValue;
        uint newTokenValue;
    }
    uint issuanceNonce;
    // mapping(uint => mapping(address => TokenOldAndNewValues)) public issuanceTokenOldAndNewValues;
    // mapping(uint => uint) public issuanceCompletedTokensCount;

    
    event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time);
    event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time);
    event MessageSent(bytes32 messageId);

    
    

    
    function initialize(
        uint64 _currentChainSelector,
        address payable _crossChainVault,
        address _chainlinkToken, 
        //ccip
        address _router, 
        //addresses
        address _weth,
        // address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        address _factoryV2
    ) external initializer{
        CCIPReceiver(_router);
        __Ownable_init();
        __Pausable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        crossChainVault = CrossChainVault(_crossChainVault);
        //set oracle data
        setChainlinkToken(_chainlinkToken);
        
        //set ccip addresses
        i_router = _router;
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        LinkTokenInterface(_chainlinkToken).approve(i_router, type(uint256).max);

        //set addresses
        weth = IWETH(_weth);
        // quoter = IQuoter(_quoter);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        factoryV2 = IUniswapV2Factory(_factoryV2);
       
    }

    function setCrossChainToken(address _crossChainToken) public onlyOwner {
        crossChainToken = _crossChainToken;
    }

    function setCrossChainVault(address payable _crossChainVault) public onlyOwner {
        crossChainVault = CrossChainVault(_crossChainVault);
    }

  

   /**
    * @dev The contract's fallback function that does not allow direct payments to the contract.
    * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
    */
    receive() external payable {
        // revert DoNotSendFundsDirectlyToTheContract();
    }

    


    
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }



    function _swapSingle(address tokenIn, address tokenOut, uint amountIn, address _recipient, uint _swapVersion) internal returns(uint){
        uint amountOut = getAmountOut(tokenIn, tokenOut, amountIn, _swapVersion);
        uint swapAmountOut;
        if(amountOut > 0){
           swapAmountOut = crossChainVault.swapSingle(tokenIn, tokenOut, amountIn, _recipient, _swapVersion);
        }
        if(_swapVersion == 3){
            return swapAmountOut;
        }else{
            return amountOut;
        }
    }


    function swap(address tokenIn, address tokenOut, uint amountIn, address _recipient, uint _swapVersion) public returns(uint){
            if(_swapVersion == 3){
                IERC20(tokenIn).approve(address(swapRouterV3), amountIn);
                ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    // pool fee 0.3%
                    fee: 3000,
                    recipient: _recipient,
                    deadline: block.timestamp,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    // NOTE: In production, this value can be used to set the limit
                    // for the price the swap will push the pool to,
                    // which can help protect against price impact
                    sqrtPriceLimitX96: 0
                });
                uint finalAmountOut = swapRouterV3.exactInputSingle(params);
                return finalAmountOut;
            } else{
                address[] memory path = new address[](2);
                path[0] = tokenIn;
                path[1] = tokenOut;

                IERC20(tokenIn).approve(address(swapRouterV2), amountIn);
                swapRouterV2.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amountIn, //amountIn
                    0, //amountOutMin
                    path, //path
                    _recipient, //to
                    block.timestamp //deadline
                );
                return 0;
            }
    }


    
    

    function getAmountOut(address tokenIn, address tokenOut, uint amountIn, uint _swapVersion) public view returns(uint finalAmountOut) {
        uint finalAmountOut;
        if(amountIn > 0){
        if(_swapVersion == 3){
           finalAmountOut = estimateAmountOut(tokenIn, tokenOut, uint128(amountIn), 1);
        }else {
            address[] memory path = new address[](2);
            path[0] = tokenIn;
            path[1] = tokenOut;
            uint[] memory v2amountOut = swapRouterV2.getAmountsOut(amountIn, path);
            finalAmountOut = v2amountOut[1];
        }
        }
        return finalAmountOut;
    }


    




    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint32 secondsAgo
    ) public view returns (uint amountOut) {
        
        address _pool = factoryV3.getPool(
            tokenIn,
            tokenOut,
            3000
        );

        (int24 tick, ) = OracleLibrary.consult(_pool, secondsAgo);
        amountOut = OracleLibrary.getQuoteAtTick(
            tick,
            amountIn,
            tokenIn,
            tokenOut
        );
    }


    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        PayFeesIn payFeesIn
    ) internal {
        uint256 length = tokensToSendDetails.length;
        require(
            length <= i_maxTokensLength,
            "Maximum 5 different tokens can be sent per CCIP Message"
        );

        for (uint256 i = 0; i < length; ) {
            // IERC20(tokensToSendDetails[i].token).transferFrom(
            //     msg.sender,
            //     address(this),
            //     tokensToSendDetails[i].amount
            // );
            if(tokensToSendDetails[i].token != i_link){
            IERC20(tokensToSendDetails[i].token).approve(
                i_router,
                tokensToSendDetails[i].amount
            );
            }
            unchecked {
                ++i;
            }
        }

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: _data,
            tokenAmounts: tokensToSendDetails,
            extraArgs: "",
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            // LinkTokenInterface(i_link).approve(i_router, fee);
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);
    }


    address public targetAddressF;

    // /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        
        (uint actionType, address[] memory targetAddresses, uint nonce, uint[] memory percentages, uint[] memory extraValues) = abi.decode(any2EvmMessage.data, (uint, address[], uint, uint[], uint[])); // abi-decoding of the sent string message
        if(actionType == 0){
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
            .destTokenAmounts;
        address token = tokenAmounts[0].token; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        uint256 amount = tokenAmounts[0].amount; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        uint wethAmount = swap(crossChainToken, address(weth), amount, address(crossChainVault), 3);
        uint[] memory oldTokenValues = new uint[](targetAddresses.length);
        uint[] memory newTokenValues = new uint[](targetAddresses.length);

        // uint wethToSwap = wethAmount*percentages[0]/extraValues[0];
        // uint oldTokenValue = getAmountOut(targetAddresses[0], address(weth), IERC20(targetAddresses[0]).balanceOf(address(crossChainVault)), 3);
        // _swapSingle(address(weth), 0xdcD77a498720D6F3Fbd241046a477062Cd1E7670, wethToSwap, address(crossChainVault), 3);
        // uint newTokenValue = oldTokenValue + wethAmount;
        // oldTokenValues[0] = oldTokenValue;
        // newTokenValues[0] = newTokenValue;
        // targetAddressF = targetAddresses[0];
        for(uint i = 0; i < targetAddresses.length; i++){
        uint wethToSwap = wethAmount*percentages[i]/extraValues[0];
        uint oldTokenValue = getAmountOut(targetAddresses[i], address(weth), IERC20(targetAddresses[i]).balanceOf(address(crossChainVault)), 3);
        _swapSingle(address(weth), address(targetAddresses[i]), wethToSwap, address(crossChainVault), 3);
        // _swapSingle(address(weth), 0xdcD77a498720D6F3Fbd241046a477062Cd1E7670, wethToSwap, address(crossChainVault), 3);
        uint newTokenValue = oldTokenValue + wethAmount;
        oldTokenValues[i] = oldTokenValue;
        newTokenValues[i] = newTokenValue;
        }
        bytes memory data = abi.encode(0, targetAddresses, nonce, oldTokenValues, newTokenValues);
        sendMessage(sourceChainSelector, address(sender), data, PayFeesIn.LINK);
        // sendMessage(sourceChainSelector, address(sender), abi.encode(""), PayFeesIn.LINK);
        }else if( actionType == 1){
          uint wethSwapAmountOut;
          for(uint i = 0; i < targetAddresses.length; i++){
          uint swapAmount = (extraValues[0]*IERC20(targetAddresses[i]).balanceOf(address(crossChainVault)))/1e18;
          wethSwapAmountOut += _swapSingle(targetAddresses[i], address(weth), swapAmount, address(this), 3);
          }
          uint crossChainTokenAmount = swap(address(weth), crossChainToken, wethSwapAmountOut, address(this), 3);
          Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
          tokensToSendArray[0].token = crossChainToken;
          tokensToSendArray[0].amount = crossChainTokenAmount;
          uint[] memory zeroArr;
          bytes memory data = abi.encode(1, targetAddresses, nonce, zeroArr, zeroArr);
          sendToken(sourceChainSelector, data, sender, tokensToSendArray, PayFeesIn.LINK);
        }else if( actionType == 2){
            uint tokenValue = getAmountOut(targetAddresses[0], address(weth), IERC20(targetAddresses[0]).balanceOf(address(crossChainVault)), 3);
            bytes memory data = abi.encode(2, targetAddresses[0], nonce, tokenValue, 0);
            sendMessage(sourceChainSelector, sender, data, PayFeesIn.LINK);
        }else if( actionType == 3){
            uint portfolioValue = percentages[0];
            uint marketShare = extraValues[0];
            uint tokenValue = getAmountOut(targetAddresses[0], address(weth), IERC20(targetAddresses[0]).balanceOf(address(crossChainVault)), 3);
            uint sellPercent = tokenValue*100e18/portfolioValue - marketShare;
            // uint swapAmount = (sellPercent*IERC20(targetAddress).balanceOf(address(crossChainVault)))/100e18;
            uint sellValue = tokenValue - (marketShare*portfolioValue)/100e18;
            uint swapAmount = (sellValue*IERC20(targetAddresses[0]).balanceOf(address(crossChainVault)))/tokenValue;
            uint wethSwapAmountOut = _swapSingle(targetAddresses[0], address(weth), swapAmount, address(this), 3);
            uint crossChainTokenAmount = swap(address(weth), crossChainToken, wethSwapAmountOut, address(this), 3);
            Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
            tokensToSendArray[0].token = crossChainToken;
            tokensToSendArray[0].amount = crossChainTokenAmount;
            bytes memory data = abi.encode(3, targetAddresses[0], nonce, 0, 0);
        }else if( actionType == 4){
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
            .destTokenAmounts;
            address token = tokenAmounts[0].token; // we expect one token to be transfered at once but of course, you can transfer several tokens.
            uint256 amount = tokenAmounts[0].amount; // we expect one token to be transfered at once but of course, you can transfer several tokens.

            uint wethAmount = swap(crossChainToken, address(weth), amount, address(crossChainVault), 3);
            _swapSingle(address(weth), targetAddresses[0], wethAmount, address(crossChainVault), 3);
        }
    }

    function testSend() public {
        sendMessage(16015286601757825753, 0x9E67a9705E52830946213526337454B34e50E554, abi.encode("HHH"), PayFeesIn.LINK);
    }

    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        PayFeesIn payFeesIn
    ) public {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: _data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            // LinkTokenInterface(i_link).approve(i_router, fee);
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);
    }


    
    
}