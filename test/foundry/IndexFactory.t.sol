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

import "./ContractDeployer.sol";

contract CounterTest is Test, ContractDeployer {

    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;


    uint256 mainnetFork;

    

    string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");

    

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);


    function setUp() public {
        
        deployAllContracts();
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
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

    function updateOracleList() public {
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

        uint[] memory swapVersions = new uint[](5);
        swapVersions[0] = 3;
        swapVersions[1] = 3;
        swapVersions[2] = 3;
        swapVersions[3] = 3;
        swapVersions[4] = 3;
        
        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapVersions);
    }
    function testOracleList() public {
        updateOracleList();
        // token  oracle list
        assertEq(factory.oracleList(0), address(token0));
        assertEq(factory.oracleList(1), address(token1));
        assertEq(factory.oracleList(2), address(token2));
        assertEq(factory.oracleList(3), address(token3));
        assertEq(factory.oracleList(4), address(token4));
        // token current list
        assertEq(factory.currentList(0), address(token0));
        assertEq(factory.currentList(1), address(token1));
        assertEq(factory.currentList(2), address(token2));
        assertEq(factory.currentList(3), address(token3));
        assertEq(factory.currentList(4), address(token4));
        // token shares
        assertEq(factory.tokenOracleMarketShare(address(token0)), 20e18);
        assertEq(factory.tokenOracleMarketShare(address(token1)), 20e18);
        assertEq(factory.tokenOracleMarketShare(address(token2)), 20e18);
        assertEq(factory.tokenOracleMarketShare(address(token3)), 20e18);
        assertEq(factory.tokenOracleMarketShare(address(token4)), 20e18);
        
        // token shares
        assertEq(factory.tokenSwapVersion(address(token0)), 3);
        assertEq(factory.tokenSwapVersion(address(token1)), 3);
        assertEq(factory.tokenSwapVersion(address(token2)), 3);
        assertEq(factory.tokenSwapVersion(address(token3)), 3);
        assertEq(factory.tokenSwapVersion(address(token4)), 3);
        
    }

    
    // function testIssuanceWithEth() public {
    //     uint startAmount = 1e14;
        

    //     updateOracleList();
        
    //     factory.proposeOwner(owner);
    //     vm.startPrank(owner);
    //     factory.transferOwnership(owner);
    //     vm.stopPrank();
    //     payable(add1).transfer(11e18);
    //     vm.startPrank(add1);
    //     // console.log("FLOKI", IERC20(FLOKI).balanceOf(address(factory)));
        
    //     factory.issuanceIndexTokensWithEth{value: (1e18*1001)/1000}(1e18);
    //     factory.redemption(indexToken.balanceOf(address(add1)), address(weth), 3);
    // }


    // function testIssuanceWithTokens() public {
    //     uint startAmount = 1e14;
        
    //     updateOracleList();
        
    //     factory.proposeOwner(owner);
    //     vm.startPrank(owner);
    //     factory.transferOwnership(owner);
    //     vm.stopPrank();
    //     usdt.transfer(add1, 1001e18);
    //     vm.startPrank(add1);
        
    //     usdt.approve(address(factory), 1001e18);
    //     factory.issuanceIndexTokens(address(usdt), 1000e18, 3);
    //     factory.redemption(indexToken.balanceOf(address(add1)), address(weth), 3);
    // }


    // function testIssuanceWithTokensOutput() public {
    //     uint startAmount = 1e14;
        
       
    //     updateOracleList();
        
    //     factory.proposeOwner(owner);
    //     vm.startPrank(owner);
    //     factory.transferOwnership(owner);
    //     vm.stopPrank();
    //     usdt.transfer(add1, 1001e18);
    //     vm.startPrank(add1);
    //     usdt.approve(address(factory), 1001e18);
    //     factory.issuanceIndexTokens(address(usdt), 1000e18, 3);
    //     console.log("index token balance after isssuance", indexToken.balanceOf(address(add1)));
    //     console.log("portfolio value after issuance", factory.getPortfolioBalance());
    //     uint reallOut = factory.redemption(indexToken.balanceOf(address(add1)), address(usdt), 3);
    //     console.log("index token balance after redemption", indexToken.balanceOf(address(add1)));
    //     console.log("portfolio value after redemption", factory.getPortfolioBalance());
    //     console.log("real out", reallOut);
    //     console.log("usdt after redemption", usdt.balanceOf(add1));
    // }
    

    

    // function testGetPrice() public {
        
    //     address pool = factoryV3.getPool(
    //         wethAddress,
    //         address(token0),
    //         3000
    //     );
        
    //    (
    //         uint160 sqrtPriceX96,
    //         int24 tick,
    //         uint16 observationIndex,
    //         uint16 observationCardinality,
    //         uint16 observationCardinalityNext,
    //         uint8 feeProtocol,
    //         bool unlocked
    //     ) = IUniswapV3Pool(pool).slot0();
    //     //swap
    //     weth.deposit{value:1e16}();
    //     weth.approve(address(swapRouter), 1e16);
    //     ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
    //     .ExactInputSingleParams({
    //         tokenIn: wethAddress,
    //         tokenOut: address(token0),
    //         // pool fee 0.3%
    //         fee: 3000,
    //         recipient: address(this),
    //         deadline: block.timestamp,
    //         amountIn: 1e16,
    //         amountOutMinimum: 0,
    //         // NOTE: In production, this value can be used to set the limit
    //         // for the price the swap will push the pool to,
    //         // which can help protect against price impact
    //         sqrtPriceLimitX96: 0
    //     });
    //     uint finalAmountOut = swapRouter.exactInputSingle(params);

    // }


    

    
}