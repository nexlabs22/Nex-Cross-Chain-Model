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

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactoryStorage is
    ChainlinkClient,
    ProposableOwnableUpgradeable
{
    enum PayFeesIn {
        Native,
        LINK
    }
    using Chainlink for Chainlink.Request;

    
    IndexToken public indexToken;
    address public indexFactory;
    address public indexFactoryBalancer;

    mapping(uint64 => address) public crossChainToken;
    mapping(uint64 => mapping(address => uint)) public crossChainTokenSwapVersion;
    mapping(uint64 => address) public crossChainFactoryBySelector;


    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;
    // uint256 internal constant SCALAR = 1e20;

    

    
    
    string baseUrl;
    string urlParams;

    bytes32 public externalJobId;
    uint256 public oraclePayment;

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
    mapping(address => uint) public tokenSwapVersion;
    mapping(address => uint64) public tokenChainSelector;

    //new mappings
    uint public oracleFilledCount;
    uint public currentFilledCount;

    // uint public latestOracleChainsCount;
    // uint public latestCurrentChainsCount;

    mapping(uint => uint64[]) public oracleChainSelectors;
    mapping(uint => uint64[]) public currentChainSelectors;

    mapping(uint => mapping(uint64 => bool)) public isOracleChainSelectorStored;
    mapping(uint => mapping(uint64 => bool)) public isCurrentChainSelectorStored;

    mapping(uint => mapping(uint64 => address[])) public oracleChainSelectorTokens;
    mapping(uint => mapping(uint64 => address[])) public currentChainSelectorTokens;

    mapping(uint => mapping(uint64 => uint[])) public oracleChainSelectorVersions;
    mapping(uint => mapping(uint64 => uint[])) public currentChainSelectorVersions;

    mapping(uint => mapping(uint64 => uint[])) public oracleChainSelectorTokenShares;
    mapping(uint => mapping(uint64 => uint[])) public currentChainSelectorTokenShares;

    mapping(uint => mapping(uint64 => uint)) public oracleChainSelectorTotalShares;
    mapping(uint => mapping(uint64 => uint)) public currentChainSelectorTotalShares;

    // mapping(uint64 => address) public crossChainFactoryBySelector;

    
    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    //nonce
    
    modifier onlyIndexFactoryBalancer() {
        require(msg.sender == indexFactoryBalancer, "Caller is not index factory balancer contract.");
        _;
    }

    
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _chainlinkToken, 
        address _oracleAddress, 
        bytes32 _externalJobId,
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
        __Ownable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        //set oracle data
        setChainlinkToken(_chainlinkToken);
        setChainlinkOracle(_oracleAddress);
        externalJobId = _externalJobId;
        oraclePayment = ((1 * LINK_DIVISIBILITY) / 10); // n * 10**18
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPriceFeed);
        //set addresses
        weth = IWETH(_weth);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        factoryV2 = IUniswapV2Factory(_factoryV2);
        //oracle url
        baseUrl = "https://app.nexlabs.io/api/allFundingRates";
        urlParams = "?multiplyFunc=18&timesNegFund=true&arrays=true";
    }

    
    function oracleChainSelectorsCount() public view returns(uint){
        return oracleChainSelectors[oracleFilledCount].length;
    }
    function currentChainSelectorsCount() public view returns(uint){
        return currentChainSelectors[currentFilledCount].length;
    }

    function oracleChainSelectorTokensCount(uint64 _chainSelector) public view returns(uint){
        return oracleChainSelectorTokens[oracleFilledCount][_chainSelector].length;
    }
    function currentChainSelectorTokensCount(uint64 _chainSelector) public view returns(uint){
        return currentChainSelectorTokens[currentFilledCount][_chainSelector].length;
    }

    function allOracleChainSelectorTokens(uint64 _chainSelector) public view returns(address[] memory tokens){
        // for(uint i; i < currentChainSelectorTokensCount(_chainSelector); i++){
        //     tokens.push(currentChainSelectorTokens[currentFilledCount][_chainSelector][i]);
        // }
        tokens = oracleChainSelectorTokens[oracleFilledCount][_chainSelector];
    }
    function allCurrentChainSelectorTokens(uint64 _chainSelector) public view returns(address[] memory tokens){
        // for(uint i; i < currentChainSelectorTokensCount(_chainSelector); i++){
        //     tokens.push(currentChainSelectorTokens[currentFilledCount][_chainSelector][i]);
        // }
        tokens = currentChainSelectorTokens[currentFilledCount][_chainSelector];
    }

    function allOracleChainSelectorVersions(uint64 _chainSelector) public view returns(uint[] memory versions){
        versions = oracleChainSelectorVersions[oracleFilledCount][_chainSelector];
    }

    function allCurrentChainSelectorVersions(uint64 _chainSelector) public view returns(uint[] memory versions){  
        versions = currentChainSelectorVersions[currentFilledCount][_chainSelector];
    }

    function allOracleChainSelectorTokenShares(uint64 _chainSelector) public view returns(uint[] memory){
        return oracleChainSelectorTokenShares[oracleFilledCount][_chainSelector];
    }

    function allCurrentChainSelectorTokenShares(uint64 _chainSelector) public view returns(uint[] memory){
        return currentChainSelectorTokenShares[currentFilledCount][_chainSelector];
    }

    function setCrossChainToken(uint64 _chainSelector, address _crossChainToken, uint _swapVersion) public onlyOwner {
        crossChainToken[_chainSelector] = _crossChainToken;
        crossChainTokenSwapVersion[_chainSelector][_crossChainToken] = _swapVersion;
    }

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
        require(_toUsdPricefeed != address(0), "ICO: Price feed address cannot be zero address");
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPricefeed);        
    }

    function setIndexFactory(address _indexFactory) public onlyOwner {
        indexFactory = _indexFactory;
    }

    function setIndexFactoryBalancer(address _indexFactoryBalancer) public onlyOwner {
        indexFactoryBalancer = _indexFactoryBalancer;
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
    


   

   /**
    * @dev The contract's fallback function that does not allow direct payments to the contract.
    * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
    */
    // receive() external payable {
    //     // revert DoNotSendFundsDirectlyToTheContract();
    // }

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
    insertOracleData(_tokens, _marketShares, _swapVersions, _chainSelectors);
    
    }


    function mockFillAssetsList(address[] memory _tokens, uint256[] memory _marketShares, uint256[] memory _swapVersions, uint64[] memory _chainSelectors)
    public
    onlyOwner
  {
    insertOracleData(_tokens, _marketShares, _swapVersions, _chainSelectors);
    
    }


    function insertOracleData(address[] memory _tokens, uint256[] memory _marketShares, uint256[] memory _swapVersions, uint64[] memory _chainSelectors) private {
        address[] memory tokens0 = _tokens;
        uint[] memory marketShares0 = _marketShares;
        uint[] memory swapVersions0 = _swapVersions;
        uint64[] memory chainSelectors0 = _chainSelectors;

        oracleFilledCount +=1;
        if(totalCurrentList == 0){
        currentFilledCount +=1;
        }
        //save mappings
        for(uint i =0; i < tokens0.length; i++){
            oracleList[i] = tokens0[i];
            tokenOracleListIndex[tokens0[i]] = i;
            tokenOracleMarketShare[tokens0[i]] = marketShares0[i];
            tokenSwapVersion[tokens0[i]] = swapVersions0[i];
            tokenChainSelector[tokens0[i]] = chainSelectors0[i];
            // oracle chain selector actions
            if(!isOracleChainSelectorStored[oracleFilledCount][chainSelectors0[i]]){
                oracleChainSelectors[oracleFilledCount].push(chainSelectors0[i]);
                isOracleChainSelectorStored[oracleFilledCount][chainSelectors0[i]] = true;
            }
            oracleChainSelectorTokens[oracleFilledCount][chainSelectors0[i]].push(tokens0[i]);
            oracleChainSelectorVersions[oracleFilledCount][chainSelectors0[i]].push(swapVersions0[i]);
            oracleChainSelectorTotalShares[oracleFilledCount][chainSelectors0[i]] += marketShares0[i];

            oracleChainSelectorTokenShares[oracleFilledCount][chainSelectors0[i]].push(marketShares0[i]);

            if(totalCurrentList == 0){

            currentList[i] = tokens0[i];
            tokenCurrentMarketShare[tokens0[i]] = marketShares0[i];
            tokenCurrentListIndex[tokens0[i]] = i;
            
            // uint64 token
            // current chain selector actions
            
            if(!isCurrentChainSelectorStored[currentFilledCount][chainSelectors0[i]]){
                isCurrentChainSelectorStored[currentFilledCount][chainSelectors0[i]] = true;
                currentChainSelectors[currentFilledCount].push(chainSelectors0[i]);
            }
            currentChainSelectorTokens[currentFilledCount][chainSelectors0[i]].push(tokens0[i]);
            currentChainSelectorVersions[currentFilledCount][chainSelectors0[i]].push(swapVersions0[i]);
            currentChainSelectorTotalShares[currentFilledCount][chainSelectors0[i]] += marketShares0[i];
            currentChainSelectorTokenShares[currentFilledCount][chainSelectors0[i]].push(marketShares0[i]);
            }
        }
        totalOracleList = tokens0.length;
        if(totalCurrentList == 0){
            totalCurrentList  = tokens0.length;
        }
        lastUpdateTime = block.timestamp;
    }




    function updateCurrentList() public onlyIndexFactoryBalancer {
        currentFilledCount +=1;
        for(uint i =0; i < totalOracleList; i++){
            
            currentList[i] = oracleList[i];
            tokenCurrentMarketShare[currentList[i]] = tokenOracleMarketShare[oracleList[i]];
            tokenCurrentListIndex[currentList[i]] = tokenOracleListIndex[oracleList[i]];
            
            // current chain selector actions
            uint64 chainSelector = tokenChainSelector[oracleList[i]];
            if(!isCurrentChainSelectorStored[currentFilledCount][chainSelector]){
                isCurrentChainSelectorStored[currentFilledCount][chainSelector] = true;
                currentChainSelectors[currentFilledCount].push(chainSelector);
            }
            currentChainSelectorTokens[currentFilledCount][chainSelector].push(oracleList[i]);
            currentChainSelectorVersions[currentFilledCount][chainSelector].push(tokenSwapVersion[oracleList[i]]);
            currentChainSelectorTotalShares[currentFilledCount][chainSelector] += tokenOracleMarketShare[oracleList[i]];
            currentChainSelectorTokenShares[currentFilledCount][chainSelector].push(tokenOracleMarketShare[oracleList[i]]);
        }
        totalCurrentList = totalOracleList;
    }

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
        // uint32 lastUpdateSecond = OracleLibrary.getOldestObservationSecondsAgo(_pool);
        (int24 tick ) = OracleLibrary.getLatestTick(_pool);
        // (int24 tick, ) = OracleLibrary.consult(_pool, secondsAgo);
        amountOut = OracleLibrary.getQuoteAtTick(
            tick,
            amountIn,
            tokenIn,
            tokenOut
        );
    }

    

    

    
}