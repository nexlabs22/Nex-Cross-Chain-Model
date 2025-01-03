// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/factory/IndexFactoryBalancer.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/test/MockRouter2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/test/LinkToken.sol";
import "./ContractDeployer.sol";
import "../../contracts/ccip/CCIPReceiver.sol";

contract IndexFactoryBalancerTest is Test, ContractDeployer {
    IndexFactoryBalancer balancer;

    enum PayFeesIn {
        Native,
        LINK
    }

    address crossChainReceiver;

    function setUp() public {
        deployAllContracts();
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);

        balancer = new IndexFactoryBalancer();
        balancer.initialize(
            1,
            payable(address(crossChainToken)),
            address(indexFactoryStorage),
            address(link),
            address(mockRouter),
            address(0x5678)
        );
    }

    function testSetFeeRateMutations() public {
        uint8 validFee = 50;
        uint256 twelveHours = 12 * 60 * 60;

        skip(twelveHours + 1);
        vm.expectRevert("You should wait at least 12 hours after the latest update");
        balancer.setFeeRate(validFee);

        uint256 latestFeeUpdate = block.timestamp - (twelveHours / 2);
        vm.expectRevert("You should wait at least 12 hours after the latest update");
        balancer.setFeeRate(validFee);
        vm.stopPrank();

        skip(twelveHours + 1);
        vm.expectRevert("The newFee should be between 1 and 100 (0.01% - 1%)");
        balancer.setFeeRate(0);

        vm.expectRevert("The newFee should be between 1 and 100 (0.01% - 1%)");
        balancer.setFeeRate(101);

        balancer.setFeeRate(validFee);
        assertEq(balancer.feeRate(), validFee, "Fee rate should be updated successfully");

        vm.stopPrank();
    }

    function testSetCrossChainFactory() public {
        uint64 chainSelector = 1;
        address crossChainFactory = address(0x7890);

        indexFactoryStorage.setCrossChainFactory(crossChainFactory, chainSelector);

        assertEq(
            indexFactoryStorage.crossChainFactoryBySelector(chainSelector),
            crossChainFactory,
            "Cross-chain factory address mismatch"
        );
    }

    function testSetCrossChainToken() public {
        uint64 chainSelector = 1;
        address tokenAddress = address(crossChainToken);
        uint24 swapFee = 3000;

        indexFactoryStorage.setCrossChainToken(chainSelector, tokenAddress, swapFee);

        assertEq(indexFactoryStorage.crossChainToken(chainSelector), tokenAddress, "Cross-chain token mismatch");

        assertEq(indexFactoryStorage.crossChainTokenSwapFee(chainSelector, tokenAddress), swapFee, "Swap fee mismatch");
    }

    function testPortfolioBalanceCalculation() public {
        address token = address(token0);
        uint256 amount = 100 ether;

        deal(address(token0), address(balancer), amount);

        uint256 balancerBalance = token0.balanceOf(address(balancer));
        console.log("Balancer Balance:", balancerBalance);

        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getAmountOut.selector),
            abi.encode(200 ether)
        );

        uint256 balance = balancer.getPortfolioBalance();
        assertGt(balance, 0, "Portfolio balance calculation failed");
    }

    function testFeeRateSetting() public {
        uint8 newFee = 50;

        vm.warp(block.timestamp + 13 hours);

        balancer.setFeeRate(newFee);

        assertEq(balancer.feeRate(), newFee, "Fee rate not updated correctly");
    }

    function testCrossChainOperation() public {
        uint64 chainSelector = 2;
        address crossChainFactory = address(0x4321);
        address crossChainToken = address(0x9876);

        indexFactoryStorage.setCrossChainFactory(crossChainFactory, chainSelector);
        indexFactoryStorage.setCrossChainToken(chainSelector, crossChainToken, 3000);

        assertEq(
            indexFactoryStorage.crossChainFactoryBySelector(chainSelector),
            crossChainFactory,
            "Cross-chain factory setup failed"
        );

        assertEq(indexFactoryStorage.crossChainToken(chainSelector), crossChainToken, "Cross-chain token setup failed");
    }

    function test_setIndexFactoryStorage_SuccessfulSetIndexFactoryStorage() public {
        address newFactoryStorage = address(0x1234);

        balancer.setIndexFactoryStorage(newFactoryStorage);

        assertEq(address(balancer.factoryStorage()), newFactoryStorage, "Factory storage address mismatch");
    }

    function test_crossChainFactoryBySelector_SuccessfulCrossChainFactoryBySelector() public {
        uint64 chainSelector = 1;
        address crossChainFactory = address(0x7890);

        indexFactoryStorage.setCrossChainFactory(crossChainFactory, chainSelector);

        address result = balancer.crossChainFactoryBySelector(chainSelector);

        assertEq(result, crossChainFactory, "Cross-chain factory address mismatch");
    }

    function test_crossChainToken_SuccessfulCrossChainTokenRetrieval() public {
        uint64 chainSelector = 1;
        address tokenAddress = address(crossChainToken);
        uint24 swapFee = 3000;

        indexFactoryStorage.setCrossChainToken(chainSelector, tokenAddress, swapFee);

        address retrievedTokenAddress = balancer.crossChainToken(chainSelector);
        assertEq(retrievedTokenAddress, tokenAddress, "Cross-chain token retrieval failed");
    }

    function test_estimateAmountOut_SuccessfulEstimateAmountOut() public {
        uint128 amountIn = 100;
        address tokenIn = address(token0);
        address tokenOut = address(0x5678);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.estimateAmountOut.selector, tokenIn, tokenOut, amountIn),
            abi.encode(200)
        );

        uint256 amountOut = balancer.estimateAmountOut(tokenIn, tokenOut, amountIn, 3000);

        assertEq(amountOut, 200, "Amount out should be 200");
    }

    function test_sendMessage_SuccessfulSendMessageWithLink() public {
        uint64 destinationChainSelector = 2;
        address receiver = address(0x1234);
        bytes memory data = "test data";

        balancer.sendMessage(destinationChainSelector, receiver, data, IndexFactoryBalancer.PayFeesIn.LINK);

        // Verify that the message was sent successfully
        // You can add additional assertions here if needed
    }

    function test_ccipReceive_SuccessfulReceiveMessageWithActionType2() public {
        uint256 actionType = 2;
        address[] memory tokenAddresses = new address[](1);
        tokenAddresses[0] = address(crossChainToken);
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
        assertEq(balancer.tokenValueByNonce(nonce, address(crossChainToken)), 100, "Token value mismatch");
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

        indexFactoryStorage.setIndexFactoryBalancer(address(balancer));

        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);

        assertEq(indexFactoryStorage.currentFilledCount(), 1, "Current filled count mismatch");
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
        address[] memory tokens = new address[](1);
        tokens[0] = address(token0);
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.priceInWei.selector),
            abi.encode(1e18)
        );

        balancer.askValues();

        vm.stopPrank();

        uint256 nonce = balancer.updatePortfolioNonce();
        uint256 portfolioValue = balancer.portfolioTotalValueByNonce(nonce);
        uint256 tokenValue = balancer.tokenValueByNonce(nonce, address(token0));
        uint256 chainValue = balancer.chainValueByNonce(nonce, 1);

        assertEq(portfolioValue, 0, "Portfolio value should be zero");
        assertEq(tokenValue, 0, "Token value should be zero");
        assertEq(chainValue, 0, "Chain value should be zero");
    }

    function testAskValuesRevertWithNonOwnerAddress() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(token0);
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.priceInWei.selector),
            abi.encode(1e18)
        );

        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.askValues();
        vm.stopPrank();
    }

    function test_setFeeRate_FailIfTooSoon() public {
        uint8 newFee = 50;

        vm.expectRevert("You should wait at least 12 hours after the latest update");
        balancer.setFeeRate(newFee);
    }

    function test_FallbackFunction_AllowsEthReceive() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(balancer).call{value: 1 ether}("");
        assertTrue(success, "ETH transfer to contract failed");
    }

    // ----------------------------------------------------------------------

    function testSetFeeRate_NotOwnerReverts() public {
        vm.startPrank(address(0xDEAD));
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.setFeeRate(40);
        vm.stopPrank();
    }

    function testSetIndexFactoryStorageFailIfNotOwner() public {
        address newFactoryStorage = address(0xABCD);

        vm.startPrank(address(0x9999));
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.setIndexFactoryStorage(newFactoryStorage);
        vm.stopPrank();
    }

    function testFirstReweightAction_BasicScenario() public {
        balancer.setPortfolioTotalValueByNonce(1, 1000);
        uint64 chainSel = 1;

        balancer.chainValueByNonce(1, chainSel);

        vm.store(
            address(balancer),
            keccak256(abi.encode(chainSel, keccak256(abi.encode(uint256(1), 73)))),
            bytes32(uint256(1500))
        );

        vm.startPrank(balancer.owner());
        balancer.firstReweightAction();
        vm.stopPrank();
    }

    function testFirstReweightActionRevertWithNonOwnerAddress() public {
        balancer.setPortfolioTotalValueByNonce(1, 1000);
        uint64 chainSel = 1;

        balancer.chainValueByNonce(1, chainSel);

        vm.store(
            address(balancer),
            keccak256(abi.encode(chainSel, keccak256(abi.encode(uint256(1), 73)))),
            bytes32(uint256(1500))
        );

        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.firstReweightAction();
        vm.stopPrank();
    }

    function testSecondReweightAction_BasicScenario() public {
        balancer.setPortfolioTotalValueByNonce(1, 2000);

        uint64 chainSel = 2;
        vm.store(
            address(balancer),
            keccak256(abi.encode(chainSel, keccak256(abi.encode(uint256(1), 73)))),
            bytes32(uint256(100))
        );

        vm.startPrank(balancer.owner());
        balancer.secondReweightAction();
        vm.stopPrank();
    }

    function testSecondReweightActionRevertWithNonOwnerAddress() public {
        balancer.setPortfolioTotalValueByNonce(1, 2000);

        uint64 chainSel = 2;
        vm.store(
            address(balancer),
            keccak256(abi.encode(chainSel, keccak256(abi.encode(uint256(1), 73)))),
            bytes32(uint256(100))
        );

        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.secondReweightAction();
        vm.stopPrank();
    }

    function testSetPortfolioTotalValueByNonce_Basic() public {
        vm.startPrank(balancer.owner());
        balancer.setPortfolioTotalValueByNonce(2, 9999);
        vm.stopPrank();

        uint256 val = balancer.portfolioTotalValueByNonce(2);
        assertEq(val, 9999, "Value mismatch for setPortfolioTotalValueByNonce");
    }

    function testSetPortfolioTotalValueByNonceRevert_WithNonOwnerAddress() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.setPortfolioTotalValueByNonce(2, 9999);
        vm.stopPrank();
    }

    function test_crossChainFactoryBySelector_NoExist() public {
        address returnedAddr = balancer.crossChainFactoryBySelector(55);
        assertEq(returnedAddr, address(0), "Should return zero if not set");
    }

    function testConvertEthToUsd_BasicMock() public {
        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.priceInWei.selector),
            abi.encode(2000e18)
        );
        uint256 usdVal = balancer.convertEthToUsd(1 ether);
        assertEq(usdVal, 2000e18, "convertEthToUsd mismatch");
    }

    function testCrossChainToken_NoSelectorSetShouldReturn0() public {
        address cToken = balancer.crossChainToken(99); // not set
        assertEq(cToken, address(0), "Should be zero if not set");
    }

    function testFirstReweightAction_CallsWithNoChainValueShouldDoNothing() public {
        balancer.setPortfolioTotalValueByNonce(1, 1000);

        vm.startPrank(balancer.owner());
        balancer.firstReweightAction();
        vm.stopPrank();
    }

    function testSecondReweightAction_CallsWithNoChainValueShouldDoNothing() public {
        balancer.setPortfolioTotalValueByNonce(2, 2000);

        vm.startPrank(balancer.owner());
        balancer.secondReweightAction();
        vm.stopPrank();
    }

    function testCcipReceive_ActionType0() public {
        uint256 actionType = 0;
        address[] memory tokenAddresses = new address[](0);
        address[] memory tokenAddresses2 = new address[](0);
        uint256[] memory value1 = new uint256[](0);
        uint256[] memory value2 = new uint256[](0);
        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, uint256(42), value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory msgData = Client.Any2EVMMessage({
            messageId: bytes32("some-id"),
            sourceChainSelector: 77,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(address(mockRouter));
        balancer.ccipReceive(msgData);
    }

    function testCcipReceive_ActionType1() public {
        uint256 actionType = 1;
        address[] memory tokenAddresses = new address[](0);
        address[] memory tokenAddresses2 = new address[](0);
        uint256[] memory value1 = new uint256[](0);
        uint256[] memory value2 = new uint256[](0);
        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, uint256(43), value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory msgData = Client.Any2EVMMessage({
            messageId: bytes32("some-other-id"),
            sourceChainSelector: 88,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(address(mockRouter));
        balancer.ccipReceive(msgData);
    }

    function testCcipReceive_ActionType999_InvalidPath() public {
        uint256 actionType = 999;
        address[] memory tokenAddresses = new address[](1);
        tokenAddresses[0] = address(token0);

        uint256[] memory value1 = new uint256[](1);
        value1[0] = 123;

        bytes memory data =
            abi.encode(actionType, tokenAddresses, new address[](0), uint256(4), value1, new uint256[](0));

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: bytes32("unknown-action"),
            sourceChainSelector: 1,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);
    }

    function testOwnerCanSetFeeRateWithinRange() public {
        vm.warp(block.timestamp + 13 hours);
        uint8 newFee = 99;
        balancer.setFeeRate(newFee);
        assertEq(balancer.feeRate(), newFee, "Fee rate not updated correctly");
    }

    function testSetFeeRate_RevertIfValueBelow1() public {
        vm.warp(block.timestamp + 13 hours);
        vm.expectRevert("The newFee should be between 1 and 100 (0.01% - 1%)");
        balancer.setFeeRate(0); // invalid
    }

    function testSetFeeRate_RevertIfValueAbove100() public {
        vm.warp(block.timestamp + 13 hours);
        vm.expectRevert("The newFee should be between 1 and 100 (0.01% - 1%)");
        balancer.setFeeRate(101);
    }

    function testNonOwnerSetFeeRateShouldRevert() public {
        vm.startPrank(address(0xDEAD));
        vm.warp(block.timestamp + 13 hours);
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.setFeeRate(10);
        vm.stopPrank();
    }

    function testSetIndexFactoryStorageByNonOwnerReverts() public {
        vm.startPrank(address(0xBEEF));
        vm.expectRevert("Ownable: caller is not the owner");
        balancer.setIndexFactoryStorage(address(0x1234));
        vm.stopPrank();
    }

    function testFallbackFunctionCanReceiveEth() public {
        vm.deal(address(this), 1 ether);
        (bool success,) = address(balancer).call{value: 1 ether}("");
        assertTrue(success, "ETH transfer to contract failed");
    }

    function test_getPortfolioBalance_SuccessfulGetPortfolioBalance() public {
        address token = address(token0);
        uint256 amount = 100 ether;

        deal(address(token0), address(balancer), amount);

        uint256 balancerBalance = token0.balanceOf(address(balancer));
        console.log("Balancer Balance:", balancerBalance);

        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 2;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getAmountOut.selector),
            abi.encode(200 ether)
        );

        uint256 balance = balancer.getPortfolioBalance();
        assertEq(balance, 0, "Portfolio balance calculation failed");
    }

    function test_sendMessage_SuccessfulSendMessageWithEth() public {
        uint64 destinationChainSelector = 2;
        address receiver = address(0x1234);
        bytes memory data = "test data";

        balancer.sendMessage(destinationChainSelector, receiver, data, IndexFactoryBalancer.PayFeesIn.Native);
    }

    function test_ccipReceive_SuccessfulReceiveMessageWithActionType3() public {
        uint256 actionType = 3;
        address[] memory tokenAddresses = new address[](1);
        tokenAddresses[0] = address(crossChainToken);
        address[] memory tokenAddresses2 = new address[](0);
        uint256 nonce = 1;
        uint256[] memory value1 = new uint256[](1);
        value1[0] = 100;
        uint256[] memory value2 = new uint256[](0);

        bytes memory data = abi.encode(actionType, tokenAddresses, tokenAddresses2, nonce, value1, value2);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: address(crossChainToken), amount: 100});

        Client.Any2EVMMessage memory any2EvmMessage = Client.Any2EVMMessage({
            messageId: bytes32(0),
            sourceChainSelector: 1,
            sender: abi.encode(address(this)),
            data: data,
            destTokenAmounts: tokenAmounts
        });

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.getAmountOut.selector),
            abi.encode(200)
        );

        vm.expectRevert();
        vm.prank(address(mockRouter));
        balancer.ccipReceive(any2EvmMessage);
    }

    function testFailFulfillAssetsData_ArrayLengthMismatch() public {
        vm.startPrank(owner);

        address[] memory tokens = new address[](2);
        tokens[0] = address(token1);
        tokens[1] = address(token2);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 100e18;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 3000;
        swapFees[1] = 10000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        vm.expectRevert("The length of the arrays should be the same");
        indexFactoryStorage.fulfillAssetsData(bytes32("requestId"), tokens, marketShares, swapFees, chainSelectors);

        vm.stopPrank();
    }

    function testInitialize_SecondInitializationReverts() public {
        vm.expectRevert("Initializable: contract is already initialized");
        balancer.initialize(
            1,
            payable(address(crossChainToken)),
            address(indexFactoryStorage),
            address(link),
            address(mockRouter),
            address(0x5678)
        );
    }

    function testCurrentListFunctionsWithoutMocking() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(token1);
        tokens[1] = address(token2);
        tokens[2] = wethAddress;

        uint256[] memory marketShares = new uint256[](3);
        marketShares[0] = 100e18;
        marketShares[1] = 200e18;
        marketShares[2] = 300e18;

        uint24[] memory swapFees = new uint24[](3);
        swapFees[0] = 3000;
        swapFees[1] = 10000;
        swapFees[2] = 500;

        uint64[] memory chainSelectors = new uint64[](3);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;
        chainSelectors[2] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        uint256 total = indexFactoryStorage.totalCurrentList();
        assertEq(total, 3, "Expected totalCurrentList to be 3");

        assertEq(indexFactoryStorage.currentList(0), address(token1), "currentList(0) should be token1");
        assertEq(indexFactoryStorage.currentList(1), address(token2), "currentList(1) should be token2");
        assertEq(indexFactoryStorage.currentList(2), wethAddress, "currentList(2) should be wethAddress");
    }

    function testSetAndCheckCurrentList() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(token1);
        tokens[1] = address(token2);

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 100e18;
        marketShares[1] = 200e18;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 3000;
        swapFees[1] = 10000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.stopPrank();

        uint256 total = indexFactoryStorage.totalCurrentList();
        assertEq(total, 2, "totalCurrentList should be 2 after mockFillAssetsList");

        address listToken0 = indexFactoryStorage.currentList(0);
        address listToken1 = indexFactoryStorage.currentList(1);

        assertEq(listToken0, address(token1), "currentList(0) should return token1");
        assertEq(listToken1, address(token2), "currentList(1) should return token2");

        uint256 shareToken1 = indexFactoryStorage.tokenCurrentMarketShare(address(token1));
        uint256 shareToken2 = indexFactoryStorage.tokenCurrentMarketShare(address(token2));
        assertEq(shareToken1, 100e18, "tokenCurrentMarketShare for token1 mismatch");
        assertEq(shareToken2, 200e18, "tokenCurrentMarketShare for token2 mismatch");
    }

    function testMockCurrentListFunctions() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(token1);
        tokens[1] = address(token2);
        tokens[2] = wethAddress;

        uint256[] memory marketShares = new uint256[](3);
        marketShares[0] = 100e18;
        marketShares[1] = 200e18;
        marketShares[2] = 300e18;

        uint24[] memory swapFees = new uint24[](3);
        swapFees[0] = 3000;
        swapFees[1] = 10000;
        swapFees[2] = 500;

        uint64[] memory chainSelectors = new uint64[](3);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;
        chainSelectors[2] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        uint256 total = indexFactoryStorage.totalCurrentList();
        assertEq(total, 3, "Expected totalCurrentList to be 3");

        assertEq(indexFactoryStorage.currentList(0), address(token1), "currentList(0) should be token1");
        assertEq(indexFactoryStorage.currentList(1), address(token2), "currentList(1) should be token2");
        assertEq(indexFactoryStorage.currentList(2), wethAddress, "currentList(2) should be wethAddress");
    }

    function testPriceInWei() public {
        vm.mockCall(
            address(indexFactoryStorage.toUsdPriceFeed()),
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(uint80(0), int256(123456789000000000), uint256(0), uint256(0), uint80(0))
        );

        vm.mockCall(
            address(indexFactoryStorage.toUsdPriceFeed()),
            abi.encodeWithSelector(AggregatorV3Interface.decimals.selector),
            abi.encode(uint8(8))
        );

        uint256 price = indexFactoryStorage.priceInWei();
        assertTrue(price > 0, "priceInWei should return a positive value");
    }

    function test_askValues_Mutations() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(token0);
        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 50;
        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 3000;
        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.mockCall(
            address(indexFactoryStorage),
            abi.encodeWithSelector(indexFactoryStorage.priceInWei.selector),
            abi.encode(1e18)
        );

        balancer.askValues();

        uint256 nonce = balancer.updatePortfolioNonce();
        uint256 portfolioValue = balancer.portfolioTotalValueByNonce(nonce);
        uint256 tokenValue = balancer.tokenValueByNonce(nonce, address(token0));
        uint256 chainValue = balancer.chainValueByNonce(nonce, 1);

        assertEq(portfolioValue, 0, "Portfolio value should remain zero due to mutation");
        assertEq(tokenValue, 0, "Token value should remain zero due to mutation");
        assertEq(chainValue, 0, "Chain value should remain zero due to mutation");
    }
}
