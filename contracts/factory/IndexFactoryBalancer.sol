// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactoryBalancer is Initializable, CCIPReceiver, ProposableOwnableUpgradeable {
    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public factoryStorage;
    address public i_link;
    uint16 public i_maxTokensLength;

    IndexToken public indexToken;

    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;

    IWETH public weth;

    //nonce
    struct TokenOldAndNewValues {
        uint256 oldTokenValue;
        uint256 newTokenValue;
    }

    struct LowSwapVariables {
        address tokenAddress;
        uint24 tokenSwapFee;
        uint256 tokenMarketShare;
        uint256 chainValue;
        uint256 swapWethAmount;
        uint256 wethAmount;
    }

    struct ExtraSwapVariables {
        address tokenAddress;
        uint24 tokenSwapFee;
        uint256 tokenMarketShare;
        uint256 chainValue;
        uint256 swapWethAmount;
    }

    uint256 public updatePortfolioNonce;

    mapping(uint256 => uint256) public portfolioTotalValueByNonce;
    mapping(uint256 => uint256) public extraWethByNonce;
    mapping(uint256 => uint256) public updatedTokensValueCount;
    mapping(uint256 => mapping(address => uint256)) public tokenValueByNonce;
    mapping(uint256 => mapping(uint64 => uint256)) public chainValueByNonce;

    mapping(uint256 => uint256) public reweightWethValueByNonce;
    mapping(uint256 => uint256) public reweightTokensCount;
    mapping(uint256 => uint256) public reweightExtraPercentage;

    mapping(uint256 => address) public redemptionNonceOutputToken;
    mapping(uint256 => uint256) public redemptionNonceOutputTokenSwapFee;

    event MessageSent(bytes32 messageId);

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _token The address of the IndexToken contract.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _factoryStorage,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        __ccipReceiver_init(_router);
        __Ownable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        factoryStorage = IndexFactoryStorage(_factoryStorage);
        //set ccip addresses
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        LinkTokenInterface(_chainlinkToken).approve(i_router, type(uint256).max);
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
    function setIndexFactoryStorage(address _factoryStorage) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    /**
     * @dev Returns the cross-chain factory address for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The address of the cross-chain factory.
     */
    function crossChainFactoryBySelector(uint64 _chainSelector) public view returns (address) {
        return factoryStorage.crossChainFactoryBySelector(_chainSelector);
    }

    /**
     * @dev Returns the cross-chain token address for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The address of the cross-chain token.
     */
    function crossChainToken(uint64 _chainSelector) public view returns (address) {
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
    function convertEthToUsd(uint256 _ethAmount) public view returns (uint256) {
        return _ethAmount * priceInWei() / 1e18;
    }

    //Notice: newFee should be between 1 to 100 (0.01% - 1%)
    /**
     * @dev Sets the fee rate, ensuring it is between 0.01% and 1%.
     * @param _newFee The new fee rate.
     */
    function setFeeRate(uint8 _newFee) public onlyOwner {
        uint256 distance = block.timestamp - latestFeeUpdate;
        require(distance / 60 / 60 > 12, "You should wait at least 12 hours after the latest update");
        require(_newFee <= 100 && _newFee >= 1, "The newFee should be between 1 and 100 (0.01% - 1%)");
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
    function swap(address tokenIn, address tokenOut, uint256 amountIn, address _recipient, uint24 _swapFee)
        public
        returns (uint256 outputAmount)
    {
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, _swapFee, tokenIn, tokenOut, amountIn, _recipient);
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
    function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn, uint24 _swapFee)
        public
        view
        returns (uint256 finalAmountOut)
    {
        finalAmountOut = factoryStorage.getAmountOut(tokenIn, tokenOut, amountIn, _swapFee);
    }

    /**
     * @dev Returns the portfolio balance.
     * @return The total portfolio balance.
     */
    function getPortfolioBalance() public view returns (uint256) {
        uint256 totalValue;
        uint256 totalCurrentList = factoryStorage.totalCurrentList();
        for (uint256 i = 0; i < totalCurrentList; i++) {
            address tokenAddress = factoryStorage.currentList(i);
            uint64 tokenChainSelector = factoryStorage.tokenChainSelector(tokenAddress);
            uint24 tokenSwapFee = factoryStorage.tokenSwapFee(tokenAddress);
            if (tokenChainSelector == currentChainSelector) {
                uint256 value = factoryStorage.getAmountOut(
                    tokenAddress, address(weth), IERC20(tokenAddress).balanceOf(address(indexToken)), tokenSwapFee
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
    function estimateAmountOut(address tokenIn, address tokenOut, uint128 amountIn)
        public
        view
        returns (uint256 amountOut)
    {
        amountOut = factoryStorage.estimateAmountOut(tokenIn, tokenOut, amountIn);
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
        require(length <= i_maxTokensLength, "Maximum 5 different tokens can be sent per CCIP Message");

        for (uint256 i = 0; i < length;) {
            if (tokensToSendDetails[i].token != i_link) {
                IERC20(tokensToSendDetails[i].token).approve(i_router, tokensToSendDetails[i].amount);
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

        uint256 fee = IRouterClient(i_router).getFee(destinationChainSelector, message);

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            messageId = IRouterClient(i_router).ccipSend(destinationChainSelector, message);
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(destinationChainSelector, message);
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
    function sendMessage(uint64 destinationChainSelector, address receiver, bytes memory _data, PayFeesIn payFeesIn)
        public
    {
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

        uint256 fee = IRouterClient(i_router).getFee(destinationChainSelector, message);

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            messageId = IRouterClient(i_router).ccipSend(destinationChainSelector, message);
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(destinationChainSelector, message);
        }

        emit MessageSent(messageId);
    }

    /**
     * @dev Handles received messages.
     * @param any2EvmMessage The received message.
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        (
            uint256 actionType,
            address[] memory tokenAddresses,
            address[] memory tokenAddresses2,
            uint256 nonce,
            uint256[] memory value1,
            uint256[] memory value2
        ) = abi.decode(any2EvmMessage.data, (uint256, address[], address[], uint256, uint256[], uint256[])); // abi-decoding of the sent string message
        if (actionType == 0) {} else if (actionType == 1) {} else if (actionType == 2) {
            for (uint256 i = 0; i < value1.length; i++) {
                portfolioTotalValueByNonce[nonce] += value1[i];
                tokenValueByNonce[nonce][tokenAddresses[i]] += value1[i];
                chainValueByNonce[nonce][sourceChainSelector] += value1[i];
                updatedTokensValueCount[nonce] += 1;
            }
        } else if (actionType == 3) {
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage.destTokenAmounts;
            address token = tokenAmounts[0].token;
            uint256 amount = tokenAmounts[0].amount;
            uint256 wethAmount = swap(token, address(weth), amount, address(this), 3);
            extraWethByNonce[nonce] += wethAmount;
        } else if (actionType == 4) {
            factoryStorage.updateCurrentList();
        }
    }

    /**
     * @dev Requests values for the portfolio.
     */
    function askValues() public onlyOwner {
        updatePortfolioNonce += 1;

        uint256 totalChains = factoryStorage.currentChainSelectorsCount();
        uint256 latestCount = factoryStorage.currentFilledCount();

        for (uint256 i = 0; i < totalChains; i++) {
            (,,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
                for (uint256 j = 0; j < chainSelectorTokensCount; j++) {
                    address tokenAddress = tokens[j];
                    uint24 tokenSwapFee = factoryStorage.tokenSwapFee(tokenAddress);
                    uint256 value;
                    if (tokenAddress == address(weth)) {
                        value = IERC20(tokenAddress).balanceOf(address(indexToken));
                    } else {
                        value = getAmountOut(
                            tokenAddress,
                            address(weth),
                            IERC20(tokenAddress).balanceOf(address(indexToken)),
                            tokenSwapFee
                        );
                    }
                    portfolioTotalValueByNonce[updatePortfolioNonce] += convertEthToUsd(value);
                    tokenValueByNonce[updatePortfolioNonce][tokenAddress] += convertEthToUsd(value);
                    updatedTokensValueCount[updatePortfolioNonce] += 1;
                    chainValueByNonce[updatePortfolioNonce][currentChainSelector] += convertEthToUsd(value);
                }
            } else {
                address crossChainIndexFactory = crossChainFactoryBySelector(chainSelector);

                address[] memory tokenAddresses = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
                uint256[] memory tokenVersions = factoryStorage.allCurrentChainSelectorVersions(chainSelector);
                address[] memory zeroAddresses = new address[](0);

                uint256[] memory zeroArray = new uint256[](0);

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
                sendMessage(chainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
            }
        }
    }

    /**
     * @dev Performs the first reweight action.
     */
    function firstReweightAction() public onlyOwner {
        uint256 nonce = updatePortfolioNonce;
        uint256 portfolioValue = portfolioTotalValueByNonce[nonce];

        uint256 totalChains = factoryStorage.currentChainSelectorsCount();
        uint256 latestCurrentCount = factoryStorage.currentFilledCount();
        uint256 latestOracleCount = factoryStorage.oracleFilledCount();

        for (uint256 i = 0; i < totalChains; i++) {
            (,,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCurrentCount);
            uint64 chainSelector = chainSelectors[i];

            uint256 chainSelectorCurrentTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorOracleTokensCount = factoryStorage.oracleChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorTotalShares =
                factoryStorage.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint256 chainValue = chainValueByNonce[nonce][chainSelector];
            uint256[] memory oracleTokenShares = factoryStorage.allOracleChainSelectorTokenShares(chainSelector);

            if ((chainValue * 100e18) / portfolioValue > chainSelectorTotalShares) {
                if (chainSelector == currentChainSelector) {
                    _swapExtraValueCurrentChain(
                        i,
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorCurrentTokensCount,
                        chainSelectorOracleTokensCount,
                        chainSelectorTotalShares
                    );
                } else {
                    _sendExtraValueOtherChains(
                        nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue, oracleTokenShares
                    );
                }
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
     * @param chainSelectorTotalShares The total shares in the chain selector.
     */
    function _swapExtraValueCurrentChain(
        uint256 i,
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorCurrentTokensCount,
        uint256 chainSelectorOracleTokensCount,
        uint256 chainSelectorTotalShares
    ) internal {
        ExtraSwapVariables memory swapVars;

        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        uint256 initialWethBalance = weth.balanceOf(address(indexToken));
        for (uint256 j = 0; j < chainSelectorCurrentTokensCount; j++) {
            swapVars.tokenAddress = factoryStorage.currentList(j);
            swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(swapVars.tokenAddress);
            swapVars.tokenMarketShare = factoryStorage.tokenOracleMarketShare(swapVars.tokenAddress);
            uint256 wethAmount;
            if (swapVars.tokenAddress == address(weth)) {
                wethAmount = initialWethBalance;
            } else {
                // wethAmount = _swapSingle(
                //     swapVars.tokenAddress,
                //     address(weth),
                //     IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                //     address(indexToken),
                //     swapVars.tokenSwapFee
                // );
                wethAmount = swap(
                    swapVars.tokenAddress,
                    address(weth),
                    IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                    address(this),
                    swapVars.tokenSwapFee
                );
            }
            swapVars.swapWethAmount += wethAmount;
        }

        uint256 chainCurrentRealShare = (swapVars.chainValue * 100e18) / portfolioValue;
        uint256 wethAmountToSwap = (swapVars.swapWethAmount * chainSelectorTotalShares) / chainCurrentRealShare;
        uint256 extraWethAmount = swapVars.swapWethAmount - wethAmountToSwap;

        for (uint256 k = 0; k < chainSelectorOracleTokensCount; k++) {
            address newTokenAddress = factoryStorage.oracleList(k);
            uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(newTokenAddress);
            uint256 newTokenMarketShare = factoryStorage.tokenOracleMarketShare(newTokenAddress);
            uint256 wethAmount;
            if (newTokenAddress == address(weth)) {
                wethAmount = (wethAmountToSwap * newTokenMarketShare) / chainSelectorTotalShares;
            } else {
                // wethAmount = _swapSingle(
                //     address(weth),
                //     newTokenAddress,
                //     (wethAmountToSwap * newTokenMarketShare) /
                //         chainSelectorTotalShares,
                //     address(indexToken),
                //     newTokenSwapFee
                // );
                wethAmount = swap(
                    address(weth),
                    newTokenAddress,
                    (wethAmountToSwap * newTokenMarketShare) / chainSelectorTotalShares,
                    address(this),
                    newTokenSwapFee
                );
            }
        }
        extraWethByNonce[nonce] += extraWethAmount;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare - chainSelectorTotalShares);
    }

    /**
     * @dev Sends extra value to other chains.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param chainSelectorTotalShares The total shares in the chain selector.
     * @param chainValue The chain value.
     * @param oracleTokenShares The oracle token shares.
     */
    function _sendExtraValueOtherChains(
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorTotalShares,
        uint256 chainValue,
        uint256[] memory oracleTokenShares
    ) internal {
        uint256 chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare - chainSelectorTotalShares);

        address crossChainIndexFactory = crossChainFactoryBySelector(chainSelector);

        address[] memory currentTokenAddresses = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        address[] memory newTokenAddresses = factoryStorage.allOracleChainSelectorTokens(chainSelector);

        uint256[] memory currentTokenVersions = factoryStorage.allCurrentChainSelectorVersions(chainSelector);
        uint256[] memory newTokenVersions = factoryStorage.allOracleChainSelectorVersions(chainSelector);

        uint256[] memory extraData = new uint256[](2);
        extraData[0] = portfolioValue;
        extraData[1] = chainSelectorTotalShares;
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
        sendMessage(chainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
    }

    /**
     * @dev Performs the second reweight action.
     */
    function secondReweightAction() public onlyOwner {
        uint256 nonce = updatePortfolioNonce;
        uint256 portfolioValue = portfolioTotalValueByNonce[nonce];

        uint256 totalChains = factoryStorage.oracleChainSelectorsCount();
        uint256 latestOracleCount = factoryStorage.oracleFilledCount();

        for (uint256 i = 0; i < totalChains; i++) {
            (,,, uint64[] memory chainSelectors) = factoryStorage.getOracleData(latestOracleCount);
            uint64 chainSelector = chainSelectors[i];

            uint256 chainSelectorCurrentTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorOracleTokensCount = factoryStorage.oracleChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorTotalShares =
                factoryStorage.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint256 chainValue = chainValueByNonce[nonce][chainSelector];
            uint256[] memory oracleTokenShares = factoryStorage.allOracleChainSelectorTokenShares(chainSelector);

            if ((chainValue * 100e18) / portfolioValue < chainSelectorTotalShares) {
                if (chainSelector == currentChainSelector) {
                    _swapLowerValueCurrentChain(
                        i,
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorCurrentTokensCount,
                        chainSelectorOracleTokensCount,
                        chainSelectorTotalShares
                    );
                } else {
                    _sendLowerValueOtherChain(
                        nonce, portfolioValue, chainSelector, chainSelectorTotalShares, chainValue, oracleTokenShares
                    );
                }
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
     * @param chainSelectorTotalShares The total shares in the chain selector.
     */
    function _swapLowerValueCurrentChain(
        uint256 i,
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorCurrentTokensCount,
        uint256 chainSelectorOracleTokensCount,
        uint256 chainSelectorTotalShares
    ) internal {
        LowSwapVariables memory swapVars;
        swapVars.tokenAddress = factoryStorage.currentList(i);
        swapVars.tokenSwapFee = factoryStorage.tokenSwapFee(swapVars.tokenAddress);
        swapVars.tokenMarketShare = factoryStorage.tokenOracleMarketShare(swapVars.tokenAddress);
        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        uint256 initialWethBalance = IERC20(swapVars.tokenAddress).balanceOf(address(indexToken));
        for (uint256 j = 0; j < chainSelectorCurrentTokensCount; j++) {
            if (swapVars.tokenAddress == address(weth)) {
                swapVars.wethAmount = initialWethBalance;
            } else {
                // swapVars.wethAmount = _swapSingle(
                //     swapVars.tokenAddress,
                //     address(weth),
                //     IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                //     address(indexToken),
                //     swapVars.tokenSwapFee
                // );
                swapVars.wethAmount = swap(
                    swapVars.tokenAddress,
                    address(weth),
                    IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                    address(this),
                    swapVars.tokenSwapFee
                );
            }
            swapVars.swapWethAmount += swapVars.wethAmount;
        }

        uint256 chainCurrentRealShare = (swapVars.chainValue * 100e18) / portfolioValue;
        uint256 negativePercentage = chainSelectorTotalShares - chainCurrentRealShare;
        uint256 extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) / reweightExtraPercentage[nonce];
        swapVars.swapWethAmount += extraWethAmount;

        for (uint256 k = 0; k < chainSelectorOracleTokensCount; k++) {
            address newTokenAddress = factoryStorage.currentList(k);
            uint24 newTokenSwapFee = factoryStorage.tokenSwapFee(newTokenAddress);
            uint256 newTokenMarketShare = factoryStorage.tokenOracleMarketShare(newTokenAddress);
            if (newTokenAddress == address(weth)) {
                swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / chainSelectorTotalShares;
            } else {
                // swapVars.wethAmount = _swapSingle(
                //     address(weth),
                //     newTokenAddress,
                //     (swapVars.swapWethAmount * newTokenMarketShare) /
                //         chainSelectorTotalShares,
                //     address(indexToken),
                //     newTokenSwapFee
                // );
                swapVars.wethAmount = swap(
                    address(weth),
                    newTokenAddress,
                    (swapVars.swapWethAmount * newTokenMarketShare) / chainSelectorTotalShares,
                    address(this),
                    newTokenSwapFee
                );
            }
        }
    }

    struct SendLowerValueOtherChainVars {
        address[] currentTokenAddresses;
        address[] newTokenAddresses;
        uint256[] currentTokenVersions;
        uint256[] newTokenVersions;
        uint256[] extraData;
    }

    /**
     * @dev Sends lower value to other chains.
     * @param nonce The nonce.
     * @param portfolioValue The portfolio value.
     * @param chainSelector The chain selector.
     * @param chainSelectorTotalShares The total shares in the chain selector.
     * @param chainValue The chain value.
     * @param oracleTokenShares The oracle token shares.
     */
    function _sendLowerValueOtherChain(
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorTotalShares,
        uint256 chainValue,
        uint256[] memory oracleTokenShares
    ) internal {
        SendLowerValueOtherChainVars memory vars;

        uint256 chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        uint256 negativePercentage = chainSelectorTotalShares - chainCurrentRealShare;
        uint256 extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) / reweightExtraPercentage[nonce];

        address crossChainIndexFactory = crossChainFactoryBySelector(chainSelector);

        // uint crossChainTokenAmount = _swapSingle(
        //     address(weth),
        //     crossChainToken(chainSelector),
        //     extraWethAmount,
        //     address(this),
        //     3
        // );

        uint256 crossChainTokenAmount =
            swap(address(weth), crossChainToken(chainSelector), extraWethAmount, address(this), 3);

        vars.currentTokenAddresses = factoryStorage.allCurrentChainSelectorTokens(chainSelector);
        vars.newTokenAddresses = factoryStorage.allOracleChainSelectorTokens(chainSelector);

        vars.currentTokenVersions = factoryStorage.allCurrentChainSelectorVersions(chainSelector);
        vars.newTokenVersions = factoryStorage.allOracleChainSelectorVersions(chainSelector);

        vars.extraData = new uint256[](2);
        vars.extraData[0] = portfolioValue;
        vars.extraData[1] = chainSelectorTotalShares;

        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
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

        sendToken(chainSelector, data, crossChainIndexFactory, tokensToSendArray, PayFeesIn.LINK);
    }

    function setPortfolioTotalValueByNonce(uint256 nonce, uint256 value) public onlyOwner {
        portfolioTotalValueByNonce[nonce] = value;
    }
}
