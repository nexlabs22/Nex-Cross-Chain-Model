// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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
// import "../libraries/OracleLibrary.sol";
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
contract IndexFactoryStorage is
    Initializable,
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
    mapping(address => uint24) public tokenSwapFee;
    mapping(address => uint64) public tokenChainSelector;

    //new mappings
    uint public oracleFilledCount;
    uint public currentFilledCount;

    // uint public latestOracleChainsCount;
    // uint public latestCurrentChainsCount;

    struct OracleData {
        address[] tokens;
        uint[] marketShares;
        uint[] swapFees;
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
        uint24[] swapFees;
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
        require(msg.sender == indexFactoryBalancer, "Caller is not index factory balancer contract.");
        _;
    }

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _token The address of the IndexToken contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _oracleAddress The address of the Chainlink oracle.
     * @param _externalJobId The external job ID for the Chainlink request.
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

    /**
     * @dev Returns the count of oracle chain selectors.
     * @return The count of oracle chain selectors.
     */
    function oracleChainSelectorsCount() public view returns(uint){
        return oracleData[oracleFilledCount].chainSelectors.length;
    }

    /**
     * @dev Returns the count of current chain selectors.
     * @return The count of current chain selectors.
     */
    function currentChainSelectorsCount() public view returns(uint){
        return currentData[currentFilledCount].chainSelectors.length;
    }

    /**
     * @dev Returns the count of tokens in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return The count of tokens in the oracle chain selector.
     */
    function oracleChainSelectorTokensCount(uint64 _chainSelector) public view returns(uint){
        return oracleData[oracleFilledCount].oracleChainSelectorTokens[_chainSelector].length;
    }

    /**
     * @dev Returns the count of tokens in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return The count of tokens in the current chain selector.
     */
    function currentChainSelectorTokensCount(uint64 _chainSelector) public view returns(uint){
        return currentData[currentFilledCount].currentChainSelectorTokens[_chainSelector].length;
    }

    /**
     * @dev Returns all tokens in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return tokens The addresses of the tokens.
     */
    function allOracleChainSelectorTokens(uint64 _chainSelector) public view returns(address[] memory tokens){
        tokens = oracleData[oracleFilledCount].oracleChainSelectorTokens[_chainSelector];
    }

    /**
     * @dev Returns all tokens in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return tokens The addresses of the tokens.
     */
    function allCurrentChainSelectorTokens(uint64 _chainSelector) public view returns(address[] memory tokens){
        tokens = currentData[currentFilledCount].currentChainSelectorTokens[_chainSelector];
    }

    /**
     * @dev Returns all versions in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return versions The versions of the tokens.
     */
    function allOracleChainSelectorVersions(uint64 _chainSelector) public view returns(uint[] memory versions){
        versions = oracleData[oracleFilledCount].oracleChainSelectorVersions[_chainSelector];
    }

    /**
     * @dev Returns all versions in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return versions The versions of the tokens.
     */
    function allCurrentChainSelectorVersions(uint64 _chainSelector) public view returns(uint[] memory versions){  
        versions = currentData[currentFilledCount].currentChainSelectorVersions[_chainSelector];
    }

    /**
     * @dev Returns all token shares in the oracle chain selector.
     * @param _chainSelector The chain selector.
     * @return The token shares.
     */
    function allOracleChainSelectorTokenShares(uint64 _chainSelector) public view returns(uint[] memory){
        return oracleData[oracleFilledCount].oracleChainSelectorTokenShares[_chainSelector];
    }

    /**
     * @dev Returns all token shares in the current chain selector.
     * @param _chainSelector The chain selector.
     * @return The token shares.
     */
    function allCurrentChainSelectorTokenShares(uint64 _chainSelector) public view returns(uint[] memory){
        return currentData[currentFilledCount].currentChainSelectorTokenShares[_chainSelector];
    }

    /**
     * @dev Sets the cross-chain token and its swap version.
     * @param _chainSelector The chain selector.
     * @param _crossChainToken The address of the cross-chain token.
     * @param _swapFee The swap version of the cross-chain token.
     */
    function setCrossChainToken(uint64 _chainSelector, address _crossChainToken, uint24 _swapFee) public onlyOwner {
        crossChainToken[_chainSelector] = _crossChainToken;
        crossChainTokenSwapFee[_chainSelector][_crossChainToken] = _swapFee;
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
        require(_toUsdPricefeed != address(0), "ICO: Price feed address cannot be zero address");
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
    function setIndexFactoryBalancer(address _indexFactoryBalancer) public onlyOwner {
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
    function _toWei(int256 _amount, uint8 _amountDecimals, uint8 _chainDecimals) private pure returns (int256) {        
        if (_chainDecimals > _amountDecimals)
            return _amount * int256(10 **(_chainDecimals - _amountDecimals));
        else
            return _amount * int256(10 **(_amountDecimals - _chainDecimals));
    }

    /**
     * @dev Returns the price in Wei.
     * @return The price in Wei.
     */
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

    /**
     * @dev Concatenates two strings.
     * @param a The first string.
     * @param b The second string.
     * @return The concatenated string.
     */
    function concatenation(string memory a, string memory b) public pure returns (string memory) {
        return string(bytes.concat(bytes(a), bytes(b)));
    }

    /**
     * @dev Sets the URL for the oracle request.
     * @param _beforeAddress The base URL.
     * @param _afterAddress The URL parameters.
     */
    function setUrl(string memory _beforeAddress, string memory _afterAddress) public onlyOwner{
    baseUrl = _beforeAddress;
    urlParams = _afterAddress;
    }
    
    /**
     * @dev Requests asset data from the oracle.
     * @return The request ID.
     */
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
        req.add("path3", "results,swapFees");
        req.add("path4", "results,chainSelector");
        // sendOperatorRequest(req, oraclePayment);
        return sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePayment);
    }

    /**
     * @dev Fulfills the asset data request.
     * @param requestId The request ID.
     * @param _tokens The addresses of the tokens.
     * @param _marketShares The market shares of the tokens.
     * @param _swapFees The swap versions of the tokens.
     * @param _chainSelectors The chain selectors of the tokens.
     */
  function fulfillAssetsData(bytes32 requestId, address[] memory _tokens, uint256[] memory _marketShares, uint24[] memory _swapFees, uint64[] memory _chainSelectors)
    public
    recordChainlinkFulfillment(requestId)
  {
    insertOracleData(_tokens, _marketShares, _swapFees, _chainSelectors);
    
    }

    /**
     * @dev Mocks the fulfillment of asset data.
     * @param _tokens The addresses of the tokens.
     * @param _marketShares The market shares of the tokens.
     * @param _swapFees The swap versions of the tokens.
     * @param _chainSelectors The chain selectors of the tokens.
     */
    function mockFillAssetsList(address[] memory _tokens, uint256[] memory _marketShares, uint24[] memory _swapFees, uint64[] memory _chainSelectors)
    public
    onlyOwner
  {
    insertOracleData(_tokens, _marketShares, _swapFees, _chainSelectors);
    
    }

    /**
     * @dev Inserts oracle data into the contract.
     * @param _tokens The addresses of the tokens.
     * @param _marketShares The market shares of the tokens.
     * @param _swapFees The swap versions of the tokens.
     * @param _chainSelectors The chain selectors of the tokens.
     */
    function insertOracleData(address[] memory _tokens, uint256[] memory _marketShares, uint24[] memory _swapFees, uint64[] memory _chainSelectors) private {
        address[] memory tokens0 = _tokens;
        uint[] memory marketShares0 = _marketShares;
        uint24[] memory swapFees0 = _swapFees;
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
            tokenSwapFee[tokens0[i]] = swapFees0[i];
            tokenChainSelector[tokens0[i]] = chainSelectors0[i];
            // oracle chain selector actions
            if(!oracleData[oracleFilledCount].isOracleChainSelectorStored[chainSelectors0[i]]){
                oracleData[oracleFilledCount].chainSelectors.push(chainSelectors0[i]);
                oracleData[oracleFilledCount].isOracleChainSelectorStored[chainSelectors0[i]] = true;
            }
            oracleData[oracleFilledCount].oracleChainSelectorTokens[chainSelectors0[i]].push(tokens0[i]);
            oracleData[oracleFilledCount].oracleChainSelectorVersions[chainSelectors0[i]].push(swapFees0[i]);
            oracleData[oracleFilledCount].oracleChainSelectorTotalShares[chainSelectors0[i]] += marketShares0[i];

            oracleData[oracleFilledCount].oracleChainSelectorTokenShares[chainSelectors0[i]].push(marketShares0[i]);

            if(totalCurrentList == 0){

            currentList[i] = tokens0[i];
            tokenCurrentMarketShare[tokens0[i]] = marketShares0[i];
            tokenCurrentListIndex[tokens0[i]] = i;
            
            // uint64 token
            // current chain selector actions
            
            if(!currentData[currentFilledCount].isCurrentChainSelectorStored[chainSelectors0[i]]){
                currentData[currentFilledCount].isCurrentChainSelectorStored[chainSelectors0[i]] = true;
                currentData[currentFilledCount].chainSelectors.push(chainSelectors0[i]);
            }
            currentData[currentFilledCount].currentChainSelectorTokens[chainSelectors0[i]].push(tokens0[i]);
            currentData[currentFilledCount].currentChainSelectorVersions[chainSelectors0[i]].push(swapFees0[i]);
            currentData[currentFilledCount].currentChainSelectorTotalShares[chainSelectors0[i]] += marketShares0[i];
            currentData[currentFilledCount].currentChainSelectorTokenShares[chainSelectors0[i]].push(marketShares0[i]);
            }
        }
        totalOracleList = tokens0.length;
        if(totalCurrentList == 0){
            totalCurrentList  = tokens0.length;
        }
        lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Updates the current list of tokens.
     */
    function _updateCurrenctList() internal {
        currentFilledCount +=1;
        for(uint i =0; i < totalOracleList; i++){
            
            currentList[i] = oracleList[i];
            tokenCurrentMarketShare[currentList[i]] = tokenOracleMarketShare[oracleList[i]];
            tokenCurrentListIndex[currentList[i]] = tokenOracleListIndex[oracleList[i]];
            
            // current chain selector actions
            uint64 chainSelector = tokenChainSelector[oracleList[i]];
            if(!currentData[currentFilledCount].isCurrentChainSelectorStored[chainSelector]){
                currentData[currentFilledCount].isCurrentChainSelectorStored[chainSelector] = true;
                currentData[currentFilledCount].chainSelectors.push(chainSelector);
            }
            currentData[currentFilledCount].currentChainSelectorTokens[chainSelector].push(oracleList[i]);
            currentData[currentFilledCount].currentChainSelectorVersions[chainSelector].push(tokenSwapFee[oracleList[i]]);
            currentData[currentFilledCount].currentChainSelectorTotalShares[chainSelector] += tokenOracleMarketShare[oracleList[i]];
            currentData[currentFilledCount].currentChainSelectorTokenShares[chainSelector].push(tokenOracleMarketShare[oracleList[i]]);
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

    

    /**
     * @dev Returns the amount out for a given swap.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token.
     * @param _swapFee The swap version.
     * @return finalAmountOutValue The amount of output token.
     */
    function getAmountOut(address tokenIn, address tokenOut, uint amountIn, uint24 _swapFee) public view returns(uint finalAmountOutValue) {
        uint finalAmountOut;
        if(amountIn > 0){
        if(_swapFee > 0){
           finalAmountOut = estimateAmountOut(tokenIn, tokenOut, uint128(amountIn), _swapFee);
        }else {
            address[] memory path = new address[](2);
            path[0] = tokenIn;
            path[1] = tokenOut;
            uint[] memory v2amountOut = swapRouterV2.getAmountsOut(amountIn, path);
            finalAmountOut = v2amountOut[1];
        }
        }
        finalAmountOutValue = finalAmountOut;
    }

    /**
     * @dev Returns the portfolio balance.
     * @return The total portfolio balance.
     */
    function getPortfolioBalance() public view returns(uint){
        uint totalValue;
        for(uint i = 0; i < totalCurrentList; i++) {
            uint value = getAmountOut(currentList[i], address(weth), IERC20(currentList[i]).balanceOf(address(vault)), tokenSwapFee[currentList[i]]);
            totalValue += value;
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
        // address _pool = factoryV3.getPool(
        //     tokenIn,
        //     tokenOut,
        //     3000
        // );
        // (int24 tick ) = OracleLibrary.getLatestTick(_pool);
        // amountOut = OracleLibrary.getQuoteAtTick(
        //     tick,
        //     amountIn,
        //     tokenIn,
        //     tokenOut
        // );
    }

    function getOracleData(uint index) public view returns (address[] memory tokens, uint[] memory marketShares, uint[] memory swapFees, uint64[] memory chainSelectors) {
        OracleData storage data = oracleData[index];
        return (data.tokens, data.marketShares, data.swapFees, data.chainSelectors);
    }

    function getCurrentData(uint index) public view returns (address[] memory tokens, uint[] memory marketShares, uint24[] memory swapFees, uint64[] memory chainSelectors) {
        CurrentData storage data = currentData[index];
        return (data.tokens, data.marketShares, data.swapFees, data.chainSelectors);
    }

    function getCurrentChainSelectorTotalShares(uint index, uint64 chainSelector) public view returns (uint) {
        return currentData[index].currentChainSelectorTotalShares[chainSelector];
    }

    function getOracleChainSelectorTotalShares(uint index, uint64 chainSelector) public view returns (uint) {
        return oracleData[index].oracleChainSelectorTotalShares[chainSelector];
    }
}