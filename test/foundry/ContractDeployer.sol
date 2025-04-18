// SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;
pragma solidity ^0.8.7;

import "forge-std/Test.sol";

import "../../contracts/token/IndexToken.sol";
import "../../contracts/test/MockV3Aggregator.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/test/MockRouter.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/test/MockRouter3.sol";
import "../../contracts/test/UniswapFactoryByteCode.sol";
import "../../contracts/test/PriceOracleByteCode.sol";
import "../../contracts/test/UniswapWETHByteCode.sol";
import "../../contracts/test/UniswapRouterByteCode.sol";
import "../../contracts/test/UniswapPositionManagerByteCode.sol";
import "../../contracts/factory/CoreSender.sol";
import "../../contracts/factory/BalancerSender.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/factory/IndexFactoryBalancer.sol";
import "../../contracts/factory/FunctionsOracle.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../../contracts/vault/Vault.sol";
import "../../contracts/vault/CrossChainIndexFactory.sol";
import "../../contracts/vault/CrossChainIndexFactoryStorage.sol";
import "../../contracts/test/Token.sol";
import "../../contracts/ccip/CrossChainFeeSender.sol";
import "../../contracts/ccip/CrossChainFeeReceiver.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";

import "../../contracts/uniswap/INonfungiblePositionManager.sol";
import "../../contracts/interfaces/IUniswapV3Factory2.sol";
import "../../contracts/interfaces/IWETH.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ContractDeployer is
    Test,
    UniswapFactoryByteCode,
    UniswapWETHByteCode,
    UniswapRouterByteCode,
    UniswapPositionManagerByteCode,
    PriceOracleByteCode
{
    bytes32 jobId = "6b88e0402e5d415eb946e528b8e0c7ba";

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

    address priceOracleAddress;
    address factoryAddress;
    address wethAddress;
    address router;
    address positionManager;
    IndexToken public indexToken;
    MockApiOracle public oracle;
    LinkToken link;
    CoreSender public coreSender;
    BalancerSender public balancerSender;
    IndexFactory public factory;
    IndexFactoryBalancer public factoryBalancer;
    CrossChainFeeSender public crossChainFeeSender;
    CrossChainFeeReceiver public crossChainFeeReceiver;

    CrossChainIndexFactoryStorage public crossChainIndexFactoryStorage;
    CrossChainIndexFactoryStorage public crossChainIndexFactoryStorage1;
    CrossChainIndexFactoryStorage public crossChainIndexFactoryStorage2;
    CrossChainIndexFactoryStorage public crossChainIndexFactoryStorage3;
    CrossChainIndexFactoryStorage public crossChainIndexFactoryStorage4;

    CrossChainIndexFactory public crossChainIndexFactory;
    CrossChainIndexFactory public crossChainIndexFactory1;
    CrossChainIndexFactory public crossChainIndexFactory2;
    CrossChainIndexFactory public crossChainIndexFactory3;
    CrossChainIndexFactory public crossChainIndexFactory4;

    Vault public vault;
    Vault public crossChainVault;
    Vault public crossChainVault1;
    Vault public crossChainVault2;
    Vault public crossChainVault3;
    Vault public crossChainVault4;
    FunctionsOracle public functionsOracle;
    IndexFactoryStorage public indexFactoryStorage;
    Token public crossChainToken;
    // TestSwap public testSwap;
    MockV3Aggregator public ethPriceOracle;
    ERC20 public dai;
    IWETH public weth;
    IQuoter public quoter;

    IUniswapV3Factory public factoryV3 = IUniswapV3Factory(factoryAddress);
    ISwapRouter public swapRouter = ISwapRouter(router);
    // MockRouter mockRouter;
    MockRouter3 mockRouter;
    MockRouter3 mockRouter1;
    MockRouter3 mockRouter2;
    MockRouter3 mockRouter3;
    MockRouter3 mockRouter4;

    function getMinTick(int24 tickSpacing) public pure returns (int24) {
        return
            int24(
                (int256(-887272) / int256(tickSpacing) + 1) *
                    int256(tickSpacing)
            );
    }

    function getMaxTick(int24 tickSpacing) public pure returns (int24) {
        return
            int24((int256(887272) / int256(tickSpacing)) * int256(tickSpacing));
    }

    function encodePriceSqrt(
        uint256 reserve1,
        uint256 reserve0
    ) public pure returns (uint160) {
        uint256 sqrtPriceX96 = sqrt((reserve1 * 2 ** 192) / reserve0);
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

    function deployInternalContracts()
        public
        returns (LinkToken, MockApiOracle, MockV3Aggregator, MockRouter3)
    {
        LinkToken link = new LinkToken();
        MockApiOracle oracle = new MockApiOracle();

        MockV3Aggregator ethPriceOracle = new MockV3Aggregator(
            18, //decimals
            2000e18 //initial data
        );

        MockRouter3 mockRouter = new MockRouter3();

        return (link, oracle, ethPriceOracle, mockRouter);
    }

    

    function deployContracts()
        public
        returns (
            IndexToken,
            Vault,
            Vault,
            FunctionsOracle,
            IndexFactoryStorage,
            CrossChainIndexFactory,
            CrossChainIndexFactoryStorage
        )
    {
        
        Vault crossChainVaultImpl = new Vault();
        crossChainVault = Vault(
            payable(
                address(
                    new ERC1967Proxy(
                        address(crossChainVaultImpl),
                        abi.encodeCall(Vault.initialize, ())
                    )
                )
            )
        );

        

        CrossChainIndexFactoryStorage crossChainIndexFactoryStorageImpl = new CrossChainIndexFactoryStorage();
        crossChainIndexFactoryStorage = CrossChainIndexFactoryStorage(
            payable(
                address(
                    new ERC1967Proxy(
                        address(crossChainIndexFactoryStorageImpl),
                        abi.encodeCall(CrossChainIndexFactoryStorage.initialize, (
                            2,
                            payable(address(crossChainVault)),
                            address(link),
                            address(mockRouter),
                            wethAddress,
                            router,
                            factoryAddress,
                            router,
                            address(ethPriceOracle)
                        ))
                    )
                )
            )
        );

        

        CrossChainIndexFactory crossChainIndexFactoryImpl = new CrossChainIndexFactory();
        crossChainIndexFactory = CrossChainIndexFactory(
            payable(
                address(
                    new ERC1967Proxy(
                        address(crossChainIndexFactoryImpl),
                        abi.encodeCall(CrossChainIndexFactory.initialize, (
                            address(crossChainIndexFactoryStorage),
                            address(mockRouter),
                            address(link)
                        ))
                    )
                )
            )
        );

        

        IndexToken indexTokenImpl = new IndexToken();
        indexToken = IndexToken(
            payable(
                address(
                    new ERC1967Proxy(
                        address(indexTokenImpl),
                        abi.encodeCall(IndexToken.initialize, (
                            "Anti Inflation",
                            "ANFI",
                            1e18,
                            feeReceiver,
                            1000000e18
                        ))
                    )
                )
            )
        );

        

        Vault vaultImpl = new Vault();
        vault = Vault(
            payable(
                address(
                    new ERC1967Proxy(
                        address(vaultImpl),
                        abi.encodeCall(Vault.initialize, ())
                    )
                )
            )
        );

        
        FunctionsOracle functionsOracleImpl = new FunctionsOracle();
        functionsOracle = FunctionsOracle(
            payable(
                address(
                    new ERC1967Proxy(
                        address(functionsOracleImpl),
                        abi.encodeCall(FunctionsOracle.initialize, (
                            address(link),
                            address(oracle),
                            jobId
                        ))
                    )
                )
            )
        );

        

        IndexFactoryStorage indexFactoryStorageImpl = new IndexFactoryStorage();
        indexFactoryStorage = IndexFactoryStorage(
            payable(
                address(
                    new ERC1967Proxy(
                        address(indexFactoryStorageImpl),
                        abi.encodeCall(IndexFactoryStorage.initialize, (
                            1,
                            payable(address(indexToken)),
                            address(functionsOracle),
                            address(ethPriceOracle),
                            address(link),
                            wethAddress,
                            router,
                            factoryAddress,
                            router,
                            factoryAddress
                        ))
                    )
                )
            )
        );

        return (
            indexToken,
            vault,
            crossChainVault,
            functionsOracle,
            indexFactoryStorage,
            crossChainIndexFactory,
            crossChainIndexFactoryStorage
        );
    }

    function deployContracts2()
        public
        returns (CoreSender, IndexFactory, BalancerSender, IndexFactoryBalancer)
    {
        

        CoreSender coreSenderImpl = new CoreSender();
        coreSender = CoreSender(
            payable(
                address(
                    new ERC1967Proxy(
                        address(coreSenderImpl),
                        abi.encodeCall(CoreSender.initialize, (
                            payable(address(indexToken)),
                            address(indexFactoryStorage),
                            address(functionsOracle),
                            address(link),
                            address(mockRouter), // ccip router
                            wethAddress
                        ))
                    )
                )
            )
        );

        
        IndexFactory indexFactoryImpl = new IndexFactory();
        IndexFactory indexFactory = IndexFactory(
            payable(
                address(
                    new ERC1967Proxy(
                        address(indexFactoryImpl),
                        abi.encodeCall(IndexFactory.initialize, (
                            1,
                            payable(address(indexToken)),
                            address(indexFactoryStorage),
                            address(functionsOracle),
                            payable(address(coreSender)),
                            wethAddress
                        ))
                    )
                )
            )
        );

        

        BalancerSender balancerSenderImpl = new BalancerSender();
        balancerSender = BalancerSender(
            payable(
                address(
                    new ERC1967Proxy(
                        address(balancerSenderImpl),
                        abi.encodeCall(BalancerSender.initialize, (
                            1,
                            address(indexFactoryStorage),
                            address(functionsOracle),
                            address(link),
                            address(mockRouter), // ccip router
                            wethAddress
                        ))
                    )
                )
            )
        );

        

        IndexFactoryBalancer indexFactoryBalancerImpl = new IndexFactoryBalancer();
        IndexFactoryBalancer indexFactoryBalancer = IndexFactoryBalancer(
            payable(
                address(
                    new ERC1967Proxy(
                        address(indexFactoryBalancerImpl),
                        abi.encodeCall(IndexFactoryBalancer.initialize, (
                            1,
                            address(indexFactoryStorage),
                            address(functionsOracle),
                            payable(address(balancerSender)),
                            wethAddress
                        ))
                    )
                )
            )
        );

        return (coreSender, indexFactory, balancerSender, indexFactoryBalancer);
    }

    function deployContracts3() public returns (CrossChainFeeSender, CrossChainFeeReceiver) {
        CrossChainFeeSender crossChainFeeSenderImpl = new CrossChainFeeSender();
        crossChainFeeSender = CrossChainFeeSender(
            payable(
                address(
                    new ERC1967Proxy(
                        address(crossChainFeeSenderImpl),
                        abi.encodeCall(CrossChainFeeSender.initialize, (
                            address(indexFactoryStorage),
                            address(link),
                            address(mockRouter), // ccip router
                            wethAddress
                        ))
                    )
                )
            )
        );

        CrossChainFeeReceiver crossChainFeeReceiverImpl = new CrossChainFeeReceiver();
        crossChainFeeReceiver = CrossChainFeeReceiver(
            payable(
                address(
                    new ERC1967Proxy(
                        address(crossChainFeeReceiverImpl),
                        abi.encodeCall(CrossChainFeeReceiver.initialize, (
                            address(crossChainIndexFactoryStorage),
                            address(mockRouter), // ccip router
                            address(link)
                        ))
                    )
                )
            )
        );

        return (crossChainFeeSender, crossChainFeeReceiver);
    }

    function linkAllContracts() public {
        indexToken.setMinter(address(factory), true);
        indexToken.setMinter(address(coreSender), true);

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(crossChainToken);

        functionsOracle.setIndexFactoryBalancer(address(factoryBalancer));
        functionsOracle.setBalancerSender(address(balancerSender));

        indexFactoryStorage.setCrossChainToken(
            2,
            address(crossChainToken),
            path,
            feesData
        );
        // indexFactoryStorage.setCrossChainToken(1, address(crossChainToken), path, feesData);
        indexFactoryStorage.setCrossChainFactory(
            address(crossChainIndexFactory),
            2
        );
        indexFactoryStorage.setIndexFactory(address(factory));
        indexFactoryStorage.setCoreSender(address(coreSender));
        indexFactoryStorage.setPriceOracle(address(priceOracleAddress));
        indexFactoryStorage.setVault(address(vault));
        indexFactoryStorage.setBalancerSender(address(balancerSender));
        indexFactoryStorage.setIndexFactoryBalancer(address(factoryBalancer));

        vault.setOperator(address(factory), true);
        vault.setOperator(address(factoryBalancer), true);

        // factory.setIndexFactoryStorage(address(indexFactoryStorage));

        crossChainIndexFactoryStorage.setCrossChainToken(
            1,
            address(crossChainToken),
            path,
            feesData
        );
        crossChainIndexFactoryStorage.setPriceOracle(priceOracleAddress);
        crossChainIndexFactoryStorage.setCrossChainFactory(
            address(crossChainIndexFactory)
        );
        crossChainIndexFactoryStorage.setVerifiedFactory(
            address(coreSender),
            1,
            true
        );
        crossChainIndexFactoryStorage.setVerifiedFactory(
            address(balancerSender),
            1,
            true
        );

        crossChainVault.setOperator(address(crossChainIndexFactory), true);

        mockRouter.setFactoryChainSelector(1, address(coreSender));
        mockRouter.setFactoryChainSelector(1, address(factory));
        mockRouter.setFactoryChainSelector(1, address(factoryBalancer));
        mockRouter.setFactoryChainSelector(1, address(balancerSender));
        mockRouter.setFactoryChainSelector(2, address(crossChainIndexFactory));
        mockRouter.setFactoryChainSelector(1, address(crossChainFeeSender));
        mockRouter.setFactoryChainSelector(2, address(crossChainFeeReceiver));

        link.transfer(address(coreSender), 10e18);
        // link.transfer(address(factory), 10e18);
        link.transfer(address(crossChainIndexFactory), 10e18);

        // for cross chain index factory
        
    }

    function deployTokens(
        uint256 initialSupply
    ) public returns (Token[12] memory) {
        Token[12] memory tokens;

        for (uint256 i = 0; i < 12; i++) {
            tokens[i] = new Token(initialSupply);
        }

        return tokens;
    }

    function deployUniswap()
        public
        returns (address, address, address, address, address)
    {
        // bytes memory bytecode = factoryByteCode;
        address priceOracleAddress = deployByteCode(priceOracleByteCode);
        address factoryAddress = deployByteCode(factoryByteCode);
        address wethAddress = deployByteCode(WETHByteCode);
        address routerAddress = deployByteCodeWithInputs(
            routerByteCode,
            abi.encode(factoryAddress, wethAddress)
        );
        address positionManagerAddress = deployByteCodeWithInputs(
            positionManagerByteCode,
            abi.encode(
                factoryAddress,
                wethAddress,
                0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
            )
        );
        // bytes memory bytecodeWithArgs = abi.encodePacked(bytecode, abi.encode(_initData));
        return (
            priceOracleAddress,
            factoryAddress,
            wethAddress,
            routerAddress,
            positionManagerAddress
        );
    }

    function deployAllContracts(uint256 initialSupply) public {
        Token[12] memory tokens = deployTokens(initialSupply);
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

        (
            priceOracleAddress,
            factoryAddress,
            wethAddress,
            router,
            positionManager
        ) = deployUniswap();
        factoryV3 = IUniswapV3Factory(factoryAddress);
        swapRouter = ISwapRouter(router);
        weth = IWETH(wethAddress);
        // (link, oracle, indexToken, ethPriceOracle, factory, testSwap, crossChainIndexFactory, crossChainVault, indexFactoryStorage, crossChainToken) = deployContracts();
        (link, oracle, ethPriceOracle, mockRouter) = deployInternalContracts();

        (
            indexToken,
            vault,
            crossChainVault,
            functionsOracle,
            indexFactoryStorage,
            crossChainIndexFactory,
            crossChainIndexFactoryStorage
        ) = deployContracts();
        (
            coreSender,
            factory,
            balancerSender,
            factoryBalancer
        ) = deployContracts2();
        (
            crossChainFeeSender,
            crossChainFeeReceiver
        ) = deployContracts3();

        linkAllContracts();
    }

    function deployByteCode(bytes memory bytecode) public returns (address) {
        bytes memory bytecodeWithArgs = bytecode;
        address deployedContract;
        assembly {
            deployedContract := create(
                0,
                add(bytecodeWithArgs, 0x20),
                mload(bytecodeWithArgs)
            )
        }

        return deployedContract;
    }

    function deployByteCodeWithInputs(
        bytes memory bytecode,
        bytes memory _initData
    ) public returns (address) {
        bytes memory bytecodeWithArgs = abi.encodePacked(bytecode, _initData);
        address deployedContract;
        assembly {
            deployedContract := create(
                0,
                add(bytecodeWithArgs, 0x20),
                mload(bytecodeWithArgs)
            )
        }

        return deployedContract;
    }

    function addLiquidity(
        address positionManager,
        address factory,
        Token token0,
        Token token1,
        uint256 amount0,
        uint256 amount1
    ) public {
        Token[] memory tokens = new Token[](2);
        tokens[0] = address(token0) < address(token1) ? token0 : token1;
        tokens[1] = address(token0) > address(token1) ? token0 : token1;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = address(tokens[0]) == address(token0) ? amount0 : amount1;
        amounts[1] = address(tokens[1]) == address(token1) ? amount1 : amount0;
        INonfungiblePositionManager(positionManager)
            .createAndInitializePoolIfNecessary(
                address(tokens[0]),
                address(tokens[1]),
                3000,
                encodePriceSqrt(1, 1)
            );
        address poolAddress = IUniswapV3Factory2(factory).getPool(
            address(tokens[0]),
            address(tokens[1]),
            3000
        );
        tokens[0].approve(positionManager, amounts[0]);
        tokens[1].approve(positionManager, amounts[1]);
        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams(
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
        uint256 amount0,
        uint256 amount1
    ) public {
        Token[] memory tokens = new Token[](2);
        tokens[0] = address(token0) < address(weth) ? token0 : Token(weth);
        tokens[1] = address(token0) > address(weth) ? token0 : Token(weth);
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = address(token0) < address(weth) ? amount0 : amount1;
        amounts[1] = address(token0) > address(weth) ? amount0 : amount1;
        INonfungiblePositionManager(positionManager)
            .createAndInitializePoolIfNecessary(
                address(tokens[0]),
                address(tokens[1]),
                3000,
                encodePriceSqrt(amounts[1] / 1e10, amounts[0] / 1e10)
            );
        address poolAddress = IUniswapV3Factory2(factory).getPool(
            address(tokens[0]),
            address(tokens[1]),
            3000
        );
        IWETH(weth).deposit{value: amount1}();
        tokens[0].approve(positionManager, amounts[0]);
        tokens[1].approve(positionManager, amounts[1]);
        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams(
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
