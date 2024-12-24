// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import {CrossChainIndexFactory} from "../../contracts/vault/CrossChainFactory.sol";
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
    CrossChainIndexFactory factory;
    CCIPReceiver ccip;
    MockERC20 mockToken;
    MockRouter2 mockRouter;
    LinkToken link;
    Vault vaultContract;
    MockPriceFeed mockPriceFeed;

    address ownerAddr = address(1);

    function setUp() public {
        vm.startPrank(ownerAddr);

        mockToken = new MockERC20("Mock Token", "MTK");
        mockRouter = new MockRouter2();
        link = new LinkToken();
        vaultContract = new Vault();

        mockPriceFeed = new MockPriceFeed();

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
            address(mockRouter) // PriceFeed
        );

        mockPriceFeed.setPrice(2000 * 10 ** 8);
        mockPriceFeed.setDecimals(8);

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

    // function testHandleIssuance() public {
    //     vm.mockCall(
    //         address(mockRouter),
    //         abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, 100 ether, new address[](2)),
    //         abi.encode(new uint256[](2))
    //     );

    //     Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
    //     tokenAmounts[0].token = address(mockToken);
    //     tokenAmounts[0].amount = 100 ether;

    //     address[] memory targetAddresses = new address[](1);
    //     targetAddresses[0] = address(mockToken);

    //     uint256[] memory targetFees = new uint256[](1);
    //     targetFees[0] = 3000;

    //     uint256[] memory percentages = new uint256[](1);
    //     percentages[0] = 50;

    //     uint256[] memory extraValues = new uint256[](1);
    //     extraValues[0] = 100;

    //     uint256 nonce = 1;

    //     vm.startPrank(ownerAddr);
    //     _handleIssuance(tokenAmounts, targetAddresses, targetFees, nonce, 1, ownerAddr, percentages, extraValues);
    //     vm.stopPrank();

    //     bytes32 issuanceMessageId = factory.issuanceMessageIdByNonce(nonce);
    //     assertTrue(issuanceMessageId != bytes32(0), "Issuance message ID should not be zero");
    // }

    // ----------------------------------------------------------------------------------------------------------------------------------

    // function testHandleIssuance() public {
    //     uint256 amountIn = 100 ether;
    //     mockToken.mint(address(factory), amountIn);

    //     Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
    //     tokenAmounts[0].token = address(mockToken);
    //     tokenAmounts[0].amount = amountIn;

    //     address[] memory targetAddresses = new address[](1);
    //     targetAddresses[0] = address(mockToken);

    //     uint256[] memory targetFees = new uint256[](1);
    //     targetFees[0] = 3000;

    //     uint256[] memory percentages = new uint256[](1);
    //     percentages[0] = 100;

    //     uint256[] memory extraValues = new uint256[](1);
    //     extraValues[0] = 100;

    //     uint256 nonce = 1;

    //     vm.mockCall(
    //         address(mockRouter), abi.encodeWithSelector(ISwapRouter.exactInputSingle.selector), abi.encode(amountIn)
    //     );

    //     address[] memory path = new address[](2);
    //     path[0] = address(mockToken);
    //     path[1] = address(mockToken);

    //     vm.mockCall(
    //         address(mockRouter),
    //         abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, amountIn, path),
    //         abi.encode(new uint256[](2))
    //     );

    //     vm.startPrank(ownerAddr);
    //     _handleIssuance(tokenAmounts, targetAddresses, targetFees, nonce, 1, ownerAddr, percentages, extraValues);
    //     vm.stopPrank();

    //     bytes32 issuanceMessageId = factory.issuanceMessageIdByNonce(nonce);
    //     assertTrue(issuanceMessageId != bytes32(0), "Issuance message ID should not be zero");
    // }

    // function testHandleRedemption() public {
    //     uint256 amountIn = 100 ether;
    //     mockToken.mint(address(vaultContract), amountIn);

    //     vm.prank(ownerAddr);
    //     factory.setCrossChainToken(1, address(mockToken), 3000);

    //     address[] memory path = new address[](2);
    //     path[0] = address(mockToken);
    //     path[1] = address(mockToken);

    //     uint256[] memory amountOut = new uint256[](2);
    //     amountOut[0] = 100 ether;
    //     uint256 amountsOut = amountOut[0] / 2;

    //     vm.mockCall(
    //         address(mockRouter),
    //         abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector, 100 ether, path),
    //         abi.encode(amountsOut)
    //     );

    //     vm.mockCall(
    //         address(mockRouter),
    //         abi.encodeWithSelector(
    //             ISwapRouter.exactInputSingle.selector,
    //             abi.encode(
    //                 ISwapRouter.ExactInputSingleParams({
    //                     tokenIn: address(mockToken),
    //                     tokenOut: address(mockToken),
    //                     fee: 3000,
    //                     recipient: address(this),
    //                     deadline: block.timestamp,
    //                     amountIn: 100 ether,
    //                     amountOutMinimum: 50 ether,
    //                     sqrtPriceLimitX96: 0
    //                 })
    //             )
    //         ),
    //         abi.encode(50 ether)
    //     );

    //     address[] memory targetAddresses = new address[](1);
    //     targetAddresses[0] = address(mockToken);

    //     uint256[] memory targetFees = new uint256[](1);
    //     targetFees[0] = 3000;

    //     uint256[] memory extraValues = new uint256[](1);
    //     extraValues[0] = 100;

    //     uint256 nonce = 1;
    //     // uint64 sourceChainSelector = 2;

    //     vm.mockCall(
    //         address(mockRouter), abi.encodeWithSelector(ISwapRouter.exactInputSingle.selector), abi.encode(amountIn)
    //     );

    //     vm.startPrank(ownerAddr);
    //     _handleRedemption(targetAddresses, targetFees, nonce, 1, ownerAddr, extraValues);
    //     vm.stopPrank();

    //     bytes32 redemptionMessageId = factory.redemptionMessageIdByNonce(nonce);
    //     assertTrue(redemptionMessageId != bytes32(0), "Redemption message ID should not be zero");
    // }

    // function testHandleAskValues() public {
    //     address[] memory targetAddresses = new address[](1);
    //     targetAddresses[0] = address(mockToken);

    //     uint256[] memory targetFees = new uint256[](1);
    //     targetFees[0] = 3000;

    //     uint256 nonce = 1;
    //     uint64 sourceChainSelector = 2;

    //     mockToken.mint(address(vaultContract), 1 ether);

    //     vm.mockCall(
    //         address(mockRouter), abi.encodeWithSelector(IUniswapV2Router02.getAmountsOut.selector), abi.encode(1 ether)
    //     );

    //     vm.startPrank(ownerAddr);
    //     _handleAskValues(targetAddresses, targetFees, nonce, sourceChainSelector, ownerAddr);
    //     vm.stopPrank();
    // }

    // function testHandleFirstReweightAction() public {
    //     address[] memory currentTokens = new address[](1);
    //     currentTokens[0] = address(mockToken);

    //     address[] memory oracleTokens = new address[](1);
    //     oracleTokens[0] = address(mockToken);

    //     uint256[] memory targetFees = new uint256[](1);
    //     targetFees[0] = 3000;

    //     uint256[] memory targetFees2 = new uint256[](1);
    //     targetFees2[0] = 3000;

    //     uint256[] memory oracleTokenShares = new uint256[](1);
    //     oracleTokenShares[0] = 100;

    //     uint256[] memory extraData = new uint256[](3);
    //     extraData[0] = 100; // portfolio value
    //     extraData[1] = 100; // total shares
    //     extraData[2] = 100; // chain value

    //     uint256 nonce = 1;
    //     uint64 sourceChainSelector = 2;

    //     _handleFirstReweightAction(
    //         CrossChainIndexFactory.HandleFirstReweightActionInputs(
    //             currentTokens,
    //             oracleTokens,
    //             targetFees,
    //             targetFees2,
    //             oracleTokenShares,
    //             sourceChainSelector,
    //             ownerAddr,
    //             nonce,
    //             extraData
    //         )
    //     );
    // }
}
