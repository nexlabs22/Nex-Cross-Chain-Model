pragma solidity ^0.8.20;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

contract CalculateOutputAmount {
    uint24 public constant UNISWAP_POOL_FEE = 3000;

    ISwapRouter public immutable swapRouter;
    IQuoter public immutable quoter;
    IUniswapV3Factory public immutable factory;

    constructor(
        ISwapRouter _swapRouter,
        IQuoter _quoter,
        IUniswapV3Factory _factory
    ) {
        swapRouter = _swapRouter;
        quoter = _quoter;
        factory = _factory;
    }

    function calculateOutputAmount(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public returns (uint256 amountOut) {
        address poolAddress = factory.getPool(tokenIn, tokenOut, UNISWAP_POOL_FEE);
        require(poolAddress != address(0), "Pool does not exist");

        amountOut = quoter.quoteExactInputSingle(
            tokenIn,
            tokenOut,
            UNISWAP_POOL_FEE,
            amountIn,
            0
        );
    }

    function calculateInputAmount(
        address tokenIn,
        address tokenOut,
        uint256 amountOut
    ) public returns (uint256 amountIn) {
        address poolAddress = factory.getPool(tokenIn, tokenOut, UNISWAP_POOL_FEE);
        require(poolAddress != address(0), "Pool does not exist");

        amountIn = quoter.quoteExactOutputSingle(
            tokenIn,
            tokenOut,
            UNISWAP_POOL_FEE,
            amountOut,
            0
        );
    }

    function calculatePriceImpact(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public returns (uint256 priceImpact) {
        address poolAddress = factory.getPool(tokenIn, tokenOut, UNISWAP_POOL_FEE);
        require(poolAddress != address(0), "Pool does not exist");

        (uint160 sqrtPriceX96,,,,,,) = IUniswapV3Pool(poolAddress).slot0();
        uint256 priceBefore = uint256(sqrtPriceX96) ** 2 / (2 ** 192);

        uint256 amountOut = quoter.quoteExactInputSingle(
            tokenIn,
            tokenOut,
            UNISWAP_POOL_FEE,
            amountIn,
            0
        );

        uint256 priceAfter = (amountIn * 1e18) / amountOut;
        priceImpact = ((priceAfter - priceBefore) * 1e18) / priceBefore;
    }

    function calculateSlippage(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 expectedAmountOut
    ) public returns (uint256 slippage) {
        uint256 actualAmountOut = calculateOutputAmount(tokenIn, tokenOut, amountIn);
        slippage = ((expectedAmountOut - actualAmountOut) * 1e18) / expectedAmountOut;
    }
}
