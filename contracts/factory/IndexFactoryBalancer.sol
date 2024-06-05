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
contract IndexFactoryBalancer is Initializable, CCIPReceiver, ProposableOwnableUpgradeable {
    enum PayFeesIn {
        Native,
        LINK
    }

    IndexFactoryStorage public indexFactoryStorage;
    address public i_link;
    uint16 public i_maxTokensLength;

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

    struct LowSwapVariables {
        address tokenAddress;
        uint tokenSwapVersion;
        uint tokenMarketShare;
        uint chainValue;
        uint swapWethAmount;
        uint wethAmount;
    }

    struct ExtraSwapVariables {
        address tokenAddress;
        uint tokenSwapVersion;
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
    mapping(uint => uint) public redemptionNonceOutputTokenSwapVersion;

    event MessageSent(bytes32 messageId);

    function initialize(
        uint64 _currentChainSelector,
        address payable _token,
        address _indexFactoryStorage,
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
        indexFactoryStorage = IndexFactoryStorage(_indexFactoryStorage);
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

    function crossChainFactoryBySelector(
        uint64 _chainSelector
    ) public view returns (address) {
        return indexFactoryStorage.crossChainFactoryBySelector(_chainSelector);
    }

    function crossChainToken(
        uint64 _chainSelector
    ) public view returns (address) {
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

    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint _swapVersion
    ) public view returns (uint finalAmountOut) {
        finalAmountOut = indexFactoryStorage.getAmountOut(
            tokenIn,
            tokenOut,
            amountIn,
            _swapVersion
        );
    }

    function getPortfolioBalance() public view returns (uint) {
        uint totalValue;
        uint totalCurrentList = indexFactoryStorage.totalCurrentList();
        for (uint i = 0; i < totalCurrentList; i++) {
            address tokenAddress = indexFactoryStorage.currentList(i);
            uint64 tokenChainSelector = indexFactoryStorage.tokenChainSelector(
                tokenAddress
            );
            uint tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(
                tokenAddress
            );
            if (tokenChainSelector == currentChainSelector) {
                uint value = indexFactoryStorage.getAmountOut(
                    tokenAddress,
                    address(weth),
                    IERC20(tokenAddress).balanceOf(address(indexToken)),
                    tokenSwapVersion
                );
                totalValue += value;
            }
        }
        return totalValue;
    }

    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn
    ) public view returns (uint amountOut) {
        amountOut = indexFactoryStorage.estimateAmountOut(
            tokenIn,
            tokenOut,
            amountIn
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

    // handle a received message
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
                3
            );
            extraWethByNonce[nonce] += wethAmount;
        }else if(actionType == 4){
            indexFactoryStorage.updateCurrentList();
        }
    }

    function askValues() public onlyOwner {
        updatePortfolioNonce += 1;

        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCount = indexFactoryStorage.currentFilledCount();

        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(
                latestCount,
                i
            );
            uint chainSelectorTokensCount = indexFactoryStorage
                .currentChainSelectorTokensCount(chainSelector);
            // uint chainSelectorTokensCount = indexFactoryStorage
            //     .oracleChainSelectorTokensCount(chainSelector);
            if (chainSelector == currentChainSelector) {
                for (uint j = 0; j < chainSelectorTokensCount; j++) {
                    // address tokenAddress = indexFactoryStorage.currentList(i);
                    address tokenAddress = indexFactoryStorage.currentChainSelectorTokens(latestCount, chainSelector, j);
                    uint tokenSwapVersion = indexFactoryStorage
                        .tokenSwapVersion(tokenAddress);
                    uint value;
                    if(tokenAddress == address(weth)){
                        value = IERC20(tokenAddress).balanceOf(address(indexToken));
                    }else{
                    value = getAmountOut(
                        tokenAddress,
                        address(weth),
                        IERC20(tokenAddress).balanceOf(address(indexToken)),
                        tokenSwapVersion
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
            } else {
                address crossChainIndexFactory = crossChainFactoryBySelector(
                    chainSelector
                );

                address[] memory tokenAddresses = indexFactoryStorage
                    .allCurrentChainSelectorTokens(chainSelector);
                uint[] memory tokenVersions = indexFactoryStorage
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
                    PayFeesIn.LINK
                );
            }
        }
    }

    function firstReweightAction() public onlyOwner {
        uint nonce = updatePortfolioNonce;
        uint portfolioValue = portfolioTotalValueByNonce[nonce];

        uint totalChains = indexFactoryStorage.currentChainSelectorsCount();
        uint latestCurrentCount = indexFactoryStorage.currentFilledCount();
        uint latestOracleCount = indexFactoryStorage.oracleFilledCount();

        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = indexFactoryStorage.currentChainSelectors(
                latestCurrentCount,
                i
            );
            
            uint chainSelectorCurrentTokensCount = indexFactoryStorage
                .currentChainSelectorTokensCount(chainSelector);
            uint chainSelectorOracleTokensCount = indexFactoryStorage
                .oracleChainSelectorTokensCount(chainSelector);
            uint chainSelectorTotalShares = indexFactoryStorage
                .oracleChainSelectorTotalShares(
                    latestOracleCount,
                    chainSelector
            );
            uint chainValue = chainValueByNonce[nonce][chainSelector];
            uint[] memory oracleTokenShares = indexFactoryStorage
                .allOracleChainSelectorTokenShares(chainSelector);

            if (
                (chainValue * 100e18) / portfolioValue >
                chainSelectorTotalShares
            ) {
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
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorTotalShares,
                        chainValue,
                        oracleTokenShares
                    );
                    /**
                    uint chainCurrentRealShare = (chainValue * 100e18) /
                        portfolioValue;
                    reweightExtraPercentage[nonce] += (chainCurrentRealShare -
                        chainSelectorTotalShares);

                    address crossChainIndexFactory = crossChainFactoryBySelector(
                            chainSelector
                        );

                    address[] memory currentTokenAddresses = indexFactoryStorage
                        .allCurrentChainSelectorTokens(chainSelector);
                    address[] memory newTokenAddresses = indexFactoryStorage
                        .allOracleChainSelectorTokens(chainSelector);

                    uint[] memory currentTokenVersions = indexFactoryStorage
                        .allCurrentChainSelectorVersions(chainSelector);
                    uint[] memory newTokenVersions = indexFactoryStorage
                        .allOracleChainSelectorVersions(chainSelector);

                    uint[] memory extraData = new uint[](2);
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
                    sendMessage(
                        chainSelector,
                        crossChainIndexFactory,
                        data,
                        PayFeesIn.LINK
                    );
                    */
                }
            }
        
        }
    }

    
    function _swapExtraValueCurrentChain(
        uint i,
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorCurrentTokensCount,
        uint chainSelectorOracleTokensCount,
        uint chainSelectorTotalShares
    ) internal {
        ExtraSwapVariables memory swapVars;
        
        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        uint initialWethBalance = weth.balanceOf(address(indexToken));
        for (uint j = 0; j < chainSelectorCurrentTokensCount; j++) {
            swapVars.tokenAddress = indexFactoryStorage.currentList(j);
            swapVars.tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(
                swapVars.tokenAddress
            );
            swapVars.tokenMarketShare = indexFactoryStorage.tokenOracleMarketShare(
                swapVars.tokenAddress
            );
            uint wethAmount;
            if(swapVars.tokenAddress == address(weth)){
                wethAmount = initialWethBalance;
            }else{
            wethAmount = _swapSingle(
                swapVars.tokenAddress,
                address(weth),
                IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                address(indexToken),
                swapVars.tokenSwapVersion
            );
            }
            swapVars.swapWethAmount += wethAmount;
        }

        uint chainCurrentRealShare = (swapVars.chainValue * 100e18) /
            portfolioValue;
        uint wethAmountToSwap = (swapVars.swapWethAmount *
            chainSelectorTotalShares) / chainCurrentRealShare;
        uint extraWethAmount = swapVars.swapWethAmount - wethAmountToSwap;
        
        for (uint k = 0; k < chainSelectorOracleTokensCount; k++) {
            address newTokenAddress = indexFactoryStorage.oracleList(k);
            uint newTokenSwapVersion = indexFactoryStorage.tokenSwapVersion(
                newTokenAddress
            );
            uint newTokenMarketShare = indexFactoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            uint wethAmount;
            if(newTokenAddress == address(weth)){
            wethAmount = (wethAmountToSwap * newTokenMarketShare) /
                    chainSelectorTotalShares;
            }else{
            wethAmount = _swapSingle(
                address(weth),
                newTokenAddress,
                (wethAmountToSwap * newTokenMarketShare) /
                    chainSelectorTotalShares,
                address(indexToken),
                newTokenSwapVersion
            );
            }
        }
        extraWethByNonce[nonce] += extraWethAmount;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare -
            chainSelectorTotalShares);
    }

    function _sendExtraValueOtherChains(
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorTotalShares,
        uint chainValue,
        uint[] memory oracleTokenShares
    ) internal {
        uint chainCurrentRealShare = (chainValue * 100e18) /
                        portfolioValue;
        reweightExtraPercentage[nonce] += (chainCurrentRealShare -
            chainSelectorTotalShares);

        address crossChainIndexFactory = crossChainFactoryBySelector(
                chainSelector
            );

        address[] memory currentTokenAddresses = indexFactoryStorage
            .allCurrentChainSelectorTokens(chainSelector);
        address[] memory newTokenAddresses = indexFactoryStorage
            .allOracleChainSelectorTokens(chainSelector);

        uint[] memory currentTokenVersions = indexFactoryStorage
            .allCurrentChainSelectorVersions(chainSelector);
        uint[] memory newTokenVersions = indexFactoryStorage
            .allOracleChainSelectorVersions(chainSelector);

        uint[] memory extraData = new uint[](2);
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
        sendMessage(
            chainSelector,
            crossChainIndexFactory,
            data,
            PayFeesIn.LINK
        );
    }

    function secondReweightAction() public onlyOwner {
        uint nonce = updatePortfolioNonce;
        uint portfolioValue = portfolioTotalValueByNonce[nonce];

        uint totalChains = indexFactoryStorage.oracleChainSelectorsCount();
        uint latestOracleCount = indexFactoryStorage.oracleFilledCount();

        for (uint i = 0; i < totalChains; i++) {
            uint64 chainSelector = indexFactoryStorage.oracleChainSelectors(
                latestOracleCount,
                i
            );
            
            uint chainSelectorCurrentTokensCount = indexFactoryStorage
                .currentChainSelectorTokensCount(chainSelector);
            uint chainSelectorOracleTokensCount = indexFactoryStorage
                .oracleChainSelectorTokensCount(chainSelector);
            uint chainSelectorTotalShares = indexFactoryStorage
                .oracleChainSelectorTotalShares(
                    latestOracleCount,
                    chainSelector
                );
            uint chainValue = chainValueByNonce[nonce][chainSelector];
            uint[] memory oracleTokenShares = indexFactoryStorage
                .allOracleChainSelectorTokenShares(chainSelector);

            if (
                (chainValue * 100e18) / portfolioValue <
                chainSelectorTotalShares
            ) {
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
                        nonce,
                        portfolioValue,
                        chainSelector,
                        chainSelectorTotalShares,
                        chainValue,
                        oracleTokenShares
                    );
                }
            }
        }
    }

    function _swapLowerValueCurrentChain(
        uint i,
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorCurrentTokensCount,
        uint chainSelectorOracleTokensCount,
        uint chainSelectorTotalShares
    ) internal {
        LowSwapVariables memory swapVars;
        swapVars.tokenAddress = indexFactoryStorage.currentList(i);
        swapVars.tokenSwapVersion = indexFactoryStorage.tokenSwapVersion(
            swapVars.tokenAddress
        );
        swapVars.tokenMarketShare = indexFactoryStorage.tokenOracleMarketShare(
            swapVars.tokenAddress
        );
        swapVars.chainValue = chainValueByNonce[nonce][chainSelector];
        uint initialWethBalance = IERC20(swapVars.tokenAddress).balanceOf(address(indexToken));
        for (uint j = 0; j < chainSelectorCurrentTokensCount; j++) {
            if(swapVars.tokenAddress == address(weth)){
                swapVars.wethAmount = initialWethBalance;
            }else{
            swapVars.wethAmount = _swapSingle(
                swapVars.tokenAddress,
                address(weth),
                IERC20(swapVars.tokenAddress).balanceOf(address(indexToken)),
                address(indexToken),
                swapVars.tokenSwapVersion
            );
            }
            swapVars.swapWethAmount += swapVars.wethAmount;
        }

        uint chainCurrentRealShare = (swapVars.chainValue * 100e18) /
            portfolioValue;
        uint negativePercentage = chainSelectorTotalShares -
            chainCurrentRealShare;
        uint extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) /
            reweightExtraPercentage[nonce];
        swapVars.swapWethAmount += extraWethAmount;

        for (uint k = 0; k < chainSelectorOracleTokensCount; k++) {
            address newTokenAddress = indexFactoryStorage.currentList(k);
            uint newTokenSwapVersion = indexFactoryStorage.tokenSwapVersion(
                newTokenAddress
            );
            uint newTokenMarketShare = indexFactoryStorage
                .tokenOracleMarketShare(newTokenAddress);
            if(newTokenAddress == address(weth)){
                swapVars.wethAmount = (swapVars.swapWethAmount * newTokenMarketShare) / chainSelectorTotalShares;
            }else{
            swapVars.wethAmount = _swapSingle(
                address(weth),
                newTokenAddress,
                (swapVars.swapWethAmount * newTokenMarketShare) /
                    chainSelectorTotalShares,
                address(indexToken),
                newTokenSwapVersion
            );
            }
        }
    }

    struct SendLowerValueOtherChainVars {
        address[] currentTokenAddresses;
        address[] newTokenAddresses;
        uint[] currentTokenVersions;
        uint[] newTokenVersions;
        uint[] extraData;
    }

    function _sendLowerValueOtherChain(
        uint nonce,
        uint portfolioValue,
        uint64 chainSelector,
        uint chainSelectorTotalShares,
        uint chainValue,
        uint[] memory oracleTokenShares
    ) internal {
        SendLowerValueOtherChainVars memory vars;

        uint chainCurrentRealShare = (chainValue * 100e18) / portfolioValue;
        uint negativePercentage = chainSelectorTotalShares -
            chainCurrentRealShare;
        uint extraWethAmount = (extraWethByNonce[nonce] * negativePercentage) /
            reweightExtraPercentage[nonce];

        address crossChainIndexFactory = crossChainFactoryBySelector(
            chainSelector
        );

        uint crossChainTokenAmount = _swapSingle(
            address(weth),
            crossChainToken(chainSelector),
            // weth.balanceOf(address(this)),
            extraWethAmount,
            address(this),
            3
        );

        vars.currentTokenAddresses = indexFactoryStorage
            .allCurrentChainSelectorTokens(chainSelector);
        vars.newTokenAddresses = indexFactoryStorage
            .allOracleChainSelectorTokens(chainSelector);

        vars.currentTokenVersions = indexFactoryStorage
            .allCurrentChainSelectorVersions(chainSelector);
        vars.newTokenVersions = indexFactoryStorage
            .allOracleChainSelectorVersions(chainSelector);
        
        vars.extraData = new uint[](2);
        vars.extraData[0] = portfolioValue;
        vars.extraData[1] = chainSelectorTotalShares;

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
