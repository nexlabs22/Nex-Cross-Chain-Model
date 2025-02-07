// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/token/IndexToken.sol";
import "../../contracts/factory/IndexFactory.sol";
// import "../../contracts/test/TestSwap.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "../../contracts/test/MockV3Aggregator.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";
// import "../../contracts/interfaces/IUniswapV3Pool.sol";
import "../../contracts/test/MockV3Aggregator.sol";

import "./ContractDeployer.sol";

contract IndexFactoryBalancerTest is Test, ContractDeployer {
    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;

    uint256 mainnetFork;

    function setUp() public {
        deployAllContracts(1000000e18);
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token0,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token1,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token2,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token3,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token4,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            crossChainToken,
            wethAddress,
            1000e18,
            1e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            usdt,
            wethAddress,
            1000e18,
            1e18
        );
    }

    function testInitialized() public {
        // counter.increment();
        assertEq(indexToken.owner(), address(this));
        assertEq(indexToken.feeRatePerDayScaled(), 1e18);
        assertEq(indexToken.feeTimestamp(), block.timestamp);
        assertEq(indexToken.feeReceiver(), feeReceiver);
        assertEq(indexToken.methodology(), "");
        assertEq(indexToken.supplyCeiling(), 1000000e18);
        assertEq(indexToken.isMinter(address(factory)), true);
    }

    enum DexStatus {
        UNISWAP_V2,
        UNISWAP_V3
    }

    function initializeOracleList() public {
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        bytes[] memory pathData = new bytes[](5);
        //updating path data for token0
        address[] memory path0 = new address[](2);
        path0[0] = address(weth);
        path0[1] = address(token0);
        pathData[0] = abi.encode(path0, feesData);
        //updating path data for token1
        address[] memory path1 = new address[](2);
        path1[0] = address(weth);
        path1[1] = address(token1);
        pathData[1] = abi.encode(path1, feesData);
        //updating path data for token2
        address[] memory path2 = new address[](2);
        path2[0] = address(weth);
        path2[1] = address(token2);
        pathData[2] = abi.encode(path2, feesData);
        //updating path data for token3
        address[] memory path3 = new address[](2);
        path3[0] = address(weth);
        path3[1] = address(token3);
        pathData[3] = abi.encode(path3, feesData);
        //updating path data for token4
        address[] memory path4 = new address[](2);
        path4[0] = address(weth);
        path4[1] = address(token4);
        pathData[4] = abi.encode(path4, feesData);

        uint[] memory tokenShares = new uint[](5);
        tokenShares[0] = 20e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 20e18;

        

        uint64[] memory chains = new uint64[](5);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;
        chains[4] = 2;

        link.transfer(address(indexFactoryStorage), 1e17);
        // bytes32 requestId = indexFactoryStorage.requestAssetsData();
        // oracle.fulfillOracleFundingRateRequest(
        //     requestId,
        //     assetList,
        //     tokenShares,
        //     swapFees,
        //     chains
        // );
        bytes32 requestId = indexFactoryStorage.requestAssetsData(
            "console.log('Hello, World!');",
            // FunctionsConsumer.Location.Inline, // Use the imported enum directly
            abi.encodePacked("default"),
            new string[](1), // Convert to dynamic array
            new bytes[](1), // Convert to dynamic array
            0,
            0
        );
        bytes memory data = abi.encode(
            assetList,
            pathData,
            tokenShares,
            chains
        );
        bool success = oracle.fulfillRequest(
            address(indexFactoryStorage),
            requestId,
            data
        );
        require(success, "fulfillRequest failed");
    }

    function updateOracleList(
        address[] memory assetList,
        bytes[] memory pathData,
        uint[] memory tokenShares,
        uint64[] memory chains
    ) public returns(bool) {
        vm.warp(block.timestamp + 1);
        link.transfer(address(indexFactoryStorage), 1e17);
        // bytes32 requestId = indexFactoryStorage.requestAssetsData();
        // oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
        bytes32 requestId = indexFactoryStorage.requestAssetsData(
            "console.log('Hello, World!');",
            // FunctionsConsumer.Location.Inline, // Use the imported enum directly
            abi.encodePacked("default"),
            new string[](1), // Convert to dynamic array
            new bytes[](1), // Convert to dynamic array
            0,
            0
        );
        bytes memory data = abi.encode(
            assetList,
            pathData,
            tokenShares,
            chains
        );
        bool success = oracle.fulfillRequest(
            address(indexFactoryStorage),
            requestId,
            data
        );
        require(success, "fulfillRequest failed");
        return success;
    }

    function testOracleListForRebalancing() public {
        initializeOracleList();
        // token  oracle list
        assertEq(indexFactoryStorage.oracleList(0), address(token0));
        assertEq(indexFactoryStorage.oracleList(1), address(token1));
        assertEq(indexFactoryStorage.oracleList(2), address(token2));
        assertEq(indexFactoryStorage.oracleList(3), address(token3));
        assertEq(indexFactoryStorage.oracleList(4), address(token4));
        // token current list
        assertEq(indexFactoryStorage.currentList(0), address(token0));
        assertEq(indexFactoryStorage.currentList(1), address(token1));
        assertEq(indexFactoryStorage.currentList(2), address(token2));
        assertEq(indexFactoryStorage.currentList(3), address(token3));
        assertEq(indexFactoryStorage.currentList(4), address(token4));
        // token shares
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token0)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token1)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token2)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token3)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token4)),
            20e18
        );

        // token shares
        // token from eth path data
        (address[] memory path00, uint24[] memory fees00) = indexFactoryStorage.getFromETHPathData(address(token0));
        assertEq(path00[0], address(weth));
        assertEq(path00[1], address(token0));
        assertEq(fees00[0], 3000);
        (address[] memory path40, uint24[] memory fees40) = indexFactoryStorage.getFromETHPathData(address(token4));
        assertEq(path40[0], address(weth));
        assertEq(path40[1], address(token4));
        assertEq(fees40[0], 3000);

        // token to eth path data
        (address[] memory path50, uint24[] memory fees50) = indexFactoryStorage.getToETHPathData(address(token0));
        assertEq(path50[0], address(token0));
        assertEq(path50[1], address(weth));
        assertEq(fees50[0], 3000);
        (address[] memory path90, uint24[] memory fees90) = indexFactoryStorage.getToETHPathData(address(token4));
        assertEq(path90[0], address(token4));
        assertEq(path90[1], address(weth));
        assertEq(fees90[0], 3000);

        address[] memory assetList2 = new address[](5);
        assetList2[0] = address(token0);
        assetList2[1] = address(token1);
        assetList2[2] = address(token2);
        assetList2[3] = address(token3);
        assetList2[4] = address(token4);

        uint[] memory tokenShares2 = new uint[](5);
        tokenShares2[0] = 30e18;
        tokenShares2[1] = 20e18;
        tokenShares2[2] = 20e18;
        tokenShares2[3] = 20e18;
        tokenShares2[4] = 10e18;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        bytes[] memory pathData = new bytes[](5);
        //updating path data for token0
        address[] memory path0 = new address[](2);
        path0[0] = address(weth);
        path0[1] = address(token0);
        pathData[0] = abi.encode(path0, feesData);
        //updating path data for token1
        address[] memory path1 = new address[](2);
        path1[0] = address(weth);
        path1[1] = address(token1);
        pathData[1] = abi.encode(path1, feesData);
        //updating path data for token2
        address[] memory path2 = new address[](2);
        path2[0] = address(weth);
        path2[1] = address(token2);
        pathData[2] = abi.encode(path2, feesData);
        //updating path data for token3
        address[] memory path3 = new address[](2);
        path3[0] = address(weth);
        path3[1] = address(token3);
        pathData[3] = abi.encode(path3, feesData);
        //updating path data for token4
        address[] memory path4 = new address[](2);
        path4[0] = address(weth);
        path4[1] = address(token4);
        pathData[4] = abi.encode(path4, feesData);

        uint64[] memory chains2 = new uint64[](5);
        chains2[0] = 1;
        chains2[1] = 1;
        chains2[2] = 1;
        chains2[3] = 1;
        chains2[4] = 2;
        bool success = updateOracleList(assetList2, pathData, tokenShares2, chains2);
        // token shares
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token0)),
            30e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token1)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token2)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token3)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenOracleMarketShare(address(token4)),
            10e18
        );
    }

    
    function showPercentages() public {
        console.log("****");
        uint portfolioBalance = indexFactoryStorage.getPortfolioBalance();
        uint totalPortfolioBalance;
        uint totalCurrentList = indexFactoryStorage.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = indexFactoryStorage.currentList(i);
            uint64 chainSelector = indexFactoryStorage.tokenChainSelector(
                tokenAddress
            );
            if (chainSelector == 1) {
                uint vaultBalance = IERC20(tokenAddress).balanceOf(
                    address(vault)
                );
                address[] memory path = new address[](2);
                path[0] = tokenAddress;
                path[1] = address(weth);
                uint24[] memory fees = new uint24[](1);
                fees[0] = 3000;
                uint tokenValue = indexFactoryStorage.getAmountOut(
                    path,
                    fees,
                    vaultBalance
                );
                totalPortfolioBalance += tokenValue;
            } else {
                address payable crossChainIndexFactory = payable(
                    indexFactoryStorage.crossChainFactoryBySelector(
                        chainSelector
                    )
                );
                Vault vault = CrossChainIndexFactory(crossChainIndexFactory)
                    .vault();
                uint vaultBalance = IERC20(tokenAddress).balanceOf(
                    address(vault)
                );
                address[] memory path = new address[](2);
                path[0] = tokenAddress;
                path[1] = address(weth);
                uint24[] memory fees = new uint24[](1);
                fees[0] = 3000;
                uint tokenValue = indexFactoryStorage.getAmountOut(
                    path,
                    fees,
                    vaultBalance
                );
                totalPortfolioBalance += tokenValue;
            }
        }
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = indexFactoryStorage.currentList(i);
            uint64 chainSelector = indexFactoryStorage.tokenChainSelector(
                tokenAddress
            );
            if (chainSelector == 1) {
                uint vaultBalance = IERC20(tokenAddress).balanceOf(
                    address(vault)
                );
                address[] memory path = new address[](2);
                path[0] = tokenAddress;
                path[1] = address(weth);
                uint24[] memory fees = new uint24[](1);
                fees[0] = 3000;
                uint tokenValue = indexFactoryStorage.getAmountOut(
                    path,
                    fees,
                    vaultBalance
                );
                uint percentage = (tokenValue * 1e18) / totalPortfolioBalance;
                console.log("token", i, "percentage", percentage);
            } else {
                address payable crossChainIndexFactory = payable(
                    indexFactoryStorage.crossChainFactoryBySelector(
                        chainSelector
                    )
                );
                Vault vault = CrossChainIndexFactory(crossChainIndexFactory)
                    .vault();
                uint vaultBalance = IERC20(tokenAddress).balanceOf(
                    address(vault)
                );
                address[] memory path = new address[](2);
                path[0] = tokenAddress;
                path[1] = address(weth);
                uint24[] memory fees = new uint24[](1);
                fees[0] = 3000;
                uint tokenValue = indexFactoryStorage.getAmountOut(
                    path,
                    fees,
                    vaultBalance
                );
                uint percentage = (tokenValue * 1e18) / totalPortfolioBalance;
                console.log("token", i, "percentage", percentage);
            }
        }
    }

    function showTokenBalances() public {
        console.log("***");
        console.log("token 0 balance", token0.balanceOf(address(vault)));
        console.log("token 1 balance", token1.balanceOf(address(vault)));
        console.log("token 2 balance", token2.balanceOf(address(vault)));
        console.log("token 3 balance", token3.balanceOf(address(vault)));
        console.log(
            "token 4 balance",
            token4.balanceOf(address(crossChainVault))
        );
    }
    
    
    function testRebalanceSameTokens() public {
        initializeOracleList();

        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        vm.startPrank(add1);

        factory.issuanceIndexTokensWithEth{value: (1e18 * 1001) / 1000}(
            1e18,
            0
        );
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(usdt);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;
        factory.redemption(indexToken.balanceOf(add1), 0, address(usdt), path, fees);

        vm.stopPrank();

        token0.transfer(address(vault), 20e18);
        token1.transfer(address(vault), 20e18);
        token2.transfer(address(vault), 20e18);
        token3.transfer(address(vault), 20e18);
        token4.transfer(address(crossChainVault), 20e18);

        factoryBalancer.proposeOwner(owner);
        vm.startPrank(owner);
        factoryBalancer.transferOwnership(owner);
        factoryBalancer.askValues();
        vm.stopPrank();
        showTokenBalances();

        //update oracle
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        bytes[] memory pathData = new bytes[](5);
        //updating path data for token0
        address[] memory path0 = new address[](2);
        path0[0] = address(weth);
        path0[1] = address(token0);
        pathData[0] = abi.encode(path0, feesData);
        //updating path data for token1
        address[] memory path1 = new address[](2);
        path1[0] = address(weth);
        path1[1] = address(token1);
        pathData[1] = abi.encode(path1, feesData);
        //updating path data for token2
        address[] memory path2 = new address[](2);
        path2[0] = address(weth);
        path2[1] = address(token2);
        pathData[2] = abi.encode(path2, feesData);
        //updating path data for token3
        address[] memory path3 = new address[](2);
        path3[0] = address(weth);
        path3[1] = address(token3);
        pathData[3] = abi.encode(path3, feesData);
        //updating path data for token4
        address[] memory path4 = new address[](2);
        path4[0] = address(weth);
        path4[1] = address(token4);
        pathData[4] = abi.encode(path4, feesData);

        uint[] memory tokenShares = new uint[](5);
        tokenShares[0] = 30e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 10e18;


        uint64[] memory chains = new uint64[](5);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;
        chains[4] = 2;

        updateOracleList(assetList, pathData, tokenShares, chains);

        vm.startPrank(owner);
        factoryBalancer.firstReweightAction();
        
        factoryBalancer.secondReweightAction();
        
        showPercentages();
       
    }
    
    function testRebalanceSameTokens2() public {
        initializeOracleList();
        assertEq(crossChainIndexFactory.verifiedFactory(address(factory), 1), true);
        assertEq(crossChainIndexFactory.verifiedFactory(address(factoryBalancer), 1), true);
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        vm.startPrank(add1);

        factory.issuanceIndexTokensWithEth{value: (1e18 * 1001) / 1000}(
            1e18,
            0
        );
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(usdt);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;
        factory.redemption(indexToken.balanceOf(add1), 0, address(usdt), path, fees);

        vm.stopPrank();

        token0.transfer(address(vault), 20e18);
        token1.transfer(address(vault), 20e18);
        token2.transfer(address(vault), 20e18);
        token3.transfer(address(vault), 20e18);
        token4.transfer(address(crossChainVault), 20e18);

        factoryBalancer.proposeOwner(owner);
        vm.startPrank(owner);
        factoryBalancer.transferOwnership(owner);
        factoryBalancer.askValues();
        vm.stopPrank();
        showTokenBalances();

        //update oracle
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        bytes[] memory pathData = new bytes[](5);
        //updating path data for token0
        address[] memory path0 = new address[](2);
        path0[0] = address(weth);
        path0[1] = address(token0);
        pathData[0] = abi.encode(path0, feesData);
        //updating path data for token1
        address[] memory path1 = new address[](2);
        path1[0] = address(weth);
        path1[1] = address(token1);
        pathData[1] = abi.encode(path1, feesData);
        //updating path data for token2
        address[] memory path2 = new address[](2);
        path2[0] = address(weth);
        path2[1] = address(token2);
        pathData[2] = abi.encode(path2, feesData);
        //updating path data for token3
        address[] memory path3 = new address[](2);
        path3[0] = address(weth);
        path3[1] = address(token3);
        pathData[3] = abi.encode(path3, feesData);
        //updating path data for token4
        address[] memory path4 = new address[](2);
        path4[0] = address(weth);
        path4[1] = address(token4);
        pathData[4] = abi.encode(path4, feesData);

        uint[] memory tokenShares = new uint[](5);
        tokenShares[0] = 10e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 30e18;


        uint64[] memory chains = new uint64[](5);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;
        chains[4] = 2;

        updateOracleList(assetList, pathData, tokenShares, chains);

        vm.startPrank(owner);
        factoryBalancer.firstReweightAction();
        
        factoryBalancer.secondReweightAction();
        
        showPercentages();
        
        // token shares
        assertEq(
            indexFactoryStorage.tokenCurrentMarketShare(address(token0)),
            10e18
        );
        assertEq(
            indexFactoryStorage.tokenCurrentMarketShare(address(token1)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenCurrentMarketShare(address(token2)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenCurrentMarketShare(address(token3)),
            20e18
        );
        assertEq(
            indexFactoryStorage.tokenCurrentMarketShare(address(token4)),
            30e18
        );
        console.log("balancerAddress", address(factoryBalancer));
        // console.log(weth.balanceOf(address(factoryBalancer)));
    }
    
}
