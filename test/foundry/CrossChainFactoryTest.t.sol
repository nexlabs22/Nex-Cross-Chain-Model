// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import {CrossChainIndexFactory} from "../../contracts/vault/CrossChainFactory.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/vault/Vault.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/ccip/CCIPReceiver.sol";
import "../../contracts/interfaces/ISwapRouter.sol";
import "../../contracts/interfaces/IUniswapV2Router02.sol";
import "../mocks/MockPriceFeed.sol";
import "./ContractDeployer.sol";

contract CrossChainIndexFactoryTest is Test, CrossChainIndexFactory {
    LinkToken link;
    MockApiOracle oracle;
    MockV3Aggregator ethPriceOracle;
    IndexToken indexToken;
    MockRouter2 mockRouter;
    Vault vaultContract;
    CrossChainIndexFactory factory;
    IndexFactoryStorage indexFactoryStorage;
    IndexFactory indexFactory;
    Token token;
    ContractDeployer deployer;
    MockERC20 mockToken;
    MockPriceFeed mockPriceFeed;

    // CrossChainIndexFactory factory;
    // ContractDeployer deployer;
    // CCIPReceiver ccip;
    // MockRouter2 mockRouter;
    // LinkToken link;
    // Vault vaultContract;

    address ownerAddr = address(1);
    address userAddr = address(2);

    struct TestAny2EVMMessage {
        bytes32 messageId;
        uint64 sourceChainSelector;
        bytes sender;
        bytes data;
        Client.EVMTokenAmount[] destTokenAmounts;
    }

    function setUp() public {
        vm.startPrank(ownerAddr);

        deployer = new ContractDeployer();
        deployer.deployAllContracts();

        // Retrieve deployed contract instances
        // (indexToken, mockRouter, vaultContract, factory, indexFactoryStorage, indexFactory) = deployer.deployContracts();

        token = deployer.crossChainToken();

        mockToken = new MockERC20("Mock Token", "MTK");
        mockRouter = new MockRouter2();
        link = new LinkToken();
        vaultContract = new Vault();

        mockPriceFeed = new MockPriceFeed();
        mockPriceFeed.setPrice(2000 * 10 ** 8);
        mockPriceFeed.setDecimals(8);

        vaultContract.initialize();

        factory = new CrossChainIndexFactory();
        factory.initialize(
            1,
            payable(address(vaultContract)),
            address(link),
            address(mockRouter), // CCIP router
            address(mockToken), // WETH
            address(mockRouter), // SwapRouterV3
            address(mockRouter), // FactoryV3
            address(mockRouter), // SwapRouterV2
            address(mockPriceFeed) // PriceFeed
        );

        link.transfer(address(factory), 1000 ether);
        mockToken.mint(address(factory), 1000 ether);

        factory.setCrossChainToken(100, address(mockToken), 0); // swapFee=0 for V2

        vm.stopPrank();
    }

    function testSetPriceOracle() public {
        address priceOracle = address(0x12345);

        vm.prank(ownerAddr);
        factory.setPriceOracle(priceOracle);

        assertEq(factory.priceOracle(), priceOracle, "Price oracle address mismatch");
    }

    function testSetCcipRouter() public {
        address newRouter = address(0x56789);

        vm.startPrank(ownerAddr);
        factory.setCcipRouter(newRouter);

        // assertEq(ccip.i_router(), newRouter, "CCIP router address mismatch");
    }

    function testSetCrossChainToken() public {
        uint64 chainSelector = 2;
        address crossChainToken = address(mockToken);
        uint24 swapFee = 3000;

        vm.prank(ownerAddr);
        factory.setCrossChainToken(chainSelector, crossChainToken, swapFee);

        assertEq(factory.crossChainToken(chainSelector), crossChainToken, "Cross-chain token mismatch");
        assertEq(factory.crossChainTokenSwapFee(chainSelector, crossChainToken), swapFee, "Swap fee mismatch");
    }

    function testConvertEthToUsd() public {
        uint256 ethAmount = 1 ether;

        vm.mockCall(
            address(mockRouter),
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(0, int256(2000 * 1e8), 0, 0, 0)
        );

        vm.mockCall(address(mockRouter), abi.encodeWithSelector(AggregatorV3Interface.decimals.selector), abi.encode(8));

        uint256 usdValue = factory.convertEthToUsd(ethAmount);

        assertEq(usdValue, 2000 * 1e18, "ETH to USD conversion mismatch");
    }

    function testSwap() public {
        uint256 amountIn = 100 ether;
        address tokenIn = address(mockToken);
        address tokenOut = address(mockToken);
        uint24 swapFee = 3000;
        address recipient = ownerAddr;

        mockToken.mint(address(factory), amountIn);

        vm.startPrank(ownerAddr);
        mockToken.approve(address(mockRouter), amountIn);
        vm.stopPrank();

        vm.mockCall(
            address(mockRouter), abi.encodeWithSelector(ISwapRouter.exactInputSingle.selector), abi.encode(amountIn)
        );

        uint256 outputAmount = factory.swap(tokenIn, tokenOut, amountIn, recipient, swapFee);

        assertEq(outputAmount, amountIn, "Swap output amount mismatch");
    }

    function testSendMessage() public {
        uint64 destinationChainSelector = 2;
        address receiver = address(0x1234);
        bytes memory data = "test data";

        vm.prank(ownerAddr);
        bytes32 messageId =
            factory.sendMessage(destinationChainSelector, receiver, data, CrossChainIndexFactory.PayFeesIn.LINK);

        assertTrue(messageId != bytes32(0), "Message ID should not be zero");
    }

    function testPauseUnpause() public {
        vm.prank(ownerAddr);
        factory.pause();

        assertTrue(factory.paused(), "Factory should be paused");

        vm.prank(ownerAddr);
        factory.unpause();

        assertFalse(factory.paused(), "Factory should not be paused");
    }

    function testFailPauseWithNonOwnerAddress() public {
        address user = address(2);
        vm.startPrank(user);
        vm.expectRevert("Non Owner address can not called this function");
        factory.pause();
    }

    function testSetVault() public {
        address payable newVault = payable(address(0x98765));

        vm.startPrank(ownerAddr);
        factory.setVault(newVault);
        vm.stopPrank();

        address actualVault = address(factory.vault());
        assertEq(actualVault, newVault, "Vault address should be updated correctly");
    }

    function testPauseAndUnpause() public {
        vm.startPrank(ownerAddr);
        factory.pause();
        vm.stopPrank();

        bool paused = factory.paused();
        assertTrue(paused, "Contract should be paused");

        vm.startPrank(ownerAddr);
        factory.unpause();
        vm.stopPrank();

        paused = factory.paused();
        assertFalse(paused, "Contract should be unpaused");
    }

    function testFailSetPriceOracleZeroAddress() public {
        vm.prank(ownerAddr);
        factory.setPriceOracle(address(0));
    }

    function testSetPriceOracleNonZero() public {
        address newOracle = address(0x123);
        vm.prank(ownerAddr);
        factory.setPriceOracle(newOracle);
        assertEq(factory.priceOracle(), newOracle);
    }

    function testFailSendTokenWithSixTokens() public {
        Client.EVMTokenAmount[] memory tooManyTokens = new Client.EVMTokenAmount[](6);
        for (uint256 i = 0; i < 6; i++) {
            tooManyTokens[i].token = address(mockToken);
            tooManyTokens[i].amount = 1 ether;
        }

        vm.startPrank(ownerAddr);
        sendToken(2, "someData", userAddr, tooManyTokens, CrossChainIndexFactory.PayFeesIn.LINK);
        vm.stopPrank();
    }

    //     function testCcipReceiveIssuance() public {
    //         vm.startPrank(ownerAddr);

    //         uint256 amountIn = 10 ether;
    //         address recipient = address(factory.weth());
    //         uint24 poolFee = 3000;
    //         uint256 nonce = 99;

    // =        vm.mockCall(
    //             address(factory), abi.encodeWithSelector(factory.swapRouterV3.selector), abi.encode(address(mockRouter))
    //         );

    //         vm.mockCall(
    //             address(factory),
    //             abi.encodeWithSelector(factory.swapRouterV2.selector),
    //             abi.encode(address(mockRouter))
    //         );

    //         vm.mockCall(
    //             address(token),
    //             abi.encodeWithSelector(IERC20.transferFrom.selector, ownerAddr, address(factory), amountIn),
    //             abi.encode(true)
    //         );

    //         vm.mockCall(
    //             address(token),
    //             abi.encodeWithSelector(IERC20.approve.selector, address(mockRouter), amountIn),
    //             abi.encode(true)
    //         );

    //         address[] memory path = new address[](2);
    //         path[0] = address(mockToken);
    //         path[1] = address(factory.weth());
    //         uint256[] memory amountsOut = new uint256[](2);
    //         amountsOut[0] = 10 ether;
    //         amountsOut[1] = 20 ether;

    //         vm.mockCall(
    //             address(mockRouter),
    //             abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
    //             abi.encode(amountsOut)
    //         );

    //         ISwapRouter.ExactInputSingleParams memory paramsV3 = ISwapRouter.ExactInputSingleParams({
    //             tokenIn: address(token),
    //             tokenOut: address(factory.weth()),
    //             fee: poolFee,
    //             recipient: address(factory),
    //             deadline: block.timestamp + 300,
    //             amountIn: amountIn,
    //             amountOutMinimum: 0,
    //             sqrtPriceLimitX96: 0
    //         });

    //         vm.mockCall(
    //             address(mockRouter),
    //             abi.encodeWithSelector(ISwapRouter.exactInputSingle.selector, paramsV3),
    //             abi.encode(20 ether)
    //         );

    //         bytes memory callData = abi.encode(
    //             0,
    //             new address[](0),
    //             new address[](0),
    //             new uint256[](0),
    //             new uint256[](0),
    //             nonce,
    //             new uint256[](0),
    //             new uint256[](0)
    //         );

    //         Client.EVMTokenAmount[] memory receivedTokens = new Client.EVMTokenAmount[](1);
    //         receivedTokens[0].token = address(token);
    //         receivedTokens[0].amount = amountIn;

    //         Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
    //             messageId: keccak256("testMessageId"),
    //             sourceChainSelector: 100,
    //             sender: abi.encode(ownerAddr),
    //             data: callData,
    //             destTokenAmounts: receivedTokens
    //         });

    //         ccipReceivePublic(any2EvmMessage);

    //         bytes32 storedMessageId = factory.issuanceMessageIdByNonce(nonce);
    //         assertTrue(storedMessageId != bytes32(0), "Issuance message ID should be non-zero");

    //         vm.stopPrank();
    //     }

    // function testCcipReceiveRedemption() public {
    //     uint256 actionType = 1; // _handleRedemption
    //     uint64 sourceChainSelector = 200;
    //     address sender = userAddr;
    //     uint256 nonce = 101;

    //     bytes memory callData = abi.encode(
    //         actionType,
    //         // targetAddresses
    //         new address[](0),
    //         // targetAddresses2
    //         new address[](0),
    //         // targetFees
    //         new uint256[](0),
    //         // targetFees2
    //         new uint256[](0),
    //         // nonce
    //         nonce,
    //         // percentages
    //         new uint256[](0),
    //         // extraValues
    //         new uint256[](1)
    //     );

    //     Client.EVMTokenAmount[] memory receivedTokens = new Client.EVMTokenAmount[](0);

    //     TestAny2EVMMessage memory testMsg = TestAny2EVMMessage({
    //         messageId: keccak256("someRedemptionMsg"),
    //         sourceChainSelector: sourceChainSelector,
    //         sender: abi.encode(sender),
    //         data: callData,
    //         destTokenAmounts: receivedTokens
    //     });

    //     vm.prank(ownerAddr);
    //     _ccipReceiveInternal(
    //         testMsg.messageId, testMsg.sourceChainSelector, testMsg.sender, testMsg.data, testMsg.destTokenAmounts
    //     );

    //     bytes32 storedMessageId = factory.redemptionMessageIdByNonce(nonce);
    //     assertTrue(storedMessageId != bytes32(0), "Redemption message ID should be non-zero");
    // }

    // function testSwapWithV2Path() public {
    //     uint256 amountIn = 50 ether;
    //     mockToken.mint(address(factory), amountIn);

    //     vm.startPrank(ownerAddr);
    //     uint256 outputAmount = factory.swap(address(mockToken), address(mockToken), amountIn, ownerAddr, 100);
    //     vm.stopPrank();

    //     assertEq(outputAmount, 0, "Expected 0 from V2 path in the sample library code");
    // }

    function testFailSetVaultNonOwner() public {
        vm.prank(userAddr);
        factory.setVault(payable(address(0x123)));
    }

    function testConvertEthToUsdCheck() public {
        uint256 ethAmount = 1 ether;
        uint256 usdValue = factory.convertEthToUsd(ethAmount);
        assertEq(usdValue, 2000 * 1e18, "convertEthToUsd mismatch at 2000 USD/ETH");
    }

    function _ccipReceiveInternal(
        bytes32 messageId,
        uint64 sourceChainSelector,
        bytes memory sender,
        bytes memory data,
        Client.EVMTokenAmount[] memory tokenAmounts
    ) internal {
        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: messageId,
            sourceChainSelector: sourceChainSelector,
            sender: sender,
            data: data,
            destTokenAmounts: tokenAmounts
        });

        ccipReceivePublic(any2EvmMessage);
    }

    function ccipReceivePublic(Client.Any2EVMMessage memory any2EvmMessage) public {
        _ccipReceive(any2EvmMessage);
    }
}
