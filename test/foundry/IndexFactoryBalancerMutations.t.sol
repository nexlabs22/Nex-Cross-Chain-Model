// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../../contracts/test/Token.sol";
import "./ContractDeployer.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/interfaces/IWETH.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/vault/Vault.sol";
import "../../contracts/factory/IndexFactoryBalancer.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/vault/CrossChainFactory.sol";
import "../../contracts/libraries/SwapHelpers.sol";

contract IndexFactoryBalancerMutations is Test, IndexFactoryBalancer {
    IndexFactory indexFactory;
    ContractDeployer deployer;
    // MockFactoryStorage indexFactoryStorage;
    IndexFactoryStorage indexFactoryStorage;
    // IWETH weth;
    LinkToken link;
    MockApiOracle oracle;
    Vault vault;
    IndexFactoryBalancer indexFactoryBalancer;
    ISwapRouter swapRouter;
    MockRouter2 router;
    CrossChainIndexFactory crossChainIndexFactory;

    address factoryAddress;
    address positionManager;
    address wethAddress;

    MockERC20 token;

    Token token0;
    Token token1;
    Token token2;
    Token token3;
    Token token4;
    Token usdt;

    address ownerAddr = address(1234);
    address user = address(2);

    function setUp() external {
        deployer = new ContractDeployer();

        vm.deal(address(deployer), 10 ether);

        deployer.deployAllContracts();

        indexFactory = deployer.factory();
        indexFactoryStorage = deployer.indexFactoryStorage();
        token0 = deployer.token0();
        token1 = deployer.token1();
        token2 = deployer.token2();
        token3 = deployer.token3();
        token4 = deployer.token4();
        // weth = deployer.weth();
        usdt = deployer.usdt();
        link = deployer.link();
        oracle = deployer.oracle();
        factoryAddress = deployer.factoryAddress();
        positionManager = deployer.positionManager();
        wethAddress = deployer.wethAddress();
        vault = deployer.vault();
        swapRouter = deployer.swapRouter();
        router = new MockRouter2();
        crossChainIndexFactory = deployer.crossChainIndexFactory();

        indexFactoryBalancer = new IndexFactoryBalancer();
        indexFactoryBalancer.initialize(
            1, payable(address(indexToken)), address(indexFactoryStorage), address(link), address(router), wethAddress
        );

        deployer.addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        deployer.addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        deployer.addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        deployer.addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        deployer.addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        deployer.addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);

        vm.startPrank(address(deployer));
        indexFactory.proposeOwner(ownerAddr);
        vm.stopPrank();

        vm.startPrank(ownerAddr);
        indexFactory.transferOwnership(ownerAddr);
        vm.stopPrank();

        deal(address(link), address(this), 10e18);
        deal(address(link), address(crossChainIndexFactory), 10e18);

        updateOracleList();
    }

    // (chainValue * 100e18) / portfolioValue < chainSelectorTotalShares	(chainValue * 100e18) / portfolioValue > chainSelectorTotalShares
    // (chainValue * 100e18) / portfolioValue	(chainValue * 100e18) * portfolioValue
    // chainValue * 100e18	chainValue / 100e18
    // chainSelector == currentChainSelector	chainSelector != currentChainSelector

    function testSecondReweightAction_ConditionMutation() public {
        uint256 chainSelector = 1;
        uint256 chainValue = 300e18;
        uint256 portfolioValue = 100e18;
        uint256 chainSelectorTotalShares = 20e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
            abi.encode(2)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
            abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(2)))
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode([10e18, 10e18, 10e18, 10e18])
        );

        indexFactoryBalancer.secondReweightAction();
    }

    function testSecondReweightAction_ScalingMutation() public {
        uint256 chainSelector = 1;
        uint256 chainValue = 111e18;
        uint256 portfolioValue = 50e18;
        uint256 chainSelectorTotalShares = 150e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
            abi.encode(2)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
            abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(4)))
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode([25e18, 25e18, 25e18, 25e18])
        );

        indexFactoryBalancer.secondReweightAction();
    }

    // function testSecondReweightAction_DivisionToMultiplicationMutation() public {
    //     uint256 chainSelector = 1;
    //     uint256 chainValue = 100e18;
    //     uint256 portfolioValue = 50e18;
    //     uint256 chainSelectorTotalShares = 150e18;

    //     // Set portfolio value
    //     indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

    //     // Mock chain selectors and values
    //     vm.mockCall(
    //         address(indexFactoryStorage),
    //         abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
    //         abi.encode(2)
    //     );

    //     vm.mockCall(
    //         address(indexFactoryStorage),
    //         abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
    //         abi.encode(1)
    //     );

    //     vm.mockCall(
    //         address(indexFactoryStorage),
    //         abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
    //         abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(4)))
    //     );

    //     vm.mockCall(
    //         address(indexFactoryStorage),
    //         abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
    //         abi.encode(chainSelectorTotalShares)
    //     );

    //     vm.mockCall(
    //         address(indexFactoryBalancer),
    //         abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
    //         abi.encode(chainValue)
    //     );

    //     vm.mockCall(
    //         address(indexFactoryStorage),
    //         abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
    //         abi.encode([25e18, 25e18, 25e18, 25e18])
    //     );

    //     indexFactoryBalancer.secondReweightAction();
    // }

    function testSecondReweightAction_ChainSelectorEquality() public {
        uint256 chainSelector = 2;
        uint256 currentChainSelector = 1;
        uint256 chainValue = 100e18;
        uint256 portfolioValue = 50e18;
        uint256 chainSelectorTotalShares = 150e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
            abi.encode(2)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
            abi.encode(1)
        );

        // vm.mockCall(
        //     address(indexFactoryStorage),
        //     abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
        //     abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), uint64(1))
        // );
        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
            abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(1)))
        );

        // vm.mockCall(
        //     address(indexFactoryStorage),
        //     abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
        //     abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), uint64(2))
        // );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
            abi.encode(currentChainSelector)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode([25e18, 25e18, 25e18, 25e18])
        );

        indexFactoryBalancer.secondReweightAction();
    }

    function testFirstReweightAction_ProportionExceedsTotalShares() public {
        uint256 chainValue = 100e18;
        uint256 portfolioValue = 50e18;
        uint256 chainSelectorTotalShares = 150e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 0, 1),
            abi.encode(chainSelectorTotalShares)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_CorrectProportionCalculation() public {
        uint256 chainValue = 100e18;
        uint256 portfolioValue = 50e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getAmountOut.selector),
            abi.encode(chainValue)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_ProportionScaling() public {
        uint256 chainValue = 1e18;
        uint256 portfolioValue = 10e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getAmountOut.selector),
            abi.encode(chainValue)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_ChainSelectorEquality() public {
        uint64 currentChainSelector = 1;
        uint64 mockChainSelector = 2;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, 100e18);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentData.selector, 0),
            abi.encode("", "", "", mockChainSelector)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(
                indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 0, mockChainSelector
            ),
            abi.encode(100e18)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function updateOracleList() public {
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint256[] memory tokenShares = new uint256[](5);
        tokenShares[0] = 20e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 20e18;

        uint256[] memory swapFees = new uint256[](5);
        swapFees[0] = 3000;
        swapFees[1] = 3000;
        swapFees[2] = 3000;
        swapFees[3] = 3000;
        swapFees[4] = 3000;

        uint64[] memory chains = new uint64[](5);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;
        chains[4] = 2;

        deal(address(link), address(this), 100e18);

        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }
}
