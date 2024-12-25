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

contract IndexFactory is Initializable, CCIPReceiver, ProposableOwnableUpgradeable, ReentrancyGuardUpgradeable {
    using MessageSender for *;

    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public factoryStorage;
    address public i_link;
    uint16 public constant MAX_TOKENS_LENGTH = 5;
    uint8 public constant MIN_FEE_RATE = 1;
    uint8 public constant MAX_FEE_RATE = 100;
    uint256 public constant MIN_FEE_UPDATE_INTERVAL = 12 hours;

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

    struct IssuanceData {
        mapping(address => TokenOldAndNewValues) tokenOldAndNewValues;
        uint256 completedTokensCount;
        address requester;
        uint256 inputAmount;
        address inputToken;
        bytes32 messageId;
    }

    struct RedemptionData {
        uint256 totalValue;
        uint256 completedTokensCount;
        address requester;
        address outputToken;
        uint24 outputTokenSwapFee;
        uint256 inputAmount;
        bytes32 messageId;
    }

    struct IssuanceSendLocalVars {
        address[] tokenAddresses;
        uint256[] tokenVersions;
        uint256[] tokenShares;
        address[] zeroAddresses;
        uint256[] zeroNumbers;
    }

    uint256 public issuanceNonce;
    uint256 public redemptionNonce;

    address public feeReceiver;

    mapping(uint256 => IssuanceData) public issuanceData;
    mapping(uint256 => RedemptionData) public redemptionData;

    event RequestIssuance(
        bytes32 indexed messageId,
        uint256 indexed nonce,
        address indexed user,
        address inputToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 time
    );

    event Issuanced(
        bytes32 indexed messageId,
        uint256 indexed nonce,
        address indexed user,
        address inputToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 time
    );

    event RequestRedemption(
        bytes32 indexed messageId,
        uint256 indexed nonce,
        address indexed user,
        address outputToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 time
    );

    event Redemption(
        bytes32 indexed messageId,
        uint256 indexed nonce,
        address indexed user,
        address outputToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 time
    );
    event MessageSent(bytes32 messageId);

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _token The address of the IndexToken contract.
     * @param _chainlinkToken The address of the Chainlink token.
     * @param _router The address of the router.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth
    ) external initializer {
        __ccipReceiver_init(_router);
        __Ownable_init();
        __ReentrancyGuard_init();
        __ReentrancyGuard_init_unchained();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        //set ccip addresses
        i_link = _chainlinkToken;
        LinkTokenInterface(_chainlinkToken).approve(i_router, type(uint256).max);
        //set addresses
        weth = IWETH(_weth);
        //fee
        feeRate = 10;
        latestFeeUpdate = block.timestamp;
        feeReceiver = msg.sender;
    }

    /**
     * @dev Sets the IndexFactoryStorage contract address.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     */
    function setIndexFactoryStorage(address _factoryStorage) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    /**
     * @dev Sets the fee receiver address.
     * @param _feeReceiver The address of the fee receiver.
     */
    function setFeeReceiver(address _feeReceiver) public onlyOwner {
        feeReceiver = _feeReceiver;
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
     * @dev Returns the cross-chain token swap version for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The swap version of the cross-chain token.
     */
    function crossChainTokenSwapFee(uint64 _chainSelector) public view returns (uint24) {
        address crossChainTokenAddress = crossChainToken(_chainSelector);
        return factoryStorage.crossChainTokenSwapFee(_chainSelector, crossChainTokenAddress);
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

    /**
     * @dev Sets the fee rate, ensuring it is between 0.01% and 1%.
     * @param _newFee The new fee rate.
     */
    function setFeeRate(uint8 _newFee) public onlyOwner {
        require(
            block.timestamp - latestFeeUpdate >= MIN_FEE_UPDATE_INTERVAL,
            "You should wait at least 12 hours after the latest update"
        );
        require(
            _newFee <= MAX_FEE_RATE && _newFee >= MIN_FEE_RATE, "The newFee should be between 1 and 100 (0.01% - 1%)"
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
    function swap(address tokenIn, address tokenOut, uint256 amountIn, address _recipient, uint24 _swapFee)
        internal
        returns (uint256 outputAmount)
    {
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, _swapFee, tokenIn, tokenOut, amountIn, _recipient);
        /**
         * IERC20(tokenIn).transfer(address(factoryStorage), amountIn);
         *     uint amountOut = factoryStorage.swap(
         *         tokenIn,
         *         tokenOut,
         *         amountIn,
         *         _recipient,
         *         _swapFee
         *     );
         *     return amountOut;
         */
    }

    /**
     * @dev Issues index tokens.
     * @param _tokenIn The address of the input token.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     * @param _tokenInSwapFee The swap version of the input token.
     */
    function issuanceIndexTokens(address _tokenIn, uint256 _inputAmount, uint256 _crossChainFee, uint24 _tokenInSwapFee)
        public
    {
        IWETH weth = factoryStorage.weth();
        Vault vault = factoryStorage.vault();

        uint256 feeAmount = FeeCalculation.calculateFee(_inputAmount, feeRate);

        // IERC20(_tokenIn).transferFrom(msg.sender, address(indexToken), _inputAmount + feeAmount);
        require(
            IERC20(_tokenIn).transferFrom(msg.sender, address(this), _inputAmount + feeAmount), "Token transfer failed"
        );
        uint256 wethAmountBeforFee =
            swap(_tokenIn, address(weth), _inputAmount + feeAmount, address(this), _tokenInSwapFee);
        // uint wethAmountBeforFee = _swapSingle(_tokenIn, address(weth), _inputAmount + feeAmount, address(this), _tokenInSwapFee);
        // uint wethAmountBeforFee = _swapSingle(_tokenIn, address(weth), _inputAmount + feeAmount, address(this), _tokenInSwapFee);
        uint256 feeWethAmount = wethAmountBeforFee * feeRate / 10000;
        uint256 wethAmount = wethAmountBeforFee - feeWethAmount;

        //giving fee to the fee receiver
        weth.transfer(address(feeReceiver), feeWethAmount);
        //set mappings
        issuanceNonce++;
        issuanceData[issuanceNonce].requester = msg.sender;
        issuanceData[issuanceNonce].inputAmount = _inputAmount;
        issuanceData[issuanceNonce].inputToken = _tokenIn;
        //run issuance
        _issuance(_tokenIn, wethAmount, _crossChainFee);
    }

    /**
     * @dev Issues index tokens with ETH.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     */
    function issuanceIndexTokensWithEth(uint256 _inputAmount, uint256 _crossChainFee) external payable {
        uint256 feeAmount = FeeCalculation.calculateFee(_inputAmount, feeRate);
        uint256 finalAmount = _inputAmount + feeAmount + _crossChainFee;
        require(msg.value >= finalAmount, "lower than required amount");
        //transfer fee to the owner
        weth.deposit{value: finalAmount}();
        weth.transfer(address(feeReceiver), feeAmount);
        //set mappings
        issuanceNonce++;
        issuanceData[issuanceNonce].requester = msg.sender;
        issuanceData[issuanceNonce].inputAmount = _inputAmount;
        issuanceData[issuanceNonce].inputToken = address(weth);
        //run issuance
        _issuance(address(weth), _inputAmount, _crossChainFee);
    }

    /**
     * @dev Internal function to handle issuance.
     * @param _tokenIn The address of the input token.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     */
    function _issuance(address _tokenIn, uint256 _inputAmount, uint256 _crossChainFee) internal {
        uint256 wethAmount = _inputAmount;

        // swap to underlying assets on all chain
        uint256 totalChains = factoryStorage.currentChainSelectorsCount();
        uint256 latestCount = factoryStorage.currentFilledCount();
        (,,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _issuanceSwapsCurrentChain(
                    wethAmount, issuanceNonce, chainSelectorTokensCount, chainSelector, latestCount
                );
            } else {
                _issuanceSwapsOtherChains(wethAmount, issuanceNonce, chainSelector, latestCount);
            }
        }
        // emit RequestIssuance(
        //         issuanceData[issuanceNonce].messageId,
        //         issuanceNonce,
        //         msg.sender,
        //         _tokenIn,
        //         issuanceData[issuanceNonce].inputAmount,
        //         0,
        //         block.timestamp
        //     );
    }

    /**
     * @dev Handles issuance swaps on the current chain.
     * @param _wethAmount The amount of WETH.
     * @param _issuanceNonce The issuance nonce.
     * @param _chainSelectorTokensCount The number of tokens in the chain selector.
     * @param _chainSelector The chain selector.
     * @param _latestCount The latest count.
     */
    function _issuanceSwapsCurrentChain(
        uint256 _wethAmount,
        uint256 _issuanceNonce,
        uint256 _chainSelectorTokensCount,
        uint64 _chainSelector,
        uint256 _latestCount
    ) internal {
        // (address[] memory tokens,,,) = factoryStorage.getCurrentData(_latestCount);
        // swap(address(weth), tokenAddress, swapAmount, address(factoryStorage.vault()), tokenSwapFee);

        address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        for (uint256 i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            uint24 tokenSwapFee = factoryStorage.tokenSwapFee(tokenAddress);
            uint256 tokenMarketShare = factoryStorage.tokenCurrentMarketShare(tokenAddress);
            uint256 oldTokenValue = tokenAddress == address(weth)
                ? convertEthToUsd(IERC20(tokenAddress).balanceOf(address(factoryStorage.vault())))
                : convertEthToUsd(
                    getAmountOut(
                        tokenAddress,
                        address(weth),
                        IERC20(tokenAddress).balanceOf(address(factoryStorage.vault())),
                        tokenSwapFee
                    )
                );
            issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].oldTokenValue = oldTokenValue;
            uint256 swapAmount = (_wethAmount * tokenMarketShare) / 100e18;
            if (tokenAddress != address(weth)) {
                // _swapSingle(address(weth), tokenAddress, (_wethAmount * tokenMarketShare) / 100e18, address(indexToken), tokenSwapFee);
                // uint swapAmount = (_wethAmount * tokenMarketShare) / 100e18;
                // IERC20(weth).approve(address(factoryStorage.vault()), swapAmount);
                swap(address(weth), tokenAddress, swapAmount, address(factoryStorage.vault()), tokenSwapFee);
            } else {
                weth.transfer(address(factoryStorage.vault()), swapAmount);
            }

            issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].newTokenValue =
                oldTokenValue + convertEthToUsd((_wethAmount * tokenMarketShare) / 100e18);
            issuanceData[_issuanceNonce].completedTokensCount += 1;
        }
    }

    /**
     * @dev Handles issuance swaps on other chains.
     * @param _wethAmount The amount of WETH.
     * @param _issuanceNonce The issuance nonce.
     * @param _chainSelector The chain selector.
     * @param _latestCount The latest count.
     */
    function _issuanceSwapsOtherChains(
        uint256 _wethAmount,
        uint256 _issuanceNonce,
        uint64 _chainSelector,
        uint256 _latestCount
    ) internal {
        IssuanceSendLocalVars memory localVars;

        uint256 totalShares = factoryStorage.getCurrentChainSelectorTotalShares(_latestCount, _chainSelector);
        uint256[] memory totalSharesArr = new uint256[](1);
        totalSharesArr[0] = totalShares;

        uint256 crossChainTokenAmount = swap(
            address(weth),
            crossChainToken(_chainSelector),
            (_wethAmount * totalSharesArr[0]) / 100e18,
            address(this),
            crossChainTokenSwapFee(_chainSelector)
        );
        address crossChainIndexFactory = crossChainFactoryBySelector(_chainSelector);

        localVars.tokenAddresses = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        localVars.tokenVersions = factoryStorage.allCurrentChainSelectorVersions(_chainSelector);
        localVars.tokenShares = factoryStorage.allCurrentChainSelectorTokenShares(_chainSelector);
        localVars.zeroAddresses = new address[](0);
        localVars.zeroNumbers = new uint256[](0);
        //fee
        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken(_chainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;

        bytes memory data = abi.encode(
            0,
            localVars.tokenAddresses,
            localVars.zeroAddresses,
            localVars.tokenVersions,
            localVars.zeroNumbers,
            _issuanceNonce,
            localVars.tokenShares,
            totalSharesArr
        );

        bytes32 messageId = sendToken(_chainSelector, data, crossChainIndexFactory, tokensToSendArray, PayFeesIn.LINK);
        emit MessageSent(messageId);
        issuanceData[issuanceNonce].messageId = messageId;
    }

    /**
     * @dev Completes the issuance request.
     * @param _issuanceNonce The issuance nonce.
     * @param _messageId The message ID.
     */
    function completeIssuanceRequest(uint256 _issuanceNonce, bytes32 _messageId) internal {
        uint256 totalOldVaules;
        uint256 totalNewVaules;
        uint256 totalCurrentList = factoryStorage.totalCurrentList();
        for (uint256 i = 0; i < totalCurrentList; i++) {
            address tokenAddress = factoryStorage.currentList(i);
            totalOldVaules += issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].oldTokenValue;
            totalNewVaules += issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].newTokenValue;
        }

        uint256 amountToMint;
        if (indexToken.totalSupply() > 0) {
            amountToMint = (indexToken.totalSupply() * totalNewVaules) / totalOldVaules - indexToken.totalSupply();
        } else {
            amountToMint = (totalNewVaules) * 100;
        }
        indexToken.mint(issuanceData[_issuanceNonce].requester, amountToMint);
        emit Issuanced(
            _messageId,
            _issuanceNonce,
            issuanceData[_issuanceNonce].requester,
            issuanceData[_issuanceNonce].inputToken,
            issuanceData[_issuanceNonce].inputAmount,
            amountToMint,
            block.timestamp
        );
    }

    /**
     * @dev Redeems tokens.
     * @param amountIn The amount of input tokens.
     * @param _crossChainFee The cross-chain fee.
     * @param _tokenOut The address of the output token.
     * @param _tokenOutSwapFee The swap version of the output token.
     */
    function redemption(uint256 amountIn, uint256 _crossChainFee, address _tokenOut, uint24 _tokenOutSwapFee) public {
        uint256 burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        redemptionNonce += 1;
        redemptionData[redemptionNonce].requester = msg.sender;
        redemptionData[redemptionNonce].outputToken = _tokenOut;
        redemptionData[redemptionNonce].outputTokenSwapFee = _tokenOutSwapFee;
        redemptionData[redemptionNonce].inputAmount = amountIn;

        indexToken.burn(msg.sender, amountIn);

        //swap
        uint256 totalChains = factoryStorage.currentChainSelectorsCount();
        uint256 latestCount = factoryStorage.currentFilledCount();
        (,,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _redemptionSwapsCurrentChain(burnPercent, redemptionNonce, chainSelectorTokensCount);
            } else {
                _redemptionSwapsOtherChains(burnPercent, redemptionNonce, chainSelector);
            }
        }
        emit RequestRedemption(
            redemptionData[redemptionNonce].messageId,
            redemptionNonce,
            msg.sender,
            _tokenOut,
            amountIn,
            0,
            block.timestamp
        );
    }

    /**
     * @dev Handles redemption swaps on the current chain.
     * @param _burnPercent The burn percentage.
     * @param _redemptionNonce The redemption nonce.
     * @param _chainSelectorTokensCount The number of tokens in the chain selector.
     */
    function _redemptionSwapsCurrentChain(
        uint256 _burnPercent,
        uint256 _redemptionNonce,
        uint256 _chainSelectorTokensCount
    ) internal {
        // (address[] memory tokens,,,) = factoryStorage.getCurrentData(factoryStorage.currentFilledCount());
        address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(currentChainSelector);
        Vault vault = factoryStorage.vault();
        for (uint256 i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            uint24 tokenSwapFee = factoryStorage.tokenSwapFee(tokenAddress);
            uint256 swapAmount = (_burnPercent * IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))) / 1e18;
            vault.withdrawFunds(tokenAddress, address(this), swapAmount);
            uint256 swapAmountOut = tokenAddress == address(weth)
                ? swapAmount
                // : _swapSingle(tokenAddress, address(weth), swapAmount, address(this), tokenSwapFee);
                : swap(tokenAddress, address(weth), swapAmount, address(this), tokenSwapFee);
            redemptionData[_redemptionNonce].totalValue += swapAmountOut;
            redemptionData[_redemptionNonce].completedTokensCount += 1;
        }
    }

    /**
     * @dev Handles redemption swaps on other chains.
     * @param _burnPercent The burn percentage.
     * @param _redemptionNonce The redemption nonce.
     * @param _chainSelector The chain selector.
     */
    function _redemptionSwapsOtherChains(uint256 _burnPercent, uint256 _redemptionNonce, uint64 _chainSelector)
        internal
    {
        address crossChainIndexFactory = crossChainFactoryBySelector(_chainSelector);

        address[] memory tokenAddresses = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        uint256[] memory tokenVersions = factoryStorage.allCurrentChainSelectorVersions(_chainSelector);
        uint256[] memory tokenShares = factoryStorage.allCurrentChainSelectorTokenShares(_chainSelector);
        address[] memory zeroAddresses = new address[](0);
        uint256[] memory zeroNumbers = new uint256[](0);
        uint256[] memory burnPercentages = new uint256[](1);

        burnPercentages[0] = _burnPercent;

        bytes memory data = abi.encode(
            1, tokenAddresses, zeroAddresses, tokenVersions, zeroNumbers, _redemptionNonce, tokenShares, burnPercentages
        );
        bytes32 messageId = sendMessage(_chainSelector, crossChainIndexFactory, data, PayFeesIn.LINK);
        redemptionData[_redemptionNonce].messageId = messageId;
    }

    /**
     * @dev Completes the redemption request.
     * @param nonce The redemption nonce.
     * @param _messageId The message ID.
     */
    function completeRedemptionRequest(uint256 nonce, bytes32 _messageId) internal {
        uint256 wethAmount = redemptionData[nonce].totalValue;
        address requester = redemptionData[nonce].requester;
        address outputToken = redemptionData[nonce].outputToken;
        uint24 outputTokenSwapFee = redemptionData[nonce].outputTokenSwapFee;
        uint256 fee = FeeCalculation.calculateFee(wethAmount, feeRate);
        weth.transfer(feeReceiver, fee);
        if (outputToken == address(weth)) {
            // weth.transfer(requester, wethAmount - fee);
            weth.withdraw(wethAmount - fee);
            (bool _requesterSuccess,) = requester.call{value: wethAmount - fee}("");
            require(_requesterSuccess, "transfer eth to the requester failed");
            emit Redemption(
                _messageId,
                nonce,
                requester,
                outputToken,
                redemptionData[nonce].inputAmount,
                wethAmount - fee,
                block.timestamp
            );
        } else {
            uint256 reallOut = swap(address(weth), outputToken, wethAmount - fee, requester, outputTokenSwapFee);
            emit Redemption(
                _messageId, nonce, requester, outputToken, redemptionData[nonce].inputAmount, reallOut, block.timestamp
            );
        }
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
                if (tokenAddress == address(weth)) {
                    totalValue += IERC20(tokenAddress).balanceOf(address(indexToken));
                } else {
                    uint256 value = factoryStorage.getAmountOut(
                        tokenAddress, address(weth), IERC20(tokenAddress).balanceOf(address(indexToken)), tokenSwapFee
                    );
                    totalValue += value;
                }
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
    function estimateAmountOut(address tokenIn, address tokenOut, uint128 amountIn, uint24 fee)
        public
        view
        returns (uint256 amountOut)
    {
        amountOut = factoryStorage.estimateAmountOut(tokenIn, tokenOut, amountIn, fee);
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
        PayFeesIn payFeesIn
    ) internal nonReentrant returns (bytes32) {
        bytes32 messageId = MessageSender.sendToken(
            i_router,
            i_link,
            MAX_TOKENS_LENGTH,
            destinationChainSelector,
            _data,
            receiver,
            tokensToSendDetails,
            payFeesIn
        );
        emit MessageSent(messageId);
        return messageId;
    }

    /**
     * @dev Sends a message to another chain.
     * @param destinationChainSelector The destination chain selector.
     * @param receiver The address of the receiver.
     * @param _data The data to send.
     * @param payFeesIn The fee payment method.
     * @return The message ID.
     */
    function sendMessage(uint64 destinationChainSelector, address receiver, bytes memory _data, PayFeesIn payFeesIn)
        public
        returns (bytes32)
    {
        return MessageSender.sendMessage(i_router, i_link, destinationChainSelector, receiver, _data, payFeesIn);
    }

    /**
     * @dev Handles received messages.
     * @param any2EvmMessage The received message.
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        bytes32 messageId = any2EvmMessage.messageId;
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector;
        uint256 totalCurrentList = factoryStorage.totalCurrentList();
        (
            uint256 actionType,
            address[] memory tokenAddresses,
            address[] memory tokenAddresses2,
            uint256 nonce,
            uint256[] memory value1,
            uint256[] memory value2
        ) = abi.decode(any2EvmMessage.data, (uint256, address[], address[], uint256, uint256[], uint256[]));

        if (actionType == 0) {
            _handleReceivedIssuance(nonce, tokenAddresses, value1, value2, totalCurrentList, messageId);
        } else if (actionType == 1) {
            _handleReceivedRedemption(
                nonce, any2EvmMessage, tokenAddresses, totalCurrentList, sourceChainSelector, messageId
            );
        }
    }

    function _handleReceivedIssuance(
        uint256 nonce,
        address[] memory tokenAddresses,
        uint256[] memory value1,
        uint256[] memory value2,
        uint256 totalCurrentList,
        bytes32 messageId
    ) private {
        uint256 requestIssuanceNonce = nonce;
        for (uint256 i; i < tokenAddresses.length; i++) {
            uint256 oldTokenValue = value1[i];
            uint256 newTokenValue = value2[i];
            issuanceData[requestIssuanceNonce].tokenOldAndNewValues[tokenAddresses[i]].oldTokenValue = oldTokenValue;
            issuanceData[requestIssuanceNonce].tokenOldAndNewValues[tokenAddresses[i]].newTokenValue = newTokenValue;
            issuanceData[requestIssuanceNonce].completedTokensCount += 1;
        }
        if (issuanceData[requestIssuanceNonce].completedTokensCount == totalCurrentList) {
            completeIssuanceRequest(requestIssuanceNonce, messageId);
        }
    }

    function _handleReceivedRedemption(
        uint256 nonce,
        Client.Any2EVMMessage memory any2EvmMessage,
        address[] memory tokenAddresses,
        uint256 totalCurrentList,
        uint64 sourceChainSelector,
        bytes32 messageId
    ) private {
        uint256 requestRedemptionNonce = nonce;
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage.destTokenAmounts;
        address token = tokenAmounts[0].token;
        uint256 amount = tokenAmounts[0].amount;
        uint256 wethAmount = swap(address(token), address(weth), amount, address(this), 3000);
        redemptionData[requestRedemptionNonce].totalValue += wethAmount;
        redemptionData[requestRedemptionNonce].completedTokensCount += tokenAddresses.length;
        if (redemptionData[requestRedemptionNonce].completedTokensCount == totalCurrentList) {
            completeRedemptionRequest(requestRedemptionNonce, messageId);
        }
    }

    function getRouterAddress() public view returns (address) {
        return i_router;
    }
}
