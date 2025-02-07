// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "../token/IndexToken.sol";
import "../proposable/ProposableOwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// import "../libraries/OracleLibrary.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "../ccip/CCIPReceiver.sol";
import "./Vault.sol";
// import {Withdraw} from "./utils/Withdraw.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../factory/IPriceOracle.sol";
import "../libraries/SwapHelpers.sol";
import "../libraries/PathHelpers.sol";
import "../interfaces/IWETH.sol";
import "../libraries/MessageSender.sol";

/// @title Index Token
/// @author NEX Labs Protocol
/// @notice The main token contract for Index Token (NEX Labs Protocol)
/// @dev This contract uses an upgradeable pattern
contract CrossChainIndexFactoryStorage is
    Initializable,
    ContextUpgradeable,
    ProposableOwnableUpgradeable,
    PausableUpgradeable
{
    

   

    address public i_router;
    address public i_link;
    uint16 public i_maxTokensLength;
    uint16 public constant MAX_TOKENS_LENGTH = 5;

    address public crossChainFactory;
    
    // IndexToken public indexToken;
    Vault public vault;

    uint64 public currentChainSelector;

    address public priceOracle;
    

    
    AggregatorV3Interface public toUsdPriceFeed;

    ISwapRouter public swapRouterV3;
    IUniswapV3Factory public factoryV3;
    IUniswapV2Router02 public swapRouterV2;
    // IUniswapV2Factory public factoryV2;
    IWETH public weth;
    IQuoter public quoter;

    // address public crossChainToken;
    mapping(uint64 => address) public crossChainToken;

    mapping(address => address[]) public fromETHPath;
    mapping(address => address[]) public toETHPath;
    mapping(address => uint24[]) public fromETHFees;
    mapping(address => uint24[]) public toETHFees;

    mapping(address => mapping(uint64 => bool)) public verifiedFactory;

    

    mapping(uint => bytes32) public redemptionMessageIdByNonce;
    mapping(uint => bytes32) public issuanceMessageIdByNonce;

    modifier onlyFactory() {
        require(msg.sender == crossChainFactory, "Only factory can call this function");
        _;
    }

    function initialize(
        uint64 _currentChainSelector,
        address payable _vault,
        address _chainlinkToken,
        //ccip
        address _router,
        //addresses
        address _weth,
        // address _quoter,
        address _swapRouterV3,
        address _factoryV3,
        address _swapRouterV2,
        // address _factoryV2,
        address _toUsdPriceFeed
    ) external initializer {
        require(_currentChainSelector > 0, "Invalid chain selector");
        require(_vault != address(0), "Invalid vault address");
        require(_chainlinkToken != address(0), "Invalid Chainlink token address");
        require(_router != address(0), "Invalid router address");
        require(_weth != address(0), "Invalid WETH address");
        require(_swapRouterV3 != address(0), "Invalid swap router v3 address");
        require(_factoryV3 != address(0), "Invalid factory v3 address");
        require(_swapRouterV2 != address(0), "Invalid swap router v2 address");
        // require(_factoryV2 != address(0), "Invalid factory v2 address");
        require(_toUsdPriceFeed != address(0), "Invalid price feed address");
        CCIPReceiver(_router);
        __Ownable_init();
        __Pausable_init();
        //set chain selector
        currentChainSelector = _currentChainSelector;
        vault = Vault(_vault);
        //set oracle data
        // setChainlinkToken(_chainlinkToken);

        //set ccip addresses
        i_router = _router;
        i_link = _chainlinkToken;
        i_maxTokensLength = 5;

        //set addresses
        weth = IWETH(_weth);
        swapRouterV3 = ISwapRouter(_swapRouterV3);
        factoryV3 = IUniswapV3Factory(_factoryV3);
        swapRouterV2 = IUniswapV2Router02(_swapRouterV2);
        // factoryV2 = IUniswapV2Factory(_factoryV2);
        //oracle
        toUsdPriceFeed = AggregatorV3Interface(_toUsdPriceFeed);
    }

    function _toWei(
        int256 _amount,
        uint8 _amountDecimals,
        uint8 _chainDecimals
    ) private pure returns (int256) {
        if (_chainDecimals > _amountDecimals)
            return _amount * int256(10 ** (_chainDecimals - _amountDecimals));
        else return _amount * int256(10 ** (_amountDecimals - _chainDecimals));
    }

    function priceInWei() public view returns (uint256) {
        (, int price, , , ) = toUsdPriceFeed.latestRoundData();
        uint8 priceFeedDecimals = toUsdPriceFeed.decimals();
        price = _toWei(price, priceFeedDecimals, 18);
        return uint256(price);
    }

    function convertEthToUsd(uint _ethAmount) public view returns (uint256) {
        return (_ethAmount * priceInWei()) / 1e18;
    }

    function setCrosschainFactory(address _factory) public onlyOwner {
        crossChainFactory = _factory;
    }

    function setPriceOracle(address _priceOracle) external onlyOwner {
        require(
            _priceOracle != address(0),
            "Price oracle address cannot be zero address"
        );
        priceOracle = _priceOracle;
    }

    function setCcipRouter(address _router) public onlyOwner {
        i_router = _router;
    }

    function setCrossChainToken(
        uint64 _chainSelector,
        address _crossChainToken,
        address[] memory _fromETHPath,
        uint24[] memory _fromETHFees
    ) public onlyOwner {
        crossChainToken[_chainSelector] = _crossChainToken;
        fromETHPath[_crossChainToken] = _fromETHPath;
        fromETHFees[_crossChainToken] = _fromETHFees;
        toETHPath[_crossChainToken] = PathHelpers.reverseAddressArray(
            _fromETHPath
        );
        toETHFees[_crossChainToken] = PathHelpers.reverseUint24Array(
            _fromETHFees
        );

    }

    function setVault(address payable _vault) public onlyOwner {
        vault = Vault(_vault);
    }

    function setVerifiedFactory(
        address _factory,
        uint64 _chainSelector,
        bool _verified
    ) public onlyOwner {
        verifiedFactory[_factory][_chainSelector] = _verified;
    }

    function setIssuanceMessageIdByNonce(uint _nonce, bytes32 _messageId) public onlyFactory {
        issuanceMessageIdByNonce[_nonce] = _messageId;
    }

    function setRedemptionMessageIdByNonce(uint _nonce, bytes32 _messageId) public onlyFactory {
        redemptionMessageIdByNonce[_nonce] = _messageId;
    }

    
    function getAllFromETHPath(address _tokenAddress) public view returns (address[] memory) {
        return fromETHPath[_tokenAddress];
    }

    function getAllFromETHFees(address _tokenAddress) public view returns (uint24[] memory) {
        return fromETHFees[_tokenAddress];
    }

    function getAllToETHPath(address _tokenAddress) public view returns (address[] memory) {
        return toETHPath[_tokenAddress];
    }

    function getAllToETHFees(address _tokenAddress) public view returns (uint24[] memory) {
        return toETHFees[_tokenAddress];
    }




    function getTokenCurrentValue(address _tokenAddress, address[] memory _fromETHPath, uint24[] memory _fromETHFees) public view returns (uint) {
        uint tokenValue = getAmountOut(
                    PathHelpers.reverseAddressArray(_fromETHPath), // toETHPath
                    PathHelpers.reverseUint24Array(_fromETHFees), // toETHFees
                    IERC20(_tokenAddress).balanceOf(address(vault))
                );
        return tokenValue;
    }

    function getAmountOut(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint finalAmountOut) {
        if (amountIn > 0) {
            if (fees.length > 0) {
                finalAmountOut = estimateAmountOutWithPath(
                    path,
                    fees,
                    amountIn
                );
            } else {
                uint[] memory v2amountOut = swapRouterV2.getAmountsOut(
                    amountIn,
                    path
                );
                finalAmountOut = v2amountOut[v2amountOut.length - 1];
            }
        }
    }

    function estimateAmountOut(
        address tokenIn,
        address tokenOut,
        uint128 amountIn,
        uint24 fee
    ) public view returns (uint amountOut) {
        amountOut = IPriceOracle(priceOracle).estimateAmountOut(
            address(factoryV3),
            tokenIn,
            tokenOut,
            amountIn,
            fee
        );
    }

    function estimateAmountOutWithPath(
        address[] memory path,
        uint24[] memory fees,
        uint amountIn
    ) public view returns (uint amountOut) {
        uint lastAmount = amountIn;
        for(uint i = 0; i < path.length - 1; i++) {
            lastAmount = IPriceOracle(priceOracle).estimateAmountOut(
                address(factoryV3),
                path[i],
                path[i+1],
                uint128(lastAmount),
                fees[i]
            );
        }
        amountOut = lastAmount;
    }

    



    
    

}
