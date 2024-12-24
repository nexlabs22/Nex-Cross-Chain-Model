// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/factory/IndexFactoryBalancer.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/test/MockRouter2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/test/LinkToken.sol";

contract IndexFactoryBalancerTest is Test {
    IndexFactoryBalancer balancer;
    IndexFactoryStorage storageContract;
    MockERC20 mockToken;
    MockRouter2 mockRouter;
    LinkToken link;

    address owner = address(1);
    address crossChainReceiver;

    function setUp() public {
        crossChainReceiver = address(0x1234);

        vm.startPrank(owner);

        mockToken = new MockERC20("Mock Token", "MTK");
        mockRouter = new MockRouter2();
        link = new LinkToken();

        storageContract = new IndexFactoryStorage();
        storageContract.initialize(
            1,
            payable(address(mockToken)),
            address(link),
            address(0x12345),
            bytes32("mockJobId"),
            address(0x123456),
            address(0x5678),
            address(mockRouter),
            address(0x6789),
            address(mockRouter),
            address(0x234)
        );

        storageContract.proposeOwner(owner);
        storageContract.transferOwnership(owner);

        balancer = new IndexFactoryBalancer();
        balancer.initialize(
            1,
            payable(address(mockToken)),
            address(storageContract),
            address(link),
            address(mockRouter),
            address(0x5678)
        );

        vm.stopPrank();

        link.approve(address(mockRouter), type(uint256).max);
    }

    function testSetCrossChainFactory() public {
        uint64 chainSelector = 1;
        address crossChainFactory = address(0x7890);

        vm.prank(owner);
        storageContract.setCrossChainFactory(crossChainFactory, chainSelector);

        assertEq(
            storageContract.crossChainFactoryBySelector(chainSelector),
            crossChainFactory,
            "Cross-chain factory address mismatch"
        );
    }

    function testSetCrossChainToken() public {
        uint64 chainSelector = 1;
        address tokenAddress = address(mockToken);
        uint24 swapFee = 3000;

        vm.prank(owner);
        storageContract.setCrossChainToken(chainSelector, tokenAddress, swapFee);

        assertEq(storageContract.crossChainToken(chainSelector), tokenAddress, "Cross-chain token mismatch");

        assertEq(storageContract.crossChainTokenSwapFee(chainSelector, tokenAddress), swapFee, "Swap fee mismatch");
    }

    function testPortfolioBalanceCalculation() public {
        address token = address(mockToken);
        uint256 amount = 100 ether;

        mockToken.mint(address(balancer), amount);

        uint256 balancerBalance = mockToken.balanceOf(address(balancer));
        console.log("Balancer Balance:", balancerBalance);

        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        vm.prank(owner);
        storageContract.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(storageContract),
            abi.encodeWithSelector(storageContract.getAmountOut.selector),
            abi.encode(200 ether)
        );

        uint256 balance = balancer.getPortfolioBalance();
        assertGt(balance, 0, "Portfolio balance calculation failed");
    }

    function testFeeRateSetting() public {
        uint8 newFee = 50;

        vm.warp(block.timestamp + 13 hours);

        vm.prank(owner);
        balancer.setFeeRate(newFee);

        assertEq(balancer.feeRate(), newFee, "Fee rate not updated correctly");
    }

    function testCrossChainOperation() public {
        uint64 chainSelector = 2;
        address crossChainFactory = address(0x4321);
        address crossChainToken = address(0x9876);

        vm.startPrank(owner);
        storageContract.setCrossChainFactory(crossChainFactory, chainSelector);
        storageContract.setCrossChainToken(chainSelector, crossChainToken, 3000);
        vm.stopPrank();

        assertEq(
            storageContract.crossChainFactoryBySelector(chainSelector),
            crossChainFactory,
            "Cross-chain factory setup failed"
        );

        assertEq(storageContract.crossChainToken(chainSelector), crossChainToken, "Cross-chain token setup failed");
    }

    function test_setIndexFactoryStorage_SuccessfulSetIndexFactoryStorage() public {
        address newFactoryStorage = address(0x1234);

        vm.prank(owner);
        balancer.setIndexFactoryStorage(newFactoryStorage);

        assertEq(address(balancer.factoryStorage()), newFactoryStorage, "Factory storage address mismatch");
    }

    function test_crossChainFactoryBySelector_SuccessfulCrossChainFactoryBySelector() public {
        uint64 chainSelector = 1;
        address crossChainFactory = address(0x7890);

        vm.prank(owner);
        storageContract.setCrossChainFactory(crossChainFactory, chainSelector);

        address result = balancer.crossChainFactoryBySelector(chainSelector);

        assertEq(result, crossChainFactory, "Cross-chain factory address mismatch");
    }

    function test_crossChainToken_SuccessfulCrossChainTokenRetrieval() public {
        uint64 chainSelector = 1;
        address tokenAddress = address(mockToken);
        uint24 swapFee = 3000;

        vm.prank(owner);
        storageContract.setCrossChainToken(chainSelector, tokenAddress, swapFee);

        address retrievedTokenAddress = balancer.crossChainToken(chainSelector);
        assertEq(retrievedTokenAddress, tokenAddress, "Cross-chain token retrieval failed");
    }

    // function test_getPortfolioBalance_SuccessfulBalanceCalculation() public {
    //     address token = address(mockToken);
    //     uint256 amount = 100 ether;

    //     mockToken.mint(address(balancer), amount);

    //     address[] memory tokens = new address[](1);
    //     tokens[0] = token;
    //     uint256[] memory marketShares = new uint256[](1);
    //     marketShares[0] = 50;
    //     uint24[] memory swapFees = new uint24[](1);
    //     swapFees[0] = 3000;
    //     uint64[] memory chainSelectors = new uint64[](1);
    //     chainSelectors[0] = 1;

    //     vm.prank(owner);
    //     storageContract.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

    //     uint256 balance = balancer.getPortfolioBalance();
    //     assertGt(balance, 0, "Portfolio balance calculation failed");
    // }

    function test_estimateAmountOut_SuccessfulEstimateAmountOut() public {
        uint128 amountIn = 100;
        address tokenIn = address(mockToken);
        address tokenOut = address(0x5678);

        vm.mockCall(
            address(storageContract),
            abi.encodeWithSelector(storageContract.estimateAmountOut.selector, tokenIn, tokenOut, amountIn),
            abi.encode(200)
        );

        vm.prank(owner);
        uint256 amountOut = balancer.estimateAmountOut(tokenIn, tokenOut, amountIn);

        assertEq(amountOut, 200, "Amount out should be 200");
    }

    function test_sendMessage_SuccessfulSendMessageWithLink() public {
        uint64 destinationChainSelector = 2;
        address receiver = address(0x1234);
        bytes memory data = "test data";

        vm.prank(owner);
        balancer.sendMessage(destinationChainSelector, receiver, data, IndexFactoryBalancer.PayFeesIn.LINK);

        // Verify that the message was sent successfully
        // You can add additional assertions here if needed
    }

    function test_ccipReceive_SuccessfulReceiveMessageWithActionType2() public {
        uint256 actionType = 2;
        address[] memory tokenAddresses = new address[](1);
        tokenAddresses[0] = address(mockToken);
        address[] memory tokenAddresses2 = new address[](0);
        uint256 nonce = 1;
        uint256[] memory value1 = new uint256[](1);
        value1[0] = 100;
        uint256[] memory value2 = new uint256[](0);

        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, nonce, value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: bytes32(0),
            sourceChainSelector: 1,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);

        assertEq(balancer.portfolioTotalValueByNonce(nonce), 100, "Portfolio total value mismatch");
        assertEq(balancer.tokenValueByNonce(nonce, address(mockToken)), 100, "Token value mismatch");
        assertEq(balancer.chainValueByNonce(nonce, 1), 100, "Chain value mismatch");
        assertEq(balancer.updatedTokensValueCount(nonce), 1, "Updated tokens value count mismatch");
    }

    function test_ccipReceive_SuccessfulReceiveMessageWithActionType4() public {
        uint256 actionType = 4;
        address[] memory tokenAddresses = new address[](0);
        address[] memory tokenAddresses2 = new address[](0);
        uint256 nonce = 1;
        uint256[] memory value1 = new uint256[](0);
        uint256[] memory value2 = new uint256[](0);

        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, nonce, value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: bytes32(0),
            sourceChainSelector: 1,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(owner);
        storageContract.setIndexFactoryBalancer(address(balancer));

        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);

        assertEq(storageContract.currentFilledCount(), 1, "Current filled count mismatch");
    }

    function test_ccipReceive_SuccessfulReceiveMessageWithActionType5() public {
        uint256 actionType = 5;
        address[] memory tokenAddresses = new address[](0);
        address[] memory tokenAddresses2 = new address[](0);
        uint256 nonce = 1;
        uint256[] memory value1 = new uint256[](0);
        uint256[] memory value2 = new uint256[](0);

        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, nonce, value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: bytes32(0),
            sourceChainSelector: 1,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);

        // Add assertions if needed
    }

    function test_askValues_SuccessfulAskValues() public {
        vm.startPrank(owner);

        address[] memory tokens = new address[](1);
        tokens[0] = address(mockToken);
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        storageContract.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(storageContract), abi.encodeWithSelector(storageContract.priceInWei.selector), abi.encode(1e18)
        );

        balancer.askValues();

        vm.stopPrank();

        uint256 nonce = balancer.updatePortfolioNonce();
        uint256 portfolioValue = balancer.portfolioTotalValueByNonce(nonce);
        uint256 tokenValue = balancer.tokenValueByNonce(nonce, address(mockToken));
        uint256 chainValue = balancer.chainValueByNonce(nonce, 1);

        assertEq(portfolioValue, 0, "Portfolio value should be zero");
        assertEq(tokenValue, 0, "Token value should be zero");
        assertEq(chainValue, 0, "Chain value should be zero");
    }

    function test_setFeeRate_FailIfTooSoon() public {
        uint8 newFee = 50;

        vm.prank(owner);
        vm.expectRevert("You should wait at least 12 hours after the latest update");
        balancer.setFeeRate(newFee);
    }

    function test_FallbackFunction_AllowsEthReceive() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(balancer).call{value: 1 ether}("");
        assertTrue(success, "ETH transfer to contract failed");
    }
}
