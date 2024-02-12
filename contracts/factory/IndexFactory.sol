// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

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

    address public crossChainToken;
    IndexToken public indexToken;

    // uint256 public fee;
    uint8 public feeRate; // 10/10000 = 0.1%
    uint256 public latestFeeUpdate;
    uint64 public currentChainSelector;

    mapping(uint64 => address) public crossChainFactoryBySelector;

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

    mapping(uint => uint) public redemptionNonceTotalValue;
    mapping(uint => uint) public redemptionCompletedTokensCount;
    mapping(uint => address) public redemptionNonceRequester;

    mapping(uint => uint) public portfolioTotalValueByNonce;
    mapping(uint => uint) public updatedTokensValueCount;
    mapping(uint => mapping(address => uint)) public tokenValueByNonce;

    mapping(uint => uint) public reweightWethValueByNonce;
    mapping(uint => uint) public reweightTokensCount;

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

    function setCrossChainToken(address _crossChainToken) public onlyOwner {
        crossChainToken = _crossChainToken;
    }

    function setCrossChainFactory(
        address _crossChainFactoryAddress,
        uint64 _chainSelector
    ) public onlyOwner {
        crossChainFactoryBySelector[_chainSelector] = _crossChainFactoryAddress;
    }

    function totalOracleList() public view returns (uint) {
        return indexFactoryStorage.totalOracleList();
    }

    function totalCurrentList() public view returns (uint) {
        return indexFactoryStorage.totalCurrentList();
    }

    function oracleList(uint _index) public view returns (address) {
        return indexFactoryStorage.oracleList(_index);
    }

    function currentList(uint _index) public view returns (address) {
        return indexFactoryStorage.currentList(_index);
    }

    function tokenOracleListIndex(address _address) public view returns (uint) {
        return indexFactoryStorage.tokenOracleListIndex(_address);
    }

    function tokenCurrentListIndex(
        address _address
    ) public view returns (uint) {
        return indexFactoryStorage.tokenCurrentListIndex(_address);
    }

    function tokenCurrentMarketShare(
        address _address
    ) public view returns (uint) {
        return indexFactoryStorage.tokenCurrentMarketShare(_address);
    }

    function tokenOracleMarketShare(
        address _address
    ) public view returns (uint) {
        return indexFactoryStorage.tokenOracleMarketShare(_address);
    }

    function tokenSwapVersion(address _address) public view returns (uint) {
        return indexFactoryStorage.tokenSwapVersion(_address);
    }

    function tokenChainSelector(address _address) public view returns (uint64) {
        return indexFactoryStorage.tokenChainSelector(_address);
    }

    function priceInWei() public view returns (uint256) {
        return indexFactoryStorage.priceInWei();
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
        issuanceNonce++;
        issuanceNonceRequester[issuanceNonce] = msg.sender;
        weth.deposit{value: _inputAmount + _crossChainFee}();
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
        uint firstPortfolioValue = getPortfolioBalance();
        uint wethAmount = _inputAmount;
        uint crossChainWethAmount;
        uint totalCrossChainShares;
        //swap to underlying assets on current chain
        for (uint i = 0; i < totalCurrentList(); i++) {
            uint64 tokenChainSelector = tokenChainSelector(currentList(i));
            if (tokenChainSelector == currentChainSelector) {
                issuanceTokenOldAndNewValues[issuanceNonce][currentList(i)]
                    .oldTokenValue = getAmountOut(
                    currentList(i),
                    address(weth),
                    IERC20(currentList(i)).balanceOf(address(indexToken)),
                    tokenSwapVersion(currentList(i))
                );
                _swapSingle(
                    address(weth),
                    currentList(i),
                    (wethAmount * tokenCurrentMarketShare(currentList(i))) /
                        100e18,
                    address(indexToken),
                    tokenSwapVersion(currentList(i))
                );
                issuanceTokenOldAndNewValues[issuanceNonce][currentList(i)]
                    .newTokenValue =
                    issuanceTokenOldAndNewValues[issuanceNonce][currentList(i)]
                        .oldTokenValue +
                    (wethAmount * tokenCurrentMarketShare(currentList(i))) /
                    100e18;
                issuanceCompletedTokensCount[issuanceNonce] += 1;
            } else {
                address crossChainIndexFactory = crossChainFactoryBySelector[
                    tokenChainSelector
                ];
                
                crossChainWethAmount +=
                    (wethAmount * tokenCurrentMarketShare(currentList(i))) /
                    100e18;
                issuanceChainSelectorTokensByNonce[issuanceNonce][
                    tokenChainSelector
                ].push(currentList(i));
                issuanceChainSelectorSharesByNonce[issuanceNonce][
                    tokenChainSelector
                ].push(tokenCurrentMarketShare(currentList(i)));
                issuanceChainSelectorTotalSharesByNonce[issuanceNonce][
                    tokenChainSelector
                ] += tokenCurrentMarketShare(currentList(i));
                totalCrossChainShares += tokenCurrentMarketShare(
                    currentList(i)
                );
                if (
                    !issuanceChainSelectorFilled[issuanceNonce][
                        tokenChainSelector
                    ]
                ) {
                    issuanceChainSelectors[issuanceNonce].push(
                        tokenChainSelector
                    );
                    issuanceChainSelectorFilled[issuanceNonce][
                        tokenChainSelector
                    ] = true;
                }
                }
                }
                //send tokens and data
                uint64[] memory allchainSelectors = issuanceChainSelectors[
                    issuanceNonce
                ];
                uint totalCrossChainTokenAmount = _swapSingle(
                    address(weth),
                    crossChainToken,
                    crossChainWethAmount,
                    address(this),
                    3
                );
                // seding token and data for each chain
                for (uint i = 0; i < allchainSelectors.length; i++) {
                    address crossChainIndexFactory = crossChainFactoryBySelector[
                    allchainSelectors[i]
                    ];
                    uint[] memory totalSharesArr = new uint[](1);
                    totalSharesArr[0] = issuanceChainSelectorTotalSharesByNonce[
                        issuanceNonce
                    ][allchainSelectors[i]];
                    uint crossChainTokenAmount = (totalCrossChainTokenAmount *
                        totalSharesArr[0]) / totalCrossChainShares;
                    address[]
                        memory tokenAddresses = issuanceChainSelectorTokensByNonce[
                            issuanceNonce
                        ][allchainSelectors[i]];
                    uint[]
                        memory tokenShares = issuanceChainSelectorSharesByNonce[
                            issuanceNonce
                        ][allchainSelectors[i]];

                    //fee
                    bytes memory simulatedData = abi.encode(
                        0,
                        tokenAddresses,
                        issuanceNonce,
                        tokenShares,
                        totalSharesArr
                    );
                    Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
                        receiver: abi.encode(crossChainIndexFactory),
                        data: simulatedData,
                        tokenAmounts: new Client.EVMTokenAmount[](0),
                        extraArgs: "",
                        feeToken: i_link
                    });
                    uint256 fees = IRouterClient(i_router).getFee(
                        allchainSelectors[i],
                        message
                    );
                    Client.EVMTokenAmount[]
                        memory tokensToSendArray = new Client.EVMTokenAmount[](
                            1
                        );
                    tokensToSendArray[0].token = crossChainToken;
                    tokensToSendArray[0].amount = crossChainTokenAmount;
                    // tokensToSendArray[1].token = i_link;
                    // tokensToSendArray[1].amount = fees;
                    
                    bytes memory data = abi.encode(
                        0,
                        tokenAddresses,
                        issuanceNonce,
                        tokenShares,
                        totalSharesArr
                    );
                
                    sendToken(
                        allchainSelectors[i],
                        data,
                        crossChainIndexFactory,
                        tokensToSendArray,
                        PayFeesIn.LINK
                    );
                
                }
    }


    

    function completeIssuanceRequest(uint _issuanceNonce) internal {
        uint totalOldVaules;
        uint totalNewVaules;
        for (uint i = 0; i < totalCurrentList(); i++) {
            totalOldVaules += issuanceTokenOldAndNewValues[_issuanceNonce][
                currentList(i)
            ].oldTokenValue;
            totalNewVaules += issuanceTokenOldAndNewValues[_issuanceNonce][
                currentList(i)
            ].newTokenValue;
        }

        uint amountToMint;
        if (indexToken.totalSupply() > 0) {
            amountToMint =
                (indexToken.totalSupply() * totalNewVaules) /
                totalOldVaules -
                indexToken.totalSupply();
        } else {
            uint price = priceInWei();
            amountToMint = (totalNewVaules * price) / 1e16;
        }
        indexToken.mint(issuanceNonceRequester[_issuanceNonce], amountToMint);
        // emit Issuanced(msg.sender, address(weth), _inputAmount, amountToMint, block.timestamp);
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
        for (uint i = 0; i < totalCurrentList(); i++) {
            uint64 tokenChainSelector = tokenChainSelector(currentList(i));
            if (tokenChainSelector == currentChainSelector) {
                uint swapAmount = (burnPercent *
                    IERC20(currentList(i)).balanceOf(address(indexToken))) /
                    1e18;
                uint swapAmountOut = _swapSingle(
                    currentList(i),
                    address(weth),
                    swapAmount,
                    address(this),
                    tokenSwapVersion(currentList(i))
                );
                redemptionNonceTotalValue[redemptionNonce] += swapAmountOut;
                redemptionCompletedTokensCount[redemptionNonce] += 1;
            } else {
                
                redemptionChainSelectorTokensByNonce[redemptionNonce][
                    tokenChainSelector
                ].push(currentList(i));
                redemptionChainSelectorSharesByNonce[redemptionNonce][
                    tokenChainSelector
                ].push(tokenCurrentMarketShare(currentList(i)));
                redemptionChainSelectorTotalSharesByNonce[redemptionNonce][
                    tokenChainSelector
                ] += tokenCurrentMarketShare(currentList(i));
                totalCrossChainShares += tokenCurrentMarketShare(
                    currentList(i)
                );
                if (
                    !redemptionChainSelectorFilled[redemptionNonce][
                        tokenChainSelector
                    ]
                ) {
                    redemptionChainSelectors[redemptionNonce].push(
                        tokenChainSelector
                    );
                    redemptionChainSelectorFilled[redemptionNonce][
                        tokenChainSelector
                    ] = true;
                }

                }
                }
                //send tokens and data
                _sendRedemptionMessages(redemptionNonce, burnPercent);
        
    }

    function _sendRedemptionMessages(uint _redemptionNonce, uint _burnPercent) internal {
        uint64[] memory allchainSelectors = redemptionChainSelectors[
                    _redemptionNonce
                ];
                
                for (uint i = 0; i < allchainSelectors.length; i++) {
                address crossChainIndexFactory = crossChainFactoryBySelector[
                allchainSelectors[i]
                ];
                // uint[] memory totalCrossChainShares = new uint[](1);
                // totalCrossChainShares[0] = _totalCrossChainShares;
                uint[] memory burnPercentages = new uint[](1);
                burnPercentages[0] = _burnPercent;
                // uint totalShares = redemptionChainSelectorTotalSharesByNonce[
                //     _redemptionNonce
                // ][allchainSelectors[i]];
                // uint crossChainTokenAmount = (totalCrossChainTokenAmount *
                //     totalShares) / _totalCrossChainShares;
                address[]
                    memory tokenAddresses = redemptionChainSelectorTokensByNonce[
                        _redemptionNonce
                    ][allchainSelectors[i]];
                uint[]
                    memory tokenShares = redemptionChainSelectorSharesByNonce[
                        _redemptionNonce
                    ][allchainSelectors[i]];
                    
            
                //fee
                // Client.EVMTokenAmount[]
                //     memory simulatedTokensToSendArray = new Client.EVMTokenAmount[](
                //         1
                //     );
                // simulatedTokensToSendArray[0].token = i_link;
                // simulatedTokensToSendArray[0].amount = IERC20(currentList(i))
                //     .balanceOf(address(indexToken));
                // bytes memory simulatedData = abi.encode(
                //     1,
                //     tokenAddresses,
                //     _redemptionNonce,
                //     tokenShares,
                //     burnPercentages
                // );
                // Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
                //     receiver: abi.encode(crossChainIndexFactory),
                //     data: simulatedData,
                //     // tokenAmounts: new Client.EVMTokenAmount[](0),
                //     tokenAmounts: simulatedTokensToSendArray,
                //     extraArgs: "",
                //     feeToken: i_link
                // });
                // uint256 fees = IRouterClient(i_router).getFee(
                //     allchainSelectors[i],
                //     message
                // );
                
                // Client.EVMTokenAmount[]
                //     memory tokensToSendArray = new Client.EVMTokenAmount[](
                //         1
                //     );
                // tokensToSendArray[0].token = i_link;
                // tokensToSendArray[0].amount = fees;
                bytes memory data = abi.encode(
                    1,
                    tokenAddresses,
                    _redemptionNonce,
                    tokenShares,
                    burnPercentages
                );
                sendMessage(
                    allchainSelectors[i],
                    crossChainIndexFactory,
                    data,
                    PayFeesIn.LINK
                );
                // sendToken(
                //     allchainSelectors[i],
                //     data,
                //     crossChainIndexFactory,
                //     tokensToSendArray,
                //     PayFeesIn.LINK
                // );
                }
    }

    function completeRedemptionRequest(uint nonce) internal {
        uint wethAmount = redemptionNonceTotalValue[nonce];
        address requester = redemptionNonceRequester[nonce];

        uint fee = (wethAmount * feeRate) / 10000;
        weth.withdraw(fee);
        weth.transfer(requester, wethAmount - fee);
        (bool _ownerSuccess, ) = owner().call{value: fee}("");
        require(_ownerSuccess, "transfer eth fee to the owner failed");
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
        for (uint i = 0; i < totalCurrentList(); i++) {
            uint64 tokenChainSelector = tokenChainSelector(currentList(i));
            if (tokenChainSelector == currentChainSelector) {
            uint value = indexFactoryStorage.getAmountOut(
                currentList(i),
                address(weth),
                IERC20(currentList(i)).balanceOf(address(indexToken)),
                tokenSwapVersion(currentList(i))
            );
            totalValue += value;
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

        (
            uint actionType,
            address[] memory tokenAddresses,
            uint nonce,
            uint[] memory value1,
            uint[] memory value2
        ) = abi.decode(
                any2EvmMessage.data,
                (uint, address[], uint, uint[], uint[])
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
                totalCurrentList()
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
                totalCurrentList()
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

    function askValues() public onlyOwner {
        updatePortfolioNonce += 1;
        for (uint i = 0; i < totalCurrentList(); i++) {
            uint64 tokenChainSelector = tokenChainSelector(currentList(i));
            if (tokenChainSelector == currentChainSelector) {
                uint value = getAmountOut(
                    currentList(i),
                    address(weth),
                    IERC20(currentList(i)).balanceOf(address(indexToken)),
                    tokenSwapVersion(currentList(i))
                );
                portfolioTotalValueByNonce[updatePortfolioNonce] += value;
                tokenValueByNonce[updatePortfolioNonce][
                    currentList(i)
                ] += value;
                updatedTokensValueCount[updatePortfolioNonce] += 1;
            } else {
                address crossChainIndexFactory = crossChainFactoryBySelector[
                    tokenChainSelector
                ];
                bytes memory data = abi.encode(
                    2,
                    currentList(i),
                    updatePortfolioNonce,
                    0,
                    0
                );
                sendMessage(
                    tokenChainSelector,
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
        for (uint i; i < totalCurrentList(); i++) {
            uint tokenValue = tokenValueByNonce[nonce][currentList(i)];
            if (
                (tokenValue * 100e18) / portfolioValue >
                tokenOracleMarketShare(currentList(i))
            ) {
                uint64 tokenChainSelector = tokenChainSelector(currentList(i));
                if (tokenChainSelector == currentChainSelector) {
                    uint sellPercent = (tokenValue * 100e18) /
                        portfolioValue -
                        tokenOracleMarketShare(currentList(i));
                    uint sellValue = tokenValue -
                        (tokenOracleMarketShare(currentList(i)) *
                            portfolioValue) /
                        100e18;
                    // uint swapAmount = (sellPercent*IERC20(currentList(i)).balanceOf(address(indexToken)))/100e18;
                    uint swapAmount = (sellValue *
                        IERC20(currentList(i)).balanceOf(address(indexToken))) /
                        tokenValue;
                    uint wethAmount = _swapSingle(
                        currentList(i),
                        address(weth),
                        swapAmount,
                        address(indexToken),
                        tokenSwapVersion(currentList(i))
                    );
                    reweightWethValueByNonce[nonce] += wethAmount;
                } else {
                    address crossChainIndexFactory = crossChainFactoryBySelector[
                            tokenChainSelector
                        ];
                    bytes memory data = abi.encode(
                        3,
                        currentList(i),
                        nonce,
                        portfolioValue,
                        tokenOracleMarketShare(currentList(i))
                    );
                    sendMessage(
                        tokenChainSelector,
                        crossChainIndexFactory,
                        data,
                        PayFeesIn.LINK
                    );
                }
            }
        }
    }

    function secondReweightAction() public onlyOwner {
        uint nonce = updatePortfolioNonce;
        uint portfolioValue = portfolioTotalValueByNonce[nonce];
        for (uint i; i < totalCurrentList(); i++) {
            uint tokenValue = tokenValueByNonce[nonce][currentList(i)];
            if (
                (tokenValue * 100e18) / portfolioValue <
                tokenOracleMarketShare(currentList(i))
            ) {
                uint64 tokenChainSelector = tokenChainSelector(currentList(i));
                if (tokenChainSelector == currentChainSelector) {
                    uint buyValue = (tokenOracleMarketShare(currentList(i)) *
                        portfolioValue) /
                        100e18 -
                        tokenValue;
                    uint wethAmount = swap(
                        address(weth),
                        currentList(i),
                        buyValue,
                        address(indexToken),
                        3
                    );
                } else {
                    uint buyValue = (tokenOracleMarketShare(currentList(i)) *
                        portfolioValue) /
                        100e18 -
                        tokenValue;
                    if (buyValue > weth.balanceOf(address(indexToken))) {
                        buyValue = weth.balanceOf(address(indexToken));
                    }
                    uint crossChainTokenAmount = _swapSingle(
                        address(weth),
                        crossChainToken,
                        buyValue,
                        address(this),
                        3
                    );
                    Client.EVMTokenAmount[]
                        memory tokensToSendArray = new Client.EVMTokenAmount[](
                            1
                        );
                    tokensToSendArray[0].token = crossChainToken;
                    tokensToSendArray[0].amount = crossChainTokenAmount;
                    bytes memory data = abi.encode(
                        4,
                        currentList(i),
                        nonce,
                        0,
                        0
                    );
                    address crossChainIndexFactory = crossChainFactoryBySelector[
                            tokenChainSelector
                        ];
                    sendToken(
                        tokenChainSelector,
                        data,
                        crossChainIndexFactory,
                        tokensToSendArray,
                        PayFeesIn.LINK
                    );
                }
            }
        }

        indexFactoryStorage.updateCurrentList();
    }
}
