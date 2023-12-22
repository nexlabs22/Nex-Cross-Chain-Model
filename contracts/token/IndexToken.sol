// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./TokenInterface.sol";
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
contract IndexToken is
    ContextUpgradeable,
    ERC20Upgradeable,
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{

    uint256 public fee;
    
    uint256 internal constant SCALAR = 1e20;

    // Inflation rate (per day) on total supply, to be accrued to the feeReceiver.
    uint256 public feeRatePerDayScaled;

    // Most recent timestamp when fee was accured.
    uint256 public feeTimestamp;

    // Address that can claim fees accrued.
    address public feeReceiver;

    // Address that can publish a new methodology.
    address public methodologist;

    // Address that has privilege to mint and burn. It will be Controller and Admin to begin.
    address public minter;

    string public methodology;

    uint256 public supplyCeiling;

    mapping(address => bool) public isRestricted;

    

    
    

    mapping(address => uint) public tokenMarketShare;
    mapping(address => uint) public tokenSwapVersion;

    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);

    modifier onlyMethodologist() {
        require(msg.sender == methodologist, "IndexToken: caller is not the methodologist");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "IndexToken: caller is not the minter");
        _;
    }

    
    function initialize(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _feeRatePerDayScaled,
        address _feeReceiver,
        uint256 _supplyCeiling,
        //addresses
        address _weth,
        address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        address _factoryV2
    ) external initializer {
        require(_feeReceiver != address(0));

        __Ownable_init();
        __Pausable_init();
        __ERC20_init(tokenName, tokenSymbol);
        __Context_init();

        feeRatePerDayScaled = _feeRatePerDayScaled;
        feeReceiver = _feeReceiver;
        supplyCeiling = _supplyCeiling;
        feeTimestamp = block.timestamp;
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



    /// @notice External mint function
    /// @dev Mint function can only be called externally by the controller
    /// @param to address
    /// @param amount uint256
    function _mintTo(address to, uint256 amount) internal whenNotPaused {
        require(totalSupply() + amount <= supplyCeiling, "will exceed supply ceiling");
        require(!isRestricted[to], "to is restricted");
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        _mintToFeeReceiver();
        _mint(to, amount);
    }

    
    /// @notice External mint function
    /// @dev Mint function can only be called externally by the controller
    /// @param to address
    /// @param amount uint256
    function mint(address to, uint256 amount) public whenNotPaused onlyMinter {
        require(totalSupply() + amount <= supplyCeiling, "will exceed supply ceiling");
        require(!isRestricted[to], "to is restricted");
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        _mintToFeeReceiver();
        _mint(to, amount);
    }

    /// @notice External burn function
    /// @dev burn function can only be called externally by the controller
    /// @param from address
    /// @param amount uint256
    function _burnTo(address from, uint256 amount) internal whenNotPaused {
        require(!isRestricted[from], "from is restricted");
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        _mintToFeeReceiver();
        _burn(from, amount);
    }


    /// @notice External burn function
    /// @dev burn function can only be called externally by the controller
    /// @param from address
    /// @param amount uint256
    function burn(address from, uint256 amount) public whenNotPaused onlyMinter {
        require(!isRestricted[from], "from is restricted");
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        _mintToFeeReceiver();
        _burn(from, amount);
    }

    function _mintToFeeReceiver() internal {
        // total number of days elapsed
        uint256 _days = (block.timestamp - feeTimestamp) / 1 days;

        if (_days >= 1) {
            uint256 initial = totalSupply();
            uint256 supply = initial;
            uint256 _feeRate = feeRatePerDayScaled;

            for (uint256 i; i < _days; ) {
                supply += ((supply * _feeRate) / SCALAR);
                unchecked {
                    ++i;
                }
            }
            uint256 amount = supply - initial;
            feeTimestamp += 1 days * _days;
            _mint(feeReceiver, amount);

            emit MintFeeToReceiver(feeReceiver, block.timestamp, totalSupply(), amount);
        }
    }

    /// @notice Expands supply and mints fees to fee reciever
    /// @dev Can only be called by the owner externally,
    /// @dev _mintToFeeReciver is the internal function and is called after each supply/rate change
    function mintToFeeReceiver() external onlyOwner {
        _mintToFeeReceiver();
    }

    
    /// @notice Only owner function for setting the methodologist
    /// @param _methodologist address
    function setMethodologist(address _methodologist) external onlyOwner {
        require(_methodologist != address(0));
        methodologist = _methodologist;
        emit MethodologistSet(_methodologist);
    }

    /// @notice Callable only by the methodoligst to store on chain data about the underlying weight of the token
    /// @param _methodology string
    function setMethodology(string memory _methodology) external onlyMethodologist {
        methodology = _methodology;
        emit MethodologySet(_methodology);
    }

    /// @notice Ownable function to set the fee rate
    /// @dev Given the annual fee rate this function sets and calculates the rate per second
    /// @param _feeRatePerDayScaled uint256
    function setFeeRate(uint256 _feeRatePerDayScaled) external onlyOwner {
        _mintToFeeReceiver();
        feeRatePerDayScaled = _feeRatePerDayScaled;
        emit FeeRateSet(_feeRatePerDayScaled);
    }

    /// @notice Ownable function to set the receiver
    /// @param _feeReceiver address
    function setFeeReceiver(address _feeReceiver) external onlyOwner {
        require(_feeReceiver != address(0));
        feeReceiver = _feeReceiver;
        emit FeeReceiverSet(_feeReceiver);
    }

    /// @notice Ownable function to set the contract that controls minting
    /// @param _minter address
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0));
        minter = _minter;
        emit MinterSet(_minter);
    }

    /// @notice Ownable function to set the limit at which the total supply cannot exceed
    /// @param _supplyCeiling uint256
    function setSupplyCeiling(uint256 _supplyCeiling) external onlyOwner {
        supplyCeiling = _supplyCeiling;
        emit SupplyCeilingSet(_supplyCeiling);
    }

    
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    
    /// @notice Compliance feature to blacklist bad actors
    /// @dev Negates current restriction state
    /// @param who address
    function toggleRestriction(address who) external onlyOwner {
        isRestricted[who] = !isRestricted[who];
        emit ToggledRestricted(who, isRestricted[who]);
    }

    
    /// @notice Overriden ERC20 transfer to include restriction
    /// @param to address
    /// @param amount uint256
    /// @return bool
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        require(!isRestricted[to], "to is restricted");

        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Overriden ERC20 transferFrom to include restriction
    /// @param from address
    /// @param to address
    /// @param amount uint256
    /// @return bool
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        require(!isRestricted[msg.sender], "msg.sender is restricted");
        require(!isRestricted[to], "to is restricted");
        require(!isRestricted[from], "from is restricted");

        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function approveSwapToken(address _token, address _to, uint _amount) public onlyMinter {
        IERC20(_token).approve(_to, _amount);
    }

    function swapSingle(address tokenIn, address tokenOut, uint amountIn, address _recipient, uint _swapVersion) public onlyMinter returns(uint){
        
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