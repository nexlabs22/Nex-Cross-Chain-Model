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

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactory is
    Initializable,
    CCIPReceiver,
    ProposableOwnableUpgradeable
{
    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public indexFactoryStorage;
    address public i_link;
    uint16 public i_maxTokensLength;

    IndexToken public indexToken;

    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;

    IWETH public weth;

    //nonce
    struct TokenOldAndNewValues {
        uint oldTokenValue;
        uint newTokenValue;
    }

    
    uint public issuanceNonce;
    uint public redemptionNonce;
    uint public updatePortfolioNonce;

    mapping(uint => mapping(address => TokenOldAndNewValues))
        public issuanceTokenOldAndNewValues;
    mapping(uint => uint) public issuanceCompletedTokensCount;
    mapping(uint => address) public issuanceNonceRequester;
    
    mapping(uint => uint) public redemptionNonceTotalValue;
    mapping(uint => uint) public redemptionCompletedTokensCount;
    mapping(uint => address) public redemptionNonceRequester;
    

    mapping(uint => uint) public portfolioTotalValueByNonce;
    mapping(uint => uint) public updatedTokensValueCount;
    mapping(uint => mapping(address => uint)) public tokenValueByNonce;

    mapping(uint => bytes32) public issuanceMessageIdByNonce;
    mapping(uint => bytes32) public redemptionMessageIdByNonce;

    mapping(uint => address) public redemptionNonceOutputToken;
    mapping(uint => uint) public redemptionNonceOutputTokenSwapVersion;

    mapping(uint => uint) public issuanceInputAmount;
    mapping(uint => address) public issuanceInputToken;
    mapping(uint => uint) public redemptionInputAmount;
    mapping(uint => address) public redemptionOutputToken;
    

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
        //set chain selector
        currentChainSelector = _currentChainSelector;
        indexToken = IndexToken(_token);
        //set ccip addresses
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;
        LinkTokenInterface(_chainlinkToken).approve(
            i_router,
            type(uint256).max
        );
        //set addresses
        weth = IWETH(_weth);
        //fee
        feeRate = 10;
        latestFeeUpdate = block.timestamp;
    }

    function setIndexFactoryStorage(
        address _indexFactoryStorage
    ) public onlyOwner {
        indexFactoryStorage = IndexFactoryStorage(_indexFactoryStorage);
    }

    
    

    function crossChainFactoryBySelector(uint64 _chainSelector) public view returns(address){
        return indexFactoryStorage.crossChainFactoryBySelector(_chainSelector);
    }

    function crossChainToken(uint64 _chainSelector) public view returns(address){
        return indexFactoryStorage.crossChainToken(_chainSelector);
    }
    function crossChainTokenSwapVersion(uint64 _chainSelector) public view returns(uint){
        address crossChainToken = crossChainToken(_chainSelector);
        return indexFactoryStorage.crossChainTokenSwapVersion(_chainSelector, crossChainToken);
    }

    function priceInWei() public view returns (uint256) {
        return indexFactoryStorage.priceInWei();
    }

    function convertEthToUsd(uint _ethAmount) public view returns (uint256) {
        return _ethAmount * priceInWei() / 1e18;
    }

    //Notice: newFee should be between 1 to 100 (0.01% - 1%)
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

    receive() external payable {}

    function _swapSingle(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        address _recipient,
        uint _swapVersion
    ) internal returns (uint) {
        uint amountOut = indexFactoryStorage.getAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            _swapVersion
        );
        uint swapAmountOut;
        if (amountOut > 0) {
            swapAmountOut = indexToken.swapSingle(
                tokenIn,
                tokenOut,
                amountIn,
                _recipient,
                _swapVersion
            );
        }
        if (_swapVersion == 3) {
            return swapAmountOut;
        } else {
            return amountOut;
        }
    }

    function swap(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        address _recipient,
        uint _swapVersion
    ) internal returns (uint) {
        IERC20(tokenIn).transfer(address(indexFactoryStorage), amountIn);
        uint amountOut = indexFactoryStorage.swap(
            tokenIn,
            tokenOut,
            amountIn,
            _recipient,
            _swapVersion
        );
        return amountOut;
    }

    function issuanceIndexTokens(
        address _tokenIn,
        uint _inputAmount,
        uint _crossChainFee,
        uint _tokenInSwapVersion
    ) public {
        uint feeAmount = (_inputAmount * feeRate) / 10000;
        uint finalAmount = _inputAmount + feeAmount + _crossChainFee;
        //transfer fee to the owner
        IERC20(_tokenIn).transferFrom(msg.sender, address(indexToken), _inputAmount);
        IERC20(_tokenIn).transferFrom(msg.sender, owner(), feeAmount);
        uint wethAmount = _swapSingle(_tokenIn, address(weth), _inputAmount, address(this), _tokenInSwapVersion);
        //set mappings
        issuanceNonce++;
        issuanceNonceRequester[issuanceNonce] = msg.sender;
        issuanceInputAmount[issuanceNonce] = _inputAmount;
        issuanceInputToken[issuanceNonce] = _tokenIn;
        //run issuance
        _issuance(_tokenIn, wethAmount, _crossChainFee);
    }

    function issuanceIndexTokensWithEth(
        uint _inputAmount,
        uint _crossChainFee
    ) public payable {
        uint feeAmount = (_inputAmount * feeRate) / 10000;
        uint finalAmount = _inputAmount + feeAmount + _crossChainFee;
        require(msg.value >= finalAmount, "lower than required amount");
        //transfer fee to the owner
        (bool _success, ) = owner().call{value: feeAmount}("");
        require(_success, "transfer eth fee to the owner failed");
        weth.deposit{value: _inputAmount + _crossChainFee}();
        //set mappings
        issuanceNonce++;
        issuanceNonceRequester[issuanceNonce] = msg.sender;
        issuanceInputAmount[issuanceNonce] = _inputAmount;
        issuanceInputToken[issuanceNonce] = address(weth);
        //run issuance
        _issuance(address(weth), _inputAmount, _crossChainFee);
    }


    function _issuance(
        address _tokenIn,
        uint _inputAmount,
        uint _crossChainFee
    ) internal {
        
        weth.transfer(address(indexToken), _inputAmount);
        
        uint wethAmount = _inputAmount;
        
        //swap to underlying assets on all chain
        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCount = indexFactoryStorage.currentFilledCount();
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(latestCount, i);
            uint chainSelectorTokensCount = indexFactoryStorage.oracleChainSelectorTokensCount(chainSelector);
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
                    chainSelectorTokensCount,
                    chainSelector,
                    latestCount
                );
            }
        }
        emit RequestIssuance(
                issuanceMessageIdByNonce[issuanceNonce], 
                issuanceNonce,
                msg.sender, 
                _tokenIn, 
                issuanceInputAmount[issuanceNonce], 
                0, 
                block.timestamp
            );
    }


    function _issuanceSwapsCurrentChain(
        uint wethAmount,
        uint issuanceNonce,
        uint chainSelectorTokensCount,
        uint64 chainSelector,
        uint latestCount
    ) internal {
        for (uint i = 0; i < chainSelectorTokensCount; i++) {
            address tokenAddress = indexFactoryStorage.currentChainSelectorTokens(latestCount, chainSelector, i);
            uint tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(tokenAddress);
            uint tokenMarketShare = indexFactoryStorage.tokenCurrentMarketShare(tokenAddress);
            if(tokenAddress == address(weth)){
            issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress]
            .oldTokenValue = convertEthToUsd(IERC20(tokenAddress).balanceOf(address(indexToken)));
            }else{
            issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress]
            .oldTokenValue = convertEthToUsd(getAmountOut(
            tokenAddress,
            address(weth),
            IERC20(tokenAddress).balanceOf(address(indexToken)),
            tokenSwapVersion
            ));
            }
        if(tokenAddress == address(weth)){
        }else{
        _swapSingle(
            address(weth),
            tokenAddress,
            (wethAmount * tokenMarketShare) /
                100e18,
            address(indexToken),
            tokenSwapVersion
        );
        }
        issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress]
            .newTokenValue =
            issuanceTokenOldAndNewValues[issuanceNonce][tokenAddress]
                .oldTokenValue +
            convertEthToUsd((wethAmount * tokenMarketShare)/100e18);
        issuanceCompletedTokensCount[issuanceNonce] += 1;
        }
    }

    struct IssuanceSendLocalVars {
        address[] tokenAddresses;
        uint[] tokenVersions;
        uint[] tokenShares;
        address[] zeroAddresses;
        uint[] zeroNumbers;
    }

    function _issuanceSwapsOtherChains(
        uint wethAmount,
        uint issuanceNonce,
        uint chainSelectorTokensCount,
        uint64 chainSelector,
        uint latestCount
    ) internal {
        IssuanceSendLocalVars memory localVars;

        uint[] memory totalSharesArr = new uint[](1);
        totalSharesArr[0] = indexFactoryStorage.currentChainSelectorTotalShares(latestCount, chainSelector);
        uint crossChainTokenAmount = _swapSingle(
        address(weth),
        crossChainToken(chainSelector),
        (wethAmount*totalSharesArr[0])/100e18,
        address(this),
        crossChainTokenSwapVersion(chainSelector)
        );
        address crossChainIndexFactory = crossChainFactoryBySelector(
        chainSelector
        );
        
        localVars.tokenAddresses = indexFactoryStorage.allCurrentChainSelectorTokens(chainSelector);
        localVars.tokenVersions = indexFactoryStorage.allCurrentChainSelectorVersions(chainSelector);
        localVars.tokenShares = indexFactoryStorage.allCurrentChainSelectorTokenShares(chainSelector);
        localVars.zeroAddresses = new address[](0);
        localVars.zeroNumbers = new uint[](0);
        //fee
        Client.EVMTokenAmount[]
            memory tokensToSendArray = new Client.EVMTokenAmount[](
                1
            );
        tokensToSendArray[0].token = crossChainToken(chainSelector);
        tokensToSendArray[0].amount = crossChainTokenAmount;
        
        bytes memory data = abi.encode(
            0,
            localVars.tokenAddresses,
            localVars.zeroAddresses,
            localVars.tokenVersions,
            localVars.zeroNumbers,
            issuanceNonce,
            localVars.tokenShares,
            totalSharesArr
        );
    
        bytes32 messageId = sendToken(
                                chainSelector,
                                data,
                                crossChainIndexFactory,
                                tokensToSendArray,
                                PayFeesIn.LINK
                            );
        issuanceMessageIdByNonce[issuanceNonce] = messageId;
    }

    function completeIssuanceRequest(uint _issuanceNonce, bytes32 _messageId) internal {
        uint totalOldVaules;
        uint totalNewVaules;
        uint totalCurrentList = indexFactoryStorage.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = indexFactoryStorage.currentList(i);
            totalOldVaules += issuanceTokenOldAndNewValues[_issuanceNonce][
                tokenAddress
            ].oldTokenValue;
            totalNewVaules += issuanceTokenOldAndNewValues[_issuanceNonce][
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
        indexToken.mint(issuanceNonceRequester[_issuanceNonce], amountToMint);
        emit Issuanced(_messageId, _issuanceNonce, issuanceNonceRequester[_issuanceNonce], issuanceInputToken[_issuanceNonce], issuanceInputAmount[_issuanceNonce], amountToMint, block.timestamp);
    }

    
    function redemption(
        uint amountIn,
        uint _crossChainFee,
        address _tokenOut,
        uint _tokenOutSwapVersion
    ) public returns (uint) {
        uint burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        redemptionNonce += 1;
        redemptionNonceRequester[redemptionNonce] = msg.sender;
        redemptionNonceOutputToken[redemptionNonce] = _tokenOut;
        redemptionNonceOutputTokenSwapVersion[redemptionNonce] = _tokenOutSwapVersion;
        redemptionInputAmount[redemptionNonce] = amountIn;
        redemptionOutputToken[redemptionNonce] = _tokenOut;

        indexToken.burn(msg.sender, amountIn);

        
        //swap
        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCount = indexFactoryStorage.currentFilledCount();
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(latestCount, i);
            uint chainSelectorTokensCount = indexFactoryStorage.oracleChainSelectorTokensCount(chainSelector);
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
                    chainSelectorTokensCount,
                    chainSelector
                );
                
            }
        }
        emit RequestRedemption(
                redemptionMessageIdByNonce[redemptionNonce],
                redemptionNonce,
                msg.sender, 
                _tokenOut, 
                amountIn, 
                0, 
                block.timestamp
            );
    }

    function _redemptionSwapsCurrentChain(
        uint burnPercent,
        uint redemptionNonce,
        uint chainSelectorTokensCount
    ) internal {
        for (uint i = 0; i < chainSelectorTokensCount; i++) {
                    address tokenAddress = indexFactoryStorage.currentList(i);
                    uint tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(tokenAddress);
                    uint tokenMarketShare = indexFactoryStorage.tokenCurrentMarketShare(tokenAddress);
                    //
                    uint swapAmount = (burnPercent *
                    IERC20(tokenAddress).balanceOf(address(indexToken))) /
                    1e18;
                    uint swapAmountOut;
                    if(tokenAddress == address(weth)){
                    indexToken.wethTransfer(
                        address(indexToken), 
                        swapAmount
                    );
                    swapAmountOut = swapAmount;
                    }else{
                    swapAmountOut = _swapSingle(
                        tokenAddress,
                        address(weth),
                        swapAmount,
                        address(this),
                        tokenSwapVersion
                    );
                    }
                    redemptionNonceTotalValue[redemptionNonce] += swapAmountOut;
                    redemptionCompletedTokensCount[redemptionNonce] += 1;
                }
    }

    function _redemptionSwapsOtherChains(
        uint burnPercent,
        uint redemptionNonce,
        uint chainSelectorTokensCount,
        uint64 chainSelector
    ) internal {
        address crossChainIndexFactory = crossChainFactoryBySelector(
                chainSelector
                );
          
        address[] memory tokenAddresses = indexFactoryStorage.allCurrentChainSelectorTokens(chainSelector);
        uint[] memory tokenVersions = indexFactoryStorage.allCurrentChainSelectorVersions(chainSelector);
        uint[] memory tokenShares = indexFactoryStorage.allCurrentChainSelectorTokenShares(chainSelector);
        address[] memory zeroAddresses = new address[](0);
        uint[] memory zeroNumbers = new uint[](0);
        uint[] memory burnPercentages = new uint[](1);

        burnPercentages[0] = burnPercent;

        bytes memory data = abi.encode(
            1,
            tokenAddresses,
            zeroAddresses,
            tokenVersions,
            zeroNumbers,
            redemptionNonce,
            tokenShares,
            burnPercentages
        );
        bytes32 messageId = sendMessage(
            chainSelector,
            crossChainIndexFactory,
            data,
            PayFeesIn.LINK
        );
        redemptionMessageIdByNonce[redemptionNonce] = messageId;
    }

    function completeRedemptionRequest(uint nonce, bytes32 _messageId) internal {
        uint wethAmount = redemptionNonceTotalValue[nonce];
        address requester = redemptionNonceRequester[nonce];
        address outputToken = redemptionNonceOutputToken[nonce];
        uint outputTokenSwapVersion = redemptionNonceOutputTokenSwapVersion[nonce];
        uint fee = (wethAmount * feeRate) / 10000;
        weth.withdraw(fee);
        (bool _ownerSuccess, ) = owner().call{value: fee}("");
        require(_ownerSuccess, "transfer eth fee to the owner failed");
        if(outputToken == address(weth)){
        // weth.transfer(requester, wethAmount - fee);
        weth.withdraw(wethAmount - fee);
        (bool _ownerSuccess, ) = requester.call{value: wethAmount - fee}("");
        require(_ownerSuccess, "transfer eth to the requester failed");
        emit Redemption(_messageId, nonce, requester, outputToken,  redemptionInputAmount[nonce], wethAmount - fee, block.timestamp);
        }else{
        uint reallOut = swap(address(weth), outputToken, wethAmount - fee, requester, outputTokenSwapVersion);
        emit Redemption(_messageId, nonce, requester, outputToken, redemptionInputAmount[nonce], reallOut, block.timestamp);
        }
    }
    

    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint _swapVersion
    ) public view returns (uint finalAmountOut) {
        uint finalAmountOut = indexFactoryStorage.getAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            _swapVersion
        );
        return finalAmountOut;
    }

    function getPortfolioBalance() public view returns (uint) {
        uint totalValue;
        uint totalCurrentList = indexFactoryStorage.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = indexFactoryStorage.currentList(i);
            uint64 tokenChainSelector = indexFactoryStorage.tokenChainSelector(tokenAddress);
            uint tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(tokenAddress);
            if (tokenChainSelector == currentChainSelector) {
            if(tokenAddress == address(weth)){
            totalValue += IERC20(tokenAddress).balanceOf(address(indexToken));
            }else{
            uint value = indexFactoryStorage.getAmountOut(
                tokenAddress,
                address(weth),
                IERC20(tokenAddress).balanceOf(address(indexToken)),
                tokenSwapVersion
            );
            totalValue += value;
            }
            }
        }
        return totalValue;
    }

    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint32 secondsAgo
    ) public view returns (uint amountOut) {
        amountOut = indexFactoryStorage.estimateAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            secondsAgo
        );
    }

    function sendToken(
        uint64 destinationChainSelector,
        bytes memory _data,
        address receiver,
        Client.EVMTokenAmount[] memory tokensToSendDetails,
        PayFeesIn payFeesIn
    ) internal returns(bytes32) {
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
                Client.EVMExtraArgsV1({gasLimit: 900_000, strict: false}) // Additional arguments, setting gas limit and non-strict sequency mode
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

        return messageId;
    }

    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        PayFeesIn payFeesIn
    ) public  returns(bytes32){
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: _data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            // extraArgs: "",
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 900_000, strict: false}) // Additional arguments, setting gas limit and non-strict sequency mode
            ),
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            // LinkTokenInterface(i_link).approve(i_router, fee);
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

        return messageId;
    }

    // /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        uint totalCurrentList = indexFactoryStorage.totalCurrentList();
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
        bytes32 _messageId
        ) private {
        uint issuanceNonce = nonce;
        for (uint i; i < tokenAddresses.length; i++) {
            uint oldTokenValue = value1[i];
            uint newTokenValue = value2[i];
            issuanceTokenOldAndNewValues[issuanceNonce][tokenAddresses[i]]
                .oldTokenValue = oldTokenValue;
            issuanceTokenOldAndNewValues[issuanceNonce][tokenAddresses[i]]
                .newTokenValue = newTokenValue;
            issuanceCompletedTokensCount[issuanceNonce] += 1;
        }
        if (
            issuanceCompletedTokensCount[issuanceNonce] ==
            totalCurrentList
        ) {
            completeIssuanceRequest(issuanceNonce, _messageId);
        }
    }

    function _handleReceivedRedemption(
        uint nonce,
        Client.Any2EVMMessage memory any2EvmMessage,
        address[] memory tokenAddresses,
        uint totalCurrentList,
        uint64 sourceChainSelector,
        bytes32 _messageId
    ) private {
        uint redemptionNonce = nonce;
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
            .destTokenAmounts;
        address token = tokenAmounts[0].token;
        uint256 amount = tokenAmounts[0].amount;
        uint wethAmount = swap(
            address(token),
            address(weth),
            amount,
            address(this),
            3
        );
        redemptionNonceTotalValue[redemptionNonce] += wethAmount;
        redemptionCompletedTokensCount[redemptionNonce] += tokenAddresses.length;
        if (
            redemptionCompletedTokensCount[redemptionNonce] ==
            totalCurrentList
        ) {
            completeRedemptionRequest(redemptionNonce, _messageId);
        }
}

    

    
    
}
