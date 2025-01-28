// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "../ccip/CCIPReceiver.sol";
import "./IndexFactoryStorage.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libraries/SwapHelpers.sol";
import "../interfaces/IWETH.sol";
import "../libraries/MessageSender.sol";


/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactoryBalancer is Initializable, CCIPReceiver, ProposableOwnableUpgradeable {
    using MessageSender for *;
    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public factoryStorage;
    address public i_link;
    uint16 public i_maxTokensLength;

    uint64 public currentChainSelector;

    IWETH public weth;

    //nonce
    struct TokenOldAndNewValues {
        uint oldTokenValue;
        uint newTokenValue;
    }

    struct LowSwapVariables {
        address tokenAddress;
        uint tokenMarketShare;
        uint chainValue;
        uint swapWethAmount;
        uint wethAmount;
    }

    struct ExtraSwapVariables {
        address tokenAddress;
        uint tokenMarketShare;
        uint chainValue;
        uint swapWethAmount;
    }

    uint public updatePortfolioNonce;

    mapping(uint => uint) public portfolioTotalValueByNonce;
    mapping(uint => uint) public extraWethByNonce;
    mapping(uint => uint) public updatedTokensValueCount;
    mapping(uint => mapping(address => uint)) public tokenValueByNonce;
    mapping(uint => mapping(uint64 => uint)) public chainValueByNonce;

    mapping(uint => uint) public reweightWethValueByNonce;
    mapping(uint => uint) public reweightTokensCount;
    mapping(uint => uint) public reweightExtraPercentage;

    mapping(uint => address) public redemptionNonceOutputToken;
    mapping(uint => uint) public redemptionNonceOutputTokenSwapFee;

    event MessageSent(bytes32 messageId);

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address _factoryStorage,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_factoryStorage != address(0), "Invalid factory storage address");
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");
        __ccipReceiver_init(_router);
        __Ownable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        factoryStorage = IndexFactoryStorage(_factoryStorage);
        //set ccip addresses
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        IERC20(_chainlinkToken).approve(
            i_router,
            type(uint256).max
        );
        //set addresses
        weth = IWETH(_weth);
    }

    /**
     * @dev Sets the IndexFactoryStorage contract address.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     */
    function setIndexFactoryStorage(
        address _factoryStorage
    ) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    /**
     * @dev Returns the cross-chain factory address for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The address of the cross-chain factory.
     */
    function crossChainFactoryBySelector(
        uint64 _chainSelector
    ) public view returns (address) {
        return factoryStorage.crossChainFactoryBySelector(_chainSelector);
    }

    /**
     * @dev Returns the cross-chain token address for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The address of the cross-chain token.
     */
    function crossChainToken(
        uint64 _chainSelector
    ) public view returns (address) {
        return factoryStorage.crossChainToken(_chainSelector);
    }

    /**
     * @dev Returns the price in Wei.
     * @return The price in Wei.
     */
    function priceInWei() public view returns (uint256) {
        return factoryStorage.priceInWei();
    }

    /**
     * @dev Converts ETH amount to USD.
     * @param _ethAmount The amount of ETH.
     * @return The equivalent amount in USD.
     */
    function convertEthToUsd(uint _ethAmount) public view returns (uint256) {
        return _ethAmount * priceInWei() / 1e18;
    }

    

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    

    /**
     * @dev Swaps tokens.
     * @param path The path of the swap.
     * @param fees The fees of the swap.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn,
        address _recipient
    ) public returns (uint outputAmount) {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(
            swapRouterV3,
            swapRouterV2,
            path,
            fees,
            amountIn,
            _recipient
        );
    }

    /**
     * @dev Returns the amount out for a given swap.
     * @param path The path of the swap.
     * @param fees The fees of the swap.
     * @param amountIn The amount of input token.
     * @return finalAmountOut The amount of output token.
     */
    function getAmountOut(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint finalAmountOut) {
        finalAmountOut = factoryStorage.getAmountOut(
            path,
            fees,
            amountIn
        );
    }

    /**
     * @dev Returns the portfolio balance.
     * @return The total portfolio balance.
     */
    function getPortfolioBalance() public view returns (uint) {
        uint totalValue;
        uint totalCurrentList = factoryStorage.totalCurrentList();
        Vault vault = factoryStorage.vault();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = factoryStorage.currentList(i);
            uint64 tokenChainSelector = factoryStorage.tokenChainSelector(
                tokenAddress
            );
            if (tokenChainSelector == currentChainSelector) {
                (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                    tokenAddress
                );
                uint value = factoryStorage.getAmountOut(
                    toETHPath,
                    toETHFees,
                    IERC20(tokenAddress).balanceOf(address(vault))
                );
                totalValue += value;
            }
        }
        return totalValue;
    }


    /**
     * @dev Sends tokens to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param _data The data to send.
     * @param receiver The address of the receiver.
     * @param tokensToSendDetails The details of the tokens to send.
     * @param payFeesIn The fee payment method.
     */
    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        PayFeesIn payFeesIn
    ) internal {
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

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);
    }

    /**
     * @dev Sends a message to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param receiver The address of the receiver.
     * @param _data The data to send.
     * @param payFeesIn The fee payment method.
     */
    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        MessageSender.PayFeesIn payFeesIn
    ) public returns(bytes32) {
        // Validate input parameters
        require(destinationChainSelector > 0, "Invalid destination chain selector");
        require(receiver != address(0), "Invalid receiver address");
        require(_data.length > 0, "Data cannot be empty");
        return MessageSender.sendMessage(
            i_router,
            i_link,
            destinationChainSelector,
            receiver,
            _data,
            payFeesIn
        );
    }
    
    /**
     * @dev Handles received messages.
     * @param any2EvmMessage The received message.
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        (
            uint actionType,
            address[] memory tokenAddresses,
            address[] memory tokenAddresses2,
            bytes[] memory tokenPaths,
            bytes[] memory tokenPaths2,
            uint nonce,
            uint[] memory value1,
            uint[] memory value2
        ) = abi.decode(
                any2EvmMessage.data,
                (uint, address[], address[], bytes[], bytes[], uint, uint[], uint[])
            ); // abi-decoding of the sent string message
        if (actionType == 0) {} else if (actionType == 1) {} else if (
            actionType == 2
        ) {
            for(uint i = 0; i < value1.length; i++){
                portfolioTotalValueByNonce[nonce] += value1[i];
                tokenValueByNonce[nonce][tokenAddresses[i]] += value1[i];
                chainValueByNonce[nonce][sourceChainSelector] += value1[i];
                updatedTokensValueCount[nonce] += 1;
            }
        } else if (actionType == 3) {
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
                .destTokenAmounts;
            address token = tokenAmounts[0].token;
            uint256 amount = tokenAmounts[0].amount;
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                token
            );
            uint wethAmount = swap(
                toETHPath,
                toETHFees,
                amount,
                address(this)
            );
            extraWethByNonce[nonce] += wethAmount;
        }else if(actionType == 4){
            // factoryStorage.updateCurrentList();
        }
    }

    function _checkValuesCurrentChain(
        uint64 chainSelector,
        uint chainSelectorTokensCount
    ) internal {
        address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        Vault vault = factoryStorage.vault();
        for (uint j = 0; j < chainSelectorTokensCount; j++) {
            address tokenAddress = tokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                tokenAddress
            );
            uint value;
            if(tokenAddress == address(weth)){
                value = IERC20(tokenAddress).balanceOf(address(vault));
            }else{
            value = getAmountOut(
                toETHPath,
                toETHFees,
                IERC20(tokenAddress).balanceOf(address(vault))
            );
            }
            portfolioTotalValueByNonce[updatePortfolioNonce] += convertEthToUsd(value);
            tokenValueByNonce[updatePortfolioNonce][
                tokenAddress
            ] += convertEthToUsd(value);
            updatedTokensValueCount[updatePortfolioNonce] += 1;
            chainValueByNonce[updatePortfolioNonce][
                currentChainSelector
            ] += convertEthToUsd(value);
        }
    }

    function _checkValuesOtherChains(
        uint64 chainSelector
    ) internal {
        address crossChainIndexFactory = crossChainFactoryBySelector(
                    chainSelector
                );

        address[] memory tokenAddresses = factoryStorage
            .allCurrentChainSelectorTokens(chainSelector);
        address[] memory zeroAddresses = new address[](0);

        uint[] memory zeroArray = new uint[](0);

        bytes memory data = abi.encode(
            2,
            tokenAddresses,
            zeroAddresses,
            factoryStorage.getFromETHPathBytesForTokens(
                tokenAddresses
            ),
            new bytes[](0),
            updatePortfolioNonce,
            zeroArray,
            zeroArray
        );
        sendMessage(
            chainSelector,
            crossChainIndexFactory,
            data,
            MessageSender.PayFeesIn.LINK
        );
    }

    /**
     * @dev Requests values for the portfolio.
     */
    function askValues() public onlyOwner {
        updatePortfolioNonce += 1;

        uint totalChains = factoryStorage.currentChainSelectorsCount();
        uint latestCount = factoryStorage.currentFilledCount();

        for (uint i = 0; i < totalChains; i++) {
            (,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
            uint64 chainSelector = chainSelectors[i];
            uint chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _checkValuesCurrentChain(chainSelector, chainSelectorTokensCount);
            } else {
                _checkValuesOtherChains(chainSelector);
            }
        }
    }

    /**
     * @dev Performs the first reweight action.
     */
    function firstReweightAction() public onlyOwner {
        uint nonce = updatePortfolioNonce;
        uint portfolioValue = portfolioTotalValueByNonce[nonce];

        uint totalChains = factoryStorage.currentChainSelectorsCount();
        uint latestCurrentCount = factoryStorage.currentFilledCount();
        uint latestOracleCount = factoryStorage.oracleFilledCount();

        (,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCurrentCount);
        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            
            uint chainSelectorCurrentTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            uint chainSelectorOracleTokensCount = factoryStorage.oracleChainSelectorTokensCount(chainSelector);
            uint currentChainSelectorTotalShares = factoryStorage.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint oracleChainSelectorTotalShares = factoryStorage.getOracleChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint chainValue = chainValueByNonce[nonce][chainSelector];
            uint[] memory oracleTokenShares = factoryStorage.allOracleChainSelectorTokenShares(chainSelector);

            if (
                (chainValue * 100e18) / portfolioValue >
                oracleChainSelectorTotalShares
            ) {
                if (chainSelector == currentChainSelector) {
                    _swapExtraValueCurrentChain(
                        i,
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorCurrentTokensCount,
                        chainSelectorOracleTokensCount,
                        currentChainSelectorTotalShares,
                        oracleChainSelectorTotalShares
                    );
                } else {
                    _sendExtraValueOtherChains(
                        nonce,
                        portfolioValue,
                        chainSelector,
                        oracleChainSelectorTotalShares,
                        chainValue,
                        oracleTokenShares
                    );
                    
                }
            }
        
        }
    }

    function _swapTokensToWETHFirstRebalance(
        uint64 chainSelector,
        uint portfolioValue,
        uint chainSelectorCurrentTokensCount,
        uint currentChainSelectorTotalShares,
        uint oracleChainSelectorTotalShares,
        Vault vault,
        uint chainValue,
        uint initialWethBalance
    ) internal returns(uint chainCurrentRealShare, uint wethAmountToSwap, uint extraWethAmount) {
        uint swapWethAmount;
        // address[] memory oracleTokens = factoryStorage.allOracleChainSelectorTokens(chainSelector);
        address[] memory currentTokens = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        for (uint j = 0; j < currentTokens.length; j++) {
            ExtraSwapVariables memory swapVars;
            swapVars.tokenAddress = currentTokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                swapVars.tokenAddress
            );
            uint wethAmount;
            if(swapVars.tokenAddress == address(weth)){
                vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
                wethAmount = initialWethBalance;
            }else{
            uint tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
            vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
            wethAmount = swap(
                toETHPath,
                toETHFees,
                tokenAmount,
                address(this)
            );
            }
            swapWethAmount += wethAmount;
        }

        chainCurrentRealShare = (chainValue * 100e18) /
            portfolioValue;
        wethAmountToSwap = (swapWethAmount *
            oracleChainSelectorTotalShares) / chainCurrentRealShare;
        extraWethAmount = swapWethAmount - wethAmountToSwap;
    }


    function _internalSwapsWETHToTokensForFirstRebalance(
        address _newTokenAddress,
        uint _wethAmountToSwap,
        uint _newTokenMarketShare,
        uint _oracleChainSelectorTotalShares,
        Vault _vault
    ) internal returns(uint) {
        uint wethAmount;
        if(_newTokenAddress == address(weth)){
            wethAmount = (_wethAmountToSwap * _newTokenMarketShare) /
                    _oracleChainSelectorTotalShares;
            weth.transfer(address(_vault), wethAmount);
            }else{
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = factoryStorage.getFromETHPathData(
                _newTokenAddress
            );
            wethAmount = swap(
                fromETHPath,
                fromETHFees,
                (_wethAmountToSwap * _newTokenMarketShare) /
                    _oracleChainSelectorTotalShares,
                address(_vault)
            );
            }
        return wethAmount;
    }

    function _swapWETHToTokensForFirstRebalance(
        uint64 chainSelector,
        uint wethAmountToSwap,
        uint chainSelectorOracleTokensCount,
        uint currentChainSelectorTotalShares,
        uint oracleChainSelectorTotalShares,
        Vault vault
    ) internal {
        address[] memory oracleTokens = factoryStorage.allOracleChainSelectorTokens(chainSelector);
        for (uint k = 0; k < oracleTokens.length; k++) {
            address newTokenAddress = oracleTokens[k];
            
            uint newTokenMarketShare = factoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            
            uint wethAmount = _internalSwapsWETHToTokensForFirstRebalance(
                newTokenAddress,
                wethAmountToSwap,
                newTokenMarketShare,
                oracleChainSelectorTotalShares,
                vault
            );
        }
    }

    /**
     * @dev Swaps extra value on the current chain.
     * @param i The index.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param chainSelectorCurrentTokensCount The number of current tokens in the chain selector.
     * @param chainSelectorOracleTokensCount The number of oracle tokens in the chain selector.
     * @param currentChainSelectorTotalShares The total shares in the chain selector.
     */
    function _swapExtraValueCurrentChain(
        uint i,
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorCurrentTokensCount,
        uint chainSelectorOracleTokensCount,
        uint currentChainSelectorTotalShares,
        uint oracleChainSelectorTotalShares
    ) internal {
        ExtraSwapVariables memory swapVars;
        Vault vault = factoryStorage.vault();
        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        uint initialWethBalance = weth.balanceOf(address(vault));
        (uint chainCurrentRealShare, uint wethAmountToSwap, uint extraWethAmount) = _swapTokensToWETHFirstRebalance(
            chainSelector,
            portfolioValue,
            chainSelectorCurrentTokensCount,
            currentChainSelectorTotalShares,
            oracleChainSelectorTotalShares,
            vault,
            swapVars.chainValue,
            initialWethBalance
        );
        
        _swapWETHToTokensForFirstRebalance(
            chainSelector,
            wethAmountToSwap,
            chainSelectorOracleTokensCount,
            currentChainSelectorTotalShares,
            oracleChainSelectorTotalShares,
            vault
        );
        
        extraWethByNonce[nonce] += extraWethAmount;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare -
            oracleChainSelectorTotalShares);
    }

    function _sendExtraValueMessage(
        uint _nonce,
        address[] memory _currentTokenAddresses,
        address[] memory _newTokenAddresses,
        uint64 _chainSelector,
        uint[] memory _oracleTokenShares,
        uint[] memory _extraData,
        address _crossChainIndexFactory
    ) internal {
        // bytes memory data;
        bytes memory data = _encodeSendExtraValue(
            _nonce,
            _currentTokenAddresses,
            _newTokenAddresses,
            factoryStorage.getFromETHPathBytesForTokens(
                _currentTokenAddresses
            ),
            factoryStorage.getFromETHPathBytesForTokens(
                _newTokenAddresses
            ),
            _oracleTokenShares,
            _extraData
        );
        
        sendMessage(
            _chainSelector,
            _crossChainIndexFactory,
            data,
            MessageSender.PayFeesIn.LINK
        );
    }

    function _encodeSendExtraValue(
        uint _nonce,
        address[] memory _currentTokenAddresses,
        address[] memory _newTokenAddresses,
        bytes[] memory _currentTokenPaths,
        bytes[] memory _newTokenPaths,
        uint[] memory _oracleTokenShares,
        uint[] memory _extraData
    ) internal pure returns(bytes memory) {
        return abi.encode(
            3,
            _currentTokenAddresses,
            _newTokenAddresses,
            _currentTokenPaths,
            _newTokenPaths,
            _nonce,
            _oracleTokenShares,
            _extraData
        );
    }
    /**
     * @dev Sends extra value to other chains.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param oracleChainSelectorTotalShares The total shares in the chain selector.
     * @param chainValue The chain value.
     * @param oracleTokenShares The oracle token shares.
     */
    function _sendExtraValueOtherChains(
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint oracleChainSelectorTotalShares,
        uint chainValue,
        uint[] memory oracleTokenShares
    ) internal {
        uint chainCurrentRealShare = (chainValue * 100e18) /
                        portfolioValue;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare -
            oracleChainSelectorTotalShares);

        address crossChainIndexFactory = crossChainFactoryBySelector(
                chainSelector
            );

        address[] memory currentTokenAddresses = factoryStorage
            .allCurrentChainSelectorTokens(chainSelector);
        address[] memory newTokenAddresses = factoryStorage
            .allOracleChainSelectorTokens(chainSelector);

        
        uint[] memory extraData = new uint[](3);
        extraData[0] = portfolioValue;
        extraData[1] = oracleChainSelectorTotalShares;
        extraData[2] = chainValue;

        _sendExtraValueMessage(
            nonce,
            currentTokenAddresses,
            newTokenAddresses,
            chainSelector,
            oracleTokenShares,
            extraData,
            crossChainIndexFactory
        );
        
    }

    /**
     * @dev Performs the second reweight action.
     */
    function secondReweightAction() public onlyOwner {
        uint nonce = updatePortfolioNonce;
        uint portfolioValue = portfolioTotalValueByNonce[nonce];

        uint totalChains = factoryStorage.oracleChainSelectorsCount();
        uint latestOracleCount = factoryStorage.oracleFilledCount();
        
        uint totalCurrentChains = factoryStorage.currentChainSelectorsCount();
        uint latestCurrentCount = factoryStorage.currentFilledCount();

        for (uint i = 0; i < totalChains; i++) {
            (,, uint64[] memory chainSelectors) = factoryStorage.getOracleData(latestOracleCount);
            // (,, , uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCurrentCount);
            uint64 chainSelector = chainSelectors[i];
            
            uint chainSelectorCurrentTokensCount = factoryStorage
                .currentChainSelectorTokensCount(chainSelector);
            uint chainSelectorOracleTokensCount = factoryStorage
                .oracleChainSelectorTokensCount(chainSelector);
            // uint chainSelectorTotalShares = factoryStorage.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint oracleChainSelectorTotalShares = factoryStorage.getOracleChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint chainValue = chainValueByNonce[nonce][chainSelector];
            uint[] memory oracleTokenShares = factoryStorage
                .allOracleChainSelectorTokenShares(chainSelector);

            if (
                (chainValue * 100e18) / portfolioValue <
                oracleChainSelectorTotalShares
            ) {
                if (chainSelector == currentChainSelector) {
                    _swapLowerValueCurrentChain(
                        i,
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorCurrentTokensCount,
                        chainSelectorOracleTokensCount,
                        oracleChainSelectorTotalShares
                    );
                } else {
                    _sendLowerValueOtherChain(
                        nonce,
                        portfolioValue,
                        chainSelector,
                        oracleChainSelectorTotalShares,
                        chainValue,
                        oracleTokenShares
                    );
                }
            }
        }
    }

    function _swapLowerValueCurrentChainToWETH(
        Vault vault,
        uint64 chainSelector,
        uint chainSelectorTokensCount,
        uint portfolioValue,
        uint chainValue
    ) internal returns(uint swapWethAmount){
        LowSwapVariables memory swapVars;
        Vault vault = factoryStorage.vault();
        uint initialWethBalance = weth.balanceOf(address(vault));
        address[] memory currentTokens = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        for (uint j = 0; j < currentTokens.length; j++) {
            swapVars.tokenAddress = currentTokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                swapVars.tokenAddress
            );
            
            if(swapVars.tokenAddress == address(weth)){
                vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
                swapVars.wethAmount = initialWethBalance;
            }else{
            uint tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
            vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
            swapVars.wethAmount = swap(
                toETHPath,
                toETHFees,
                tokenAmount,
                address(this)
            );
            }
            swapVars.swapWethAmount += swapVars.wethAmount;
        }
        swapWethAmount = swapVars.swapWethAmount;
    }

    function _swapLowerValueCurrentChainFromWETH(
        Vault vault,
        uint64 chainSelector,
        uint swapWethAmount,
        uint oracleChainSelectorTotalShares
    ) internal {
        LowSwapVariables memory swapVars;
        swapVars.swapWethAmount = swapWethAmount;
        address[] memory oracleTokens = factoryStorage.allOracleChainSelectorTokens(chainSelector);
        for (uint k = 0; k < oracleTokens.length; k++) {
            address newTokenAddress = oracleTokens[k];
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = factoryStorage.getFromETHPathData(
                newTokenAddress
            );
            
            uint newTokenMarketShare = factoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            if(newTokenAddress == address(weth)){
                swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / oracleChainSelectorTotalShares;
                weth.transfer(address(vault), swapVars.wethAmount);
            }else{
            swapVars.wethAmount = swap(
                fromETHPath,
                fromETHFees,
                (swapVars.swapWethAmount * newTokenMarketShare) /
                    oracleChainSelectorTotalShares,
                address(vault)
            );
            }
        }
    }
    /**
     * @dev Swaps lower value on the current chain.
     * @param i The index.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param chainSelectorCurrentTokensCount The number of current tokens in the chain selector.
     * @param chainSelectorOracleTokensCount The number of oracle tokens in the chain selector.
     * @param oracleChainSelectorTotalShares The total shares in the chain selector.
     */
    function _swapLowerValueCurrentChain(
        uint i,
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorCurrentTokensCount,
        uint chainSelectorOracleTokensCount,
        uint oracleChainSelectorTotalShares
    ) internal {
        Vault vault = factoryStorage.vault();
        LowSwapVariables memory swapVars;
        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        
        swapVars.swapWethAmount = _swapLowerValueCurrentChainToWETH(
            vault,
            chainSelector,
            chainSelectorCurrentTokensCount,
            portfolioValue,
            swapVars.chainValue
        );
        uint chainCurrentRealShare = (swapVars.chainValue * 100e18) /
            portfolioValue;
        uint negativePercentage = oracleChainSelectorTotalShares -
            chainCurrentRealShare;
        uint extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) /
            reweightExtraPercentage[nonce];
        swapVars.swapWethAmount += extraWethAmount;
        
        _swapLowerValueCurrentChainFromWETH(
            vault,
            chainSelector,
            swapVars.swapWethAmount,
            oracleChainSelectorTotalShares
        );
    }

    struct SendLowerValueOtherChainVars {
        address[] currentTokenAddresses;
        address[] newTokenAddresses;
        uint[] extraData;
    }

    function _swapLowerValueToCrossChainToken(
        uint64 _chainSelector,
        uint _extraWethAmount
    ) internal returns(uint crossChainTokenAmount) {
        (address[] memory fromETHPath, uint24[] memory fromETHFees) = factoryStorage.getFromETHPathData(
            crossChainToken(_chainSelector)
        );
        crossChainTokenAmount = swap(
            fromETHPath,
            fromETHFees,
            _extraWethAmount,
            address(this)
        );
    }
    function _encodeLowerValueMessage(
        uint64 _chainSelector,
        uint _crossChainTokenAmount,
        uint _updatePortfolioNonce,
        uint[] memory _oracleTokenShares,
        uint[] memory _extraData
    ) internal returns(bytes memory) {

        address[] memory currentTokenAddresses = factoryStorage
            .allCurrentChainSelectorTokens(_chainSelector);
        address[] memory newTokenAddresses = factoryStorage
            .allOracleChainSelectorTokens(_chainSelector);

        
        return abi.encode(
            4,
            currentTokenAddresses,
            newTokenAddresses,
            factoryStorage.getFromETHPathBytesForTokens(
                currentTokenAddresses
            ),
            factoryStorage.getFromETHPathBytesForTokens(
                newTokenAddresses
            ),
            _updatePortfolioNonce,
            _oracleTokenShares,
            _extraData
        );
    }
    function _sendLowerValueTokensAndMessage(
        uint64 _chainSelector,
        uint _crossChainTokenAmount,
        bytes memory _data
    ) internal {
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken(_chainSelector);
        tokensToSendArray[0].amount = _crossChainTokenAmount;

        address crossChainIndexFactory = crossChainFactoryBySelector(
            _chainSelector
        );
        
        sendToken(
            _chainSelector,
            _data,
            crossChainIndexFactory,
            tokensToSendArray,
            PayFeesIn.LINK
        );
    }

    function _calculateExtraAmountForLowerValue(
        uint _nonce,
        uint _portfolioValue,
        uint _chainValue,
        uint _oracleChainSelectorTotalShares
    ) internal returns(uint) {
        uint chainCurrentRealShare = (_chainValue * 100e18) / _portfolioValue;
        uint negativePercentage = _oracleChainSelectorTotalShares -
            chainCurrentRealShare;
        uint extraWethAmount = (extraWethByNonce[_nonce] * negativePercentage) /
            reweightExtraPercentage[_nonce];

        return extraWethAmount;
    }
    /**
     * @dev Sends lower value to other chains.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param oracleChainSelectorTotalShares The total shares in the chain selector.
     * @param chainValue The chain value.
     * @param oracleTokenShares The oracle token shares.
     */
    function _sendLowerValueOtherChain(
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint oracleChainSelectorTotalShares,
        uint chainValue,
        uint[] memory oracleTokenShares
    ) internal {
        
        uint extraWethAmount = _calculateExtraAmountForLowerValue(
            nonce,
            portfolioValue,
            chainValue,
            oracleChainSelectorTotalShares
        );

        
        uint crossChainTokenAmount = _swapLowerValueToCrossChainToken(
            chainSelector,
            extraWethAmount
        );

        
        uint[] memory extraData = new uint[](2);
        extraData[0] = portfolioValue;
        extraData[1] = oracleChainSelectorTotalShares;

        bytes memory data = _encodeLowerValueMessage(
            chainSelector,
            crossChainTokenAmount,
            nonce,
            oracleTokenShares,
            extraData
        );
        _sendLowerValueTokensAndMessage(
            chainSelector,
            crossChainTokenAmount,
            data
        );
        
    }
}
