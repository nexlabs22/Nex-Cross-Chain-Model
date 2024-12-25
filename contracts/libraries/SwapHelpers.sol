// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IUniswapV2Router02} from "../interfaces/IUniswapV2Router02.sol";

library SwapHelpers {
    function swapVersion3(
        ISwapRouter uniswapRouter,
        uint24 poolFee,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address recipient
    ) internal returns (uint256 amountOut) {
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: recipient,
            deadline: block.timestamp + 300,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        amountOut = uniswapRouter.exactInputSingle(params);
    }

    function swapTokensV2(
        IUniswapV2Router02 uniswapRouter,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address recipient
    ) internal returns (uint256 amountOut) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint256[] memory v2AmountOut = uniswapRouter.getAmountsOut(amountIn, path);
        IERC20(tokenIn).approve(address(uniswapRouter), amountIn);
        uniswapRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn, //amountIn
            0, //amountOutMin
            path, //path
            recipient, //to
            block.timestamp //deadline
        );
        amountOut = v2AmountOut[1];
    }

    function swap(
        ISwapRouter uniswapRouter,
        IUniswapV2Router02 uniswapRouterV2,
        uint24 poolFee,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        address recipient
    ) internal returns (uint256 amountOut) {
        if (poolFee > 0) {
            amountOut = swapVersion3(uniswapRouter, poolFee, tokenIn, tokenOut, amountIn, recipient);
        } else {
            amountOut = swapTokensV2(uniswapRouterV2, tokenIn, tokenOut, amountIn, recipient);
        }
    }
}
