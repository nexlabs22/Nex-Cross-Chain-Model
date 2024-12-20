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

contract CounterTest is Test, ContractDeployer {

    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;


    uint256 mainnetFork;

    



    function setUp() public {
        
        deployAllContracts();
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);
        
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

    function initializeOracleList(
    ) public {
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint[] memory tokenShares = new uint[](5);
        tokenShares[0] = 20e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 20e18;

        uint[] memory swapFees = new uint[](5);
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

        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }

    function updateOracleList(
        address[] memory assetList,
        uint[] memory tokenShares,
        uint[] memory swapFees,
        uint64[] memory chains
    ) public {
        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }

    function testOracleList() public {
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
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(token0)), 20e18);
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(token1)), 20e18);
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(token2)), 20e18);
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(token3)), 20e18);
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(token4)), 20e18);
        
        // token shares
        assertEq(indexFactoryStorage.tokenSwapFee(address(token0)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token1)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token2)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token3)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token4)), 3000);
        
    }

    function showPercentages() public {
        // uint portfolioBalance = indexFactoryStorage.getPortfolioBalance();
        // uint totalPortfolioBalance;
        // uint totalCurrentList = indexFactoryStorage.totalCurrentList();
        // for (uint i = 0; i < totalCurrentList; i++) {
            // address tokenAddress = indexFactoryStorage.currentList(i);
            // uint64 chainSelector = indexFactoryStorage.tokenChainSelector(tokenAddress);
            // if(chainSelector == 1){
                // uint vaultBalance = IERC20(tokenAddress).balanceOf(address(vault));
                // uint tokenValue = indexFactoryStorage.getAmountOut(tokenAddress, address(weth), vaultBalance, 3000);
                // totalPortfolioBalance += tokenValue;
            // }else{
                // address payable crossChainIndexFactory = payable(indexFactoryStorage.crossChainFactoryBySelector(chainSelector));
                // Vault vault = CrossChainIndexFactory(crossChainIndexFactory).vault();
                // uint vaultBalance = IERC20(tokenAddress).balanceOf(address(vault));
                // uint tokenValue = indexFactoryStorage.getAmountOut(tokenAddress, address(weth), vaultBalance, 3000);
                // totalPortfolioBalance += tokenValue;
            // }

        // }
        // for (uint i = 0; i < totalCurrentList; i++) {
            // address tokenAddress = indexFactoryStorage.currentList(i);
            // uint64 chainSelector = indexFactoryStorage.tokenChainSelector(tokenAddress);
            // if(chainSelector == 1){
                // uint vaultBalance = IERC20(tokenAddress).balanceOf(address(vault));
                // uint tokenValue = indexFactoryStorage.getAmountOut(tokenAddress, address(weth), vaultBalance, 3000);
                // uint percentage = (tokenValue * 1e18) / totalPortfolioBalance;
                // console.log("token", i, "percentage", percentage);
            // }else{
                // address payable crossChainIndexFactory = payable(indexFactoryStorage.crossChainFactoryBySelector(chainSelector));
                // Vault vault = CrossChainIndexFactory(crossChainIndexFactory).vault();
                // uint vaultBalance = IERC20(tokenAddress).balanceOf(address(vault));
                // uint tokenValue = indexFactoryStorage.getAmountOut(tokenAddress, address(weth), vaultBalance, 3000);
                // uint percentage = (tokenValue * 1e18) / totalPortfolioBalance;
                // console.log("token", i, "percentage", percentage);
            // }

        // }
    }
    function testIssuanceWithEth() public {
        initializeOracleList();
        
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        payable(add1).transfer(11e18);
        vm.startPrank(add1);
        
        console.log(indexToken.balanceOf(add1));
        factory.issuanceIndexTokensWithEth{value: (1e18*1001)/1000}(1e18, 0);
        console.log(indexToken.balanceOf(add1));
        
        console.log("token 0 balance", token0.balanceOf(address(vault)));
        console.log("token 1 balance", token1.balanceOf(address(vault)));
        console.log("token 2 balance", token2.balanceOf(address(vault)));
        console.log("token 3 balance", token3.balanceOf(address(vault)));
        console.log("token 4 balance", token4.balanceOf(address(crossChainVault)));
        // vm.roll(block.number + 100);
        // vm.mine();
        console.log("block number", block.number);
        console.log("token 0 value", indexFactoryStorage.getAmountOut(address(token0), address(indexFactoryStorage.weth()), token0.balanceOf(address(vault)), 3000));
        // console.log("token 0 value", IPriceOracle(priceOracleAddress).estimateAmountOut(address(factoryV3), address(crossChainToken), address(weth), uint128(token0.balanceOf(address(vault))), 3000));
        // vm.roll(block.number + 100);
        // console.log(indexToken.balanceOf(add1));
        // uint portfolioBalance = indexFactoryStorage.getPortfolioBalance();
        // console.log("portfolio balance", portfolioBalance);
        // showPercentages();
    }
    


    

    
}