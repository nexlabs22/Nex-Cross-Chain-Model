// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// import "../libraries/OracleLibrary.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "../ccip/CCIPReceiver.sol";
import "./Vault.sol";
// import {Withdraw} from "./utils/Withdraw.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../factory/IPriceOracle.sol";
import "../libraries/SwapHelpers.sol";
import "../libraries/PathHelpers.sol";
import "../interfaces/IWETH.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CrossChainIndexFactory is
    Initializable,
    CCIPReceiver,
    ContextUpgradeable,
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{
    enum PayFeesIn {
        Native,
        LINK
    }

    struct Message {
        uint64 sourceChainSelector; // The chain selector of the source chain.
        address sender; // The address of the sender.
        string message; // The content of the message.
        address token; // received token.
        uint256 amount; // received amount.
    }

    struct ReweightActionData {
        uint chainSelectorCurrentTokensCount;
        uint portfolioValue;
        uint chainSelectorTotalShares;
        uint swapWethAmount;
        uint chainValue;
    }

    // address public i_router;
    address public i_link;
    uint16 public i_maxTokensLength;
    mapping(bytes32 => Message) public messageDetail; // Mapping from message ID to Message struct, storing details of each received message.

    // IndexToken public indexToken;
    Vault public vault;

    uint64 public currentChainSelector;

    address public priceOracle;
    

    
    AggregatorV3Interface public toUsdPriceFeed;

    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    // IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    // address public crossChainToken;
    mapping(uint64 => address) public crossChainToken;

    mapping(address => address[]) public fromETHPath;
    mapping(address => address[]) public toETHPath;
    mapping(address => uint24[]) public fromETHFees;
    mapping(address => uint24[]) public toETHFees;

    //nonce
    struct TokenOldAndNewValues {
        uint oldTokenValue;
        uint newTokenValue;
    }
    
    
    event Issuanced(bytes32 indexed messageId, uint indexed nonce, uint time);
    event Redemption(bytes32 indexed messageId, uint indexed nonce, uint time);
    event MessageSent(bytes32 messageId);

    mapping(uint => bytes32) public redemptionMessageIdByNonce;
    mapping(uint => bytes32) public issuanceMessageIdByNonce;

    function initialize(
        uint64 _currentChainSelector,
        address payable _vault,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth,
        // address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        // address _factoryV2,
        address _toUsdPriceFeed
    ) external initializer {
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_vault != address(0), "Invalid vault address");
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");
        require(_swapRouterV3 != address(0), "Invalid swap router v3 address");
        require(_factoryV3 != address(0), "Invalid factory v3 address");
        require(_swapRouterV2 != address(0), "Invalid swap router v2 address");
        // require(_factoryV2 != address(0), "Invalid factory v2 address");
        require(_toUsdPriceFeed != address(0), "Invalid price feed address");
        CCIPReceiver(_router);
        __Ownable_init();
        __Pausable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        vault = Vault(_vault);
        //set oracle data
        // setChainlinkToken(_chainlinkToken);

        //set ccip addresses
        i_router = _router;
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        IERC20(_chainlinkToken).approve(
            i_router,
            type(uint256).max
        );

        //set addresses
        weth = IWETH(_weth);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        // factoryV2 = IUniswapV2Factory(_factoryV2);
        //oracle
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPriceFeed);
    }

    function _toWei(
        int256 _amount,
        uint8 _amountDecimals,
        uint8 _chainDecimals
    ) private pure returns (int256) {
        if (_chainDecimals > _amountDecimals)
            return _amount * int256(10 ** (_chainDecimals - _amountDecimals));
        else return _amount * int256(10 ** (_amountDecimals - _chainDecimals));
    }

    function priceInWei() public view returns (uint256) {
        (, int price, , , ) = toUsdPriceFeed.latestRoundData();
        uint8 priceFeedDecimals = toUsdPriceFeed.decimals();
        price = _toWei(price, priceFeedDecimals, 18);
        return uint256(price);
    }

    function convertEthToUsd(uint _ethAmount) public view returns (uint256) {
        return (_ethAmount * priceInWei()) / 1e18;
    }

    function setPriceOracle(address _priceOracle) external onlyOwner {
        require(
            _priceOracle != address(0),
            "Price oracle address cannot be zero address"
        );
        priceOracle = _priceOracle;
    }

    function setCcipRouter(address _router) public onlyOwner {
        i_router = _router;
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
        toETHPath[_crossChainToken] = PathHelpers.reverseAddressArray(
            _fromETHPath
        );
        toETHFees[_crossChainToken] = PathHelpers.reverseUint24Array(
            _fromETHFees
        );

    }

    function setVault(address payable _vault) public onlyOwner {
        vault = Vault(_vault);
    }

    /**
     * @dev The contract's fallback function that does not allow direct payments to the contract.
     * @notice Prevents users from sending ether directly to the contract by reverting the transaction.
     */
    receive() external payable {
        // revert DoNotSendFundsDirectlyToTheContract();
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function swap(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn,
        address _recipient
    ) public returns (uint outputAmount) {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        // ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        // IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(
            swapRouterV3,
            swapRouterV2,
            path,
            fees,
            amountIn,
            _recipient
        );
    }

    function getAmountOut(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint finalAmountOut) {
        if (amountIn > 0) {
            if (fees.length > 0) {
                finalAmountOut = estimateAmountOutWithPath(
                    path,
                    fees,
                    amountIn
                );
            } else {
                uint[] memory v2amountOut = swapRouterV2.getAmountsOut(
                    amountIn,
                    path
                );
                finalAmountOut = v2amountOut[v2amountOut.length - 1];
            }
        }
    }

    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint24 fee
    ) public view returns (uint amountOut) {
        amountOut = IPriceOracle(priceOracle).estimateAmountOut(
            address(factoryV3),
            tokenIn,
            tokenOut,
            amountIn,
            fee
        );
    }

    function estimateAmountOutWithPath(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint amountOut) {
        uint lastAmount = amountIn;
        for(uint i = 0; i < path.length - 1; i++) {
            lastAmount = IPriceOracle(priceOracle).estimateAmountOut(
                address(factoryV3),
                path[i],
                path[i+1],
                uint128(lastAmount),
                fees[i]
            );
        }
        amountOut = lastAmount;
    }

    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        PayFeesIn payFeesIn
    ) internal returns (bytes32) {
        uint256 length = tokensToSendDetails.length;
        require(
            length <= i_maxTokensLength,
            "Maximum 5 different tokens can be sent per CCIP Message"
        );

        for (uint256 i = 0; i < length; ) {
            if (tokensToSendDetails[i].token != i_link) {
                IERC20(tokensToSendDetails[i].token).approve(
                    i_router,
                    tokensToSendDetails[i].amount
                );
            }
            unchecked {
                ++i;
            }
        }

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: _data,
            tokenAmounts: tokensToSendDetails,
            // extraArgs: "",
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 900_000}) // Additional arguments, setting gas limit and non-strict sequency mode
            ),
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 ccipFee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            // LinkTokenInterface(i_link).approve(i_router, ccipFee);
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: ccipFee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);

        return messageId;
    }



    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        // bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address

        (
            uint actionType,
            address[] memory targetAddresses,
            address[] memory targetAddresses2,
            bytes[] memory targetPaths,
            bytes[] memory targetPaths2,
            // uint[] memory targetFees,
            // uint[] memory targetFees2,
            uint nonce,
            uint[] memory percentages,
            uint[] memory extraValues
        ) = abi.decode(
                any2EvmMessage.data,
                (
                    uint,
                    address[],
                    address[],
                    bytes[],
                    bytes[],
                    uint,
                    uint[],
                    uint[]
                )
            ); // abi-decoding of the sent string message
        
        if (actionType == 0) {
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
                .destTokenAmounts;
            _handleIssuance(
                tokenAmounts,
                targetAddresses,
                targetPaths,
                // targetFees,
                nonce,
                sourceChainSelector,
                sender,
                percentages,
                extraValues
            );
        } else if (actionType == 1) {
            _handleRedemption(
                targetAddresses,
                targetPaths,
                nonce,
                sourceChainSelector,
                sender,
                extraValues
            );
        } else if (actionType == 2) {
            _handleAskValues(
                targetAddresses,
                targetPaths,
                // targetFees,
                nonce,
                sourceChainSelector,
                sender
            );
        } else if (actionType == 3) {
            //first reweight action
            _handleFirstReweightAction(
                HandleFirstReweightActionInputs(
                    targetAddresses,
                    targetAddresses2,
                    targetPaths,
                    targetPaths2,
                    // targetFees,
                    // targetFees2,
                    percentages,
                    sourceChainSelector,
                    sender,
                    nonce,
                    extraValues
                )
            );
        } else if (actionType == 4) {
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
                .destTokenAmounts;

            _handleSecondReweightAction(
                HandleSecondReweightActionInputs(
                    targetAddresses,
                    targetAddresses2,
                    targetPaths,
                    targetPaths2,
                    // targetFees,
                    // targetFees2,
                    percentages,
                    tokenAmounts[0].token,
                    tokenAmounts[0].amount,
                    sourceChainSelector,
                    sender,
                    nonce,
                    extraValues
                )
            );
        }
    }

    struct HandleIssuanceLocalVars {
        uint wethAmount;
        uint[] oldTokenValues;
        uint[] newTokenValues;
        bytes data;
    }

    function _handleIssuance(
        Client.EVMTokenAmount[] memory tokenAmounts,
        address[] memory targetAddresses,
        bytes[] memory targetPaths,
        // uint[] memory targetFees,
        uint nonce,
        uint64 sourceChainSelector,
        address sender,
        uint[] memory percentages,
        uint[] memory extraValues
    ) private {
        HandleIssuanceLocalVars memory vars;

        vars.wethAmount = swap(
            toETHPath[tokenAmounts[0].token],
            toETHFees[tokenAmounts[0].token],
            tokenAmounts[0].amount,
            address(this)
        );
        vars.oldTokenValues = new uint[](targetAddresses.length);
        vars.newTokenValues = new uint[](targetAddresses.length);
        for (uint i = 0; i < targetAddresses.length; i++) {
            uint wethToSwap = (vars.wethAmount * percentages[i]) /
                extraValues[0];
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = PathHelpers.decodePathBytes(
                targetPaths[i]
            );
            uint oldTokenValue;
            if (targetAddresses[i] == address(weth)) {
                oldTokenValue = IERC20(targetAddresses[i]).balanceOf(
                    address(vault)
                );
                weth.transfer(address(vault), wethToSwap);
            } else {
                oldTokenValue = getAmountOut(
                    PathHelpers.reverseAddressArray(fromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(fromETHFees), // toETHFees
                    IERC20(targetAddresses[i]).balanceOf(address(vault))
                );
                swap(
                    fromETHPath,
                    fromETHFees,
                    wethToSwap,
                    address(vault)
                );
            }
            uint newTokenValue = oldTokenValue + wethToSwap;
            vars.oldTokenValues[i] = convertEthToUsd(oldTokenValue);
            vars.newTokenValues[i] = convertEthToUsd(newTokenValue);
        }

        vars.data = abi.encode(
            0,
            targetAddresses,
            new address[](0),
            new bytes[](0),
            new bytes[](0),
            nonce,
            vars.oldTokenValues,
            vars.newTokenValues
        );
        bytes32 messageId = sendMessage(
            sourceChainSelector,
            address(sender),
            vars.data,
            PayFeesIn.LINK
        );
        issuanceMessageIdByNonce[nonce] = messageId;
        emit Issuanced(messageId, nonce, block.timestamp);
    }

    function _handleRedemption(
        address[] memory targetAddresses,
        bytes[] memory targetPaths,
        uint nonce,
        uint64 sourceChainSelector,
        address sender,
        uint[] memory extraValues
    ) private {
        uint wethSwapAmountOut;
        for (uint i = 0; i < targetAddresses.length; i++) {
            uint swapAmount = (extraValues[0] *
                IERC20(address(targetAddresses[i])).balanceOf(address(vault))) /
                1e18;
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = PathHelpers.decodePathBytes(
                targetPaths[i]
            );
            if (address(targetAddresses[i]) == address(weth)) {
                vault.withdrawFunds(address(weth), address(this), swapAmount);
                wethSwapAmountOut += swapAmount;
            } else {
                vault.withdrawFunds(
                    address(targetAddresses[i]),
                    address(this),
                    swapAmount
                );
                wethSwapAmountOut += swap(
                    PathHelpers.reverseAddressArray(fromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(fromETHFees), // toETHFees
                    swapAmount,
                    address(this)
                );
            }
        }
        uint crossChainTokenAmount = swap(
            fromETHPath[crossChainToken[sourceChainSelector]],
            fromETHFees[crossChainToken[sourceChainSelector]],
            wethSwapAmountOut,
            address(this)
        );
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken[sourceChainSelector];
        tokensToSendArray[0].amount = crossChainTokenAmount;
        uint[] memory zeroArr = new uint[](0);
        bytes memory data = abi.encode(
            1,
            targetAddresses,
            new address[](0),
            new bytes[](0),
            new bytes[](0),
            nonce,
            zeroArr,
            zeroArr
        );
        bytes32 messageId = sendToken(
            sourceChainSelector,
            data,
            sender,
            tokensToSendArray,
            PayFeesIn.LINK
        );
        redemptionMessageIdByNonce[nonce] = messageId;
        emit Redemption(messageId, nonce, block.timestamp);
    }

    function _handleAskValues(
        address[] memory targetAddresses,
        bytes[] memory targetPaths,
        uint nonce,
        uint64 sourceChainSelector,
        address sender
    ) internal {
        uint[] memory zeroArr = new uint[](0);
        uint[] memory tokenValueArr = new uint[](targetAddresses.length);
        for (uint i = 0; i < targetAddresses.length; i++) {
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = PathHelpers.decodePathBytes(
                targetPaths[i]
            );
            if (targetAddresses[i] == address(weth)) {
                tokenValueArr[i] = convertEthToUsd(
                    IERC20(targetAddresses[i]).balanceOf(address(vault))
                );
            } else {
                uint tokenValue = getAmountOut(
                    PathHelpers.reverseAddressArray(fromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(fromETHFees), // toETHFees
                    IERC20(targetAddresses[i]).balanceOf(address(vault))
                );
                tokenValueArr[i] = convertEthToUsd(tokenValue);
            }
        }
        bytes memory data = abi.encode(
            2,
            targetAddresses,
            new address[](0),
            new bytes[](0),
            new bytes[](0),
            nonce,
            tokenValueArr,
            zeroArr
        );
        sendMessage(sourceChainSelector, sender, data, PayFeesIn.LINK);
    }

    struct HandleFirstReweightActionInputs {
        address[] currentTokens;
        address[] oracleTokens;
        bytes[] currentTargetPaths;
        bytes[] oracleTargetPaths;
        uint[] oracleTokenShares;
        uint64 sourceChainSelector;
        address sender;
        uint nonce;
        uint[] extraData;
    }
    function _handleFirstReweightAction(
        HandleFirstReweightActionInputs memory inputData
    ) private {
        ReweightActionData memory data;
        data.chainSelectorCurrentTokensCount = inputData.currentTokens.length;
        data.portfolioValue = inputData.extraData[0];
        data.chainSelectorTotalShares = inputData.extraData[1];
        data.chainValue = inputData.extraData[2];

        uint extraWethAmount = swapFirstReweightAction(
            data,
            inputData.currentTokens,
            inputData.oracleTokens,
            inputData.currentTargetPaths,
            inputData.oracleTargetPaths,
            inputData.oracleTokenShares,
            inputData.sender,
            inputData.nonce
        );

        uint crossChainTokenAmount = swap(
            fromETHPath[crossChainToken[inputData.sourceChainSelector]],
            fromETHFees[crossChainToken[inputData.sourceChainSelector]],
            extraWethAmount,
            address(this)
        );
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken[inputData.sourceChainSelector];
        tokensToSendArray[0].amount = crossChainTokenAmount;
        uint[] memory zeroArr = new uint[](0);
        bytes memory encodedData = abi.encode(
            3,
            inputData.currentTokens,
            inputData.oracleTokens,
            new bytes[](0),
            new bytes[](0),
            inputData.nonce,
            zeroArr,
            zeroArr
        );
        sendToken(
            inputData.sourceChainSelector,
            encodedData,
            inputData.sender,
            tokensToSendArray,
            PayFeesIn.LINK
        );
    }

    struct SwapFirstReweightActionVars {
        uint chainSelectorCurrentTokensCount;
        uint portfolioValue;
        uint chainSelectorTotalShares;
        uint swapWethAmount;
        uint chainValue;
        uint initialWethBalance;
        uint chainSelectorOracleTokensCount;
        uint chainCurrentRealShare;
        uint wethAmountToSwap;
        uint extraWethAmount;
    }

    function _swapToETHFirstReweightAction(
        uint initialWethBalance,
        address[] memory currentTokens,
        bytes[] memory currentTargetPaths,
        Vault vault
    ) internal returns (uint swapWethAmount) {
        for (uint i = 0; i < currentTokens.length; i++) {
            (address[] memory currentFromETHPath, uint24[] memory currentFromETHFees) = PathHelpers.decodePathBytes(
                currentTargetPaths[i]
            );
            uint wethAmount;
            if (currentTokens[i] == address(weth)) {
                vault.withdrawFunds(
                    address(weth),
                    address(this),
                    initialWethBalance
                );
                wethAmount = initialWethBalance;
            } else {
                uint tokenBalance = IERC20(currentTokens[i]).balanceOf(
                    address(vault)
                );
                vault.withdrawFunds(
                    currentTokens[i],
                    address(this),
                    tokenBalance
                );
                wethAmount = swap(
                    PathHelpers.reverseAddressArray(currentFromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(currentFromETHFees), // toETHFees
                    tokenBalance,
                    address(this)
                );
            }
            swapWethAmount += wethAmount;
        }
    }

    function _swapToTokensFirstReweightAction(
        uint wethAmountToSwap,
        address[] memory oracleTokens,
        bytes[] memory oracleTargetPaths,
        uint[] memory oracleTokenShares,
        uint chainSelectorTotalShares,
        Vault vault
    ) internal {
        for (uint i = 0; i < oracleTokens.length; i++) {
            (address[] memory oracleFromETHPath, uint24[] memory oracleFromETHFees) = PathHelpers.decodePathBytes(
                oracleTargetPaths[i]
            );
            if (oracleTokens[i] == address(weth)) {
                weth.transfer(
                    address(vault),
                    (wethAmountToSwap * oracleTokenShares[i]) /
                        chainSelectorTotalShares
                );
            } else {
                uint wethAmount = swap(
                    oracleFromETHPath,
                    oracleFromETHFees,
                    (wethAmountToSwap * oracleTokenShares[i]) /
                        chainSelectorTotalShares,
                    address(vault)
                );
            }
        }
    }

    function swapFirstReweightAction(
        ReweightActionData memory data,
        address[] memory currentTokens,
        address[] memory oracleTokens,
        bytes[] memory currentTargetPaths,
        bytes[] memory oracleTargetPaths,
        uint[] memory oracleTokenShares,
        address sender,
        uint nonce
    ) internal returns (uint) {
        SwapFirstReweightActionVars memory vars;
        // swapData.chainSelectorCurrentTokensCount = data.chainSelectorCurrentTokensCount;
        vars.initialWethBalance = weth.balanceOf(address(vault));
        
        
        vars.swapWethAmount = _swapToETHFirstReweightAction(
            vars.initialWethBalance,
            currentTokens,
            currentTargetPaths,
            vault
        );
        // vars.chainSelectorOracleTokensCount = oracleTokens.length;

        vars.chainCurrentRealShare =
            (data.chainValue * 100e18) /
            data.portfolioValue;
        vars.wethAmountToSwap =
            (vars.swapWethAmount * data.chainSelectorTotalShares) /
            vars.chainCurrentRealShare;
        vars.extraWethAmount = vars.swapWethAmount - vars.wethAmountToSwap;

        
        _swapToTokensFirstReweightAction(
            vars.wethAmountToSwap,
            oracleTokens,
            oracleTargetPaths,
            oracleTokenShares,
            data.chainSelectorTotalShares,
            vault
        );
        

        return vars.extraWethAmount;
    }

    struct HandleSecondReweightActionInputs {
        address[] currentTokens;
        address[] oracleTokens;
        bytes[] currentTargetPaths;
        bytes[] oracleTargetPaths;
        uint[] oracleTokenShares;
        address tokenAddress;
        uint tokenAmount;
        uint64 sourceChainSelector;
        address sender;
        uint nonce;
        uint[] extraData;
    }

    function _handleSecondReweightAction(
        HandleSecondReweightActionInputs memory inputData
    ) internal {
        uint crossChainWethAmount = swap(
            toETHPath[inputData.tokenAddress],
            toETHFees[inputData.tokenAddress],
            inputData.tokenAmount,
            address(this)
        );

        swapSecondReweightAction(
            inputData.currentTokens,
            inputData.oracleTokens,
            inputData.currentTargetPaths,
            inputData.oracleTargetPaths,
            inputData.oracleTokenShares,
            crossChainWethAmount,
            inputData.extraData
        );

        uint[] memory zeroUintArr = new uint[](1);
        address[] memory zeroAddArr = new address[](1);
        
        bytes memory data = abi.encode(
            4,
            zeroAddArr,
            zeroAddArr,
            new bytes[](0),
            new bytes[](0),
            inputData.nonce,
            zeroUintArr,
            zeroUintArr
        );
        // sendMessage(
        //     inputData.sourceChainSelector,
        //     inputData.sender,
        //     data,
        //     PayFeesIn.LINK
        // );
    }

    struct SwapSecondReweightActionVars {
        uint chainSelectorTotalShares;
        uint chainSelectorCurrentTokensCount;
        uint initialWethBalance;
        uint swapWethAmount;
        uint wethAmountToSwap;
        uint chainSelectorOracleTokensCount;
    }

    function swapSecondReweightAction(
        address[] memory currentTokens,
        address[] memory oracleTokens,
        bytes[] memory currentTargetPaths,
        bytes[] memory oracleTargetPaths,
        uint[] memory oracleTokenShares,
        uint crossChainWethAmount,
        uint[] memory extraData
    ) internal {
        
        SwapSecondReweightActionVars memory vars;
        vars.chainSelectorTotalShares = extraData[1];
        vars.chainSelectorCurrentTokensCount = currentTokens.length;
        vars.initialWethBalance = weth.balanceOf(address(vault));
        vars.swapWethAmount = 0; // Initialize swapWethAmount to 0
        for (uint i = 0; i < currentTokens.length; i++) {
            address tokenAddress = currentTokens[i];
            (address[] memory currentFromETHPath, uint24[] memory currentFromETHFees) = PathHelpers.decodePathBytes(
                currentTargetPaths[i]
            );
            uint wethAmount;
            if (tokenAddress == address(weth)) {
                vault.withdrawFunds(
                    address(weth),
                    address(this),
                    vars.initialWethBalance
                );
                wethAmount = vars.initialWethBalance;
            } else {
                uint tokenAmount = IERC20(tokenAddress).balanceOf(address(vault));
                vault.withdrawFunds(
                    tokenAddress,
                    address(this),
                    tokenAmount
                );
                wethAmount = swap(
                    PathHelpers.reverseAddressArray(currentFromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(currentFromETHFees), // toETHFees
                    tokenAmount,
                    address(this)
                );
            }
            vars.swapWethAmount += wethAmount; // Accumulate wethAmount in swapWethAmount
        }
        vars.wethAmountToSwap = crossChainWethAmount + vars.swapWethAmount;
        vars.chainSelectorOracleTokensCount = oracleTokens.length;
        for (uint i = 0; i < oracleTokens.length; i++) {
            address newTokenAddress = oracleTokens[i];
            uint newTokenMarketShare = oracleTokenShares[i];
            (address[] memory oracleFromETHPath, uint24[] memory oracleFromETHFees) = PathHelpers.decodePathBytes(
                oracleTargetPaths[i]
            );
            if (newTokenAddress == address(weth)) {
                weth.transfer(
                    address(vault),
                    (vars.wethAmountToSwap * newTokenMarketShare) /
                        vars.chainSelectorTotalShares
                );
            } else {
                uint wethAmount = swap(
                    oracleFromETHPath,
                    oracleFromETHFees,
                    (vars.wethAmountToSwap * newTokenMarketShare) /
                        vars.chainSelectorTotalShares,
                    address(vault)
                );
            }
                
            }
    }

    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        PayFeesIn payFeesIn
    ) public returns (bytes32) {
        // Validate input parameters
        require(destinationChainSelector > 0, "Invalid destination chain selector");
        require(receiver != address(0), "Invalid receiver address");
        require(_data.length > 0, "Data cannot be empty");

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: _data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            // extraArgs: "",
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 900_000}) // Additional arguments, setting gas limit and non-strict sequency mode
            ),
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 ccipFee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            // LinkTokenInterface(i_link).approve(i_router, ccipFee);
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: ccipFee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);

        return messageId;
    }


}
