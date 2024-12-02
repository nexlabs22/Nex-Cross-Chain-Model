// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;
pragma solidity ^0.8.7;

import "forge-std/Test.sol";

import "../../contracts/token/IndexToken.sol";
import "../../contracts/test/MockV3Aggregator.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/test/MockRouter.sol";
import "../../contracts/test/UniswapFactoryByteCode.sol";
import "../../contracts/test/UniswapWETHByteCode.sol";
import "../../contracts/test/UniswapRouterByteCode.sol";
import "../../contracts/test/UniswapPositionManagerByteCode.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../../contracts/vault/CrossChainVault.sol";
import "../../contracts/vault/CrossChainFactory.sol";
// import "../../contracts/test/TestSwap.sol";
import "../../contracts/test/Token.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "../../contracts/interfaces/IUniswapV3Pool.sol";

import "../../contracts/uniswap/INonfungiblePositionManager.sol";
import "../../contracts/interfaces/IUniswapV3Factory2.sol";
import "../../contracts/interfaces/IWETH.sol";

import "../../contracts/Swap.sol";

contract ContractDeployer is Test, UniswapFactoryByteCode, UniswapWETHByteCode, UniswapRouterByteCode, UniswapPositionManagerByteCode {

    bytes32 jobId = "6b88e0402e5d415eb946e528b8e0c7ba";
    
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant QUOTER = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;
    
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    
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
    
    address feeReceiver = vm.addr(1);
    address newFeeReceiver = vm.addr(2);
    address minter = vm.addr(3);
    address newMinter = vm.addr(4);
    address methodologist = vm.addr(5);
    address owner = vm.addr(6);
    address add1 = vm.addr(7);


    Token token0;
    Token token1;
    Token token2;
    Token token3;
    Token token4;
    Token token5;
    Token token6;
    Token token7;
    Token token8;
    Token token9;

    Token usdt;

    // Token crossChainToken;

    address factoryAddress;
    address wethAddress;
    address router;
    address positionManager;
    IndexToken public indexToken;
    Swap public swap;
    MockApiOracle public oracle;
    LinkToken link;
    IndexFactory public factory;
    CrossChainIndexFactory public crossChainIndexFactory;
    CrossChainVault public crossChainVault;
    IndexFactoryStorage public indexFactoryStorage;
    Token public crossChainToken;
    // TestSwap public testSwap;
    MockV3Aggregator public ethPriceOracle;
    ERC20 public dai;
    IWETH public weth;
    IQuoter public quoter;

    IUniswapV3Factory public factoryV3 =
        IUniswapV3Factory(factoryAddress);
    ISwapRouter public swapRouter =
        ISwapRouter(router);
    MockRouter mockRouter;
    
    function getMinTick(int24 tickSpacing) public pure returns (int24) {
        return int24((int256(-887272) / int256(tickSpacing) + 1) * int256(tickSpacing));
    }

    function getMaxTick(int24 tickSpacing) public pure returns (int24) {
        return int24((int256(887272) / int256(tickSpacing)) * int256(tickSpacing));
    }


    function encodePriceSqrt(uint256 reserve1, uint256 reserve0) public pure returns (uint160) {
        uint256 sqrtPriceX96 = sqrt((reserve1 * 2**192) / reserve0);
        return uint160(sqrtPriceX96);
    }

    function sqrt(uint256 y) public pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
    function deployInternalContracts() public returns(
        LinkToken,
        MockApiOracle,
        MockV3Aggregator
    ){
        LinkToken link = new LinkToken();
        MockApiOracle oracle = new MockApiOracle(address(link));

        MockV3Aggregator ethPriceOracle = new MockV3Aggregator(
            18, //decimals
            2000e18   //initial data
        );

        return (
            link,
            oracle,
            ethPriceOracle
        );
    }
    function deployContracts() public returns(
        // LinkToken,
        // MockApiOracle,
        IndexToken,
        // MockV3Aggregator,
        // TestSwap,
        MockRouter,
        CrossChainVault,
        CrossChainIndexFactory,
        IndexFactoryStorage,
        IndexFactory
    ) {
    //     LinkToken link = new LinkToken();
    //     MockApiOracle oracle = new MockApiOracle(address(link));

    //    MockApiOracle oracle = new MockV3Aggregator(
    //         18, //decimals
    //         2000e18   //initial data
    //     );

        // (LinkToken link, MockApiOracle oracle, MockV3Aggregator ethPriceOracle) = deployInternalContracts();

        dai = ERC20(DAI);
        quoter = IQuoter(QUOTER);

        IndexToken indexToken = new IndexToken();
        indexToken.initialize(
            "Anti Inflation",
            "ANFI",
            1e18,
            feeReceiver,
            1000000e18,
            //swap addresses
            wethAddress,
            QUOTER,
            router,
            factoryAddress,
            router,
            factoryAddress
        );
        
        MockRouter mockRouter = new MockRouter(address(link));

        CrossChainVault crossChainVault = new CrossChainVault();
        crossChainVault.initialize(
            address(0),
            wethAddress,
            router, //qouter
            router,
            factoryAddress,
            router,
            factoryAddress
        );

        CrossChainIndexFactory crossChainIndexFactory = new CrossChainIndexFactory();
        crossChainIndexFactory.initialize(
            2,
            payable(address(crossChainVault)),
            address(link),
            address(mockRouter),
            wethAddress,
            router,
            factoryAddress,
            router,
            factoryAddress,
            address(ethPriceOracle)
        );


        IndexFactoryStorage indexFactoryStorage = new IndexFactoryStorage();
        indexFactoryStorage.initialize(
            1,
            payable(address(indexToken)),
            address(link),
            address(oracle),
            jobId,
            address(ethPriceOracle),
            wethAddress,
            router,
            factoryAddress,
            router,
            factoryAddress
        );

        IndexFactory indexFactory = new IndexFactory();
        indexFactory.initialize(
            1,
            payable(address(indexToken)),
            address(link),
            address(mockRouter), // ccip router
            wethAddress
        );
        

        indexToken.setMinter(address(indexFactory), true);
        indexFactoryStorage.setCrossChainToken(2, address(crossChainToken), 3);
        indexFactoryStorage.setCrossChainFactory(address(crossChainIndexFactory), 2);
        indexFactoryStorage.setIndexFactory(address(indexFactory));
        indexFactory.setIndexFactoryStorage(address(indexFactoryStorage));
        crossChainIndexFactory.setCrossChainToken(1, address(crossChainToken), 3);
        crossChainVault.setFactory(address(crossChainIndexFactory));
        
        mockRouter.setFactoryChainSelector(1, address(indexFactory));
        mockRouter.setFactoryChainSelector(2, address(crossChainIndexFactory));

        link.transfer(address(indexFactory), 10e18);
        link.transfer(address(crossChainIndexFactory), 10e18);

        // TestSwap testSwap = new TestSwap();
        
        
        return (
            // link,
            // oracle,
            indexToken,
            // ethPriceOracle,
            // testSwap,
            mockRouter,
            crossChainVault,
            crossChainIndexFactory,
            indexFactoryStorage,
            indexFactory
        );

    }

    function deployTokens() public returns(Token[12] memory) {
        Token[12] memory tokens;
        
        for (uint256 i = 0; i < 12; i++) {
            tokens[i] = new Token(1000000e18);
        }

        return tokens;
    }

    function deployUniswap() public returns(address, address, address, address){
        // bytes memory bytecode = factoryByteCode;
        address factoryAddress = deployByteCode(factoryByteCode);
        address wethAddress = deployByteCode(WETHByteCode);
        address routerAddress = deployByteCodeWithInputs(routerByteCode, abi.encode(factoryAddress, wethAddress));
        address positionManagerAddress = deployByteCodeWithInputs(positionManagerByteCode, abi.encode(factoryAddress, wethAddress, 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707));
        // bytes memory bytecodeWithArgs = abi.encodePacked(bytecode, abi.encode(_initData));
        return (factoryAddress, wethAddress, routerAddress, positionManagerAddress);
    }

    function deployAllContracts() public {
        Token[12] memory tokens = deployTokens();
        token0 = tokens[0];
        token1 = tokens[1];
        token2 = tokens[2];
        token3 = tokens[3];
        token4 = tokens[4];
        token5 = tokens[5];
        token6 = tokens[6];
        token7 = tokens[7];
        token8 = tokens[8];
        token9 = tokens[9];
        usdt = tokens[10];
        crossChainToken = tokens[11];
        
        (factoryAddress, wethAddress, router, positionManager) = deployUniswap();
        factoryV3 = IUniswapV3Factory(factoryAddress);
        swapRouter = ISwapRouter(router);
        weth = IWETH(wethAddress);
        // (link, oracle, indexToken, ethPriceOracle, factory, testSwap, crossChainIndexFactory, crossChainVault, indexFactoryStorage, crossChainToken) = deployContracts();
        (link, oracle, ethPriceOracle) = deployInternalContracts();
        (
            // link,
            // oracle,
            indexToken,
            // ethPriceOracle,
            // testSwap,
            mockRouter,
            crossChainVault,
            crossChainIndexFactory,
            indexFactoryStorage,
            factory
        ) = deployContracts();
    }

    function deployByteCode(bytes memory bytecode) public returns(address){
        bytes memory bytecodeWithArgs = bytecode;
        address deployedContract;
        assembly {
            deployedContract := create(0, add(bytecodeWithArgs, 0x20), mload(bytecodeWithArgs))
        }
        
        return deployedContract;
    }

    function deployByteCodeWithInputs(bytes memory bytecode, bytes memory _initData) public returns(address){
        bytes memory bytecodeWithArgs = abi.encodePacked(bytecode, _initData);
        address deployedContract;
        assembly {
            deployedContract := create(0, add(bytecodeWithArgs, 0x20), mload(bytecodeWithArgs))
        }
        
        return deployedContract;
    }

    function addLiquidity(
        address positionManager,
        address factory,
        Token token0,
        Token token1,
        uint amount0,
        uint amount1
    ) public {
       Token[] memory tokens = new Token[](2);
       tokens[0] = address(token0) < address(token1) ? token0: token1;
       tokens[1] = address(token0) > address(token1) ? token0: token1;
       uint[] memory amounts = new uint[](2);
       amounts[0] = address(tokens[0]) == address(token0) ? amount0 : amount1;
       amounts[1] = address(tokens[1]) == address(token1) ? amount1 : amount0;
       INonfungiblePositionManager(positionManager).createAndInitializePoolIfNecessary(
          address(tokens[0]),
          address(tokens[1]),
          3000,
          encodePriceSqrt(1, 1)
        );
        address poolAddress = IUniswapV3Factory2(factory).getPool(address(tokens[0]), address(tokens[1]), 3000);
        tokens[0].approve(positionManager, amounts[0]);
        tokens[1].approve(positionManager, amounts[1]);
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams(
            address(tokens[0]),
            address(tokens[1]),
            3000,
            getMinTick(3000),
            getMaxTick(3000),
            amounts[0],
            amounts[1],
            0,
            0,
            address(this),
            block.timestamp
        );
        INonfungiblePositionManager(positionManager).mint(params); 
    }


    function addLiquidityETH(
        address positionManager,
        address factory,
        Token token0,
        address weth,
        uint amount0,
        uint amount1
    ) public {
       Token[] memory tokens = new Token[](2);
       tokens[0] = address(token0) < address(weth) ? token0: Token(weth);
       tokens[1] = address(token0) > address(weth) ? token0: Token(weth);
       uint[] memory amounts = new uint[](2);
       amounts[0] = address(token0) < address(weth) ? amount0 : amount1;
       amounts[1] = address(token0) > address(weth) ? amount0 : amount1;
       INonfungiblePositionManager(positionManager).createAndInitializePoolIfNecessary(
          address(tokens[0]),
          address(tokens[1]),
          3000,
          encodePriceSqrt(amounts[1]/1e10, amounts[0]/1e10)
        );
        address poolAddress = IUniswapV3Factory2(factory).getPool(address(tokens[0]), address(tokens[1]), 3000);
        IWETH(weth).deposit{value: amount1}();
        tokens[0].approve(positionManager, amounts[0]);
        tokens[1].approve(positionManager, amounts[1]);
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams(
            address(tokens[0]),
            address(tokens[1]),
            3000,
            getMinTick(3000),
            getMaxTick(3000),
            amounts[0],
            amounts[1],
            0,
            0,
            address(this),
            block.timestamp
        );
        INonfungiblePositionManager(positionManager).mint(params); 
    }
}