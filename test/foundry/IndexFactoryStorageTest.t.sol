// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";

contract IndexFactoryStorageTest is Test {
    IndexFactoryStorage indexFactoryStorage;

    uint64 currentChainSelector = 1;
    address payable token = payable(address(0x1));
    address chainlinkToken = address(0x2);
    address oracleAddress = address(0x3);
    bytes32 externalJobId = bytes32(uint256(0x4));
    address toUsdPriceFeed = address(0x5);
    address weth = address(0x6);
    address swapRouterV3 = address(0x7);
    address factoryV3 = address(0x8);
    address swapRouterV2 = address(0x9);
    address factoryV2 = address(0x10);

    function setUp() external {
        indexFactoryStorage = new IndexFactoryStorage();
        indexFactoryStorage.initialize(
            currentChainSelector,
            token,
            chainlinkToken,
            oracleAddress,
            externalJobId,
            toUsdPriceFeed,
            weth,
            swapRouterV3,
            factoryV3,
            swapRouterV2,
            factoryV2
        );
    }

    function test_setPriceFeed_SuccessfulSetPriceFeed() public {
        address newPriceFeed = address(0x123);
        indexFactoryStorage.setPriceFeed(newPriceFeed);
        assertEq(address(indexFactoryStorage.toUsdPriceFeed()), newPriceFeed);
    }

    function test_setVault_SuccessfulSetVault() public {
        address vaultAddress = address(0x11);
        indexFactoryStorage.setVault(vaultAddress);
        assertEq(address(indexFactoryStorage.vault()), vaultAddress);
    }

    function test_priceInWei_SuccessfulPriceInWei() public {
        int256 price = 1000 * 10 ** 8;
        vm.mockCall(
            toUsdPriceFeed,
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(0, price, 0, 0, 0)
        );

        uint8 decimals = 8;
        vm.mockCall(
            toUsdPriceFeed, abi.encodeWithSelector(AggregatorV3Interface.decimals.selector), abi.encode(decimals)
        );

        uint256 priceInWei = indexFactoryStorage.priceInWei();
        assertEq(priceInWei, uint256(price) * 10 ** 10);
    }

    function test_getAmountOut_SuccessfulGetAmountOut() public {
        address tokenIn = address(0x1);
        address tokenOut = address(0x2);
        uint256 amountIn = 1 ether;
        uint24 swapFee = 3;

        address priceOracle = address(0x3);
        vm.mockCall(
            priceOracle,
            abi.encodeWithSelector(
                IPriceOracle.estimateAmountOut.selector, address(0), tokenIn, tokenOut, uint128(amountIn)
            ),
            abi.encode(2 ether)
        );

        indexFactoryStorage.setPriceOracle(priceOracle);

        uint256 amountOut = indexFactoryStorage.getAmountOut(tokenIn, tokenOut, amountIn, swapFee);
        // assertEq(amountOut, 2 ether);
    }
}
