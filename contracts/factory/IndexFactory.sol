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
import "./CoreSender.sol";
import "./FunctionsOracle.sol";
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
contract IndexFactory is
    Initializable,
    ProposableOwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // using MessageSender for *;

    struct IssuanceSendLocalVars {
        address[] tokenAddresses;
        uint[] tokenVersions;
        uint[] tokenShares;
        address[] zeroAddresses;
        uint[] zeroNumbers;
    }

    // enum PayFeesIn {
    //     Native,
    //     LINK
    // }

    IndexToken public indexToken;
    IndexFactoryStorage public factoryStorage;
    FunctionsOracle public functionsOracle;
    CoreSender public coreSender;

    
    uint64 public currentChainSelector;

    IWETH public weth;

    event RequestIssuance(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address inputToken,
        uint inputAmount,
        uint outputAmount,
        uint time
    );

    

    event RequestRedemption(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address outputToken,
        uint inputAmount,
        uint outputAmount,
        uint time
    );

    

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _token The address of the IndexToken contract..
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _indexFactoryStorage,
        address _functionsOracle,
        address payable _coreSender,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_token != address(0), "Invalid token address");
        require(_weth != address(0), "Invalid WETH address");

        __Ownable_init();
        __ReentrancyGuard_init();
        __ReentrancyGuard_init_unchained();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        factoryStorage = IndexFactoryStorage(_indexFactoryStorage);
        functionsOracle = FunctionsOracle(_functionsOracle);
        coreSender = CoreSender(_coreSender);
        
        //set addresses
        weth = IWETH(_weth);
    }

    /**
     * @dev Sets the IndexFactoryStorage contract address.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     */
    function setIndexFactoryStorage(address _factoryStorage) public onlyOwner {
        factoryStorage = IndexFactoryStorage(_factoryStorage);
    }

    /**
     * @dev Sets the FunctionsOracle contract address.
     * @param _functionsOracle The address of the FunctionsOracle contract.
     */
    function setFunctionsOracle(address _functionsOracle) public onlyOwner {
        functionsOracle = FunctionsOracle(_functionsOracle);
    }

    function setCoreSender(address payable _coreSender) public onlyOwner {
        coreSender = CoreSender(_coreSender);
    }

    

    /**
     * @dev Fallback function to receive ETH.
     */
    receive() external payable {}

    /**
     * @dev Swaps tokens.
     * @param path The path of the tokens.
     * @param fees The fees of the tokens.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn,
        address _recipient
    ) internal returns (uint outputAmount) {
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
     * @dev Issues index tokens.
     * @param _tokenIn The address of the input token.
     * @param _tokenInPath The path of the input token.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     */
    function issuanceIndexTokens(
        address _tokenIn,
        address[] memory _tokenInPath,
        uint24[] memory _tokenInFees,
        uint _inputAmount,
        uint _crossChainFee
    ) public {
        // Validate input parameters
        require(_tokenIn != address(0), "Invalid input token address");
        require(_inputAmount > 0, "Input amount must be greater than zero");
        require(_crossChainFee >= 0, "Cross-chain fee must be non-negative");

        IWETH weth = factoryStorage.weth();
        Vault vault = factoryStorage.vault();

        uint feeAmount = FeeCalculation.calculateFee(_inputAmount, factoryStorage.feeRate());

        factoryStorage.increaseIssuanceNonce();
        factoryStorage.setIssuanceData(
            factoryStorage.issuanceNonce(),
            msg.sender,
            _tokenIn,
            _inputAmount,
            bytes32(0)
        );

        require(
            IERC20(_tokenIn).transferFrom(
                msg.sender,
                address(this),
                _inputAmount + feeAmount
            ),
            "Token transfer failed"
        );
        uint wethAmountBeforFee = swap(
            _tokenInPath,
            _tokenInFees,
            _inputAmount + feeAmount,
            address(this)
        );
        uint feeWethAmount = (wethAmountBeforFee * factoryStorage.feeRate()) / 10000;
        uint wethAmount = wethAmountBeforFee - feeWethAmount;

        // Transfer fee to the fee receiver and check the result
        require(
            weth.transfer(address(factoryStorage.feeReceiver()), feeWethAmount),
            "Fee transfer failed"
        );

        //run issuance
        _issuance(_tokenIn, wethAmount, _crossChainFee);
    }

    /**
     * @dev Issues index tokens with ETH.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     */
    function issuanceIndexTokensWithEth(
        uint _inputAmount,
        uint _crossChainFee
    ) external payable {
        // Validate input parameters
        require(_inputAmount > 0, "Input amount must be greater than zero");
        require(_crossChainFee >= 0, "Cross-chain fee must be non-negative");
        require(msg.value >= _inputAmount, "Insufficient ETH sent");

        uint feeAmount = FeeCalculation.calculateFee(_inputAmount, factoryStorage.feeRate());
        uint finalAmount = _inputAmount + feeAmount + _crossChainFee;
        require(msg.value >= finalAmount, "lower than required amount");
        //transfer fee to the owner
        weth.deposit{value: finalAmount}();
        // Transfer fee to the fee receiver and check the result
        require(
            weth.transfer(address(factoryStorage.feeReceiver()), feeAmount),
            "Fee transfer failed"
        );
        //set mappings
        factoryStorage.increaseIssuanceNonce();
        factoryStorage.setIssuanceData(
            factoryStorage.issuanceNonce(),
            msg.sender,
            address(weth),
            _inputAmount,
            bytes32(0)
        );
        //run issuance
        _issuance(address(weth), _inputAmount, _crossChainFee);
    }

    /**
     * @dev Internal function to handle issuance.
     * @param _tokenIn The address of the input token.
     * @param _inputAmount The amount of input token.
     * @param _crossChainFee The cross-chain fee.
     */
    function _issuance(
        address _tokenIn,
        uint _inputAmount,
        uint _crossChainFee
    ) internal {
        uint wethAmount = _inputAmount;

        // swap to underlying assets on all chain
        uint totalChains = functionsOracle.currentChainSelectorsCount();
        uint latestCount = functionsOracle.currentFilledCount();
        (, , uint64[] memory chainSelectors) = functionsOracle.getCurrentData(
            latestCount
        );
        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint chainSelectorTokensCount = functionsOracle
                .currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _issuanceSwapsCurrentChain(
                    wethAmount,
                    factoryStorage.issuanceNonce(),
                    chainSelectorTokensCount,
                    chainSelector,
                    latestCount
                );
            } else {
                _issuanceSwapsOtherChains(
                    wethAmount,
                    factoryStorage.issuanceNonce(),
                    chainSelector,
                    latestCount
                );
            }
        }
        emit RequestIssuance(
            factoryStorage.getIssuanceMessageId(factoryStorage.issuanceNonce()),
            factoryStorage.issuanceNonce(),
            msg.sender,
            _tokenIn,
            factoryStorage.getIssuanceInputAmount(factoryStorage.issuanceNonce()),
            0,
            block.timestamp
        );
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
        uint _wethAmount,
        uint _issuanceNonce,
        uint _chainSelectorTokensCount,
        uint64 _chainSelector,
        uint _latestCount
    ) internal {
        address[] memory tokens = functionsOracle.allCurrentChainSelectorTokens(
            _chainSelector
        );
        for (uint i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (
                address[] memory fromETHPath,
                uint24[] memory fromETHFees
            ) = functionsOracle.getFromETHPathData(tokenAddress);

            factoryStorage.setIssuanceOldTokenValue(
                _issuanceNonce,
                tokenAddress,
                factoryStorage.getCurrentTokenValue(tokenAddress)
            );

            uint tokenMarketShare = functionsOracle.tokenCurrentMarketShare(
                tokenAddress
            );
            uint swapAmount = (_wethAmount * tokenMarketShare) / 100e18;
            if (tokenAddress != address(weth)) {
                swap(
                    fromETHPath,
                    fromETHFees,
                    swapAmount,
                    address(factoryStorage.vault())
                );
            } else {
                weth.transfer(address(factoryStorage.vault()), swapAmount);
            }

            factoryStorage.setIssuanceNewTokenValue(
                _issuanceNonce,
                tokenAddress,
                factoryStorage.getCurrentTokenValue(tokenAddress)
            );
            factoryStorage.issuanceIncreaseCompletedTokensCount(_issuanceNonce);
        }
    }

    function _issuanceSwapsOtherChains(
        uint _wethAmount,
        uint _issuanceNonce,
        uint64 _chainSelector,
        uint _latestCount
    ) internal {
        
        uint totalShares = functionsOracle.getCurrentChainSelectorTotalShares(
            _latestCount,
            _chainSelector
        );
        uint chainWethAmount = (_wethAmount * totalShares) / 100e18;

        weth.approve(address(coreSender), chainWethAmount);
        coreSender.sendIssuanceRequest(
            chainWethAmount,
            _issuanceNonce,
            _chainSelector,
            _latestCount
        );
    }


    /**
     * @dev Redeems tokens.
     * @param amountIn The amount of input tokens.
     * @param _crossChainFee The cross-chain fee.
     * @param _tokenOut The address of the output token.
     */
    function redemption(
        uint amountIn,
        uint _crossChainFee,
        address _tokenOut,
        address[] memory _tokenOutPath,
        uint24[] memory _tokenOutFees
    ) public {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_crossChainFee >= 0, "Cross-chain fee must be non-negative");
        require(_tokenOut != address(0), "Invalid output token address");
        uint burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        factoryStorage.increaseRedemptionNonce();
        factoryStorage.setRedemptionData(
            factoryStorage.redemptionNonce(),
            msg.sender,
            _tokenOut,
            amountIn,
            _tokenOutPath,
            _tokenOutFees,
            bytes32(0)
        );

        indexToken.burn(msg.sender, amountIn);

        //swap
        uint totalChains = functionsOracle.currentChainSelectorsCount();
        uint latestCount = functionsOracle.currentFilledCount();
        (, , uint64[] memory chainSelectors) = functionsOracle.getCurrentData(
            latestCount
        );
        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint chainSelectorTokensCount = functionsOracle
                .currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _redemptionSwapsCurrentChain(
                    burnPercent,
                    // redemptionNonce,
                    factoryStorage.redemptionNonce(),
                    chainSelectorTokensCount
                );
            } else {
                _redemptionSwapsOtherChains(
                    burnPercent,
                    factoryStorage.redemptionNonce(),
                    chainSelector
                );
            }
        }
        emit RequestRedemption(
            factoryStorage.getRedemptionMessageId(factoryStorage.redemptionNonce()),
            factoryStorage.redemptionNonce(),
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
        uint _burnPercent,
        uint _redemptionNonce,
        uint _chainSelectorTokensCount
    ) internal {
        address[] memory tokens = functionsOracle.allCurrentChainSelectorTokens(
            currentChainSelector
        );
        Vault vault = factoryStorage.vault();
        for (uint i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (
                address[] memory toETHPath,
                uint24[] memory toETHFees
            ) = functionsOracle.getToETHPathData(tokenAddress);
            uint swapAmount = (_burnPercent *
                IERC20(tokenAddress).balanceOf(
                    address(factoryStorage.vault())
                )) / 1e18;
            vault.withdrawFunds(tokenAddress, address(this), swapAmount);
            uint swapAmountOut = tokenAddress == address(weth)
                ? swapAmount
                : swap(toETHPath, toETHFees, swapAmount, address(coreSender));
            factoryStorage.increaseRedemptionTotalValue(
                _redemptionNonce,
                swapAmountOut
            );
            factoryStorage.increaseRedemptionTotalPortfolioValues(
                _redemptionNonce,
                factoryStorage.getAmountOut(
                    toETHPath,
                    toETHFees,
                    IERC20(tokenAddress).balanceOf(
                        address(factoryStorage.vault())
                    )
                )
            );
            factoryStorage.increaseRedemptionCompletedTokensCount(_redemptionNonce, 1);
        }
    }

    

    function _redemptionSwapsOtherChains(
        uint _burnPercent,
        uint _redemptionNonce,
        uint64 _chainSelector
    ) internal {
        coreSender.sendRedemptionRequest(_burnPercent, _redemptionNonce, _chainSelector);
    }

    
}
