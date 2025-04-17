// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../libraries/OracleLibrary.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "./CCIPReceiver.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libraries/SwapHelpers.sol";
import "../libraries/PathHelpers.sol";
import "../interfaces/IWETH.sol";
import "../libraries/MessageSender.sol";
import "../vault/CrossChainIndexFactoryStorage.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CrossChainFeeReceiver is
    Initializable,
    CCIPReceiver,
    ContextUpgradeable,
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{
    mapping(address => bool) public isOperator;

    CrossChainIndexFactoryStorage public factoryStorage;

    event FeeReceived(
        uint256 amount
    );


    modifier onlyOwnerOrOperator() {
        require(
            msg.sender == owner() || isOperator[msg.sender],
            "Not authorized"
        );
        _;
    }

    function initialize(
        address _crossChainFactoryStorage,
        address _router,
        address _chainlinkToken
    ) external initializer {
        require(
            _crossChainFactoryStorage != address(0),
            "CrossChainFactoryStorage address cannot be zero address"
        );
        require(_router != address(0), "Router address cannot be zero address");
        require(
            _chainlinkToken != address(0),
            "Chainlink token address cannot be zero address"
        );

        factoryStorage = CrossChainIndexFactoryStorage(
            _crossChainFactoryStorage
        );
        __ccipReceiver_init(_router);
        __Ownable_init();
        __Pausable_init();

        IERC20(_chainlinkToken).approve(_router, type(uint256).max);
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function withdrawLink() external onlyOwner {
        IERC20(factoryStorage.i_link()).transfer(
            msg.sender,
            IERC20(factoryStorage.i_link()).balanceOf(address(this))
        );
    }

    /**
     * @dev The contract's fallback function that does not allow direct payments to the contract.
     * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
     */
    receive() external payable {}

    function withdrawEther() external onlyOwnerOrOperator {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Ether transfer failed");
    }

    function weth() public view returns (IWETH) {
        return factoryStorage.weth();
    }

    function fromETHPath(address token) public view returns (address[] memory) {
        return factoryStorage.getAllFromETHPath(token);
    }

    function fromETHFees(address token) public view returns (uint24[] memory) {
        return factoryStorage.getAllFromETHFees(token);
    }

    function toETHPath(address token) public view returns (address[] memory) {
        return factoryStorage.getAllToETHPath(token);
    }

    function toETHFees(address token) public view returns (uint24[] memory) {
        return factoryStorage.getAllToETHFees(token);
    }

    function setCrossChainIndexFactoryStorage(
        address _crossChainFactoryStorage
    ) external onlyOwnerOrOperator {
        require(
            _crossChainFactoryStorage != address(0),
            "CrossChainFactoryStorage address cannot be zero address"
        );
        factoryStorage = CrossChainIndexFactoryStorage(
            _crossChainFactoryStorage
        );
    }

    function swap(
        address[] memory path,
        uint24[] memory fees,
        uint256 amountIn,
        address _recipient
    ) public returns (uint256 outputAmount) {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        uint256 amountOutMinimum = factoryStorage.getMinAmountOut(
            path,
            fees,
            amountIn
        );
        outputAmount = SwapHelpers.swap(
            factoryStorage.swapRouterV3(),
            factoryStorage.swapRouterV2(),
            path,
            fees,
            amountIn,
            amountOutMinimum,
            _recipient
        );
    }
    uint public calledCount;
    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        calledCount += 1;
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
            .destTokenAmounts;
        if (any2EvmMessage.destTokenAmounts.length > 0) {
        _handleReceivedAmounts(tokenAmounts);
        }
    }

    function _handleReceivedAmounts(
        Client.EVMTokenAmount[] memory tokenAmounts
    ) private {
        calledCount += 1;
        IWETH weth = weth();

        uint wethAmount = swap(
            toETHPath(tokenAmounts[0].token),
            toETHFees(tokenAmounts[0].token),
            tokenAmounts[0].amount,
            address(this)
        );
        weth.withdraw(wethAmount);

        (bool success, ) = payable(factoryStorage.crossChainFactory()).call{
            value: wethAmount
        }("");
        require(success, "Ether transfer failed");
        emit FeeReceived(
            wethAmount
        );
    }
}
