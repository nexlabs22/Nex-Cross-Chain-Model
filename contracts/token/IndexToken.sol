// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./TokenInterface.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexToken is
    Initializable,
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
    // address public minter;
    mapping(address => bool) public isMinter;

    string public methodology;

    uint256 public supplyCeiling;

    mapping(address => bool) public isRestricted;

    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event MinterRemoved(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);

    modifier onlyMethodologist() {
        require(msg.sender == methodologist, "IndexToken: caller is not the methodologist");
        _;
    }

    modifier onlyMinter() {
        // require(msg.sender == minter, "IndexToken: caller is not the minter");
        require(isMinter[msg.sender], "IndexToken: caller is not the minter");
        _;
    }

    function initialize(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _feeRatePerDayScaled,
        address _feeReceiver,
        uint256 _supplyCeiling
    ) external initializer {
        // Validate input parameters
        require(bytes(tokenName).length > 0, "Token name cannot be empty");
        require(bytes(tokenSymbol).length > 0, "Token symbol cannot be empty");
        require(_feeRatePerDayScaled > 0, "Fee rate must be greater than zero");
        require(_feeReceiver != address(0), "Invalid fee receiver address");
        require(_supplyCeiling > 0, "Supply ceiling must be greater than zero");

        __Ownable_init();
        __Pausable_init();
        __ERC20_init(tokenName, tokenSymbol);
        __Context_init();

        feeRatePerDayScaled = _feeRatePerDayScaled;
        feeReceiver = _feeReceiver;
        supplyCeiling = _supplyCeiling;
        feeTimestamp = block.timestamp;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // Function to withdraw Ether from the contract
    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");

        (bool success,) = payable(owner()).call{value: balance}("");
        require(success, "Ether transfer failed");
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
        // Validate input parameters
        require(from != address(0), "Invalid from address");
        require(amount > 0, "Amount must be greater than zero");
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
        // Validate input parameters
        require(from != address(0), "Invalid from address");
        require(amount > 0, "Amount must be greater than zero");

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

            // for (uint256 i; i < _days;) {
            //     supply += ((supply * _feeRate) / SCALAR);
            //     unchecked {
            //         ++i;
            //     }
            // }
            
            // Use a logarithmic approximation for compounding
            uint256 compoundedFeeRate = SCALAR + (_feeRate * _days);
            // Calculate the compounded supply
            supply = (supply * compoundedFeeRate) / SCALAR;

            uint256 amount = supply - initial;
            feeTimestamp += 1 days * _days;

            require(
                totalSupply() + amount <= supplyCeiling,
                "will exceed supply ceiling"
            );

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
        // Validate input parameters
        require(bytes(_methodology).length > 0, "Methodology cannot be empty");
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
    function setMinter(address _minter, bool _enabled) external onlyOwner {
        require(_minter != address(0));
        isMinter[_minter] = _enabled;
        if (_enabled) {
            emit MinterSet(_minter);
        } else {
            emit MinterRemoved(_minter);
        }
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
        // Validate input parameters
        require(to != address(0), "Invalid to address");
        require(amount > 0, "Amount must be greater than zero");

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
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        // Validate input parameters
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");
        require(amount > 0, "Amount must be greater than zero");

        require(!isRestricted[msg.sender], "msg.sender is restricted");
        require(!isRestricted[to], "to is restricted");
        require(!isRestricted[from], "from is restricted");

        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }
}
