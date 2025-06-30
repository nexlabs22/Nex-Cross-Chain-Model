// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "./CCIPReceiver.sol";
import "../factory/IndexFactoryStorage.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../libraries/FeeCalculation.sol";
import "../libraries/MessageSender.sol";
import "../libraries/SwapHelpers.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern

interface ICoreSender {
    function withdrawEther() external;
}

contract CrossChainFeeSender is
    Initializable,
    CCIPReceiver,
    ProposableOwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using MessageSender for *;

    IndexFactoryStorage public factoryStorage;
    uint256 public gasLimit;

    mapping(address => bool) public isOperator;

    IWETH public weth;

    // address crossChainToken;

    modifier onlyOwnerOrOperator() {
        require(msg.sender == owner() || isOperator[msg.sender], "Not authorized");
        _;
    }

    event MessageSent(bytes32 messageId);
    event FeeSent(uint64 indexed chainSelector, address indexed crossChainReceiver, uint256 amount);

    mapping(uint64 => address) public crossChainToken;
    mapping(address => address[]) public fromETHPath;
    mapping(address => address[]) public toETHPath;
    mapping(address => uint24[]) public fromETHFees;
    mapping(address => uint24[]) public toETHFees;
    /**
     * @dev Initializes the contract with the given parameters.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */

    function initialize(
        address _indexFactoryStorage,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");

        __ccipReceiver_init(_router);
        __Ownable_init();
        __ReentrancyGuard_init();
        __ReentrancyGuard_init_unchained();

        factoryStorage = IndexFactoryStorage(_indexFactoryStorage);

        IERC20(_chainlinkToken).approve(i_router, type(uint256).max);
        //set addresses
        weth = IWETH(_weth);
        gasLimit = 300000; // Default gas limit
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function setCrossChainToken(
        uint64 _chainSelector,
        address _crossChainToken,
        address[] memory _fromETHPath,
        uint24[] memory _fromETHFees
    ) public onlyOwner {
        crossChainToken[_chainSelector] = _crossChainToken;
        fromETHPath[_crossChainToken] = _fromETHPath;
        fromETHFees[_crossChainToken] = _fromETHFees;
        toETHPath[_crossChainToken] = PathHelpers.reverseAddressArray(_fromETHPath);
        toETHFees[_crossChainToken] = PathHelpers.reverseUint24Array(_fromETHFees);
    }

    // function setCrossChainTokenAddress(address _crossChainTokenAddress) public onlyOwner {
    //     require(_crossChainTokenAddress != address(0), "Invalid address");
    //     crossChainToken = _crossChainTokenAddress;
    // }

    function setWeth(address _weth) external onlyOwner {
        require(_weth != address(0), "Invalid WETH address");
        weth = IWETH(_weth);
    }

    function setGasLimit(uint256 _gasLimit) external onlyOwnerOrOperator {
        gasLimit = _gasLimit;
    }

    /**
     * @dev Sets the IndexFactoryStorage contract address.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     */
    function setIndexFactoryStorage(address _factoryStorage) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    function setOperator(address _operator, bool _isOperator) external onlyOwner {
        isOperator[_operator] = _isOperator;
    }

    function getFromETHPathData(address _tokenAddress) public view returns (address[] memory, uint24[] memory) {
        return (fromETHPath[_tokenAddress], fromETHFees[_tokenAddress]);
    }

    function getToETHPathData(address _tokenAddress) public view returns (address[] memory, uint24[] memory) {
        return (toETHPath[_tokenAddress], toETHFees[_tokenAddress]);
    }

    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {}

    function withdrawLink() external onlyOwnerOrOperator {
        IERC20(factoryStorage.linkToken()).transfer(
            msg.sender, IERC20(factoryStorage.linkToken()).balanceOf(address(this))
        );
    }

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    function withdrawEther() external onlyOwnerOrOperator {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");

        (bool success,) = payable(msg.sender).call{value: balance}("");
        require(success, "Ether transfer failed");
    }

    /**
     * @dev Swaps tokens.
     * @param path The path of the tokens.
     * @param fees The fees of the tokens.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(address[] memory path, uint24[] memory fees, uint256 amountIn, address _recipient)
        internal
        returns (uint256 outputAmount)
    {
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        uint256 amountOutMinimum = factoryStorage.getMinAmountOut(path, fees, amountIn);
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, path, fees, amountIn, amountOutMinimum, _recipient);
    }

    function withdrawAndCrossChainToken(uint64 _chainSelector, address _crossChainReceiver, uint256 _amount)
        external
        onlyOwnerOrOperator
    {
        require(_amount > 0, "Invalid amount");
        address coreSender = factoryStorage.coreSender();
        uint256 balance = address(coreSender).balance;
        require(balance > 0, "Balance is zero");
        ICoreSender(coreSender).withdrawEther();

        uint256 remainingAmount = balance - _amount;
        (bool success,) = payable(factoryStorage.balancerSender()).call{value: remainingAmount}("");
        require(success, "Ether transfer failed");

        _sendCrossChainToken(_chainSelector, _crossChainReceiver, _amount);
    }

    function _sendCrossChainToken(uint64 _chainSelector, address _crossChainReceiver, uint256 _value) internal {
        uint256 crossChainFee = calculateCrossChainFee(_chainSelector, _value, _crossChainReceiver);
        require(_value >= crossChainFee, "Insufficient fee");
        uint256 transferWethAmount = _value - crossChainFee;
        weth.deposit{value: transferWethAmount}();

        // swap to cross chain token
        (address[] memory fromETHPath, uint24[] memory fromETHFees) =
            getFromETHPathData(crossChainToken[_chainSelector]);
        uint256 crossChainTokenAmount = swap(fromETHPath, fromETHFees, transferWethAmount, address(this));

        //encode data
        bytes memory data = abi.encode("");
        // send issuance request
        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken[_chainSelector];
        tokensToSendArray[0].amount = crossChainTokenAmount;

        // send token and data
        bytes32 messageId =
            sendToken(_chainSelector, data, _crossChainReceiver, tokensToSendArray, MessageSender.PayFeesIn.Native);
        emit MessageSent(messageId);
        emit FeeSent(_chainSelector, _crossChainReceiver, transferWethAmount);
    }

    function sendCrossChainToken(uint64 _chainSelector, address _crossChainReceiver) public payable {
        _sendCrossChainToken(_chainSelector, _crossChainReceiver, msg.value);
    }

    function calculateCrossChainFee(uint64 _chainSelector, uint256 _wethAmount, address _crossChainReceiver)
        public
        view
        returns (uint256 totalFee)
    {
        (address[] memory fromETHPath, uint24[] memory fromETHFees) =
            getFromETHPathData(crossChainToken[_chainSelector]);
        uint256 crossChainTokenAmount = factoryStorage.getAmountOut(fromETHPath, fromETHFees, _wethAmount);

        // encode data
        bytes memory data = abi.encode("");

        // send issuance request
        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken[_chainSelector];
        tokensToSendArray[0].amount = crossChainTokenAmount;

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_crossChainReceiver),
            data: data,
            tokenAmounts: tokensToSendArray,
            feeToken: address(0),
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: gasLimit}))
        });

        return IRouterClient(i_router).getFee(_chainSelector, message);
    }

    /**
     * @dev Sends tokens to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param _data The data to send.
     * @param receiver The address of the receiver.
     * @param tokensToSendDetails The details of the tokens to send.
     * @param payFeesIn The fee payment method.
     * @return The message ID.
     */
    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        MessageSender.PayFeesIn payFeesIn
    ) internal nonReentrant returns (bytes32) {
        bytes32 messageId = MessageSender.sendToken(
            getRouter(),
            factoryStorage.linkToken(),
            factoryStorage.MAX_TOKENS_LENGTH(),
            destinationChainSelector,
            _data,
            receiver,
            tokensToSendDetails,
            payFeesIn,
            gasLimit
        );
        emit MessageSent(messageId);
        return messageId;
    }
}
