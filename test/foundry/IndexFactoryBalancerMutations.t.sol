// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/StdError.sol";
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

    function testFirstReweightAction_KillsMutation() public {
        uint256 portfolioValue = 100e18;
        uint64 chainSelector = 1;
        uint256 chainValue = 20e18;
        uint256 chainSelectorTotalShares = 15e18;
        uint256[] memory oracleTokenShares = new uint256[](1);
        oracleTokenShares[0] = 5e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.currentChainSelectorsCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.currentFilledCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode(oracleTokenShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        indexFactoryBalancer.firstReweightAction();

        uint256 extraWeth = indexFactoryBalancer.extraWethByNonce(updatePortfolioNonce);
        uint256 reweightExtra = indexFactoryBalancer.reweightExtraPercentage(updatePortfolioNonce);
        assertEq(extraWeth, 0, "Failed: extraWethByNonce should be greater than zero.");
        assertEq(reweightExtra, 0, "Failed: reweightExtraPercentage should be greater than zero.");
    }

    function testSecondReweightAction_KillsMutation() public {
        uint256 portfolioValue = 100e18;
        uint64 chainSelector = 1;
        uint256 chainValue = 10e18;
        uint256 chainSelectorTotalShares = 15e18;
        uint256[] memory oracleTokenShares = new uint256[](1);
        oracleTokenShares[0] = 5e18;

        deal(address(token0), address(indexFactoryBalancer), 2_000_000e18);

        vm.mockCall(
            address(token0),
            abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
            abi.encode(2_000_000e18)
        );

        vm.mockCall(
            address(token0),
            abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexToken)),
            abi.encode(100_000e18)
        );

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode(oracleTokenShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        vm.expectRevert(stdError.divisionError);
        indexFactoryBalancer.secondReweightAction();

        uint256 extraWeth = indexFactoryBalancer.extraWethByNonce(updatePortfolioNonce);
        uint256 reweightExtra = indexFactoryBalancer.reweightExtraPercentage(updatePortfolioNonce);
        assertEq(extraWeth, 0, "Failed: extraWethByNonce should be greater than zero.");
        assertEq(reweightExtra, 0, "Failed: reweightExtraPercentage should be greater than zero.");
    }

    function testSendToken_MaxTokensExceeded() public {
        uint64 destinationChainSelector = 1;
        address receiver = address(0x123);
        bytes memory _data = "mockData";
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](6);

        for (uint256 i = 0; i < 6; i++) {
            tokensToSendDetails[i] = Client.EVMTokenAmount({token: address(token0), amount: 100e18});
        }

        vm.expectRevert("Maximum 5 different tokens can be sent per CCIP Message");
        sendToken(destinationChainSelector, _data, receiver, tokensToSendDetails, PayFeesIn.LINK);
    }

    // ------------------------------------------------------------------------------------------------------------

    function testSecondReweightAction_Mutations1() public {
        uint64 chainSelector = 1;
        uint64 actualCurrentChainSelector = 1;
        uint256 nonce = updatePortfolioNonce;
        uint256 portfolioValue = 100e18;
        uint256 chainValue = 30e18;
        uint256 chainSelectorTotalShares = 40e18;

        deal(address(token0), address(indexFactoryBalancer), 2_000_000e18);

        vm.mockCall(
            address(token0),
            abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
            abi.encode(2_000_000e18)
        );

        vm.mockCall(
            address(token0),
            abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexToken)),
            abi.encode(100_000e18)
        );

        indexFactoryBalancer.setPortfolioTotalValueByNonce(nonce, portfolioValue);

        chainValueByNonce[nonce][chainSelector] = chainValue;

        vm.store(
            address(indexFactoryBalancer),
            keccak256(abi.encodePacked(uint256(7))),
            bytes32(uint256(actualCurrentChainSelector))
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorsCount.selector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleFilledCount.selector),
            abi.encode(1)
        );

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = chainSelector;

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector, 1),
            abi.encode(0, 0, 0, chainSelectors)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.currentChainSelectorTokensCount.selector, chainSelector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.oracleChainSelectorTokensCount.selector, chainSelector),
            abi.encode(1)
        );

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        uint256[] memory oracleTokenShares = new uint256[](1);
        oracleTokenShares[0] = 100e18;

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode(oracleTokenShares)
        );

        uint256 extraWethBefore = indexFactoryBalancer.extraWethByNonce(nonce);
        uint256 reweightExtraPercentageBefore = indexFactoryBalancer.reweightExtraPercentage(nonce);

        vm.expectRevert();
        indexFactoryBalancer.secondReweightAction();

        uint256 reweightExtraPercentageAfter = indexFactoryBalancer.reweightExtraPercentage(nonce);
    }

    function testFirstReweightAction_Mutations() public {
        {
            uint64 chainSelector = 1;
            uint256 chainValue = 10e18; // 10
            uint256 portfolioValue = 2e18;
            uint256 chainSelectorTotalShares = 300e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );

            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(chainSelector)
            );

            indexFactoryBalancer.firstReweightAction();
        }

        {
            uint64 chainSelector = 2;
            uint256 chainValue = 50e18; // 50
            uint256 portfolioValue = 100e18; // 100

            uint256 chainSelectorTotalShares = 30e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );
            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(uint64(1)) // different from 2
            );

            indexFactoryBalancer.firstReweightAction();
        }

        {
            uint64 chainSelector = 1;
            uint64 actualCurrentChainSelector = 1;
            uint256 chainValue = 20e18;
            uint256 portfolioValue = 10e18;

            uint256 chainSelectorTotalShares = 100e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(actualCurrentChainSelector)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );

            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            indexFactoryBalancer.firstReweightAction();
        }
    }

    function testSecondReweightAction_Mutations() public {
        deal(address(token0), address(indexFactoryBalancer), 500e18);
        deal(address(token0), address(indexToken), 1_000e18);

        vm.mockCall(
            address(token0),
            abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexToken)),
            abi.encode(1_000e18)
        );

        {
            uint64 chainSelector = 1;
            uint256 chainValue = 50e18;
            uint256 portfolioValue = 100e18;
            uint256 chainSelectorTotalShares = 80e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );
            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(chainSelector)
            );

            vm.mockCall(
                address(token0),
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
                abi.encode(500e18)
            );

            deal(address(token0), address(indexFactoryBalancer), 2_000_000e18); // 2e21
            vm.mockCall(
                address(token0),
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
                abi.encode(2_000_000e18)
            );

            vm.expectRevert();
            indexFactoryBalancer.secondReweightAction();
        }

        {
            uint64 chainSelector = 2;
            uint256 chainValue = 20e18;
            uint256 portfolioValue = 2e18;

            uint256 chainSelectorTotalShares = 1100e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );
            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(uint64(1))
            );

            deal(address(token0), address(indexFactoryBalancer), 2_000_000e18);
            vm.mockCall(
                address(token0),
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
                abi.encode(2_000_000e18)
            );

            vm.expectRevert();
            indexFactoryBalancer.secondReweightAction();
        }

        {
            uint64 chainSelector = 3;
            uint256 chainValue = 10e18; // 10
            uint256 portfolioValue = 1000e18;
            uint256 chainSelectorTotalShares = 2e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );
            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(chainSelector)
            );

            deal(address(token0), address(indexFactoryBalancer), 2_000_000e18);
            vm.mockCall(
                address(token0),
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
                abi.encode(2_000_000e18)
            );

            vm.expectRevert();

            indexFactoryBalancer.secondReweightAction();
        }

        {
            uint64 chainSelector = 4;
            uint64 actualCurrentChainSelector = 4;
            uint256 chainValue = 100e18;
            uint256 portfolioValue = 1000e18;
            uint256 chainSelectorTotalShares = 20e18;

            indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
                abi.encode(actualCurrentChainSelector)
            );

            vm.mockCall(
                address(indexFactoryBalancer),
                abi.encodeWithSelector(
                    indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector
                ),
                abi.encode(chainValue)
            );

            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(
                    indexFactoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector
                ),
                abi.encode(chainSelectorTotalShares)
            );

            vm.store(
                address(indexFactoryBalancer),
                keccak256(abi.encode(4, keccak256(abi.encode(uint256(1), 73)))),
                bytes32(uint256(100))
            );

            deal(address(token0), address(indexFactoryBalancer), 2_000_000e18);
            vm.mockCall(
                address(token0),
                abi.encodeWithSelector(IERC20.balanceOf.selector, address(indexFactoryBalancer)),
                abi.encode(2_000_000e18)
            );

            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(indexFactoryStorage.getOracleData.selector),
                abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(2)))
            );

            // vm.expectRevert();

            indexFactoryBalancer.secondReweightAction();
        }
    }

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

    function testSecondReweightAction_DivisionToMultiplicationMutation() public {
        uint256 chainSelector = 1;
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
            abi.encode(new uint64[](0), new uint64[](0), new uint64[](0), new uint64[](uint64(4)))
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

    function testFirstReweightAction_ConditionMutation() public {
        uint256 chainSelector = 1;
        uint256 chainValue = 50e18;
        uint256 portfolioValue = 100e18;
        uint256 chainSelectorTotalShares = 40e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_EqualityMutation() public {
        uint256 chainSelector = 1;
        uint256 currentChainSelector = 2;
        uint256 chainValue = 50e18;
        uint256 portfolioValue = 100e18;
        uint256 chainSelectorTotalShares = 40e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(updatePortfolioNonce, portfolioValue);

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.currentChainSelector.selector),
            abi.encode(currentChainSelector)
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.getCurrentChainSelectorTotalShares.selector, 1, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, updatePortfolioNonce, chainSelector),
            abi.encode(chainValue)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_PortfolioValueMultiplicationMutation() public {
        uint256 nonce = updatePortfolioNonce;
        uint64 chainSelector = 1;
        uint256 portfolioValue = 1e18;
        uint256 chainValue = 50e18;
        uint256 chainSelectorTotalShares = 40e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(nonce, portfolioValue);

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.getCurrentChainSelectorTotalShares.selector, nonce, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode([10e18, 10e18, 10e18, 10e18])
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testFirstReweightAction_ChainValueDivisionMutation() public {
        uint256 nonce = updatePortfolioNonce;
        uint64 chainSelector = 1;
        uint256 portfolioValue = 100e18;
        uint256 chainValue = 50e18;
        uint256 chainSelectorTotalShares = 40e18;

        indexFactoryBalancer.setPortfolioTotalValueByNonce(nonce, portfolioValue);

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.getCurrentChainSelectorTotalShares.selector, nonce, chainSelector),
            abi.encode(chainSelectorTotalShares)
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allOracleChainSelectorTokenShares.selector, chainSelector),
            abi.encode([10e18, 10e18, 10e18, 10e18])
        );

        vm.mockCall(
            address(indexFactoryBalancer),
            abi.encodeWithSelector(indexFactoryBalancer.chainValueByNonce.selector, nonce, chainSelector),
            abi.encode(chainValue)
        );

        indexFactoryBalancer.firstReweightAction();
    }

    function testSendMessage_AddressSwapMutation() public {
        uint64 destinationChainSelector = 2;
        address receiver = address(0x1234);
        bytes memory data = "test data";

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 900_000})),
            feeToken: i_link
        });

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(IRouterClient.getFee.selector, destinationChainSelector, message),
            abi.encode(1 ether)
        );

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(IRouterClient.ccipSend.selector, destinationChainSelector, message),
            abi.encode(bytes32("mock-message-id"))
        );

        indexFactoryBalancer.sendMessage(destinationChainSelector, receiver, data, IndexFactoryBalancer.PayFeesIn.LINK);

        message.feeToken = address(0);

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(IRouterClient.getFee.selector, destinationChainSelector, message),
            abi.encode(1 ether)
        );

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(IRouterClient.ccipSend.selector, destinationChainSelector, message),
            abi.encode(bytes32("mock-message-id"))
        );

        indexFactoryBalancer.sendMessage(
            destinationChainSelector, receiver, data, IndexFactoryBalancer.PayFeesIn.Native
        );
    }

    function testSendLowerValueOtherChain_Mutations() public {
        uint256 nonce = 1;
        uint256 portfolioValue = 1e20;
        uint64 chainSelector = 1;
        uint256 chainSelectorTotalShares = 200e18;
        uint256 chainValue = 50e18;
        uint256[] memory oracleTokenShares = new uint256[](1);
        oracleTokenShares[0] = 10e18;

        vm.store(
            address(this), keccak256(abi.encode(nonce, keccak256("reweightExtraPercentage"))), bytes32(uint256(100e18))
        );

        vm.store(address(this), keccak256(abi.encode(nonce, keccak256("extraWethByNonce"))), bytes32(uint256(10e18)));

        {
            vm.expectRevert(stdError.divisionError);
            _sendLowerValueOtherChain(
                nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue / 100e18, oracleTokenShares
            );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendLowerValueOtherChain(
                nonce,
                portfolioValue,
                chainSelector,
                chainSelectorTotalShares,
                (chainValue * 100e18) * portfolioValue,
                oracleTokenShares
            );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendLowerValueOtherChain(
                nonce,
                portfolioValue,
                chainSelector,
                chainSelectorTotalShares + ((chainValue * 100e18) / portfolioValue),
                chainValue,
                oracleTokenShares
            );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendLowerValueOtherChain(
                nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue, oracleTokenShares
            );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendLowerValueOtherChain(
                nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue, oracleTokenShares
            );
        }
    }

    function testSendExtraValueOtherChains_Mutations1() public {
        uint256 nonce = 1;
        uint256 portfolioValue = 1e20;
        uint64 chainSelector = 1;
        uint256 chainSelectorTotalShares = 200e18;
        uint256 chainValue = 50e18;
        uint256[] memory oracleTokenShares = new uint256[](1);
        oracleTokenShares[0] = 10e18;

        vm.store(
            address(this), keccak256(abi.encode(nonce, keccak256("reweightExtraPercentage"))), bytes32(uint256(100e18))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allCurrentChainSelectorTokens.selector, chainSelector),
            abi.encode(new address[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allOracleChainSelectorTokens.selector, chainSelector),
            abi.encode(new address[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allCurrentChainSelectorVersions.selector, chainSelector),
            abi.encode(new uint256[](0))
        );
        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allOracleChainSelectorVersions.selector, chainSelector),
            abi.encode(new uint256[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.crossChainFactoryBySelector.selector, chainSelector),
            abi.encode(address(0x1234))
        );

        {
            vm.expectRevert(stdError.arithmeticError);
            _sendExtraValueOtherChains(
                nonce,
                portfolioValue,
                chainSelector,
                chainSelectorTotalShares,
                (chainValue * 100e18) * portfolioValue,
                oracleTokenShares
            );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendExtraValueOtherChains(
                nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue / 100e18, oracleTokenShares
            );
        }

        {
            uint256 chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
            vm.store(
                address(this),
                keccak256(abi.encode(nonce, keccak256("reweightExtraPercentage"))),
                bytes32(uint256(100e18))
            );

            vm.expectRevert();
            _sendExtraValueOtherChains(
                nonce, portfolioValue, chainSelector, chainCurrentRealShare, chainValue, oracleTokenShares
            );
            // _sendExtraValueOtherChains(
            //     nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue, oracleTokenShares
            // );
        }

        {
            vm.expectRevert(stdError.divisionError);
            _sendExtraValueOtherChains(
                nonce,
                portfolioValue,
                chainSelector,
                chainSelectorTotalShares + ((chainValue * 100e18) / portfolioValue),
                chainValue,
                oracleTokenShares
            );
        }
    }

    function testAskValues_Mutations() public {
        uint256 nonce = 1;
        uint64 chainSelector = 1;
        uint256 wethAmount = 10e18;
        uint256 ethValue = 1000e18;
        uint256 updateNonce = 1;

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.currentChainSelectorsCount.selector),
            abi.encode(2)
        );

        vm.mockCall(
            address(factoryStorage), abi.encodeWithSelector(factoryStorage.currentFilledCount.selector), abi.encode(1)
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.getCurrentData.selector, 1),
            abi.encode(0, 0, 0, new uint64[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allCurrentChainSelectorTokens.selector, chainSelector),
            abi.encode(new address[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.allCurrentChainSelectorVersions.selector, chainSelector),
            abi.encode(new uint256[](0))
        );

        vm.mockCall(
            address(factoryStorage),
            abi.encodeWithSelector(factoryStorage.tokenSwapFee.selector, address(weth)),
            abi.encode(3000)
        );

        vm.mockCall(
            address(factoryStorage), abi.encodeWithSelector(factoryStorage.vault.selector), abi.encode(address(vault))
        );

        vm.mockCall(
            address(weth),
            abi.encodeWithSelector(IERC20(address(weth)).balanceOf.selector, address(vault)),
            abi.encode(wethAmount)
        );

        vm.mockCall(
            address(this), abi.encodeWithSelector(this.convertEthToUsd.selector, wethAmount), abi.encode(ethValue)
        );

        {
            vm.store(address(this), keccak256(abi.encode(nonce, keccak256("extraWethByNonce"))), bytes32(uint256(0)));

            vm.expectRevert();
            askValues();
        }

        {
            vm.mockCall(
                address(indexFactoryStorage),
                abi.encodeWithSelector(indexFactoryStorage.allCurrentChainSelectorTokens.selector, chainSelector),
                abi.encode([address(token0)])
            );

            askValues();
        }

        {
            vm.store(
                address(this),
                keccak256(abi.encode(updateNonce, keccak256("portfolioTotalValueByNonce"))),
                bytes32(uint256(ethValue))
            );

            vm.expectRevert();
            askValues();
        }

        {
            vm.store(
                address(this),
                keccak256(abi.encode(updateNonce, keccak256("tokenValueByNonce"))),
                bytes32(uint256(ethValue))
            );

            vm.expectRevert();
            askValues();
        }

        {
            vm.store(
                address(this),
                keccak256(abi.encode(updateNonce, keccak256("chainValueByNonce"))),
                bytes32(uint256(ethValue))
            );

            vm.expectRevert();
            askValues();
        }
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
