// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../../contracts/token/IndexToken.sol";
import "../../../contracts/factory/IndexFactory.sol";
// import "../../contracts/test/TestSwap.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "../../../contracts/test/MockV3Aggregator.sol";
import "../../../contracts/test/MockApiOracle.sol";
import "../../../contracts/test/LinkToken.sol";
// import "../../contracts/interfaces/IUniswapV3Pool.sol";
import "../../../contracts/test/MockV3Aggregator.sol";

import "../ContractDeployer.sol";

contract IndexTokenFactoryFuzzTests is Test, ContractDeployer {
    using stdStorage for StdStorage;

    uint256 internal constant SCALAR = 1e20;

    uint256 mainnetFork;

    // string MAINNET_RPC_URL = vm.envString("MAINNET_RPC_URL");
    uint256 internal constant TOKEN_LIQUIDITY_LIMIT = 1000000e18;
    uint256 internal constant WETH_LIQUIDITY_LIMIT = 1000e18;

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(
        address feeReceiver,
        uint256 timestamp,
        uint256 totalSupply,
        uint256 amount
    );
    event ToggledRestricted(address indexed account, bool isRestricted);

    function setUp() public {
        deployAllContracts(TOKEN_LIQUIDITY_LIMIT * 1000);
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token0,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token1,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token2,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token3,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            token4,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            usdt,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );
        addLiquidityETH(
            positionManager,
            factoryAddress,
            crossChainToken,
            wethAddress,
            TOKEN_LIQUIDITY_LIMIT,
            WETH_LIQUIDITY_LIMIT
        );

        //set supply ceiling
        indexToken.setSupplyCeiling(type(uint256).max);

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
            requestId,
            assetList,
            tokenShares,
            swapFees,
            chains
        );
        oracle.fulfillRequest(
            address(indexFactoryStorage),
            requestId,
            data
        );
    }
    function testOracleList() public {
        updateOracleList();
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
        assertEq(indexFactoryStorage.tokenSwapFee(address(token0)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token1)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token2)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token3)), 3000);
        assertEq(indexFactoryStorage.tokenSwapFee(address(token4)), 3000);
    }

    function testFuzzIssuanceWithTokens(uint256 amount) public {
        vm.assume(
            amount > 1000000 &&
                amount <
                TOKEN_LIQUIDITY_LIMIT - (TOKEN_LIQUIDITY_LIMIT * 100) / 10000
        );
        // vm.assume(amount > 1000000 && amount < 1000e18 - 1000e18*10/10000);
        updateOracleList();

        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        usdt.transfer(add1, amount + (amount * 10) / 10000);
        vm.startPrank(add1);

        usdt.approve(address(factory), amount + (amount * 10) / 10000);
        factory.issuanceIndexTokens(address(usdt), amount, 0, 3000);
    }

    function testFuzzRedemptionWithTokens(uint256 amount) public {
        // vm.assume(amount + 1e18 < TOKEN_LIQUIDITY_LIMIT);
        // vm.assume(amount < TOKEN_LIQUIDITY_LIMIT - 1e18);
        vm.assume(
            amount > 1000000 &&
                amount <
                TOKEN_LIQUIDITY_LIMIT - (TOKEN_LIQUIDITY_LIMIT * 100) / 10000
        );
        updateOracleList();

        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();
        usdt.transfer(add1, amount + (amount * 10) / 10000);
        vm.startPrank(add1);

        usdt.approve(address(factory), amount + (amount * 10) / 10000);
        factory.issuanceIndexTokens(address(usdt), amount, 0, 3000);
        factory.redemption(
            indexToken.balanceOf(address(add1)),
            0,
            address(weth),
            3000
        );
        assertEq(indexToken.balanceOf(add1), 0);
    }
}
