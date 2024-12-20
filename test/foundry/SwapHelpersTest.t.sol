// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/libraries/SwapHelpers.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/interfaces/IUniswapV2Router02.sol";

contract SwapHelpersTest is Test {
    using SwapHelpers for ISwapRouter;
    using SwapHelpers for IUniswapV2Router02;

    ISwapRouter private uniswapV3Router;
    IUniswapV2Router02 private uniswapV2Router;
    IERC20 private tokenIn;
    IERC20 private tokenOut;

    address private tokenInAddress = address(0x1);
    address private tokenOutAddress = address(0x2);
    address private recipient = address(0x3);

    uint24 private poolFee = 3000;
    uint256 private amountIn = 100e18;

    function setUp() public {
        uniswapV3Router = ISwapRouter(address(vm.addr(1)));
        uniswapV2Router = IUniswapV2Router02(address(vm.addr(2)));
        tokenIn = IERC20(tokenInAddress);
        tokenOut = IERC20(tokenOutAddress);

        vm.mockCall(
            tokenInAddress, abi.encodeWithSelector(IERC20.balanceOf.selector, address(this)), abi.encode(amountIn)
        );
        vm.mockCall(
            tokenInAddress,
            abi.encodeWithSelector(IERC20.approve.selector, address(uniswapV3Router), amountIn),
            abi.encode(true)
        );
    }

    function testSwapVersion3() public {
        vm.mockCall(
            address(uniswapV3Router),
            abi.encodeWithSelector(
                ISwapRouter.exactInputSingle.selector,
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenInAddress,
                    tokenOut: tokenOutAddress,
                    fee: poolFee,
                    recipient: recipient,
                    deadline: block.timestamp + 300,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            ),
            abi.encode(200e18)
        );

        uint256 amountOut =
            SwapHelpers.swapVersion3(uniswapV3Router, poolFee, tokenInAddress, tokenOutAddress, amountIn, recipient);

        assertEq(amountOut, 200e18, "Incorrect output amount for swapVersion3");
    }

    function testSwapVersion3Preference() public {
        vm.mockCall(
            address(uniswapV3Router),
            abi.encodeWithSelector(
                ISwapRouter.exactInputSingle.selector,
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenInAddress,
                    tokenOut: tokenOutAddress,
                    fee: poolFee,
                    recipient: recipient,
                    deadline: block.timestamp + 300,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            ),
            abi.encode(300e18)
        );

        uint256 amountOut = SwapHelpers.swap(
            uniswapV3Router, uniswapV2Router, poolFee, tokenInAddress, tokenOutAddress, amountIn, recipient
        );

        assertEq(amountOut, 300e18, "Incorrect output amount for swap using Uniswap V3");
    }

    function testSwapTokensV2() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = 200e18;

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
            abi.encode(amounts)
        );

        vm.mockCall(
            tokenInAddress,
            abi.encodeWithSelector(IERC20.approve.selector, address(uniswapV2Router), amountIn),
            abi.encode(true)
        );

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(
                IUniswapV2Router02.swapExactTokensForTokensSupportingFeeOnTransferTokens.selector,
                amountIn,
                0,
                path,
                recipient,
                block.timestamp
            ),
            abi.encode()
        );

        uint256 amountOut =
            SwapHelpers.swapTokensV2(uniswapV2Router, tokenInAddress, tokenOutAddress, amountIn, recipient);

        assertEq(amountOut, 200e18, "Incorrect output amount for swapTokensV2");
    }

    function testSwapFallbackToV2() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = 250e18;

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
            abi.encode(amounts)
        );

        vm.mockCall(
            tokenInAddress,
            abi.encodeWithSelector(IERC20.approve.selector, address(uniswapV2Router), amountIn),
            abi.encode(true)
        );

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(
                IUniswapV2Router02.swapExactTokensForTokensSupportingFeeOnTransferTokens.selector,
                amountIn,
                0,
                path,
                recipient,
                block.timestamp
            ),
            abi.encode()
        );

        uint256 amountOut =
            SwapHelpers.swap(uniswapV3Router, uniswapV2Router, 0, tokenInAddress, tokenOutAddress, amountIn, recipient);

        assertEq(amountOut, 250e18, "Incorrect output amount for swap falling back to Uniswap V2");
    }

    function testFailSwapTokensV2RevertOnInsufficientApproval() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = 200e18;

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
            abi.encode(amounts)
        );

        vm.mockCall(
            tokenInAddress,
            abi.encodeWithSelector(IERC20.approve.selector, address(uniswapV2Router), amountIn),
            abi.encode(false)
        );

        vm.expectRevert("ERC20: approve failed");

        SwapHelpers.swapTokensV2(uniswapV2Router, tokenInAddress, tokenOutAddress, amountIn, recipient);
    }

    function testFailSwapTokensV2RevertOnGetAmountsOutFailure() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
            abi.encode()
        );

        vm.expectRevert("UniswapV2: getAmountsOut failed");

        SwapHelpers.swapTokensV2(uniswapV2Router, tokenInAddress, tokenOutAddress, amountIn, recipient);
    }

    function testFailSwapTokensV2WithZeroAmount() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        vm.expectRevert("SwapHelpers: amountIn must be greater than zero");

        SwapHelpers.swapTokensV2(uniswapV2Router, tokenInAddress, tokenOutAddress, 0, recipient);
    }

    function testSwapPoolFeeSelection() public {
        address[] memory path = new address[](2);
        path[0] = tokenInAddress;
        path[1] = tokenOutAddress;

        vm.mockCall(
            tokenInAddress,
            abi.encodeWithSelector(IERC20.approve.selector, address(uniswapV2Router), amountIn),
            abi.encode(true)
        );

        vm.mockCall(
            address(uniswapV3Router),
            abi.encodeWithSelector(
                ISwapRouter.exactInputSingle.selector,
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenInAddress,
                    tokenOut: tokenOutAddress,
                    fee: poolFee,
                    recipient: recipient,
                    deadline: block.timestamp + 300,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                })
            ),
            abi.encode(300e18)
        );

        uint256 amountOutV3 = SwapHelpers.swap(
            uniswapV3Router, uniswapV2Router, poolFee, tokenInAddress, tokenOutAddress, amountIn, recipient
        );

        assertEq(amountOutV3, 300e18, "Incorrect output amount for V3 path");

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = 250e18;

        vm.mockCall(
            address(uniswapV2Router),
            abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
            abi.encode(amounts)
        );

        uint256 amountOutV2 =
            SwapHelpers.swap(uniswapV3Router, uniswapV2Router, 0, tokenInAddress, tokenOutAddress, amountIn, recipient);

        assertEq(amountOutV2, 250e18, "Incorrect output amount for V2 path");
    }
}
