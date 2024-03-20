// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
// import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
// import "../chainlink/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "../libraries/OracleLibrary.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "../ccip/CCIPReceiver.sol";
import "./IndexFactoryStorage.sol";

// import {Withdraw} from "./utils/Withdraw.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract IndexFactory is
    CCIPReceiver,
    // ChainlinkClient,
    // ContextUpgradeable,
    ProposableOwnableUpgradeable
    // PausableUpgradeable
{
    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public indexFactoryStorage;
    // address public i_router;
    address public i_link;
    uint16 public i_maxTokensLength;

    // address public crossChainToken;
    // mapping(uint64 => address) public crossChainToken;

    IndexToken public indexToken;

    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;

    // mapping(uint64 => address) public crossChainFactoryBySelector;

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
    /**
    mapping(uint => mapping(uint64 => address[]))
        public issuanceChainSelectorTokensByNonce;
    mapping(uint => mapping(uint64 => uint[]))
        public issuanceChainSelectorSharesByNonce;
    mapping(uint => mapping(uint64 => uint))
        public issuanceChainSelectorTotalSharesByNonce;
    mapping(uint => uint64[]) public issuanceChainSelectors;
    mapping(uint => mapping(uint64 => bool)) public issuanceChainSelectorFilled;

    mapping(uint => mapping(uint64 => address[]))
        public redemptionChainSelectorTokensByNonce;
    mapping(uint => mapping(uint64 => uint[]))
        public redemptionChainSelectorSharesByNonce;
    mapping(uint => mapping(uint64 => uint))
        public redemptionChainSelectorTotalSharesByNonce;
    mapping(uint => uint64[]) public redemptionChainSelectors;
    mapping(uint => mapping(uint64 => bool)) public redemptionChainSelectorFilled;
    */
    mapping(uint => uint) public redemptionNonceTotalValue;
    mapping(uint => uint) public redemptionCompletedTokensCount;
    mapping(uint => address) public redemptionNonceRequester;
    

    mapping(uint => uint) public portfolioTotalValueByNonce;
    mapping(uint => uint) public updatedTokensValueCount;
    mapping(uint => mapping(address => uint)) public tokenValueByNonce;

    mapping(uint => uint) public reweightWethValueByNonce;
    mapping(uint => uint) public reweightTokensCount;

    mapping(uint => address) public redemptionNonceOutputToken;
    mapping(uint => uint) public redemptionNonceOutputTokenSwapVersion;

    mapping(uint => uint) public issuanceInputAmount;
    mapping(uint => address) public issuanceInputToken;
    mapping(uint => uint) public redemptionInputAmount;
    mapping(uint => address) public redemptionOutputToken;
    

    event Issuanced(
        address indexed user,
        address indexed inputToken,
        uint inputAmount,
        uint outputAmount,
        uint time
    );
    event Redemption(
        address indexed user,
        address indexed outputToken,
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
    ) public returns (uint) {
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
    ) public payable {
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
        if (_crossChainFee > 0) {
            //swap ccip fee from eth to link
            uint ccipLinkFee = swap(
                address(weth),
                i_link,
                _crossChainFee,
                address(this),
                3
            );
        }
        uint wethAmount = _inputAmount;
        // uint firstPortfolioValue = getPortfolioBalance();
        // uint crossChainWethAmount;
        // uint totalCrossChainShares;
        //swap to underlying assets on all chain
        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCount = indexFactoryStorage.currentFilledCount();
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(latestCount, i);
            uint chainSelectorTokensCount = indexFactoryStorage.oracleChainSelecotrTokensCount(chainSelector);
            if(chainSelector == currentChainSelector){
                for (uint i = 0; i < chainSelectorTokensCount; i++) {
                    address tokenAddress = indexFactoryStorage.currentList(i);
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
                // weth.transfer(
                //     address(indexToken), 
                //     (wethAmount*tokenMarketShare)/100e18
                // );
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
            }else{
                uint[] memory totalSharesArr = new uint[](1);
                    totalSharesArr[0] = indexFactoryStorage.currentChainSelecotrTotalShares(latestCount, chainSelector);
                    uint crossChainTokenAmount = _swapSingle(
                    address(weth),
                    crossChainToken(chainSelector),
                    (wethAmount*totalSharesArr[0])/100e18,
                    address(this),
                    3
                    );
                    address crossChainIndexFactory = crossChainFactoryBySelector(
                    chainSelector
                    );
                    
                    address[] memory tokenAddresses = indexFactoryStorage.allCurrentChainSelecotrTokens(chainSelector);
                    uint[] memory tokenShares = indexFactoryStorage.allCurrentChainSelecotrTokenShares(chainSelector);
                    address[] memory zeroAddresses = new address[](0);
                    //fee
                    Client.EVMTokenAmount[]
                        memory tokensToSendArray = new Client.EVMTokenAmount[](
                            1
                        );
                    tokensToSendArray[0].token = crossChainToken(chainSelector);
                    tokensToSendArray[0].amount = crossChainTokenAmount;
                    
                    bytes memory data = abi.encode(
                        0,
                        tokenAddresses,
                        zeroAddresses,
                        issuanceNonce,
                        tokenShares,
                        totalSharesArr
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
    }


    

    

    function completeIssuanceRequest(uint _issuanceNonce) internal {
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
            // uint price = priceInWei();
            // uint price = priceInWei();
            // amountToMint = (totalNewVaules * price) / 1e16;
            amountToMint = (totalNewVaules) / 100;
        }
        indexToken.mint(issuanceNonceRequester[_issuanceNonce], amountToMint);
        emit Issuanced(issuanceNonceRequester[_issuanceNonce], issuanceInputToken[_issuanceNonce], issuanceInputAmount[_issuanceNonce], amountToMint, block.timestamp);
    }

    function redemption(
        uint amountIn,
        uint _crossChainFee,
        address _tokenOut,
        uint _tokenOutSwapVersion
    ) public payable returns (uint) {
        require(msg.value >= _crossChainFee, "lower than required amount");
        uint burnPercent = (amountIn * 1e18) / indexToken.totalSupply();
        redemptionNonce += 1;
        redemptionNonceRequester[redemptionNonce] = msg.sender;
        redemptionNonceOutputToken[redemptionNonce] = _tokenOut;
        redemptionNonceOutputTokenSwapVersion[redemptionNonce] = _tokenOutSwapVersion;
        redemptionInputAmount[redemptionNonce] = amountIn;
        redemptionOutputToken[redemptionNonce] = _tokenOut;

        indexToken.burn(msg.sender, amountIn);

        if (_crossChainFee > 0) {
            weth.deposit{value: _crossChainFee}();
            //swap ccip fee from eth to link
            uint ccipLinkFee = swap(
                address(weth),
                i_link,
                _crossChainFee,
                address(this),
                3
            );
        }
        // uint outputAmount;
        //swap
        uint totalCrossChainShares;
        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCount = indexFactoryStorage.currentFilledCount();
        for(uint i = 0; i < totalChains; i++){
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(latestCount, i);
            uint chainSelectorTokensCount = indexFactoryStorage.oracleChainSelecotrTokensCount(chainSelector);
            if(chainSelector == currentChainSelector){
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
            }else{
                
                address crossChainIndexFactory = crossChainFactoryBySelector(
                chainSelector
                );
                
                address[] memory tokenAddresses = indexFactoryStorage.allCurrentChainSelecotrTokens(chainSelector);
                uint[] memory tokenShares = indexFactoryStorage.allCurrentChainSelecotrTokenShares(chainSelector);
                address[] memory zeroAddresses = new address[](0);

                uint[] memory burnPercentages = new uint[](1);
                burnPercentages[0] = burnPercent;

                bytes memory data = abi.encode(
                    1,
                    tokenAddresses,
                    zeroAddresses,
                    redemptionNonce,
                    tokenShares,
                    burnPercentages
                );
                sendMessage(
                    chainSelector,
                    crossChainIndexFactory,
                    data,
                    PayFeesIn.LINK
                );
                    
            }
        }
    }

    
    function completeRedemptionRequest(uint nonce) internal {
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
        emit Redemption(requester, outputToken,  redemptionInputAmount[nonce], wethAmount - fee, block.timestamp);
        }else{
        uint reallOut = swap(address(weth), outputToken, wethAmount - fee, requester, outputTokenSwapVersion);
        emit Redemption(requester, outputToken, redemptionInputAmount[nonce], reallOut, block.timestamp);
        }
    }
    // }

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
    }

    function sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory _data,
        PayFeesIn payFeesIn
    ) public {
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
                completeIssuanceRequest(issuanceNonce);
            }
        } else if (actionType == 1) {
            uint redemptionNonce = nonce;
            Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage
                .destTokenAmounts;
            address token = tokenAmounts[0].token;
            uint256 amount = tokenAmounts[0].amount;
            uint wethAmount = swap(
                token,
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
                completeRedemptionRequest(redemptionNonce);
            }
        } else if (actionType == 2) {
            portfolioTotalValueByNonce[nonce] += value1[0];
            tokenValueByNonce[nonce][tokenAddresses[0]] += value1[0];
            updatedTokensValueCount[nonce] += 1;
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
                3
            );
            reweightWethValueByNonce[nonce] += wethAmount;
        }
    }

    

    
    
}
