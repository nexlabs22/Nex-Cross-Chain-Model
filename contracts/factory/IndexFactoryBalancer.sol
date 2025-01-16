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


    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;

    IWETH public weth;

    //nonce
    struct TokenOldAndNewValues {
        uint oldTokenValue;
        uint newTokenValue;
    }

    struct LowSwapVariables {
        address tokenAddress;
        uint24 tokenSwapFee;
        uint tokenMarketShare;
        uint chainValue;
        uint swapWethAmount;
        uint wethAmount;
    }

    struct ExtraSwapVariables {
        address tokenAddress;
        uint24 tokenSwapFee;
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
        //fee
        feeRate = 10;
        latestFeeUpdate = block.timestamp;
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

    //Notice: newFee should be between 1 to 100 (0.01% - 1%)
    /**
     * @dev Sets the fee rate, ensuring it is between 0.01% and 1%.
     * @param _newFee The new fee rate.
     */
    function setFeeRate(uint8 _newFee) public onlyOwner {
        uint256 distance = block.timestamp - latestFeeUpdate;
        require(
            distance / 60 / 60 > 12,
            "You should wait at least 12 hours after the latest update"
        );
        require(
            _newFee <= 100 && _newFee >= 1,
            "The newFee should be between 1 and 100 (0.01% - 1%)"
        );
        feeRate = _newFee;
        latestFeeUpdate = block.timestamp;
    }

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    

    /**
     * @dev Swaps tokens.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @param _swapFee The swap version.
     * @return outputAmount The amount of output token.
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        address _recipient,
        uint24 _swapFee
    ) public returns (uint outputAmount) {
        // Validate input parameters
        require(tokenIn != address(0), "Invalid tokenIn address");
        require(tokenOut != address(0), "Invalid tokenOut address");
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(
            swapRouterV3,
            swapRouterV2,
            _swapFee,
            tokenIn,
            tokenOut,
            amountIn,
            _recipient
        );
        // IERC20(tokenIn).transfer(address(factoryStorage), amountIn);
        // uint amountOut = factoryStorage.swap(
        //     tokenIn,
        //     tokenOut,
        //     amountIn,
        //     _recipient,
        //     _swapFee
        // );
        // return amountOut;
    }

    /**
     * @dev Returns the amount out for a given swap.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token.
     * @param _swapFee The swap version.
     * @return finalAmountOut The amount of output token.
     */
    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint24 _swapFee
    ) public view returns (uint finalAmountOut) {
        finalAmountOut = factoryStorage.getAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            _swapFee
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
            uint24 tokenSwapFee = factoryStorage.tokenSwapFee(
                tokenAddress
            );
            if (tokenChainSelector == currentChainSelector) {
                uint value = factoryStorage.getAmountOut(
                    tokenAddress,
                    address(weth),
                    IERC20(tokenAddress).balanceOf(address(vault)),
                    tokenSwapFee
                );
                totalValue += value;
            }
        }
        return totalValue;
    }

    /**
     * @dev Estimates the amount out for a given swap.
     * @param tokenIn The address of the input token.
     * @param tokenOut The address of the output token.
     * @param amountIn The amount of input token.
     * @return amountOut The estimated amount of output token.
     */
    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint24 fee
    ) public view returns (uint amountOut) {
        amountOut = factoryStorage.estimateAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            fee
        );
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
        // Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
        //     receiver: abi.encode(receiver),
        //     data: _data,
        //     tokenAmounts: new Client.EVMTokenAmount[](0),
        //     // extraArgs: "",
        //     extraArgs: Client._argsToBytes(
        //         Client.EVMExtraArgsV1({gasLimit: 3000_000}) // Additional arguments, setting gas limit and non-strict sequency mode
        //     ),
        //     feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        // });

        // uint256 fee = IRouterClient(i_router).getFee(
        //     destinationChainSelector,
        //     message
        // );

        // bytes32 messageId;

        // if (payFeesIn == PayFeesIn.LINK) {
        //     messageId = IRouterClient(i_router).ccipSend(
        //         destinationChainSelector,
        //         message
        //     );
        // } else {
        //     messageId = IRouterClient(i_router).ccipSend{value: fee}(
        //         destinationChainSelector,
        //         message
        //     );
        // }

        // emit MessageSent(messageId);
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
            uint nonce,
            uint[] memory value1,
            uint[] memory value2
        ) = abi.decode(
                any2EvmMessage.data,
                (uint, address[], address[], uint, uint[], uint[])
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
            uint wethAmount = swap(
                token,
                address(weth),
                amount,
                address(this),
                3000
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
            uint24 tokenSwapFee = factoryStorage.tokenSwapFee(tokenAddress);
            uint value;
            if(tokenAddress == address(weth)){
                value = IERC20(tokenAddress).balanceOf(address(vault));
            }else{
            value = getAmountOut(
                tokenAddress,
                address(weth),
                IERC20(tokenAddress).balanceOf(address(vault)),
                tokenSwapFee
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
        uint[] memory tokenVersions = factoryStorage
            .allCurrentChainSelectorVersions(chainSelector);
        address[] memory zeroAddresses = new address[](0);

        uint[] memory zeroArray = new uint[](0);

        bytes memory data = abi.encode(
            2,
            tokenAddresses,
            zeroAddresses,
            tokenVersions,
            zeroArray,
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
            (,, , uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
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

        (,, , uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCurrentCount);
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
            swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(
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
                swapVars.tokenAddress,
                address(weth),
                tokenAmount,
                address(this),
                swapVars.tokenSwapFee
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
            uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(
                newTokenAddress
            );
            uint newTokenMarketShare = factoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            uint wethAmount;
            if(newTokenAddress == address(weth)){
            wethAmount = (wethAmountToSwap * newTokenMarketShare) /
                    oracleChainSelectorTotalShares;
            weth.transfer(address(vault), wethAmount);
            }else{
            wethAmount = swap(
                address(weth),
                newTokenAddress,
                (wethAmountToSwap * newTokenMarketShare) /
                    oracleChainSelectorTotalShares,
                address(vault),
                newTokenSwapFee
            );
            }
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
        // for (uint j = 0; j < chainSelectorCurrentTokensCount; j++) {
        //     swapVars.tokenAddress = factoryStorage.currentList(j);
        //     swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(
        //         swapVars.tokenAddress
        //     );
        //     swapVars.tokenMarketShare = factoryStorage.tokenOracleMarketShare(
        //         swapVars.tokenAddress
        //     );
        //     uint wethAmount;
        //     if(swapVars.tokenAddress == address(weth)){
        //         wethAmount = initialWethBalance;
        //     }else{
        //     wethAmount = swap(
        //         swapVars.tokenAddress,
        //         address(weth),
        //         IERC20(swapVars.tokenAddress).balanceOf(address(vault)),
        //         address(this),
        //         swapVars.tokenSwapFee
        //     );
        //     }
        //     swapVars.swapWethAmount += wethAmount;
        // }

        // uint chainCurrentRealShare = (swapVars.chainValue * 100e18) /
        //     portfolioValue;
        // uint wethAmountToSwap = (swapVars.swapWethAmount *
        //     chainSelectorTotalShares) / chainCurrentRealShare;
        // uint extraWethAmount = swapVars.swapWethAmount - wethAmountToSwap;
        // uint oracleChainSelectorTotalShares = factoryStorage.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
        _swapWETHToTokensForFirstRebalance(
            chainSelector,
            wethAmountToSwap,
            chainSelectorOracleTokensCount,
            currentChainSelectorTotalShares,
            oracleChainSelectorTotalShares,
            vault
        );

        //second swap

        // for (uint k = 0; k < chainSelectorOracleTokensCount; k++) {
        //     address newTokenAddress = factoryStorage.oracleList(k);
        //     uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(
        //         newTokenAddress
        //     );
        //     uint newTokenMarketShare = factoryStorage
        //         .tokenOracleMarketShare(newTokenAddress);
        //     uint wethAmount;
        //     if(newTokenAddress == address(weth)){
        //     wethAmount = (wethAmountToSwap * newTokenMarketShare) /
        //             chainSelectorTotalShares;
        //     }else{
        //     wethAmount = swap(
        //         address(weth),
        //         newTokenAddress,
        //         (wethAmountToSwap * newTokenMarketShare) /
        //             chainSelectorTotalShares,
        //         address(this),
        //         newTokenSwapFee
        //     );
        //     }
        // }
        
        extraWethByNonce[nonce] += extraWethAmount;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare -
            oracleChainSelectorTotalShares);
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

        uint[] memory currentTokenVersions = factoryStorage
            .allCurrentChainSelectorVersions(chainSelector);
        uint[] memory newTokenVersions = factoryStorage
            .allOracleChainSelectorVersions(chainSelector);

        uint[] memory extraData = new uint[](3);
        extraData[0] = portfolioValue;
        extraData[1] = oracleChainSelectorTotalShares;
        extraData[2] = chainValue;

        bytes memory data = abi.encode(
            3,
            currentTokenAddresses,
            newTokenAddresses,
            currentTokenVersions,
            newTokenVersions,
            updatePortfolioNonce,
            oracleTokenShares,
            extraData
        );
        sendMessage(
            chainSelector,
            crossChainIndexFactory,
            data,
            MessageSender.PayFeesIn.LINK
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
            (,, , uint64[] memory chainSelectors) = factoryStorage.getOracleData(latestOracleCount);
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
            swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(
                swapVars.tokenAddress
            );
            if(swapVars.tokenAddress == address(weth)){
                vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
                swapVars.wethAmount = initialWethBalance;
            }else{
            uint tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
            vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
            swapVars.wethAmount = swap(
                swapVars.tokenAddress,
                address(weth),
                tokenAmount,
                address(this),
                swapVars.tokenSwapFee
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
            uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(
                newTokenAddress
            );
            uint newTokenMarketShare = factoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            if(newTokenAddress == address(weth)){
                swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / oracleChainSelectorTotalShares;
                weth.transfer(address(vault), swapVars.wethAmount);
            }else{
            swapVars.wethAmount = swap(
                address(weth),
                newTokenAddress,
                (swapVars.swapWethAmount * newTokenMarketShare) /
                    oracleChainSelectorTotalShares,
                address(vault),
                newTokenSwapFee
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
        // uint initialWethBalance = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
        // address[] memory currentTokens = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        // for (uint j = 0; j < currentTokens.length; j++) {
        //     swapVars.tokenAddress = currentTokens[j];
        //     swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(
        //         swapVars.tokenAddress
        //     );
        //     if(swapVars.tokenAddress == address(weth)){
        //         vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
        //         swapVars.wethAmount = initialWethBalance;
        //     }else{
        //     uint tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
        //     vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
        //     swapVars.wethAmount = swap(
        //         swapVars.tokenAddress,
        //         address(weth),
        //         tokenAmount,
        //         address(this),
        //         swapVars.tokenSwapFee
        //     );
        //     }
        //     swapVars.swapWethAmount += swapVars.wethAmount;
        // }
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
        // address[] memory oracleTokens = factoryStorage.allOracleChainSelectorTokens(chainSelector);
        // for (uint k = 0; k < oracleTokens.length; k++) {
        //     address newTokenAddress = oracleTokens[k];
        //     uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(
        //         newTokenAddress
        //     );
        //     uint newTokenMarketShare = factoryStorage
        //         .tokenOracleMarketShare(newTokenAddress);
        //     if(newTokenAddress == address(weth)){
        //         swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / oracleChainSelectorTotalShares;
        //         weth.transfer(address(vault), swapVars.wethAmount);
        //     }else{
        //     swapVars.wethAmount = swap(
        //         address(weth),
        //         newTokenAddress,
        //         (swapVars.swapWethAmount * newTokenMarketShare) /
        //             oracleChainSelectorTotalShares,
        //         address(vault),
        //         newTokenSwapFee
        //     );
        //     }
        // }
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
        uint[] currentTokenVersions;
        uint[] newTokenVersions;
        uint[] extraData;
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
        SendLowerValueOtherChainVars memory vars;

        uint chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        uint negativePercentage = oracleChainSelectorTotalShares -
            chainCurrentRealShare;
        uint extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) /
            reweightExtraPercentage[nonce];

        address crossChainIndexFactory = crossChainFactoryBySelector(
            chainSelector
        );

        uint crossChainTokenAmount = swap(
            address(weth),
            crossChainToken(chainSelector),
            extraWethAmount,
            address(this),
            3000
        );

        vars.currentTokenAddresses = factoryStorage
            .allCurrentChainSelectorTokens(chainSelector);
        vars.newTokenAddresses = factoryStorage
            .allOracleChainSelectorTokens(chainSelector);

        vars.currentTokenVersions = factoryStorage
            .allCurrentChainSelectorVersions(chainSelector);
        vars.newTokenVersions = factoryStorage
            .allOracleChainSelectorVersions(chainSelector);
        
        vars.extraData = new uint[](2);
        vars.extraData[0] = portfolioValue;
        vars.extraData[1] = oracleChainSelectorTotalShares;

        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken(chainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;

        bytes memory data = abi.encode(
            4,
            vars.currentTokenAddresses,
            vars.newTokenAddresses,
            vars.currentTokenVersions,
            vars.newTokenVersions,
            updatePortfolioNonce,
            oracleTokenShares,
            vars.extraData
        );

        sendToken(
            chainSelector,
            data,
            crossChainIndexFactory,
            tokensToSendArray,
            PayFeesIn.LINK
        );
    }
}
