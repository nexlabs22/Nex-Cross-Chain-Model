// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface IPriceOracle {

    /**
     * @notice Estimates the amount of tokenOut that would be received for a given amount of tokenIn.
     * @param factoryAddress The address of the factory contract.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token to be exchanged.
     * @return amountOut The estimated amount of output token that would be received.
     */
    function estimateAmountOut(
        address factoryAddress,
        address tokenIn,
        address tokenOut,
        uint128 amountIn
    ) external view returns (uint amountOut);

}

