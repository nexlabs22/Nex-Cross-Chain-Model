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

contract IndexFactoryTest is Test, ContractDeployer {

    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;


    uint256 mainnetFork;

    

    // string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);


    function setUp() public {
        
        deployAllContracts(1000000e18);
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 100000e18, 100e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 100000e18, 1e18);

        // set Fee
        mockRouter.setFee(1e16);
        // send fee to the core sender and cross chain factory
        // payable(address(coreSender)).transfer(1e18);
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

    function updateOracleList() public {
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
        bytes32 requestId = functionsOracle.requestAssetsData(
            "console.log('Hello, World!');",
            // FunctionsConsumer.Location.Inline, // Use the imported enum directly
            abi.encodePacked("default"),
            new string[](1), // Convert to dynamic array
            new bytes[](1),  // Convert to dynamic array
            0,
            0
        );
        bytes memory data = abi.encode(assetList, pathData, tokenShares, chains);
        bool success = oracle.fulfillRequest(address(functionsOracle), requestId, data);
        require(success, "oracle request failed");
        // oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }
    function testOracleList() public {
        updateOracleList();
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
        assertEq(functionsOracle.tokenOracleMarketShare(address(token0)), 20e18);
        assertEq(functionsOracle.tokenOracleMarketShare(address(token1)), 20e18);
        assertEq(functionsOracle.tokenOracleMarketShare(address(token2)), 20e18);
        assertEq(functionsOracle.tokenOracleMarketShare(address(token3)), 20e18);
        assertEq(functionsOracle.tokenOracleMarketShare(address(token4)), 20e18);
        
         // token from eth path data
        (address[] memory path0, uint24[] memory fees0) = functionsOracle.getFromETHPathData(address(token0));
        assertEq(path0[0], address(weth));
        assertEq(path0[1], address(token0));
        assertEq(fees0[0], 3000);
        (address[] memory path1, uint24[] memory fees1) = functionsOracle.getFromETHPathData(address(token1));
        assertEq(path1[0], address(weth));
        assertEq(path1[1], address(token1));
        assertEq(fees1[0], 3000);
        (address[] memory path2, uint24[] memory fees2) = functionsOracle.getFromETHPathData(address(token2));
        assertEq(path2[0], address(weth));
        assertEq(path2[1], address(token2));
        assertEq(fees2[0], 3000);
        (address[] memory path3, uint24[] memory fees3) = functionsOracle.getFromETHPathData(address(token3));
        assertEq(path3[0], address(weth));
        assertEq(path3[1], address(token3));
        assertEq(fees3[0], 3000);
        (address[] memory path4, uint24[] memory fees4) = functionsOracle.getFromETHPathData(address(token4));
        assertEq(path4[0], address(weth));
        assertEq(path4[1], address(token4));
        assertEq(fees4[0], 3000);

        // token to eth path data
        (address[] memory path5, uint24[] memory fees5) = functionsOracle.getToETHPathData(address(token0));
        assertEq(path5[0], address(token0));
        assertEq(path5[1], address(weth));
        assertEq(fees5[0], 3000);
        (address[] memory path6, uint24[] memory fees6) = functionsOracle.getToETHPathData(address(token1));
        assertEq(path6[0], address(token1));
        assertEq(path6[1], address(weth));
        assertEq(fees6[0], 3000);
        (address[] memory path7, uint24[] memory fees7) = functionsOracle.getToETHPathData(address(token2));
        assertEq(path7[0], address(token2));
        assertEq(path7[1], address(weth));
        assertEq(fees7[0], 3000);
        (address[] memory path8, uint24[] memory fees8) = functionsOracle.getToETHPathData(address(token3));
        assertEq(path8[0], address(token3));
        assertEq(path8[1], address(weth));
        assertEq(fees8[0], 3000);
        (address[] memory path9, uint24[] memory fees9) = functionsOracle.getToETHPathData(address(token4));
        assertEq(path9[0], address(token4));
        assertEq(path9[1], address(weth));
        assertEq(fees9[0], 3000);
        
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
        uint numerator = totalPortfolioBalance + crossChainTokenValue + indexFactoryStorage.totalPendingRedemptionHoldValue() - indexFactoryStorage.totalPendingIssuanceInput();
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

    function checkSentAndReceivedAmounts() public returns (uint256, uint256) {
        uint sentAmount = indexFactoryStorage.totalSentAmount(address(crossChainToken));
        uint receivedAmount = indexFactoryStorage.totalReceivedAmount(address(crossChainToken));

        uint sentAmount2 = crossChainIndexFactoryStorage.totalSentAmount(address(crossChainToken));
        uint receivedAmount2 = crossChainIndexFactoryStorage.totalReceivedAmount(address(crossChainToken));
        assertEq(sentAmount + receivedAmount, sentAmount2 + receivedAmount2);
        return (sentAmount + receivedAmount, sentAmount2 + receivedAmount2);
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
        
        assertEq(indexFactoryStorage.crossChainFactoryBySelector(2), address(crossChainIndexFactory));
        // calculate issuance fee
        uint issuanceFee = factory.getIssuanceFee(
            address(weth),
            new address[](0),
            new uint24[](0),
            1e18
        );
        console.log(indexToken.balanceOf(add1));
        factory.issuanceIndexTokensWithEth{value: (1e18*1001)/1000 + issuanceFee}(1e18, 0);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));

        issuanceFee = factory.getIssuanceFee(
            address(weth),
            new address[](0),
            new uint24[](0),
            1e17
        );

        uint indexTokenPrice = getIndexTokenPrice();
        uint indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);
        checkSentAndReceivedAmounts();
        factory.issuanceIndexTokensWithEth{value: (1e17*1001)/1000 + issuanceFee}(1e17, 0);
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        mockRouter.executeAllMessages();
        indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);

        checkSentAndReceivedAmounts();

        //calculate redemption fee
        uint redemptionFee = factory.getRedemptionFee(
            indexToken.balanceOf(address(add1))/2
        );
        factory.redemption{value: redemptionFee}(indexToken.balanceOf(address(add1))/2, 0, address(weth), new address[](0), new uint24[](0));
         indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);
        mockRouter.executeAllMessages();
         indexTokenPrice = getIndexTokenPrice();
        indexTokenPrice2 = getIndexTokenPrice2();
        console.log(indexTokenPrice);
        console.log(indexTokenPrice2);
        
    }

    
    function testRedemptionWithEth() public {
        uint startAmount = 1e14;
        

        updateOracleList();
        
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

        console.log(indexToken.balanceOf(add1));
        factory.issuanceIndexTokensWithEth{value: (1e18*1001)/1000 + issuanceFee}(1e18, 0);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));
        // redemption input token path data
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(weth);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;

        //calculate redemption fee
        uint redemptionFee = factory.getRedemptionFee(
            indexToken.balanceOf(address(add1))
        );
        factory.redemption{value: redemptionFee}(indexToken.balanceOf(address(add1)), 0, address(weth), path, fees);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));
    }
    
    
    function testIssuanceWithUsdc() public {
        uint startAmount = 1e14;
        

        updateOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        usdt.transfer(add1, 1001e18);
        vm.startPrank(add1);
        
        console.log(indexToken.balanceOf(add1));
        usdt.approve(address(factory), 1001e18);
        // redemption input token path data
        address[] memory path = new address[](2);
        path[0] = address(usdt);
        path[1] = address(weth);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;

        //calculate issuance fee
        uint issuanceFee = factory.getIssuanceFee(
            address(usdt),
            path,
            fees,
            1000e18
        );
        factory.issuanceIndexTokens{value: issuanceFee}(address(usdt), path, fees, 1000e18, 0);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));
    }
    
    
    function testRedemptionWithUsdc() public {
        uint startAmount = 1e14;
        

        updateOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        usdt.transfer(add1, 1001e18);
        vm.startPrank(add1);
        
        console.log(indexToken.balanceOf(add1));
        usdt.approve(address(factory), 1001e18);
        // redemption input token path data
        address[] memory path = new address[](2);
        path[0] = address(usdt);
        path[1] = address(weth);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;
        // calculate issuance fee
        uint issuanceFee = factory.getIssuanceFee(
            address(usdt),
            path,
            fees,
            1000e18
        );
        factory.issuanceIndexTokens{value: issuanceFee}(address(usdt), path, fees, 1000e18, 0);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));
        // redemption input token path data
        address[] memory path2 = new address[](2);
        path2[0] = address(weth);
        path2[1] = address(usdt);
        uint24[] memory fees2 = new uint24[](1);
        fees2[0] = 3000;
        // calculate redemption fee
        uint redemptionFee = factory.getRedemptionFee(
            indexToken.balanceOf(address(add1))
        );
        factory.redemption{value: redemptionFee}(indexToken.balanceOf(address(add1)), 0, address(usdt), path2, fees2);
        mockRouter.executeAllMessages();
        console.log(indexToken.balanceOf(add1));
    }

    
    


    

    
}