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
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token1,
            wethAddress,
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token2,
            wethAddress,
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token3,
            wethAddress,
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token4,
            wethAddress,
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            crossChainToken,
            wethAddress,
            100000e18,
            100e18
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            usdt,
            wethAddress,
            100000e18,
            100e18
        );

        // set Fee
        mockRouter.setFee(1e16);
        // send fee to the core sender and cross chain factory
        // payable(address(coreSender)).transfer(1e18);
        payable(address(balancerSender)).transfer(1e18);
        payable(address(crossChainIndexFactory)).transfer(1e18);
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

        link.transfer(address(functionsOracle), 1e17);
        // bytes32 requestId = functionsOracle.requestAssetsData();
        // oracle.fulfillOracleFundingRateRequest(
        //     requestId,
        //     assetList,
        //     tokenShares,
        //     swapFees,
        //     chains
        // );
        bytes32 requestId = functionsOracle.requestAssetsData(
            "console.log('Hello, World!');",
            0,
            0
        );
        bytes memory data = abi.encode(
            assetList,
            tokenShares,
            chains
        );
        bool success = oracle.fulfillRequest(
            address(functionsOracle),
            requestId,
            data
        );
        require(success, "fulfillRequest failed");

        // update path data
        functionsOracle.updatePathData(assetList, pathData);
    }

    function updateOracleList(
        address[] memory assetList,
        bytes[] memory pathData,
        uint[] memory tokenShares,
        uint64[] memory chains
    ) public returns(bool) {
        vm.warp(block.timestamp + 1);
        link.transfer(address(functionsOracle), 1e17);
        // bytes32 requestId = functionsOracle.requestAssetsData();
        // oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
        bytes32 requestId = functionsOracle.requestAssetsData(
            "console.log('Hello, World!');",
            0,
            0
        );
        bytes memory data = abi.encode(
            assetList,
            tokenShares,
            chains
        );
        bool success = oracle.fulfillRequest(
            address(functionsOracle),
            requestId,
            data
        );
        require(success, "fulfillRequest failed");
        // update path data
        functionsOracle.updatePathData(assetList, pathData);
        return success;
    }

    function testOracleListForRebalancing() public {
        initializeOracleList();
        // token  oracle list
        assertEq(functionsOracle.oracleList(0), address(token0));
        assertEq(functionsOracle.oracleList(1), address(token1));
        assertEq(functionsOracle.oracleList(2), address(token2));
        assertEq(functionsOracle.oracleList(3), address(token3));
        assertEq(functionsOracle.oracleList(4), address(token4));
        // token current list
        assertEq(functionsOracle.currentList(0), address(token0));
        assertEq(functionsOracle.currentList(1), address(token1));
        assertEq(functionsOracle.currentList(2), address(token2));
        assertEq(functionsOracle.currentList(3), address(token3));
        assertEq(functionsOracle.currentList(4), address(token4));
        // token shares
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token0)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token1)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token2)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token3)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token4)),
            20e18
        );

        // token shares
        // token from eth path data
        (address[] memory path00, uint24[] memory fees00) = functionsOracle.getFromETHPathData(address(token0));
        assertEq(path00[0], address(weth));
        assertEq(path00[1], address(token0));
        assertEq(fees00[0], 3000);
        (address[] memory path40, uint24[] memory fees40) = functionsOracle.getFromETHPathData(address(token4));
        assertEq(path40[0], address(weth));
        assertEq(path40[1], address(token4));
        assertEq(fees40[0], 3000);

        // token to eth path data
        (address[] memory path50, uint24[] memory fees50) = functionsOracle.getToETHPathData(address(token0));
        assertEq(path50[0], address(token0));
        assertEq(path50[1], address(weth));
        assertEq(fees50[0], 3000);
        (address[] memory path90, uint24[] memory fees90) = functionsOracle.getToETHPathData(address(token4));
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
            functionsOracle.tokenOracleMarketShare(address(token0)),
            30e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token1)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token2)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token3)),
            20e18
        );
        assertEq(
            functionsOracle.tokenOracleMarketShare(address(token4)),
            10e18
        );
    }

    function getIndexTokenPrice() public view returns (uint256) {
        uint totalPortfolioBalance;
        uint totalSupply = indexToken.totalSupply();
        uint ethPrice = indexFactoryStorage.priceInWei();
        for (uint i = 0; i < functionsOracle.totalCurrentList(); i++) {
            address token = functionsOracle.currentList(i);
            uint64 tokenChainSelector = functionsOracle.tokenChainSelector(token);
            address vaultAddress = tokenChainSelector == 1 ? address(vault) : address(crossChainVault);
            uint tokenBalance = IERC20(token).balanceOf(vaultAddress);
            (address[] memory path, uint24[] memory fees) = functionsOracle.getToETHPathData(token);
            uint tokenValue = indexFactoryStorage.getAmountOut(
                path,
                fees,
                tokenBalance
            );
            totalPortfolioBalance += tokenValue;
        }
        return (totalPortfolioBalance * ethPrice) / totalSupply;
        // return totalSupply;
    }

    function getIndexTokenPrice2() public view returns (uint256) {
        uint totalPortfolioBalance;
        uint totalSupply = indexToken.totalSupply();
        uint ethPrice = indexFactoryStorage.priceInWei();
        for (uint i = 0; i < functionsOracle.totalCurrentList(); i++) {
            address token = functionsOracle.currentList(i);
            uint64 tokenChainSelector = functionsOracle.tokenChainSelector(token);
            address vaultAddress = tokenChainSelector == 1 ? address(vault) : address(crossChainVault);
            uint tokenBalance = IERC20(token).balanceOf(vaultAddress);
            (address[] memory path, uint24[] memory fees) = functionsOracle.getToETHPathData(token);
            uint tokenValue = indexFactoryStorage.getAmountOut(
                path,
                fees,
                tokenBalance
            );
            totalPortfolioBalance += tokenValue;
        }
        uint netReceivedAmount = getNetSentAndReceivedAmounts();
        (address[] memory path, uint24[] memory fees) = indexFactoryStorage.getToETHPathData(address(crossChainToken));
        uint crossChainTokenValue = indexFactoryStorage.getAmountOut(
            path,
            fees,
            netReceivedAmount
        );
        uint numerator = totalPortfolioBalance + crossChainTokenValue + indexFactoryStorage.totalPendingRedemptionHoldValue() + indexFactoryStorage.totalPendingExtraWeth() - indexFactoryStorage.totalPendingIssuanceInput();
        uint denominator = totalSupply + indexFactoryStorage.totalPendingRedemptionInput();
        return (numerator * ethPrice) / denominator;
        // return (totalPortfolioBalance * ethPrice) / totalSupply;
        // return totalSupply;
    }

    function getNetSentAndReceivedAmounts() public view returns (uint256) {
        uint sentAmount = indexFactoryStorage.totalSentAmount(address(crossChainToken));
        uint receivedAmount = indexFactoryStorage.totalReceivedAmount(address(crossChainToken));

        uint sentAmount2 = crossChainIndexFactoryStorage.totalSentAmount(address(crossChainToken));
        uint receivedAmount2 = crossChainIndexFactoryStorage.totalReceivedAmount(address(crossChainToken));
        if(sentAmount + receivedAmount > sentAmount2 + receivedAmount2) {
            return ((sentAmount + receivedAmount) - (sentAmount2 + receivedAmount2));
        } else {
            return ((sentAmount2 + receivedAmount2) - (sentAmount + receivedAmount));
        }
    }
    
    function showPercentages() public {
        console.log("****");
        uint portfolioBalance = indexFactoryStorage.getPortfolioBalance();
        uint totalPortfolioBalance;
        uint totalCurrentList = functionsOracle.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = functionsOracle.currentList(i);
            uint64 chainSelector = functionsOracle.tokenChainSelector(
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
            address tokenAddress = functionsOracle.currentList(i);
            uint64 chainSelector = functionsOracle.tokenChainSelector(
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

        //calculate issuance fee
        uint issuanceFee = factory.getIssuanceFee(
            address(weth),
            new address[](0),
            new uint24[](0),
            1e18
        );
        factory.issuanceIndexTokensWithEth{value: (1e18 * 1001) / 1000 + issuanceFee}(
            1e18
        );
        mockRouter.executeAllMessages();
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(usdt);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;
        // calculate redemption fee
        uint redemptionFee = factory.getRedemptionFee(
            indexToken.balanceOf(add1)
        );
        factory.redemption{value: redemptionFee}(indexToken.balanceOf(add1), address(usdt), path, fees);
        mockRouter.executeAllMessages();
        vm.stopPrank();

        token0.transfer(address(vault), 20e18);
        token1.transfer(address(vault), 20e18);
        token2.transfer(address(vault), 20e18);
        token3.transfer(address(vault), 20e18);
        token4.transfer(address(crossChainVault), 20e18);
        indexToken.setMinter(address(this), true);
        indexToken.mint(address(this), 20e18);
        factoryBalancer.proposeOwner(owner);
        vm.startPrank(owner);
        factoryBalancer.transferOwnership(owner);
        assertEq(factory.paused(), false);
        factoryBalancer.askValues();
        assertEq(factory.paused(), true);
        mockRouter.executeAllMessages();
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

        //check prices
        uint indexTokenPrice = getIndexTokenPrice();
        uint indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        vm.startPrank(owner);
        factoryBalancer.firstReweightAction();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        mockRouter.executeAllMessages();
        
        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        factoryBalancer.secondReweightAction();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);
        // factoryBalancer.pauseIndexFactory();
        // factoryBalancer.unpauseIndexFactory();
        mockRouter.executeAllMessages();
        // assertEq(factory.paused(), false);
        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);
        
        showPercentages();
       
    }
    
    function testRebalanceSameTokens2() public {
        initializeOracleList();
        assertEq(crossChainIndexFactoryStorage.verifiedFactory(address(coreSender), 1), true);
        assertEq(crossChainIndexFactoryStorage.verifiedFactory(address(balancerSender), 1), true);
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        vm.startPrank(add1);

        // calculate issuance fee
        uint issuanceFee = factory.getIssuanceFee(
            address(weth),
            new address[](0),
            new uint24[](0),
            1e18
        );
        factory.issuanceIndexTokensWithEth{value: (1e18 * 1001) / 1000 + issuanceFee}(
            1e18
        );
        mockRouter.executeAllMessages();
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(usdt);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;

        // calculate redemption fee
        uint redemptionFee = factory.getRedemptionFee(
            indexToken.balanceOf(add1)
        );
        factory.redemption{value: redemptionFee}(indexToken.balanceOf(add1), address(usdt), path, fees);
        mockRouter.executeAllMessages();
        vm.stopPrank();

        token0.transfer(address(vault), 20e18);
        token1.transfer(address(vault), 20e18);
        token2.transfer(address(vault), 20e18);
        token3.transfer(address(vault), 20e18);
        token4.transfer(address(crossChainVault), 20e18);

        indexToken.setMinter(address(this), true);
        indexToken.mint(address(this), 20e18);

        factoryBalancer.proposeOwner(owner);
        vm.startPrank(owner);
        factoryBalancer.transferOwnership(owner);
        factoryBalancer.askValues();
        mockRouter.executeAllMessages();
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

        //check prices
        uint indexTokenPrice = getIndexTokenPrice();
        uint indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        vm.startPrank(owner);
        factoryBalancer.firstReweightAction();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        mockRouter.executeAllMessages();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        factoryBalancer.secondReweightAction();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        mockRouter.executeAllMessages();

        //check prices
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        showPercentages();
        
        // token shares
        assertEq(
            functionsOracle.tokenCurrentMarketShare(address(token0)),
            10e18
        );
        assertEq(
            functionsOracle.tokenCurrentMarketShare(address(token1)),
            20e18
        );
        assertEq(
            functionsOracle.tokenCurrentMarketShare(address(token2)),
            20e18
        );
        assertEq(
            functionsOracle.tokenCurrentMarketShare(address(token3)),
            20e18
        );
        assertEq(
            functionsOracle.tokenCurrentMarketShare(address(token4)),
            30e18
        );
        
    }
    
}
