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
import "../ccip/CCIPReceiver.sol";
import "./Vault.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../factory/IPriceOracle.sol";
import "../libraries/SwapHelpers.sol";
import "../libraries/PathHelpers.sol";
import "../interfaces/IWETH.sol";
import "../libraries/MessageSender.sol";
import "./CrossChainIndexFactoryStorage.sol";

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
        IWETH weth;
        Vault vault;
    }

    //nonce
    struct TokenOldAndNewValues {
        uint oldTokenValue;
        uint newTokenValue;
    }
    
    CrossChainIndexFactoryStorage public factoryStorage;
    
    event Issuanced(bytes32 indexed messageId, uint indexed nonce, uint time);
    event Redemption(bytes32 indexed messageId, uint indexed nonce, uint time);
    event MessageSent(bytes32 messageId);


    function initialize(
       address _crossChainFactoryStorage,
       address _router,
       address _chainlinkToken
    ) external initializer {
        require(
            _crossChainFactoryStorage != address(0),
            "CrossChainFactoryStorage address cannot be zero address"
        );
        factoryStorage = CrossChainIndexFactoryStorage(_crossChainFactoryStorage);
        CCIPReceiver(_router);
        __Ownable_init();
        __Pausable_init();
       
        IERC20(_chainlinkToken).approve(
            _router,
            type(uint256).max
        );
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

    function vault() public view returns (Vault) {
        return factoryStorage.vault();
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

    function setCrossChainIndexFactoryStorage(address _crossChainFactoryStorage)
        external
        onlyOwner
    {
        require(
            _crossChainFactoryStorage != address(0),
            "CrossChainFactoryStorage address cannot be zero address"
        );
        factoryStorage = CrossChainIndexFactoryStorage(_crossChainFactoryStorage);
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
        outputAmount = SwapHelpers.swap(
            factoryStorage.swapRouterV3(),
            factoryStorage.swapRouterV2(),
            path,
            fees,
            amountIn,
            _recipient
        );
    }

    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        MessageSender.PayFeesIn payFeesIn
    ) internal returns (bytes32) {
        bytes32 messageId = MessageSender.sendToken(
            factoryStorage.i_router(),
            factoryStorage.i_link(),
            factoryStorage.MAX_TOKENS_LENGTH(),
            destinationChainSelector,
            _data,
            receiver,
            tokensToSendDetails,
            payFeesIn
        );
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
        require(
            factoryStorage.verifiedFactory(sender, sourceChainSelector),
            "sender to the cross chain is not verified"
        );
        (
            uint actionType,
            address[] memory targetAddresses,
            address[] memory targetAddresses2,
            bytes[] memory targetPaths,
            bytes[] memory targetPaths2,
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
        Vault vault;
        IWETH weth;
    }

    function _handleIssuance(
        Client.EVMTokenAmount[] memory tokenAmounts,
        address[] memory targetAddresses,
        bytes[] memory targetPaths,
        uint nonce,
        uint64 sourceChainSelector,
        address sender,
        uint[] memory percentages,
        uint[] memory extraValues
    ) private {
        HandleIssuanceLocalVars memory vars;
        vars.vault = vault();
        vars.weth = weth();

        vars.wethAmount = swap(
            toETHPath(tokenAmounts[0].token),
            toETHFees(tokenAmounts[0].token),
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
            if (targetAddresses[i] == address(vars.weth)) {
                oldTokenValue = IERC20(targetAddresses[i]).balanceOf(
                    address(vars.vault)
                );
                vars.weth.transfer(address(vars.vault), wethToSwap);
            } else {
                oldTokenValue = factoryStorage.getTokenCurrentValue(targetAddresses[i], fromETHPath, fromETHFees);
                swap(
                    fromETHPath,
                    fromETHFees,
                    wethToSwap,
                    address(vars.vault)
                );
            }
            // uint newTokenValue = oldTokenValue + wethToSwap;
            uint newTokenValue = factoryStorage.getTokenCurrentValue(targetAddresses[i], fromETHPath, fromETHFees);
            
            vars.oldTokenValues[i] = factoryStorage.convertEthToUsd(oldTokenValue);
            vars.newTokenValues[i] = factoryStorage.convertEthToUsd(newTokenValue);
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
            MessageSender.PayFeesIn.LINK
        );
        // issuanceMessageIdByNonce[nonce] = messageId;
        factoryStorage.setIssuanceMessageIdByNonce(nonce, messageId);
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
        uint[] memory newTokenValues = new uint[](1);
        for (uint i = 0; i < targetAddresses.length; i++) {
            uint swapAmount = (extraValues[0] *
                IERC20(address(targetAddresses[i])).balanceOf(address(vault()))) /
                1e18;
            (address[] memory fromETHPath0, uint24[] memory fromETHFees0) = PathHelpers.decodePathBytes(
                targetPaths[i]
            );
            if (address(targetAddresses[i]) == address(weth())) {
                vault().withdrawFunds(address(weth()), address(this), swapAmount);
                wethSwapAmountOut += swapAmount;
            } else {
                vault().withdrawFunds(
                    address(targetAddresses[i]),
                    address(this),
                    swapAmount
                );
                wethSwapAmountOut += swap(
                    PathHelpers.reverseAddressArray(fromETHPath0), // toETHPath
                    PathHelpers.reverseUint24Array(fromETHFees0), // toETHFees
                    swapAmount,
                    address(this)
                );
            }
            newTokenValues[0] += factoryStorage.getTokenCurrentValue(targetAddresses[i], fromETHPath0, fromETHFees0);
            
        }
        uint crossChainTokenAmount = swap(
            fromETHPath(factoryStorage.crossChainToken(sourceChainSelector)),
            fromETHFees(factoryStorage.crossChainToken(sourceChainSelector)),
            wethSwapAmountOut,
            address(this)
        );
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = factoryStorage.crossChainToken(sourceChainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;
        uint[] memory zeroArr = new uint[](0);
        bytes memory data = abi.encode(
            1,
            targetAddresses,
            new address[](0),
            new bytes[](0),
            new bytes[](0),
            nonce,
            newTokenValues,
            zeroArr
        );
        bytes32 messageId = sendToken(
            sourceChainSelector,
            data,
            sender,
            tokensToSendArray,
            MessageSender.PayFeesIn.LINK
        );
        // redemptionMessageIdByNonce[nonce] = messageId;
        factoryStorage.setRedemptionMessageIdByNonce(nonce, messageId);
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
            if (targetAddresses[i] == address(weth())) {
                tokenValueArr[i] = factoryStorage.convertEthToUsd(
                    IERC20(targetAddresses[i]).balanceOf(address(vault()))
                );
            } else {
                uint tokenValue = factoryStorage.getAmountOut(
                    PathHelpers.reverseAddressArray(fromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(fromETHFees), // toETHFees
                    IERC20(targetAddresses[i]).balanceOf(address(vault()))
                );
                tokenValueArr[i] = factoryStorage.convertEthToUsd(tokenValue);
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
        sendMessage(sourceChainSelector, sender, data, MessageSender.PayFeesIn.LINK);
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
        data.weth = weth();
        data.vault = vault();

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
            fromETHPath(factoryStorage.crossChainToken(inputData.sourceChainSelector)),
            fromETHFees(factoryStorage.crossChainToken(inputData.sourceChainSelector)),
            extraWethAmount,
            address(this)
        );
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = factoryStorage.crossChainToken(inputData.sourceChainSelector);
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
            MessageSender.PayFeesIn.LINK
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
        Vault vault,
        IWETH weth
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
        Vault vault,
        IWETH weth
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
        vars.initialWethBalance = weth().balanceOf(address(data.vault));
        
        
        vars.swapWethAmount = _swapToETHFirstReweightAction(
            vars.initialWethBalance,
            currentTokens,
            currentTargetPaths,
            data.vault,
            weth()
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
            vault(),
            weth()
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
            toETHPath(inputData.tokenAddress),
            toETHFees(inputData.tokenAddress),
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
            inputData.extraData,
            weth(),
            vault()
        );

        uint[] memory zeroUintArr = new uint[](0);
        address[] memory zeroAddArr = new address[](0);
        
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
        sendMessage(
            inputData.sourceChainSelector,
            inputData.sender,
            data,
            MessageSender.PayFeesIn.LINK
        );

    }

    struct SwapSecondReweightActionVars {
        uint chainSelectorTotalShares;
        uint chainSelectorCurrentTokensCount;
        uint initialWethBalance;
        uint swapWethAmount;
        uint wethAmountToSwap;
        uint chainSelectorOracleTokensCount;
        IWETH weth;
        Vault vault;
    }

    function swapSecondReweightAction(
        address[] memory currentTokens,
        address[] memory oracleTokens,
        bytes[] memory currentTargetPaths,
        bytes[] memory oracleTargetPaths,
        uint[] memory oracleTokenShares,
        uint crossChainWethAmount,
        uint[] memory extraData,
        IWETH weth,
        Vault vault
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
        MessageSender.PayFeesIn payFeesIn
    ) public returns (bytes32) {
        
        // Validate input parameters
        require(destinationChainSelector > 0, "Invalid destination chain selector");
        require(receiver != address(0), "Invalid receiver address");
        require(_data.length > 0, "Data cannot be empty");
        
        return MessageSender.sendMessage(
                factoryStorage.i_router(),
                factoryStorage.i_link(),
                destinationChainSelector,
                receiver,
                _data,
                payFeesIn
            );
    }

}
