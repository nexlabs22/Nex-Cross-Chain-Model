// SPDX-License-Identifier: GPL-2.0-or-later
// pragma solidity ^0.7.6;
pragma solidity ^0.8.7;
// pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/external/IWETH9.sol";
import "../interfaces/IWETH.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestSwap {
    
    receive() external payable{}

    // NOTE: Does not work with SwapRouter02
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    
    ERC20 public dai = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    IWETH public weth = IWETH(WETH9);
    
    function deposit(uint amount) public {
        // weth.deposit{value: msg.value}();
        dai.transferFrom(msg.sender, address(this), amount);
        dai.approve(address(swapRouter), amount);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
        .ExactInputSingleParams({
            tokenIn: DAI,
            tokenOut: WETH9,
            // pool fee 0.3%
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: amount,
            amountOutMinimum: 0,
            // NOTE: In production, this value can be used to set the limit
            // for the price the swap will push the pool to,
            // which can help protect against price impact
            sqrtPriceLimitX96: 0
        });

        swapRouter.exactInputSingle(params);
    }
}