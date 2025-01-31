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
    CCIPReceiver,
    ProposableOwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
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
        uint oldTokenValue;
        uint newTokenValue;
    }

    struct IssuanceData {
        mapping(address => TokenOldAndNewValues) tokenOldAndNewValues;
        uint completedTokensCount;
        address requester;
        uint inputAmount;
        address inputToken;
        bytes32 messageId;
    }

    struct RedemptionData {
        uint totalValue;
        uint completedTokensCount;
        address requester;
        address outputToken;
        address[] outputTokenPath;
        uint24[] outputTokenFees;
        uint inputAmount;
        bytes32 messageId;
    }

    struct IssuanceSendLocalVars {
        address[] tokenAddresses;
        uint[] tokenVersions;
        uint[] tokenShares;
        address[] zeroAddresses;
        uint[] zeroNumbers;
    }

    uint public issuanceNonce;
    uint public redemptionNonce;

    address public feeReceiver;

    mapping(uint => IssuanceData) public issuanceData;
    mapping(uint => RedemptionData) public redemptionData;



    

    event RequestIssuance(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address inputToken,
        uint inputAmount,
        uint outputAmount,
        uint time
    );

    event Issuanced(
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

    event Redemption(
        bytes32 indexed messageId,
        uint indexed nonce,
        address indexed user,
        address outputToken,
        uint inputAmount,
        uint outputAmount,
        uint time
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
        // Validate input parameters
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_token != address(0), "Invalid token address");
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");

        __ccipReceiver_init(_router);
        __Ownable_init();
        __ReentrancyGuard_init();
        __ReentrancyGuard_init_unchained();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        //set ccip addresses
        i_link = _chainlinkToken;
        IERC20(_chainlinkToken).approve(
            i_router,
            type(uint256).max
        );
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
    function setIndexFactoryStorage(
        address _factoryStorage
    ) public onlyOwner {
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
    function crossChainFactoryBySelector(uint64 _chainSelector) public view returns(address){
        return factoryStorage.crossChainFactoryBySelector(_chainSelector);
    }

    /**
     * @dev Returns the cross-chain token address for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The address of the cross-chain token.
     */
    function crossChainToken(uint64 _chainSelector) public view returns(address){
        return factoryStorage.crossChainToken(_chainSelector);
    }

    /**
     * @dev Returns the cross-chain token swap version for a given chain selector.
     * @param _chainSelector The chain selector.
     * @return The swap version of the cross-chain token.
     */
    function crossChainTokenSwapFee(uint64 _chainSelector) public view returns(uint24){
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
    function convertEthToUsd(uint _ethAmount) public view returns (uint256) {
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
            _newFee <= MAX_FEE_RATE && _newFee >= MIN_FEE_RATE,
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

        uint feeAmount = FeeCalculation.calculateFee(_inputAmount, feeRate);
        
        //set mappings
        issuanceNonce++;
        issuanceData[issuanceNonce].requester = msg.sender;
        issuanceData[issuanceNonce].inputAmount = _inputAmount;
        issuanceData[issuanceNonce].inputToken = _tokenIn;
        
        // IERC20(_tokenIn).transferFrom(msg.sender, address(indexToken), _inputAmount + feeAmount);
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
        uint feeWethAmount = wethAmountBeforFee*feeRate/10000;
        uint wethAmount = wethAmountBeforFee - feeWethAmount;

        // Transfer fee to the fee receiver and check the result
        require(
            weth.transfer(address(feeReceiver), feeWethAmount),
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

        uint feeAmount = FeeCalculation.calculateFee(_inputAmount, feeRate);
        uint finalAmount = _inputAmount + feeAmount + _crossChainFee;
        require(msg.value >= finalAmount, "lower than required amount");
        //transfer fee to the owner
        weth.deposit{value: finalAmount}();
         // Transfer fee to the fee receiver and check the result
        require(
            weth.transfer(address(feeReceiver), feeAmount),
            "Fee transfer failed"
        );
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
    function _issuance(
        address _tokenIn,
        uint _inputAmount,
        uint _crossChainFee
    ) internal {
        
        uint wethAmount = _inputAmount;
        
        // swap to underlying assets on all chain
        uint totalChains = factoryStorage.currentChainSelectorsCount();
        uint latestCount = factoryStorage.currentFilledCount();
        (,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = chainSelectors[i];
            uint chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if(chainSelector == currentChainSelector){
                _issuanceSwapsCurrentChain(
                    wethAmount, 
                    issuanceNonce, 
                    chainSelectorTokensCount,
                    chainSelector,
                    latestCount
                );
                
            }else{
                _issuanceSwapsOtherChains(
                    wethAmount,
                    issuanceNonce,
                    chainSelector,
                    latestCount
                );
            }
        }
        emit RequestIssuance(
                issuanceData[issuanceNonce].messageId, 
                issuanceNonce,
                msg.sender, 
                _tokenIn,
                issuanceData[issuanceNonce].inputAmount, 
                0, 
                block.timestamp
            );
    }

    function _getCurrentTokenValue(
        address tokenAddress
    ) internal returns(uint) {
        (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(
                tokenAddress
        );
            
        uint oldTokenValue = tokenAddress == address(weth)
            ? convertEthToUsd(IERC20(tokenAddress).balanceOf(address(factoryStorage.vault())))
            : convertEthToUsd(getAmountOut(toETHPath, toETHFees, IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))));
        
        return oldTokenValue;
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
        // (address[] memory tokens,,,) = factoryStorage.getCurrentData(_latestCount);
        address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        for (uint i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (address[] memory fromETHPath, uint24[] memory fromETHFees) = factoryStorage.getFromETHPathData(
                tokenAddress
            );
            
            issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].oldTokenValue = _getCurrentTokenValue(tokenAddress);
            uint tokenMarketShare = factoryStorage.tokenCurrentMarketShare(tokenAddress);
            uint swapAmount = (_wethAmount * tokenMarketShare) / 100e18;
            if (tokenAddress != address(weth)) {
                swap(fromETHPath, fromETHFees, swapAmount, address(factoryStorage.vault()));
            }else{
                weth.transfer(address(factoryStorage.vault()), swapAmount);
            }

            issuanceData[_issuanceNonce].tokenOldAndNewValues[tokenAddress].newTokenValue = _getCurrentTokenValue(tokenAddress);
            issuanceData[_issuanceNonce].completedTokensCount += 1;
        }
    }

    function _issuanceSwapToCrossChainToken(
        uint _wethAmount,
        uint64 _chainSelector,
        uint totalShares
    ) internal returns(uint) {
        (address[] memory fromETHPath, uint24[] memory fromETHFees) = factoryStorage.getFromETHPathData(
            crossChainToken(_chainSelector)
        );
        uint crossChainTokenAmount = swap(
            fromETHPath,
            fromETHFees,
            (_wethAmount*totalShares)/100e18,
            address(this)
        );
        return crossChainTokenAmount;
    }
    function _encodeIssuanceMessageData(
        uint _issuanceNonce,
        uint[] memory _totalSharesArr,
        address[] memory tokenAddresses,
        uint[] memory tokenShares
    ) internal view returns(bytes memory){
        return abi.encode(
            0,
            tokenAddresses,
            new address[](0),
            factoryStorage.getFromETHPathBytesForTokens(tokenAddresses),
            factoryStorage.getFromETHPathBytesForTokens(new address[](0)),
            _issuanceNonce,
            tokenShares,
            _totalSharesArr
        );
    }
    function _sendIssuanceMessage(
        uint _issuanceNonce,
        uint64 _chainSelector,
        uint _crossChainTokenAmount,
        address crossChainIndexFactory,
        uint[] memory _totalSharesArr,
        address[] memory tokenAddresses,
        uint[] memory tokenShares
    ) internal returns (bytes32) {
        Client.EVMTokenAmount[] memory tokensToSendArray = new Client.EVMTokenAmount[](1);
        tokensToSendArray[0].token = crossChainToken(_chainSelector);
        tokensToSendArray[0].amount = _crossChainTokenAmount;

        bytes memory data = _encodeIssuanceMessageData(
            _issuanceNonce,
            _totalSharesArr,
            tokenAddresses,
            tokenShares
        );

        return sendToken(
            _chainSelector,
            data,
            crossChainIndexFactory,
            tokensToSendArray,
            MessageSender.PayFeesIn.LINK
        );
    }

    /**
     * @dev Handles issuance swaps on other chains.
     * @param _wethAmount The amount of WETH.
     * @param _issuanceNonce The issuance nonce.
     * @param _chainSelector The chain selector.
     * @param _latestCount The latest count.
     */
    function _issuanceSwapsOtherChains(
        uint _wethAmount,
        uint _issuanceNonce,
        uint64 _chainSelector,
        uint _latestCount
    ) internal {
        uint totalShares = factoryStorage.getCurrentChainSelectorTotalShares(_latestCount, _chainSelector);
        uint[] memory totalSharesArr = new uint[](1);
        totalSharesArr[0] = totalShares;

        uint crossChainTokenAmount = _issuanceSwapToCrossChainToken(
            _wethAmount,
            _chainSelector,
            totalShares
        );

        address[] memory tokenAddresses = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        uint[] memory tokenShares = factoryStorage.allCurrentChainSelectorTokenShares(_chainSelector);
        address crossChainIndexFactory = crossChainFactoryBySelector(_chainSelector);

        bytes32 messageId = _sendIssuanceMessage(
            _issuanceNonce,
            _chainSelector,
            crossChainTokenAmount,
            crossChainIndexFactory,
            totalSharesArr,
            tokenAddresses,
            tokenShares
        );
        emit MessageSent(messageId);
        issuanceData[_issuanceNonce].messageId = messageId;
    }

    /**
     * @dev Completes the issuance request.
     * @param _issuanceNonce The issuance nonce.
     * @param _messageId The message ID.
     */
    function completeIssuanceRequest(uint _issuanceNonce, bytes32 _messageId) internal {
        uint totalOldVaules;
        uint totalNewVaules;
        uint totalCurrentList = factoryStorage.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = factoryStorage.currentList(i);
            totalOldVaules += issuanceData[_issuanceNonce].tokenOldAndNewValues[
                tokenAddress
            ].oldTokenValue;
            totalNewVaules += issuanceData[_issuanceNonce].tokenOldAndNewValues[
                tokenAddress
            ].newTokenValue;
        }

        uint amountToMint;
        if (indexToken.totalSupply() > 0) {
            amountToMint =
                (indexToken.totalSupply() * totalNewVaules) /
                totalOldVaules -
                indexToken.totalSupply();
        } else {
            amountToMint = (totalNewVaules) * 100;
        }
        indexToken.mint(issuanceData[_issuanceNonce].requester, amountToMint);
        emit Issuanced(_messageId, _issuanceNonce, issuanceData[_issuanceNonce].requester, issuanceData[_issuanceNonce].inputToken, issuanceData[_issuanceNonce].inputAmount, amountToMint, block.timestamp);
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
        redemptionNonce += 1;
        redemptionData[redemptionNonce].requester = msg.sender;
        redemptionData[redemptionNonce].outputToken = _tokenOut;
        redemptionData[redemptionNonce].inputAmount = amountIn;
        redemptionData[redemptionNonce].outputTokenPath = _tokenOutPath;
        redemptionData[redemptionNonce].outputTokenFees = _tokenOutFees;

        indexToken.burn(msg.sender, amountIn);

        
        //swap
        uint totalChains = factoryStorage.currentChainSelectorsCount();
        uint latestCount = factoryStorage.currentFilledCount();
        (,, uint64[] memory chainSelectors) = factoryStorage.getCurrentData(latestCount);
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = chainSelectors[i];
            uint chainSelectorTokensCount = factoryStorage.currentChainSelectorTokensCount(chainSelector);
            if(chainSelector == currentChainSelector){
                _redemptionSwapsCurrentChain(
                    burnPercent,
                    redemptionNonce,
                    chainSelectorTokensCount
                );
                
            }else{
                _redemptionSwapsOtherChains(
                    burnPercent,
                    redemptionNonce,
                    chainSelector
                );
                
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
        uint _burnPercent,
        uint _redemptionNonce,
        uint _chainSelectorTokensCount
    ) internal {
        // (address[] memory tokens,,,) = factoryStorage.getCurrentData(factoryStorage.currentFilledCount());
        address[] memory tokens = factoryStorage.allCurrentChainSelectorTokens(currentChainSelector);
        Vault vault = factoryStorage.vault();
        for (uint i = 0; i < _chainSelectorTokensCount; i++) {
            address tokenAddress = tokens[i];
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(tokenAddress);
            uint swapAmount = (_burnPercent * IERC20(tokenAddress).balanceOf(address(factoryStorage.vault()))) / 1e18;
            vault.withdrawFunds(tokenAddress, address(this), swapAmount);
            uint swapAmountOut = tokenAddress == address(weth)
                ? swapAmount
                // : _swapSingle(tokenAddress, address(weth), swapAmount, address(this), tokenSwapFee);
                : swap(toETHPath, toETHFees, swapAmount, address(this));
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
    function _redemptionSwapsOtherChains(
        uint _burnPercent,
        uint _redemptionNonce,
        uint64 _chainSelector
    ) internal {
        address crossChainIndexFactory = crossChainFactoryBySelector(
                _chainSelector
                );
          
        address[] memory tokenAddresses = factoryStorage.allCurrentChainSelectorTokens(_chainSelector);
        // uint[] memory tokenVersions = factoryStorage.allCurrentChainSelectorVersions(_chainSelector);
        // uint[] memory tokenShares = factoryStorage.allCurrentChainSelectorTokenShares(_chainSelector);
        // address[] memory zeroAddresses = new address[](0);
        // uint[] memory zeroNumbers = new uint[](0);
        uint[] memory burnPercentages = new uint[](1);
        burnPercentages[0] = _burnPercent;
        

        bytes memory data = abi.encode(
            1,
            tokenAddresses,
            new address[](0),
            factoryStorage.getFromETHPathBytesForTokens(tokenAddresses),
            new bytes[](0),
            _redemptionNonce,
            new uint[](0),
            burnPercentages
        );
        bytes32 messageId = sendMessage(
            _chainSelector,
            crossChainIndexFactory,
            data,
            MessageSender.PayFeesIn.LINK
        );
        redemptionData[_redemptionNonce].messageId = messageId;
    }

    /**
     * @dev Completes the redemption request.
     * @param nonce The redemption nonce.
     * @param _messageId The message ID.
     */
    function completeRedemptionRequest(uint nonce, bytes32 _messageId) internal {
        uint wethAmount = redemptionData[nonce].totalValue;
        address requester = redemptionData[nonce].requester;
        address outputToken = redemptionData[nonce].outputToken;
        // uint24 outputTokenSwapFee = redemptionData[nonce].outputTokenSwapFee;
        uint fee = FeeCalculation.calculateFee(wethAmount, feeRate);
        // weth.transfer(feeReceiver, fee);
        require(
            weth.transfer(address(feeReceiver), fee),
            "Fee transfer failed"
        );
        if(outputToken == address(weth)){
        // weth.transfer(requester, wethAmount - fee);
        weth.withdraw(wethAmount - fee);
        (bool _requesterSuccess, ) = requester.call{value: wethAmount - fee}("");
        require(_requesterSuccess, "transfer eth to the requester failed");
        emit Redemption(_messageId, nonce, requester, outputToken,  redemptionData[nonce].inputAmount, wethAmount - fee, block.timestamp);
        }else{
        uint reallOut = swap(redemptionData[nonce].outputTokenPath, redemptionData[nonce].outputTokenFees, wethAmount - fee, requester);
        emit Redemption(_messageId, nonce, requester, outputToken, redemptionData[nonce].inputAmount, reallOut, block.timestamp);
        }
    }
    
    /**
     * @dev Returns the amount out for a given swap.
     * @param path The path of the tokens.
     * @param fees The fees of the tokens.
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
            uint64 tokenChainSelector = factoryStorage.tokenChainSelector(tokenAddress);
            (address[] memory toETHPath, uint24[] memory toETHFees) = factoryStorage.getToETHPathData(tokenAddress);
            if (tokenChainSelector == currentChainSelector) {
            if(tokenAddress == address(weth)){
            totalValue += IERC20(tokenAddress).balanceOf(address(vault));
            }else{
            uint value = factoryStorage.getAmountOut(
                toETHPath,
                toETHFees,
                IERC20(tokenAddress).balanceOf(address(vault))
            );
            totalValue += value;
            }
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
     * @return The message ID.
     */
    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        MessageSender.PayFeesIn payFeesIn
    ) internal nonReentrant returns(bytes32) {
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
        bytes32 messageId = any2EvmMessage.messageId;
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector;
        uint totalCurrentList = factoryStorage.totalCurrentList();
        (
            uint actionType,
            address[] memory tokenAddresses,
            ,
            ,
            ,
            // address[] memory tokenAddresses2,
            // bytes[] memory tokenPaths,
            // bytes[] memory tokenPaths2,
            uint nonce,
            uint[] memory value1,
            uint[] memory value2
        ) = abi.decode(
                any2EvmMessage.data,
                (uint, address[], address[], bytes[], bytes[], uint, uint[], uint[])
            );
        if (actionType == 0) {
            _handleReceivedIssuance(
                nonce,
                tokenAddresses,
                value1,
                value2,
                totalCurrentList,
                messageId
            );
        } else if (actionType == 1) {
            _handleReceivedRedemption(
                nonce,
                any2EvmMessage,
                tokenAddresses,
                totalCurrentList,
                sourceChainSelector,
                messageId
            );
        }
    }

    function _handleReceivedIssuance(
        uint nonce,
        address[] memory tokenAddresses,
        uint[] memory value1,
        uint[] memory value2,
        uint totalCurrentList,
        bytes32 messageId
    ) private {
        uint requestIssuanceNonce = nonce;
        for (uint i; i < tokenAddresses.length; i++) {
            uint oldTokenValue = value1[i];
            uint newTokenValue = value2[i];
            issuanceData[requestIssuanceNonce].tokenOldAndNewValues[tokenAddresses[i]]
                .oldTokenValue = oldTokenValue;
            issuanceData[requestIssuanceNonce].tokenOldAndNewValues[tokenAddresses[i]]
                .newTokenValue = newTokenValue;
            issuanceData[requestIssuanceNonce].completedTokensCount += 1;
        }
        if (
            issuanceData[requestIssuanceNonce].completedTokensCount ==
            totalCurrentList
        ) {
            completeIssuanceRequest(requestIssuanceNonce, messageId);
        }
    }

    function _handleReceivedRedemption(
        uint nonce,
        Client.Any2EVMMessage memory any2EvmMessage,
        address[] memory tokenAddresses,
        uint totalCurrentList,
        uint64 sourceChainSelector,
        bytes32 messageId
    ) private {
        uint requestRedemptionNonce = nonce;
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
        redemptionData[requestRedemptionNonce].totalValue += wethAmount;
        redemptionData[requestRedemptionNonce].completedTokensCount += tokenAddresses.length;
        if (
            redemptionData[requestRedemptionNonce].completedTokensCount ==
            totalCurrentList
        ) {
            completeRedemptionRequest(requestRedemptionNonce, messageId);
        }
    }
}
