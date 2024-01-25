// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/token/IndexToken.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/test/TestSwap.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "../../contracts/test/MockV3Aggregator.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/interfaces/IUniswapV3Pool.sol";
import "../../contracts/test/MockV3Aggregator.sol";

contract CounterTest is Test {

    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;

    IndexToken public indexToken;
    IndexFactory public factory;
    TestSwap public testSwap;
    MockV3Aggregator public ethPriceOracle;

    uint256 mainnetFork;

    address feeReceiver = vm.addr(1);
    address newFeeReceiver = vm.addr(2);
    address minter = vm.addr(3);
    address newMinter = vm.addr(4);
    address methodologist = vm.addr(5);
    address owner = vm.addr(6);
    address add1 = vm.addr(7);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant QUOTER = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;

    IUniswapV3Factory public constant factoryV3 =
        IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);
    
    address public SHIB = 0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE;
    address public constant PEPE = 0x6982508145454Ce325dDbE47a25d4ec3d2311933;
    address public constant FLOKI = 0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E;
    address public constant MEME = 0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74;
    address public constant BabyDoge = 0xAC57De9C1A09FeC648E93EB98875B212DB0d460B;
    address public constant BONE = 0x9813037ee2218799597d83D4a5B6F3b6778218d9;
    address public constant HarryPotterObamaSonic10Inu = 0x72e4f9F808C49A2a61dE9C5896298920Dc4EEEa9;
    address public constant ELON = 0x761D38e5ddf6ccf6Cf7c55759d5210750B5D60F3;
    address public constant WSM = 0xB62E45c3Df611dcE236A6Ddc7A493d79F9DFadEf;
    address public constant LEASH = 0x27C70Cd1946795B66be9d954418546998b546634;

    address public constant WBTC = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
    address public constant BNB = 0x418D75f65a02b3D53B2418FB8E1fe493759c7605;
    address public constant WXRP = 0x1E02E2eD139F5Baf6bfaD04c0E61EBb0110dA653;
    address public constant CURVE = 0xD533a949740bb3306d119CC777fa900bA034cd52;
    address public constant LINK = 0x514910771AF9Ca656af840dff83E8264EcF986CA;
    address public constant UNI = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;

    address[] public assetList = [
        WBTC,
        BNB,
        CURVE,
        LINK,
        UNI
        // SHIB,
        // PEPE,
        // FLOKI
        // MEME,
        // BabyDoge
        // BONE
        // HarryPotterObamaSonic10Inu,
        // ELON
        // WSM,
        // LEASH
    ];

    uint[] public tokenShares = [
        20e18,
        20e18,
        20e18,
        20e18,
        20e18
        // 10e18,
        // 10e18,
        // 10e18,
        // 10e18,
        // 10e18
    ];

    uint[] public swapVersions = [
        3,
        3,
        3,
        3,
        3
        // 3,
        // 3,
        // 2,
        // 3,
        // 2
        // 3
        // 3,
        // 2,
        // 3,
        // 2
    ];

    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant QUOTER = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;
    address public constant SwapRouterV3 = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public constant FactoryV3 = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address public constant SwapRouterV2 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant FactoryV2 = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    
    

    ERC20 public dai;
    IWETH public weth;

    // Swap public swap;
    IQuoter public quoter;

    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    bytes32 jobId = "6b88e0402e5d415eb946e528b8e0c7ba";

    MockApiOracle public oracle;
    LinkToken link;

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);


    function setUp() public {
        mainnetFork = vm.createFork(MAINNET_RPC_URL);

        vm.selectFork(mainnetFork);
        // vm.rollFork(18635000);
        // vm.rollFork(block.number - 1000);
        link = new LinkToken();
        oracle = new MockApiOracle(address(link));

        ethPriceOracle = new MockV3Aggregator(
            18, //decimals
            2000e18   //initial data
        );


        indexToken = new IndexToken();
        indexToken.initialize(
            "Anti Inflation",
            "ANFI",
            1e18,
            feeReceiver,
            1000000e18,
            //swap addresses
            WETH9,
            QUOTER,
            SwapRouterV3,
            FactoryV3,
            SwapRouterV2,
            FactoryV2
        );

        factory = new IndexFactory();
        factory.initialize(
            payable(address(indexToken)),
            // address(0),
            address(link),
            address(oracle),
            jobId,
            address(ethPriceOracle),
            //swap addresses
            WETH9,
            QUOTER,
            SwapRouterV3,
            FactoryV3,
            SwapRouterV2,
            FactoryV2
        );

        indexToken.setMinter(address(factory));

        // swap = new Swap();
        dai = ERC20(DAI);
        weth = IWETH(WETH9);
        quoter = IQuoter(QUOTER);

        testSwap = new TestSwap();

        
    }

    function testInitialized() public {
        // counter.increment();
        assertEq(indexToken.owner(), address(this));
        assertEq(indexToken.feeRatePerDayScaled(), 1e18);
        assertEq(indexToken.feeTimestamp(), block.timestamp);
        assertEq(indexToken.feeReceiver(), feeReceiver);
        assertEq(indexToken.methodology(), "");
        assertEq(indexToken.supplyCeiling(), 1000000e18);
        assertEq(indexToken.minter(), address(factory));
    }

    enum DexStatus {
        UNISWAP_V2,
        UNISWAP_V3
    }

    function updateOracleList() public {
        // console.log(link.balanceOf(address(this)));
        // console.log(link.balanceOf(address(this)));
        // link.transfer(address(factory), 1e18);
        link.transfer(address(factory), 1e17);
        bytes32 requestId = factory.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapVersions);
    }
    function testOracleList() public {
        updateOracleList();
        // token list
        assertEq(factory.oracleList(0), assetList[0]);
        assertEq(factory.oracleList(1), assetList[1]);
        assertEq(factory.oracleList(2), assetList[2]);
        assertEq(factory.oracleList(3), assetList[3]);
        assertEq(factory.oracleList(4), assetList[4]);
        // assertEq(factory.oracleList(5), assetList[5]);
        // assertEq(factory.oracleList(6), assetList[6]);
        // assertEq(factory.oracleList(7), assetList[7]);
        // assertEq(factory.oracleList(8), assetList[8]);
        // assertEq(factory.oracleList(9), assetList[9]);
        // token shares
        assertEq(factory.tokenOracleMarketShare(assetList[0]), tokenShares[0]);
        assertEq(factory.tokenOracleMarketShare(assetList[1]), tokenShares[1]);
        assertEq(factory.tokenOracleMarketShare(assetList[2]), tokenShares[2]);
        assertEq(factory.tokenOracleMarketShare(assetList[3]), tokenShares[3]);
        assertEq(factory.tokenOracleMarketShare(assetList[4]), tokenShares[4]);
        // assertEq(factory.tokenMarketShare(assetList[5]), tokenShares[5]);
        // assertEq(factory.tokenMarketShare(assetList[6]), tokenShares[6]);
        // assertEq(factory.tokenMarketShare(assetList[7]), tokenShares[7]);
        // assertEq(factory.tokenMarketShare(assetList[8]), tokenShares[8]);
        // assertEq(factory.tokenMarketShare(assetList[9]), tokenShares[9]);
        // token shares
        assertEq(factory.tokenSwapVersion(assetList[0]), swapVersions[0]);
        assertEq(factory.tokenSwapVersion(assetList[1]), swapVersions[1]);
        assertEq(factory.tokenSwapVersion(assetList[2]), swapVersions[2]);
        assertEq(factory.tokenSwapVersion(assetList[3]), swapVersions[3]);
        assertEq(factory.tokenSwapVersion(assetList[4]), swapVersions[4]);
        // assertEq(factory.tokenSwapVersion(assetList[5]), swapVersions[5]);
        // assertEq(factory.tokenSwapVersion(assetList[6]), swapVersions[6]);
        // assertEq(factory.tokenSwapVersion(assetList[7]), swapVersions[7]);
        // assertEq(factory.tokenSwapVersion(assetList[8]), swapVersions[8]);
        // assertEq(factory.tokenSwapVersion(assetList[9]), swapVersions[9]);
    }

    
    function testIssuanceWithEth() public {
        uint startAmount = 1e14;
        

        updateOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        vm.startPrank(add1);
        console.log("FLOKI", IERC20(FLOKI).balanceOf(address(factory)));
        
        factory.issuanceIndexTokensWithEth{value: (1e18*1001)/1000}(1e18);
        console.log("index token balance", indexToken.balanceOf(address(add1)));
        console.log("portfolio value", factory.getPortfolioBalance());
        factory.redemption(indexToken.balanceOf(address(add1)), address(weth), 3);
        console.log("weth after redemption", add1.balance);
    }


    function testIssuanceWithTokens() public {
        uint startAmount = 1e14;
        
        weth.deposit{value:10e18}();
        IERC20(WETH9).approve(address(swapRouter), 10e18);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: DAI,
            // pool fee 0.3%
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: 10e18,
            amountOutMinimum: 0,
            // NOTE: In production, this value can be used to set the limit
            // for the price the swap will push the pool to,
            // which can help protect against price impact
            sqrtPriceLimitX96: 0
        });
        uint finalAmountOut = swapRouter.exactInputSingle(params);
        console.log("dai balalnce", IERC20(DAI).balanceOf(address(this)));
        updateOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        // payable(add1).transfer(11e18);
        IERC20(DAI).transfer(add1, 1001e18);
        vm.startPrank(add1);
        console.log("FLOKI", IERC20(FLOKI).balanceOf(address(factory)));
        
        IERC20(DAI).approve(address(factory), 1001e18);
        factory.issuanceIndexTokens(address(DAI), 1000e18, 3);
        console.log("index token balance", indexToken.balanceOf(address(add1)));
        console.log("portfolio value", factory.getPortfolioBalance());
        factory.redemption(indexToken.balanceOf(address(add1)), address(weth), 3);
        console.log("weth after redemption", add1.balance);
    }


    function testIssuanceWithTokensOutput() public {
        uint startAmount = 1e14;
        
        weth.deposit{value:10e18}();
        IERC20(WETH9).approve(address(swapRouter), 10e18);
        console.log(factory.getExactAmountOut(WETH9, DAI, 10e18, 3));
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: DAI,
            // pool fee 0.3%
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: 10e18,
            amountOutMinimum: 0,
            // NOTE: In production, this value can be used to set the limit
            // for the price the swap will push the pool to,
            // which can help protect against price impact
            sqrtPriceLimitX96: 0
        });
        uint finalAmountOut = swapRouter.exactInputSingle(params);
        console.log("dai balalnce", IERC20(DAI).balanceOf(address(this)));
        updateOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        // payable(add1).transfer(11e18);
        IERC20(DAI).transfer(add1, 1001e18);
        vm.startPrank(add1);
        console.log("FLOKI", IERC20(FLOKI).balanceOf(address(factory)));
        
        IERC20(DAI).approve(address(factory), 1001e18);
        console.log("issuance output amount", factory.getIssuanceAmountOut2(1000e18, DAI, 3));
        factory.issuanceIndexTokens(address(DAI), 1000e18, 3);
        console.log("index token balance", indexToken.balanceOf(address(add1)));
        console.log("portfolio value", factory.getPortfolioBalance());
        console.log("redemption output amount", factory.getRedemptionAmountOut2(indexToken.balanceOf(address(add1)), DAI, 3));
        console.log("weth after redemption", IERC20(DAI).balanceOf(add1));
        uint reallOut = factory.redemption(indexToken.balanceOf(address(add1)), address(DAI), 3);
        console.log("real out", reallOut);
        console.log("weth after redemption", IERC20(DAI).balanceOf(add1));
    }
    

    function testBlock() public {
        // updateOracleList();
        initializeAssetList();
        //user has 10 index tokens
        stdstore
            .target(address(indexToken))
            .sig("balanceOf(address)")
            .with_key(address(this))
            .checked_write(10e18);
        stdstore
            .target(address(indexToken))
            .sig("totalSupply()")
            // .with_key(address(this))
            .checked_write(10e18);
        // console.log("balanceOf user index token", indexToken.balanceOf(address(this)));
        // console.log("total supply index token", indexToken.totalSupply());
        // return;
        for(uint i; i < assetList.length; i++){
        stdstore
            .target(address(assetList[i]))
            .sig("balanceOf(address)")
            .with_key(address(factory))
            .checked_write(200e18);
        }
        for(uint i; i < assetList.length; i++){
        // console.log(IERC20(assetList[i]).balanceOf(address(factory)));
        }
        console.log(factory.getPortfolioBalance());
        console.log("redemption happening...");
        factory.redemption(indexToken.balanceOf(address(this)), address(weth), 3);
    }

    function testGetPrice() public {
        address pool = factoryV3.getPool(
            WETH9,
            WBTC,
            3000
        );
       (
            uint160 sqrtPriceX96,
            int24 tick,
            uint16 observationIndex,
            uint16 observationCardinality,
            uint16 observationCardinalityNext,
            uint8 feeProtocol,
            bool unlocked
        ) = IUniswapV3Pool(pool).slot0();
        console.log(sqrtPriceX96);
        console.log(factory.getAmountOut(WETH9, WBTC, 1e18, 3));

        //swap
        weth.deposit{value:1e18}();
        IERC20(WETH9).approve(address(swapRouter), 1e18);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: WBTC,
            // pool fee 0.3%
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: 1e18,
            amountOutMinimum: 0,
            // NOTE: In production, this value can be used to set the limit
            // for the price the swap will push the pool to,
            // which can help protect against price impact
            sqrtPriceLimitX96: 0
        });
        uint finalAmountOut = swapRouter.exactInputSingle(params);
        console.log(finalAmountOut);

    }


    function initializeAssetList() public {
        for(uint i = 0; i < assetList.length; i++) {
        stdstore
            .target(address(factory))
            .sig("oracleList(uint256)")
            .with_key(i)
            .checked_write(assetList[i]);
        stdstore
            .target(address(factory))
            .sig("currentList(uint256)")
            .with_key(i)
            .checked_write(assetList[i]);
        stdstore
            .target(address(factory))
            .sig("tokenMarketShare(address)")
            .with_key(assetList[i])
            .checked_write(tokenShares[i]);
        stdstore
            .target(address(factory))
            .sig("tokenSwapVersion(address)")
            .with_key(assetList[i])
            .checked_write(swapVersions[i]);
        
        }
        stdstore
            .target(address(factory))
            .sig("totalOracleList()")
            // .with_key(i)
            .checked_write(assetList.length);
        stdstore
            .target(address(factory))
            .sig("totalCurrentList()")
            // .with_key(i)
            .checked_write(assetList.length);
        
    }

    

    
}