// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IndexFactoryStorage.sol";
import "./FunctionsOracle.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libraries/SwapHelpers.sol";
import "../interfaces/IWETH.sol";
import "./BalancerSender.sol";
import "./IndexFactory.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactoryBalancer is Initializable, ProposableOwnableUpgradeable, PausableUpgradeable {
    IndexFactoryStorage public factoryStorage;
    FunctionsOracle public functionsOracle;
    BalancerSender public balancerSender;

    uint64 public currentChainSelector;

    IWETH public weth;

    struct LowSwapVariables {
        address tokenAddress;
        uint256 tokenMarketShare;
        uint256 chainValue;
        uint256 swapWethAmount;
        uint256 wethAmount;
    }

    struct ExtraSwapVariables {
        address tokenAddress;
        uint256 tokenMarketShare;
        uint256 chainValue;
        uint256 swapWethAmount;
    }

    event RequestedAskValues(uint256 time);
    event RequestedFirstReweightAction(uint256 time);
    event RequestedSecondReweightAction(uint256 time);

    /**
     * @dev Pauses the contract.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    modifier onlyOwnerOrOperator() {
        require(msg.sender == owner() || functionsOracle.isOperator(msg.sender), "Caller is not the owner or operator");
        _;
    }

    /**
     * @dev Initializes the contract with the given parameters.
     * @param _currentChainSelector The current chain selector.
     * @param _factoryStorage The address of the IndexFactoryStorage contract.
     * @param _weth The address of the WETH token.
     */
    function initialize(
        uint64 _currentChainSelector,
        address _factoryStorage,
        address _functionsOracle,
        address payable _balancerSender,
        //addresses
        address _weth
    ) external initializer {
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_factoryStorage != address(0), "Invalid factory storage address");
        require(_weth != address(0), "Invalid WETH address");
        __Ownable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        factoryStorage = IndexFactoryStorage(_factoryStorage);
        functionsOracle = FunctionsOracle(_functionsOracle);
        balancerSender = BalancerSender(_balancerSender);
        //set addresses
        weth = IWETH(_weth);
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
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

    function setBalancerSender(address payable _balancerSender) public onlyOwner {
        balancerSender = BalancerSender(_balancerSender);
    }

    // set WETH address
    function setWethAddress(address _weth) public onlyOwner {
        require(_weth != address(0), "Invalid WETH address");
        weth = IWETH(_weth);
    }

    /**
     * @dev Sets the current chain selector.
     * @param _currentChainSelector The current chain selector.
     */
    function setCurrentChainSelector(uint64 _currentChainSelector) public onlyOwner {
        require(_currentChainSelector > 0, "Invalid chain selector");
        currentChainSelector = _currentChainSelector;
    }

    // pause index factory when rebalance happens
    function pauseIndexFactory() public onlyOwnerOrOperator {
        address indexFactoryAddress = factoryStorage.indexFactory();
        IndexFactory indexFactory = IndexFactory(payable(indexFactoryAddress));
        if (!indexFactory.paused()) {
            indexFactory.pause();
        }
    }

    // unpause index factory when rebalance is done
    function unpauseIndexFactory() public onlyOwnerOrOperator {
        address indexFactoryAddress = factoryStorage.indexFactory();
        IndexFactory indexFactory = IndexFactory(payable(indexFactoryAddress));
        if (indexFactory.paused()) {
            indexFactory.unpause();
        }
    }

    /**
     * @dev Swaps tokens.
     * @param path The path of the swap.
     * @param fees The fees of the swap.
     * @param amountIn The amount of input token.
     * @param _recipient The address of the recipient.
     * @return outputAmount The amount of output token.
     */
    function swap(address[] memory path, uint24[] memory fees, uint256 amountIn, address _recipient)
        public
        returns (uint256 outputAmount)
    {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_recipient != address(0), "Invalid recipient address");
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        uint256 amountOutMinimum = factoryStorage.getMinAmountOut(path, fees, amountIn);
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, path, fees, amountIn, amountOutMinimum, _recipient);
    }

    function _checkValuesCurrentChain(uint64 chainSelector, uint256 chainSelectorTokensCount) internal {
        address[] memory tokens = functionsOracle.allCurrentChainSelectorTokens(chainSelector);
        Vault vault = factoryStorage.vault();
        for (uint256 j = 0; j < chainSelectorTokensCount; j++) {
            address tokenAddress = tokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) = functionsOracle.getToETHPathData(tokenAddress);
            uint256 value;
            if (tokenAddress == address(weth)) {
                value = IERC20(tokenAddress).balanceOf(address(vault));
            } else {
                value =
                    factoryStorage.getAmountOut(toETHPath, toETHFees, IERC20(tokenAddress).balanceOf(address(vault)));
            }

            factoryStorage.increasePortfolioTotalValueByNonce(
                factoryStorage.updatePortfolioNonce(), factoryStorage.convertEthToUsd(value)
            );
            factoryStorage.increaseTokenValueByNonce(
                factoryStorage.updatePortfolioNonce(), tokenAddress, factoryStorage.convertEthToUsd(value)
            );
            factoryStorage.increaseUpdatedTokensValueCount(factoryStorage.updatePortfolioNonce());
            factoryStorage.increaseChainValueByNonce(
                factoryStorage.updatePortfolioNonce(), currentChainSelector, factoryStorage.convertEthToUsd(value)
            );
        }
    }

    function _checkValuesOtherChains(uint64 chainSelector) internal {
        balancerSender.sendAskValues(chainSelector);
    }

    /**
     * @dev Requests values for the portfolio.
     */
    function askValues() public whenNotPaused onlyOwnerOrOperator {
        pauseIndexFactory();
        factoryStorage.increaseUpdatePortfolioNonce();

        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCount = functionsOracle.currentFilledCount();

        for (uint256 i = 0; i < totalChains; i++) {
            (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCount);
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _checkValuesCurrentChain(chainSelector, chainSelectorTokensCount);
            } else {
                _checkValuesOtherChains(chainSelector);
            }
        }

        emit RequestedAskValues(block.timestamp);
    }

    /**
     * @dev Performs the first reweight action.
     */
    function firstReweightAction() public whenNotPaused onlyOwnerOrOperator {
        uint256 nonce = factoryStorage.updatePortfolioNonce();
        uint256 portfolioValue = factoryStorage.portfolioTotalValueByNonce(nonce);

        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCurrentCount = functionsOracle.currentFilledCount();
        uint256 latestOracleCount = functionsOracle.oracleFilledCount();

        (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCurrentCount);
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];

            uint256 chainSelectorCurrentTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorOracleTokensCount = functionsOracle.oracleChainSelectorTokensCount(chainSelector);
            uint256 currentChainSelectorTotalShares =
                functionsOracle.getCurrentChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint256 oracleChainSelectorTotalShares =
                functionsOracle.getOracleChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint256 chainValue = factoryStorage.chainValueByNonce(nonce, chainSelector);
            uint256[] memory oracleTokenShares = functionsOracle.allOracleChainSelectorTokenShares(chainSelector);

            if ((chainValue * 100e18) / portfolioValue > oracleChainSelectorTotalShares) {
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

        emit RequestedFirstReweightAction(block.timestamp);
    }

    function _swapTokensToWETHFirstRebalance(
        uint64 chainSelector,
        uint256 portfolioValue,
        uint256 chainSelectorCurrentTokensCount,
        uint256 currentChainSelectorTotalShares,
        uint256 oracleChainSelectorTotalShares,
        Vault vault,
        uint256 chainValue,
        uint256 initialWethBalance
    ) internal returns (uint256 chainCurrentRealShare, uint256 wethAmountToSwap, uint256 extraWethAmount) {
        uint256 swapWethAmount;
        address[] memory currentTokens = functionsOracle.allCurrentChainSelectorTokens(chainSelector);
        for (uint256 j = 0; j < currentTokens.length; j++) {
            ExtraSwapVariables memory swapVars;
            swapVars.tokenAddress = currentTokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) =
                functionsOracle.getToETHPathData(swapVars.tokenAddress);
            uint256 wethAmount;
            if (swapVars.tokenAddress == address(weth)) {
                vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
                wethAmount = initialWethBalance;
            } else {
                uint256 tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
                vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
                wethAmount = swap(toETHPath, toETHFees, tokenAmount, address(this));
            }
            swapWethAmount += wethAmount;
        }

        chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        wethAmountToSwap = (swapWethAmount * oracleChainSelectorTotalShares) / chainCurrentRealShare;
        extraWethAmount = swapWethAmount - wethAmountToSwap;
    }

    function _internalSwapsWETHToTokensForFirstRebalance(
        address _newTokenAddress,
        uint256 _wethAmountToSwap,
        uint256 _newTokenMarketShare,
        uint256 _oracleChainSelectorTotalShares,
        Vault _vault
    ) internal returns (uint256) {
        uint256 wethAmount;
        if (_newTokenAddress == address(weth)) {
            wethAmount = (_wethAmountToSwap * _newTokenMarketShare) / _oracleChainSelectorTotalShares;
            weth.transfer(address(_vault), wethAmount);
        } else {
            (address[] memory fromETHPath, uint24[] memory fromETHFees) =
                functionsOracle.getFromETHPathData(_newTokenAddress);
            wethAmount = swap(
                fromETHPath,
                fromETHFees,
                (_wethAmountToSwap * _newTokenMarketShare) / _oracleChainSelectorTotalShares,
                address(_vault)
            );
        }
        return wethAmount;
    }

    function _swapWETHToTokensForFirstRebalance(
        uint64 chainSelector,
        uint256 wethAmountToSwap,
        uint256 chainSelectorOracleTokensCount,
        uint256 currentChainSelectorTotalShares,
        uint256 oracleChainSelectorTotalShares,
        Vault vault
    ) internal {
        address[] memory oracleTokens = functionsOracle.allOracleChainSelectorTokens(chainSelector);
        for (uint256 k = 0; k < oracleTokens.length; k++) {
            address newTokenAddress = oracleTokens[k];

            uint256 newTokenMarketShare = functionsOracle.tokenOracleMarketShare(newTokenAddress);

            uint256 wethAmount = _internalSwapsWETHToTokensForFirstRebalance(
                newTokenAddress, wethAmountToSwap, newTokenMarketShare, oracleChainSelectorTotalShares, vault
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
        uint256 i,
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorCurrentTokensCount,
        uint256 chainSelectorOracleTokensCount,
        uint256 currentChainSelectorTotalShares,
        uint256 oracleChainSelectorTotalShares
    ) internal {
        ExtraSwapVariables memory swapVars;
        Vault vault = factoryStorage.vault();
        swapVars.chainValue = factoryStorage.chainValueByNonce(nonce, chainSelector);
        uint256 initialWethBalance = weth.balanceOf(address(vault));
        (uint256 chainCurrentRealShare, uint256 wethAmountToSwap, uint256 extraWethAmount) =
        _swapTokensToWETHFirstRebalance(
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

        factoryStorage.increaseExtraWethByNonce(nonce, extraWethAmount);
        factoryStorage.increasePendingExtraWethByNonce(nonce, extraWethAmount);
        factoryStorage.increaseReweightExtraPercentage(nonce, chainCurrentRealShare - oracleChainSelectorTotalShares);
    }

    function _sendExtraValueOtherChains(
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 oracleChainSelectorTotalShares,
        uint256 chainValue,
        uint256[] memory oracleTokenShares
    ) internal {
        balancerSender.sendFirstReweightAction(
            nonce, portfolioValue, chainSelector, oracleChainSelectorTotalShares, chainValue, oracleTokenShares
        );
    }

    /**
     * @dev Performs the second reweight action.
     */
    function secondReweightAction() public whenNotPaused onlyOwnerOrOperator {
        uint256 nonce = factoryStorage.updatePortfolioNonce();
        uint256 portfolioValue = factoryStorage.portfolioTotalValueByNonce(nonce);

        uint256 totalChains = functionsOracle.oracleChainSelectorsCount();
        uint256 latestOracleCount = functionsOracle.oracleFilledCount();

        bool isOnlyOnCurrentChain = true;
        for (uint256 i = 0; i < totalChains; i++) {
            (,, uint64[] memory chainSelectors) = functionsOracle.getOracleData(latestOracleCount);
            uint64 chainSelector = chainSelectors[i];

            uint256 chainSelectorCurrentTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            uint256 chainSelectorOracleTokensCount = functionsOracle.oracleChainSelectorTokensCount(chainSelector);
            uint256 oracleChainSelectorTotalShares =
                functionsOracle.getOracleChainSelectorTotalShares(latestOracleCount, chainSelector);
            uint256 chainValue = factoryStorage.chainValueByNonce(nonce, chainSelector);
            uint256[] memory oracleTokenShares = functionsOracle.allOracleChainSelectorTokenShares(chainSelector);

            if ((chainValue * 100e18) / portfolioValue < oracleChainSelectorTotalShares) {
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
                    isOnlyOnCurrentChain = false;
                    _sendLowerValueOtherChain(
                        nonce,
                        portfolioValue,
                        chainSelector,
                        oracleChainSelectorTotalShares,
                        chainValue,
                        oracleTokenShares
                    );
                }
                if (isOnlyOnCurrentChain) {
                    functionsOracle.updateCurrentList();
                }
            }
        }
        factoryStorage.decreasePendingExtraWethByNonce(nonce);
        emit RequestedSecondReweightAction(block.timestamp);
    }

    function _swapLowerValueCurrentChainToWETH(
        Vault vault,
        uint64 chainSelector,
        uint256 chainSelectorTokensCount,
        uint256 portfolioValue,
        uint256 chainValue
    ) internal returns (uint256 swapWethAmount) {
        LowSwapVariables memory swapVars;
        Vault vault = factoryStorage.vault();
        uint256 initialWethBalance = weth.balanceOf(address(vault));
        address[] memory currentTokens = functionsOracle.allCurrentChainSelectorTokens(chainSelector);
        for (uint256 j = 0; j < currentTokens.length; j++) {
            swapVars.tokenAddress = currentTokens[j];
            (address[] memory toETHPath, uint24[] memory toETHFees) =
                functionsOracle.getToETHPathData(swapVars.tokenAddress);

            if (swapVars.tokenAddress == address(weth)) {
                vault.withdrawFunds(swapVars.tokenAddress, address(this), initialWethBalance);
                swapVars.wethAmount = initialWethBalance;
            } else {
                uint256 tokenAmount = IERC20(swapVars.tokenAddress).balanceOf(address(vault));
                vault.withdrawFunds(swapVars.tokenAddress, address(this), tokenAmount);
                swapVars.wethAmount = swap(toETHPath, toETHFees, tokenAmount, address(this));
            }
            swapVars.swapWethAmount += swapVars.wethAmount;
        }
        swapWethAmount = swapVars.swapWethAmount;
    }

    function _swapLowerValueCurrentChainFromWETH(
        Vault vault,
        uint64 chainSelector,
        uint256 swapWethAmount,
        uint256 oracleChainSelectorTotalShares
    ) internal {
        LowSwapVariables memory swapVars;
        swapVars.swapWethAmount = swapWethAmount;
        address[] memory oracleTokens = functionsOracle.allOracleChainSelectorTokens(chainSelector);
        for (uint256 k = 0; k < oracleTokens.length; k++) {
            address newTokenAddress = oracleTokens[k];
            (address[] memory fromETHPath, uint24[] memory fromETHFees) =
                functionsOracle.getFromETHPathData(newTokenAddress);

            uint256 newTokenMarketShare = functionsOracle.tokenOracleMarketShare(newTokenAddress);
            if (newTokenAddress == address(weth)) {
                swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / oracleChainSelectorTotalShares;
                weth.transfer(address(vault), swapVars.wethAmount);
            } else {
                swapVars.wethAmount = swap(
                    fromETHPath,
                    fromETHFees,
                    (swapVars.swapWethAmount * newTokenMarketShare) / oracleChainSelectorTotalShares,
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
        uint256 i,
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 chainSelectorCurrentTokensCount,
        uint256 chainSelectorOracleTokensCount,
        uint256 oracleChainSelectorTotalShares
    ) internal {
        Vault vault = factoryStorage.vault();
        LowSwapVariables memory swapVars;
        swapVars.chainValue = factoryStorage.chainValueByNonce(nonce, chainSelector);

        swapVars.swapWethAmount = _swapLowerValueCurrentChainToWETH(
            vault, chainSelector, chainSelectorCurrentTokensCount, portfolioValue, swapVars.chainValue
        );
        uint256 chainCurrentRealShare = (swapVars.chainValue * 100e18) / portfolioValue;
        uint256 negativePercentage = oracleChainSelectorTotalShares - chainCurrentRealShare;
        uint256 extraWethAmount = (factoryStorage.extraWethByNonce(nonce) * negativePercentage)
            / factoryStorage.reweightExtraPercentage(nonce);
        swapVars.swapWethAmount += extraWethAmount;

        _swapLowerValueCurrentChainFromWETH(
            vault, chainSelector, swapVars.swapWethAmount, oracleChainSelectorTotalShares
        );
    }

    struct SendLowerValueOtherChainVars {
        address[] currentTokenAddresses;
        address[] newTokenAddresses;
        uint256[] extraData;
    }

    function _calculateExtraAmountForLowerValue(
        uint256 _nonce,
        uint256 _portfolioValue,
        uint256 _chainValue,
        uint256 _oracleChainSelectorTotalShares
    ) internal view returns (uint256) {
        uint256 chainCurrentRealShare = (_chainValue * 100e18) / _portfolioValue;
        uint256 negativePercentage = _oracleChainSelectorTotalShares - chainCurrentRealShare;
        uint256 extraWethAmount = (factoryStorage.extraWethByNonce(_nonce) * negativePercentage)
            / factoryStorage.reweightExtraPercentage(_nonce);

        return extraWethAmount;
    }

    function _sendLowerValueOtherChain(
        uint256 nonce,
        uint256 portfolioValue,
        uint64 chainSelector,
        uint256 oracleChainSelectorTotalShares,
        uint256 chainValue,
        uint256[] memory oracleTokenShares
    ) internal {
        uint256 extraWethAmount =
            _calculateExtraAmountForLowerValue(nonce, portfolioValue, chainValue, oracleChainSelectorTotalShares);

        weth.approve(address(balancerSender), extraWethAmount);
        balancerSender.sendSecondReweightAction(
            nonce, portfolioValue, chainSelector, oracleChainSelectorTotalShares, oracleTokenShares, extraWethAmount
        );
    }
}
