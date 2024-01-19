// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../token/IndexToken.sol";
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
import "../ccip/CCIPReceiver.sol";

// import {Withdraw} from "./utils/Withdraw.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactory is
    CCIPReceiver,
    ChainlinkClient,
    // ContextUpgradeable,
    ProposableOwnableUpgradeable
    // PausableUpgradeable
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
    // bytes32[] public receivedMessages; // Array to keep track of the IDs of received messages.
    // mapping(bytes32 => Message) public messageDetail; // Mapping from message ID to Message struct, storing details of each received message.
    address public crossChainToken;
    IndexToken public indexToken;

    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;
    // uint256 internal constant SCALAR = 1e20;

    // Inflation rate (per day) on total supply, to be accrued to the feeReceiver.
    // uint256 public feeRatePerDayScaled;

    // Most recent timestamp when fee was accured.
    // uint256 public feeTimestamp;

    // Address that can claim fees accrued.
    // address public feeReceiver;

    // Address that can publish a new methodology.
    // address public methodologist;

    // Address that has privilege to mint and burn. It will be Controller and Admin to begin.
    // address public minter;

    // string public methodology;

    // uint256 public supplyCeiling;

    // mapping(address => bool) public isRestricted;

    // enum DexStatus {
    //     UNISWAP_V2,
    //     UNISWAP_V3
    // }

    
    
    string baseUrl;
    string urlParams;

    bytes32 public externalJobId;
    uint256 public oraclePayment;
    AggregatorV3Interface public toUsdPriceFeed;
    uint public lastUpdateTime;
    // address[] public oracleList;
    // address[] public currentList;

    uint public totalOracleList;
    uint public totalCurrentList;

    mapping(uint => address) public oracleList;
    mapping(uint => address) public currentList;

    mapping(address => uint) public tokenOracleListIndex;
    mapping(address => uint) public tokenCurrentListIndex;

    mapping(address => uint) public tokenCurrentMarketShare;
    mapping(address => uint) public tokenOracleMarketShare;
    mapping(address => uint) public tokenSwapVersion;
    mapping(address => uint64) public tokenChainSelector;

    mapping(uint64 => address) public crossChainFactoryBySelector;

    
    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    //nonce
    struct TokenOldAndNewValues{
        uint oldTokenValue;
        uint newTokenValue;
    }
    uint issuanceNonce;
    uint redemptionNonce;
    uint updatePortfolioNonce;

    mapping(uint => mapping(address => TokenOldAndNewValues)) public issuanceTokenOldAndNewValues;
    mapping(uint => uint) public issuanceCompletedTokensCount;
    mapping(uint => address) public issuanceNonceRequester;


    mapping(uint => uint) public redemptionNonceTotalValue;
    mapping(uint => uint) public redemptionCompletedTokensCount;
    mapping(uint => address) public redemptionNonceRequester;

    mapping(uint => uint) public portfolioTotalValueByNonce;
    mapping(uint => uint) public updatedTokensValueCount;
    mapping(uint => mapping(address => uint)) public tokenValueByNonce;

    // event FeeReceiverSet(address indexed feeReceiver);
    // event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    // event MethodologistSet(address indexed methodologist);
    // event MethodologySet(string methodology);
    // event MinterSet(address indexed minter);
    // event SupplyCeilingSet(uint256 supplyCeiling);
    // event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    // event ToggledRestricted(address indexed account, bool isRestricted);

    event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time);
    event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time);
    event MessageSent(bytes32 messageId);

    // Event emitted when a message is received from another chain.
    // event MessageReceived(
    //     bytes32 indexed messageId, // The unique ID of the message.
    //     uint64 indexed sourceChainSelector, // The chain selector of the source chain.
    //     address sender, // The address of the sender from the source chain.
    //     string message, // The message that was received.
    //     Client.EVMTokenAmount tokenAmount // The token amount that was received.
    // );
    // modifier onlyMethodologist() {
    //     require(msg.sender == methodologist, "IndexToken: caller is not the methodologist");
    //     _;
    // }

    // modifier onlyMinter() {
    //     require(msg.sender == minter, "IndexToken: caller is not the minter");
    //     _;
    // }

    
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _chainlinkToken, 
        address _oracleAddress, 
        bytes32 _externalJobId,
        address _toUsdPriceFeed,
        //ccip
        address _router,
        //addresses
        address _weth,
        // address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        address _factoryV2
    ) external initializer {
        __ccipReceiver_init(_router);
        // CCIPReceiver(_router);
        __Ownable_init();
        // __Pausable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        //set oracle data
        setChainlinkToken(_chainlinkToken);
        setChainlinkOracle(_oracleAddress);
        externalJobId = _externalJobId;
        // externalJobId = "81027ac9198848d79a8d14235bf30e16";
        oraclePayment = ((1 * LINK_DIVISIBILITY) / 10); // n * 10**18
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPriceFeed);
        //set ccip addresses
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        // i_router = _router;
        LinkTokenInterface(_chainlinkToken).approve(i_router, type(uint256).max);

        //set addresses
        weth = IWETH(_weth);
        // quoter = IQuoter(_quoter);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        factoryV2 = IUniswapV2Factory(_factoryV2);
        //fee
        feeRate = 10;
        latestFeeUpdate = block.timestamp;

        baseUrl = "https://app.nexlabs.io/api/allFundingRates";
        urlParams = "?multiplyFunc=18&timesNegFund=true&arrays=true";
        // s_requestCount = 1;
    }

    
    function setCrossChainToken(address _crossChainToken) public onlyOwner {
        crossChainToken = _crossChainToken;
    }

    function setCrossChainFactory(address _crossChainFactoryAddress, uint64 _chainSelector) public onlyOwner {
        // crossChainToken = _crossChainToken;;
        crossChainFactoryBySelector[_chainSelector] = _crossChainFactoryAddress;
    }

  /**
    * @dev Sets the price feed address of the native coin to USD from the Chainlink oracle.
    * @param _toUsdPricefeed The address of native coin to USD price feed.
    */    
    function setPriceFeed(address _toUsdPricefeed) external onlyOwner {
        require(_toUsdPricefeed != address(0), "ICO: Price feed address cannot be zero address");
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPricefeed);        
    }

    
    function _toWei(int256 _amount, uint8 _amountDecimals, uint8 _chainDecimals) private pure returns (int256) {        
        if (_chainDecimals > _amountDecimals)
            return _amount * int256(10 **(_chainDecimals - _amountDecimals));
        else
            return _amount * int256(10 **(_amountDecimals - _chainDecimals));
    }

    function priceInWei() public view returns (uint256) {
        (,int price,,,) = toUsdPriceFeed.latestRoundData();
        uint8 priceFeedDecimals = toUsdPriceFeed.decimals();
        price = _toWei(price, priceFeedDecimals, 18);
        return uint256(price);
    }
    


    //Notice: newFee should be between 1 to 100 (0.01% - 1%)
  function setFeeRate(uint8 _newFee) public onlyOwner {
    uint256 distance = block.timestamp - latestFeeUpdate;
    require(distance / 60 / 60 > 12, "You should wait at least 12 hours after the latest update");
    require(_newFee <= 100 && _newFee >= 1, "The newFee should be between 1 and 100 (0.01% - 1%)");
    feeRate = _newFee;
    latestFeeUpdate = block.timestamp;
  }

   /**
    * @dev The contract's fallback function that does not allow direct payments to the contract.
    * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
    */
    receive() external payable {
        // revert DoNotSendFundsDirectlyToTheContract();
    }

    function concatenation(string memory a, string memory b) public pure returns (string memory) {
        return string(bytes.concat(bytes(a), bytes(b)));
    }

    function setUrl(string memory _beforeAddress, string memory _afterAddress) public onlyOwner{
    baseUrl = _beforeAddress;
    urlParams = _afterAddress;
    }
    
    function requestAssetsData(
    )
        public
        returns(bytes32)
    {
        
        string memory url = concatenation(baseUrl, urlParams);
        Chainlink.Request memory req = buildChainlinkRequest(externalJobId, address(this), this.fulfillAssetsData.selector);
        req.add("get", url);
        req.add("path1", "results,tokens");
        req.add("path2", "results,marketShares");
        req.add("path3", "results,swapVersions");
        req.add("path4", "results,chainSelector");
        // sendOperatorRequest(req, oraclePayment);
        return sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePayment);
    }

  function fulfillAssetsData(bytes32 requestId, address[] memory _tokens, uint256[] memory _marketShares, uint256[] memory _swapVersions, uint64[] memory _chainSelectors)
    public
    recordChainlinkFulfillment(requestId)
  {
    
    address[] memory tokens0 = _tokens;
    uint[] memory marketShares0 = _marketShares;
    uint[] memory swapVersions0 = _swapVersions;
    uint64[] memory chainSelectors0 = _chainSelectors;

    // //save mappings
    for(uint i =0; i < tokens0.length; i++){
        oracleList[i] = tokens0[i];
        tokenOracleListIndex[tokens0[i]] = i;
        tokenOracleMarketShare[tokens0[i]] = marketShares0[i];
        tokenSwapVersion[tokens0[i]] = swapVersions0[i];
        tokenChainSelector[tokens0[i]] = chainSelectors0[i];
        if(totalCurrentList == 0){
            currentList[i] = tokens0[i];
            tokenCurrentMarketShare[tokens0[i]] = marketShares0[i];
            tokenCurrentListIndex[tokens0[i]] = i;
        }
    }
    totalOracleList = tokens0.length;
    if(totalCurrentList == 0){
        totalCurrentList  = tokens0.length;
    }
    lastUpdateTime = block.timestamp;
    }


//     function mockFillAssetsList(address[] memory _tokens, uint256[] memory _marketShares, uint256[] memory _swapVersions)
//     public
//     onlyOwner
//   {
    
//     address[] memory tokens0 = _tokens;
//     uint[] memory marketShares0 = _marketShares;
//     uint[] memory swapVersions0 = _swapVersions;

//     // //save mappings
//     for(uint i =0; i < tokens0.length; i++){
//         oracleList[i] = tokens0[i];
//         tokenOracleListIndex[tokens0[i]] = i;
//         tokenOracleMarketShare[tokens0[i]] = marketShares0[i];
//         tokenSwapVersion[tokens0[i]] = swapVersions0[i];
//         if(totalCurrentList == 0){
//             currentList[i] = tokens0[i];
//             tokenCurrentMarketShare[tokens0[i]] = marketShares0[i];
//             tokenCurrentListIndex[tokens0[i]] = i;
//         }
//     }
//     totalOracleList = tokens0.length;
//     if(totalCurrentList == 0){
//         totalCurrentList  = tokens0.length;
//     }
//     lastUpdateTime = block.timestamp;
//     }






    function _swapSingle(address tokenIn, address tokenOut, uint amountIn, address _recipient, uint _swapVersion) internal returns(uint){
        uint amountOut = getAmountOut(tokenIn, tokenOut, amountIn, _swapVersion);
        uint swapAmountOut;
        if(amountOut > 0){
           swapAmountOut = indexToken.swapSingle(tokenIn, tokenOut, amountIn, _recipient, _swapVersion);
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

   
    function issuanceIndexTokensWithEth(uint _inputAmount) public payable {
        uint feeAmount = (_inputAmount*feeRate)/10000;
        uint finalAmount = _inputAmount + feeAmount;
        require(msg.value >= finalAmount, "lower than required amount");
        //transfer fee to the owner
        (bool _success,) = owner().call{value: feeAmount}("");
        require(_success, "transfer eth fee to the owner failed");
        issuanceNonce ++;
        issuanceNonceRequester[issuanceNonce] = msg.sender;
        weth.deposit{value: _inputAmount}();
        weth.transfer(address(indexToken), _inputAmount);
        uint firstPortfolioValue = getPortfolioBalance();
        uint wethAmount = _inputAmount;
        //swap
        for(uint i = 0; i < totalCurrentList; i++) {
          uint64 tokenChainSelector = tokenChainSelector[currentList[i]];
          if(tokenChainSelector == currentChainSelector){
            issuanceTokenOldAndNewValues[issuanceNonce][currentList[i]].oldTokenValue = getAmountOut(currentList[i], address(weth), IERC20(currentList[i]).balanceOf(address(indexToken)), tokenSwapVersion[currentList[i]]);
            _swapSingle(address(weth), currentList[i], wethAmount*tokenCurrentMarketShare[currentList[i]]/100e18, address(indexToken), tokenSwapVersion[currentList[i]]);
            issuanceTokenOldAndNewValues[issuanceNonce][currentList[i]].newTokenValue = issuanceTokenOldAndNewValues[issuanceNonce][currentList[i]].oldTokenValue + wethAmount*tokenCurrentMarketShare[currentList[i]]/100e18;
            issuanceCompletedTokensCount[issuanceNonce] += 1;
          }else{
            uint crossChainTokenAmount = _swapSingle(address(weth), crossChainToken, wethAmount*tokenCurrentMarketShare[currentList[i]]/100e18, address(this), 3);
            Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
            tokensToSendArray[0].token = crossChainToken;
            tokensToSendArray[0].amount = crossChainTokenAmount;
            bytes memory data = abi.encode(0, currentList[i], issuanceNonce, 0);
            address crossChainIndexFactory = crossChainFactoryBySelector[tokenChainSelector];
            sendToken(tokenChainSelector, data, crossChainIndexFactory, tokensToSendArray, PayFeesIn.LINK);
          }
        }
    }

    function completeIssuanceRequest(uint _issuanceNonce) internal {
        uint totalOldVaules;
        uint totalNewVaules;
        for(uint i = 0; i < totalCurrentList; i++){
            totalOldVaules += issuanceTokenOldAndNewValues[_issuanceNonce][currentList[i]].oldTokenValue;
            totalNewVaules += issuanceTokenOldAndNewValues[_issuanceNonce][currentList[i]].newTokenValue;
        }
    
        uint amountToMint;
       if(indexToken.totalSupply() > 0){
        amountToMint = (indexToken.totalSupply()*totalNewVaules)/totalOldVaules - indexToken.totalSupply();
       }else{
        uint price = priceInWei();
        amountToMint = (totalNewVaules*price)/1e16;
       }
        indexToken.mint(issuanceNonceRequester[_issuanceNonce], amountToMint);
        // emit Issuanced(msg.sender, address(weth), _inputAmount, amountToMint, block.timestamp);
        
    }


    function redemption(uint amountIn, address _tokenOut, uint _tokenOutSwapVersion) public returns(uint) {
        uint burnPercent = amountIn*1e18/indexToken.totalSupply();
        redemptionNonce +=1;
        redemptionNonceRequester[redemptionNonce] = msg.sender;

        indexToken.burn(msg.sender, amountIn);

        // uint outputAmount;
        //swap
        for(uint i = 0; i < totalCurrentList; i++) {
        uint64 tokenChainSelector = tokenChainSelector[currentList[i]];
        if(tokenChainSelector == currentChainSelector){
        uint swapAmount = (burnPercent*IERC20(currentList[i]).balanceOf(address(indexToken)))/1e18;
        uint swapAmountOut = _swapSingle(currentList[i], address(weth), swapAmount, address(this), tokenSwapVersion[currentList[i]]);
        redemptionNonceTotalValue[redemptionNonce] += swapAmountOut;
        redemptionCompletedTokensCount[redemptionNonce] += 1;
        // outputAmount += swapAmountOut;
        }else{
            address crossChainIndexFactory = crossChainFactoryBySelector[tokenChainSelector];
            bytes memory data = abi.encode(1, currentList[i], redemptionNonce, burnPercent);
            sendMessage(tokenChainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
        }
        }
        
        
        }

        function completeRedemptionRequest(uint nonce) internal {
            uint wethAmount = redemptionNonceTotalValue[nonce];
            address requester = redemptionNonceRequester[nonce];

            uint fee = wethAmount*feeRate/10000;
            weth.withdraw(fee);
            weth.transfer(requester, wethAmount - fee);
            (bool _ownerSuccess,) = owner().call{value: fee}("");
            require(_ownerSuccess, "transfer eth fee to the owner failed");

            /**
            uint fee = outputAmount*feeRate/10000;
            if(_tokenOut == address(weth)){
                // weth.transfer(msg.sender, outputAmount - fee);
                weth.withdraw(outputAmount);
                (bool _ownerSuccess,) = owner().call{value: fee}("");
                require(_ownerSuccess, "transfer eth fee to the owner failed");
                (bool _userSuccess,) = payable(msg.sender).call{value: outputAmount - fee}("");
                require(_userSuccess, "transfer eth fee to the user failed");
                emit Redemption(msg.sender, _tokenOut, amountIn, outputAmount - fee, block.timestamp);
                return outputAmount - fee;
            }else{
                weth.withdraw(fee);
                (bool _success,) = owner().call{value: fee}("");
                require(_success, "transfer eth fee to the owner failed");
                uint reallOut = swap(address(weth), _tokenOut, outputAmount - fee, msg.sender, _tokenOutSwapVersion);
                emit Redemption(msg.sender, _tokenOut, amountIn, reallOut, block.timestamp);
                return reallOut;
            }
            */
        }


    // }

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


    function getPortfolioBalance() public view returns(uint){
        uint totalValue;
        for(uint i = 0; i < totalCurrentList; i++) {
            uint value = getAmountOut(currentList[i], address(weth), IERC20(currentList[i]).balanceOf(address(indexToken)), tokenSwapVersion[currentList[i]]);
            totalValue += value;
        }
        return totalValue;
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
            IERC20(tokensToSendDetails[i].token).approve(
                i_router,
                tokensToSendDetails[i].amount
            );

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

    // /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        // Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
        //     .destTokenAmounts;
        // address token = tokenAmounts[0].token; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        // uint256 amount = tokenAmounts[0].amount; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        (uint actionType, address tokenAddress, uint nonce, uint value1, uint value2) = abi.decode(any2EvmMessage.data, (uint, address, uint, uint, uint)); // abi-decoding of the sent string message
        if(actionType == 0){
        uint issuanceNonce = nonce;
        uint oldTokenValue = value1;
        uint newTokenValue = value2;
        issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress].oldTokenValue = oldTokenValue;
        issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress].newTokenValue = newTokenValue;
        issuanceCompletedTokensCount[issuanceNonce] += 1;
        if(issuanceCompletedTokensCount[issuanceNonce] == totalCurrentList){
            completeIssuanceRequest(issuanceNonce);
        }
        }else if(actionType == 1){
        uint redemptionNonce = nonce;
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
        .destTokenAmounts;
        address token = tokenAmounts[0].token; 
        uint256 amount = tokenAmounts[0].amount;
        uint wethAmount = swap(token, address(weth), amount, address(this), 3);
        redemptionNonceTotalValue[redemptionNonce] += wethAmount;
        redemptionCompletedTokensCount[redemptionNonce] += 1;
        if(redemptionCompletedTokensCount[redemptionNonce] == totalCurrentList){
            completeRedemptionRequest(redemptionNonce);
        }
        }else if(actionType == 2){
            portfolioTotalValueByNonce[nonce] += value1;
            tokenValueByNonce[nonce][tokenAddress] += value1;
            updatedTokensValueCount[nonce] += 1;
        }
    }

    function askValues(){
        updatePortfolioNonce += 1;
        for(uint i = 0; i < totalCurrentList; i++) {
        uint64 tokenChainSelector = tokenChainSelector[currentList[i]];
        if(tokenChainSelector == currentChainSelector){
        uint value = getAmountOut(currentList[i], address(weth), IERC20(currentList[i]).balanceOf(address(indexToken)), tokenSwapVersion[currentList[i]]);
        portfolioTotalValueByNonce[updatePortfolioNonce] += value;
        tokenValueByNonce[nonce][tokenAddress] += value;
        updatedTokensValueCount[updatePortfolioNonce] += 1;
        }else{
            address crossChainIndexFactory = crossChainFactoryBySelector[tokenChainSelector];
            bytes memory data = abi.encode(2, currentList[i], updatePortfolioNonce, 0);
            sendMessage(tokenChainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
        }
    }

    function reIndexAndReweight() public onlyOwner {
            uint nonce = updatePortfolioNonce;
            uint portfolioValue = portfolioTotalValueByNonce[nonce];
        for(uint i; i < totalCurrentList; i++) {
            uint tokenValue = tokenValueByNonce[nonce][currentList[i]];
            if(tokenValue*100e18/portfolioValue > tokenOracleMarketShare[currentList[i]]){
                uint64 tokenChainSelector = tokenChainSelector[currentList[i]];
                if(tokenChainSelector == currentChainSelector){
                uint sellPercent = tokenValue*100e18/portfolioValue - tokenOracleMarketShare[currentList[i]];
                uint swapAmount = (sellPercent*IERC20(currentList[i]).balanceOf(address(indexToken)))/100e18;
                _swapSingle(currentList[i], address(weth), swapAmount, address(indexToken), tokenSwapVersion[currentList[i]]);
                }else{
                    address crossChainIndexFactory = crossChainFactoryBySelector[tokenChainSelector];
                    bytes memory data = abi.encode(3, currentList[i], nonce, portfolioValue);
                    sendMessage(tokenChainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
                }
            }
        }
    }
    
}