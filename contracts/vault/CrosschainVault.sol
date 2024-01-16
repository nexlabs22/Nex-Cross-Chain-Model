// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
// import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "../libraries/OracleLibrary.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IUniswapV2Factory.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CrossChainVault is
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{

    

    // Address that has privilege to mint and burn. It will be Controller and Admin to begin.
    address public indexFactory;

    

    
    mapping(address => uint) public tokenMarketShare;
    mapping(address => uint) public tokenSwapVersion;

    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    event IndexFactorySet(address indexed indexFactory);
   
   
    modifier onlyIndexFactory() {
        require(msg.sender == indexFactory, "IndexToken: caller is not the factory contract");
        _;
    }

    
    function initialize(
        address _indexFactory,
        //addresses
        address _weth,
        address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        address _factoryV2
    ) external initializer {

        __Ownable_init();
        __Pausable_init();

        indexFactory = _indexFactory;
        //set addresses
        weth = IWETH(_weth);
        quoter = IQuoter(_quoter);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        factoryV2 = IUniswapV2Factory(_factoryV2);
    }


   /**
    * @dev The contract's fallback function that does not allow direct payments to the contract.
    * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
    */
    receive() external payable {
        // revert DoNotSendFundsDirectlyToTheContract();
    }



    

    /// @notice Ownable function to set the contract that controls swap
    /// @param _factory address
    function setFactory(address _factory) external onlyOwner {
        require(_factory != address(0));
        indexFactory = _factory;
        emit IndexFactorySet(_factory);
    }
    

    
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    
    

    function approveSwapToken(address _token, address _to, uint _amount) public onlyIndexFactory {
        IERC20(_token).approve(_to, _amount);
    }

    function swapSingle(address tokenIn, address tokenOut, uint amountIn, address _recipient, uint _swapVersion) public onlyIndexFactory returns(uint){
        
            if(_swapVersion == 3){
                IERC20(tokenIn).approve(address(swapRouterV3), amountIn);
                ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    // pool fee 0.3%
                    fee: 3000,
                    recipient: _recipient,
                    deadline: block.timestamp,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    // NOTE: In production, this value can be used to set the limit
                    // for the price the swap will push the pool to,
                    // which can help protect against price impact
                    sqrtPriceLimitX96: 0
                });
                uint finalAmountOut = swapRouterV3.exactInputSingle(params);
                return finalAmountOut;
            } else{
                address[] memory path = new address[](2);
                path[0] = tokenIn;
                path[1] = tokenOut;

                IERC20(tokenIn).approve(address(swapRouterV2), amountIn);
                swapRouterV2.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    amountIn, //amountIn
                    0, //amountOutMin
                    path, //path
                    _recipient, //to
                    block.timestamp //deadline
                );
                return 0;
            }
    }

    
}