// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

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

contract IndexFactory is Initializable, ProposableOwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    // using MessageSender for *;

    struct IssuanceSendLocalVars {
        address[] tokenAddresses;
        uint256[] tokenVersions;
        uint256[] tokenShares;
        address[] zeroAddresses;
        uint256[] zeroNumbers;
    }


    IndexToken public indexToken;
    IndexFactoryStorage public factoryStorage;
    FunctionsOracle public functionsOracle;
    CoreSender public coreSender;

    uint64 public currentChainSelector;

    IWETH public weth;

    event RequestIssuance(
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

    modifier onlyOwnerOrBalancers() {
        require(
            msg.sender == owner() || functionsOracle.isOperator(msg.sender) || msg.sender == address(factoryStorage.balancerSender()) || msg.sender == address(factoryStorage.indexFactoryBalancer()),
            "Not owner or balancer"
        );
        _;
    }

    /**
     * @dev Pauses the contract.
     */
    function pause() external onlyOwnerOrBalancers {
        _pause();
    }

    /**
     * @dev Unpauses the contract.
     */
    function unpause() external onlyOwnerOrBalancers {
        _unpause();
    }

    

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

    // set WETH address
    function setWethAddress(address _weth) public onlyOwner {
        require(_weth != address(0), "Invalid WETH address");
        weth = IWETH(_weth);
    }

    /**
     * @dev Sets the IndexToken contract address.
     * @param _token The address of the IndexToken contract.
     */
    function setIndexToken(address _token) public onlyOwner {
        require(_token != address(0), "Invalid token address");
        indexToken = IndexToken(payable(_token));
    }

    /**
     * @dev Sets the current chain selector.
     * @param _currentChainSelector The current chain selector.
     */
    function setCurrentChainSelector(uint64 _currentChainSelector) public onlyOwner {
        require(_currentChainSelector > 0, "Invalid chain selector");
        currentChainSelector = _currentChainSelector;
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
    function swap(address[] memory path, uint24[] memory fees, uint256 amountIn, address _recipient)
        internal
        returns (uint256 outputAmount)
    {
        ISwapRouter swapRouterV3 = factoryStorage.swapRouterV3();
        IUniswapV2Router02 swapRouterV2 = factoryStorage.swapRouterV2();
        uint256 amountOutMinimum = factoryStorage.getMinAmountOut(path, fees, amountIn);
        outputAmount = SwapHelpers.swap(swapRouterV3, swapRouterV2, path, fees, amountIn, amountOutMinimum, _recipient);
    }

    function getIssuanceFee(
        address _tokenIn,
        address[] memory _tokenInPath,
        uint24[] memory _tokenInFees,
        uint256 _inputAmount
    ) public view returns (uint256) {
        // get weth amount
        uint wethAmount;
        if(_tokenIn == address(weth)){
            wethAmount = _inputAmount;
        } else {
            wethAmount = factoryStorage.getAmountOut(_tokenInPath, _tokenInFees, _inputAmount);
        }

        // get fee for other chains
        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCount = functionsOracle.currentFilledCount();
        (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCount);

        uint256 totalCrossChainFee;
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector != currentChainSelector) {
               uint256 totalShares = functionsOracle.getCurrentChainSelectorTotalShares(latestCount, chainSelector);
               uint256 chainWethAmount = (wethAmount * totalShares) / 100e18;
               //get the fee
                uint256 fee = coreSender.calculateIssuanceFee(chainSelector, chainWethAmount);
                totalCrossChainFee += fee;
            }
        }

        return totalCrossChainFee;
    }

    function getRedemptionFee(uint256 amountIn) public view returns (uint256) {
        uint256 burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCount = functionsOracle.currentFilledCount();
        (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCount);
        uint256 totalCrossChainFee;
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            if (chainSelector != currentChainSelector) {
                //get the fee
                uint256 fee = coreSender.calculateRedemptionFee(chainSelector);
                totalCrossChainFee += fee;
            }
        }
        return totalCrossChainFee;
    }

    /**
     * @dev Issues index tokens.
     * @param _tokenIn The address of the input token.
     * @param _tokenInPath The path of the input token.
     * @param _inputAmount The amount of input token.
     */
    function issuanceIndexTokens(
        address _tokenIn,
        address[] memory _tokenInPath,
        uint24[] memory _tokenInFees,
        uint256 _inputAmount
    ) public payable whenNotPaused {
        // Validate input parameters
        require(_tokenIn != address(0), "Invalid input token address");
        require(_inputAmount > 0, "Input amount must be greater than zero");
        require(_tokenInPath[_tokenInPath.length - 1] == address(weth), "Invalid token path");
        require(getIssuanceFee(_tokenIn, _tokenInPath, _tokenInFees, _inputAmount) == msg.value, "Insufficient ETH sent for cross chain fee");
        (bool success, ) = factoryStorage.coreSender().call{value: msg.value}("");
        require(success, "Cross chain fee transfer failed");
        IWETH weth = factoryStorage.weth();
        Vault vault = factoryStorage.vault();

        uint256 feeAmount = FeeCalculation.calculateFee(_inputAmount, factoryStorage.feeRate());

        factoryStorage.increaseIssuanceNonce();
        factoryStorage.setIssuanceData(factoryStorage.issuanceNonce(), msg.sender, _tokenIn, _inputAmount, bytes32(0));

        require(
            IERC20(_tokenIn).transferFrom(msg.sender, address(this), _inputAmount + feeAmount), "Token transfer failed"
        );
        uint256 wethAmountBeforFee = swap(_tokenInPath, _tokenInFees, _inputAmount + feeAmount, address(this));
        uint256 feeWethAmount = (wethAmountBeforFee * factoryStorage.feeRate()) / 10000;
        uint256 wethAmount = wethAmountBeforFee - feeWethAmount;

        // Transfer fee to the fee receiver and check the result
        require(weth.transfer(address(factoryStorage.feeReceiver()), feeWethAmount), "Fee transfer failed");

        //run issuance
        _issuance(_tokenIn, wethAmount);
    }

    /**
     * @dev Issues index tokens with ETH.
     * @param _inputAmount The amount of input token.
     */
    function issuanceIndexTokensWithEth(uint256 _inputAmount) external whenNotPaused payable {
        // Validate input parameters
        require(_inputAmount > 0, "Input amount must be greater than zero");
        require(msg.value >= _inputAmount, "Insufficient ETH sent");
        
        uint256 feeAmount = FeeCalculation.calculateFee(_inputAmount, factoryStorage.feeRate());
        uint256 crossChainFee = getIssuanceFee(address(weth), new address[](0), new uint24[](0), _inputAmount);
        uint256 finalAmount = _inputAmount + feeAmount + crossChainFee;
        require(msg.value == finalAmount, "lower than required amount");
        (bool success, ) = factoryStorage.coreSender().call{value: crossChainFee}("");
        require(success, "Cross chain fee transfer failed");
        //transfer fee to the owner
        weth.deposit{value: finalAmount - crossChainFee}();
        // Transfer fee to the fee receiver and check the result
        require(weth.transfer(address(factoryStorage.feeReceiver()), feeAmount), "Fee transfer failed");

        //set mappings
        factoryStorage.increaseIssuanceNonce();
        factoryStorage.setIssuanceData(
            factoryStorage.issuanceNonce(), msg.sender, address(weth), _inputAmount, bytes32(0)
        );
        //run issuance
        _issuance(address(weth), _inputAmount);
    }

    /**
     * @dev Internal function to handle issuance.
     * @param _tokenIn The address of the input token.
     * @param _inputAmount The amount of input token.
     */
    function _issuance(address _tokenIn, uint256 _inputAmount) internal {
        uint256 wethAmount = _inputAmount;
        factoryStorage.increasePendingIssuanceInputByNonce(factoryStorage.issuanceNonce(), wethAmount);
        // swap to underlying assets on all chain
        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCount = functionsOracle.currentFilledCount();
        (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCount);
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _issuanceSwapsCurrentChain(
                    wethAmount, factoryStorage.issuanceNonce(), chainSelectorTokensCount, chainSelector, latestCount
                );
            } else {
                _issuanceSwapsOtherChains(wethAmount, factoryStorage.issuanceNonce(), chainSelector, latestCount);
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
        uint256 _wethAmount,
        uint256 _issuanceNonce,
        uint256 _chainSelectorTokensCount,
        uint64 _chainSelector,
        uint256 _latestCount
    ) internal {
        address[] memory tokens = functionsOracle.allCurrentChainSelectorTokens(_chainSelector);
        for (uint256 i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (address[] memory fromETHPath, uint24[] memory fromETHFees) =
                functionsOracle.getFromETHPathData(tokenAddress);

            factoryStorage.setIssuanceOldTokenValue(
                _issuanceNonce, tokenAddress, factoryStorage.getCurrentTokenValue(tokenAddress)
            );

            uint256 tokenMarketShare = functionsOracle.tokenCurrentMarketShare(tokenAddress);
            uint256 swapAmount = (_wethAmount * tokenMarketShare) / 100e18;
            if (tokenAddress != address(weth)) {
                swap(fromETHPath, fromETHFees, swapAmount, address(factoryStorage.vault()));
            } else {
                weth.transfer(address(factoryStorage.vault()), swapAmount);
            }

            factoryStorage.setIssuanceNewTokenValue(
                _issuanceNonce, tokenAddress, factoryStorage.getCurrentTokenValue(tokenAddress)
            );
            factoryStorage.issuanceIncreaseCompletedTokensCount(_issuanceNonce);
        }
    }

    function _issuanceSwapsOtherChains(
        uint256 _wethAmount,
        uint256 _issuanceNonce,
        uint64 _chainSelector,
        uint256 _latestCount
    ) internal {
        uint256 totalShares = functionsOracle.getCurrentChainSelectorTotalShares(_latestCount, _chainSelector);
        uint256 chainWethAmount = (_wethAmount * totalShares) / 100e18;

        weth.approve(address(coreSender), chainWethAmount);
        coreSender.sendIssuanceRequest(chainWethAmount, _issuanceNonce, _chainSelector, _latestCount);
    }

    /**
     * @dev Redeems tokens.
     * @param amountIn The amount of input tokens.
     * @param _tokenOut The address of the output token.
     */
    function redemption(
        uint256 amountIn,
        address _tokenOut,
        address[] memory _tokenOutPath,
        uint24[] memory _tokenOutFees
    ) public payable whenNotPaused {
        // Validate input parameters
        require(amountIn > 0, "Amount must be greater than zero");
        require(_tokenOut != address(0), "Invalid output token address");
        require(_tokenOutPath[0] == address(weth), "Invalid token path");
        require(getRedemptionFee(amountIn) >= msg.value, "Insufficient ETH sent for cross chain fee");
        (bool success, ) = factoryStorage.coreSender().call{value: msg.value}("");
        require(success, "Cross chain fee transfer failed");
        uint256 burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        factoryStorage.increaseRedemptionNonce();
        factoryStorage.increasePendingRedemptionInputByNonce(factoryStorage.redemptionNonce(), amountIn);
        factoryStorage.setRedemptionData(
            factoryStorage.redemptionNonce(), msg.sender, _tokenOut, amountIn, _tokenOutPath, _tokenOutFees, bytes32(0)
        );

        indexToken.burn(msg.sender, amountIn);

        //swap
        uint256 totalChains = functionsOracle.currentChainSelectorsCount();
        uint256 latestCount = functionsOracle.currentFilledCount();
        (,, uint64[] memory chainSelectors) = functionsOracle.getCurrentData(latestCount);
        for (uint256 i = 0; i < totalChains; i++) {
            uint64 chainSelector = chainSelectors[i];
            uint256 chainSelectorTokensCount = functionsOracle.currentChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                _redemptionSwapsCurrentChain(
                    burnPercent,
                    // redemptionNonce,
                    factoryStorage.redemptionNonce(),
                    chainSelectorTokensCount
                );
            } else {
                _redemptionSwapsOtherChains(burnPercent, factoryStorage.redemptionNonce(), chainSelector);
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
        uint256 _burnPercent,
        uint256 _redemptionNonce,
        uint256 _chainSelectorTokensCount
    ) internal {
        address[] memory tokens = functionsOracle.allCurrentChainSelectorTokens(currentChainSelector);
        Vault vault = factoryStorage.vault();
        for (uint256 i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (address[] memory toETHPath, uint24[] memory toETHFees) = functionsOracle.getToETHPathData(tokenAddress);
            uint256 swapAmount = (_burnPercent * IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))) / 1e18;
            vault.withdrawFunds(tokenAddress, address(this), swapAmount);
            uint256 swapAmountOut =
                tokenAddress == address(weth) ? swapAmount : swap(toETHPath, toETHFees, swapAmount, address(coreSender));
            if (tokenAddress == address(weth)) {
                weth.transfer(address(coreSender), swapAmount);
            }
            factoryStorage.increasePendingRedemptionHoldValueByNonce(_redemptionNonce, swapAmountOut);
            factoryStorage.increaseRedemptionTotalValue(_redemptionNonce, swapAmountOut);
            factoryStorage.increaseRedemptionTotalPortfolioValues(
                _redemptionNonce,
                tokenAddress == address(weth)
                    ? IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))
                    : factoryStorage.getAmountOut(
                        toETHPath, toETHFees, IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))
                    )
            );
            factoryStorage.increaseRedemptionCompletedTokensCount(_redemptionNonce, 1);
        }
    }

    function _redemptionSwapsOtherChains(uint256 _burnPercent, uint256 _redemptionNonce, uint64 _chainSelector)
        internal
    {
        coreSender.sendRedemptionRequest(_burnPercent, _redemptionNonce, _chainSelector);
    }

    
}
