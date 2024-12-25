// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../mocks/MockERC20.sol";
// import "../mocks/MockWETH.sol";
// import "../../contracts/test/MockRouter2.sol";
import "../../contracts/test/MockRouter2.sol";
// import "../mocks/MockIndexFactoryStorage.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../../contracts/libraries/MessageSender.sol";
import "../../contracts/ccip/CCIPReceiver.sol";
import "./OlympixUnitTest.sol";
import "./ContractDeployer.sol";
import "../../contracts/factory/IndexFactoryBalancer.sol";

contract IndexFactoryTest is Test, ContractDeployer {
    // using MessageSender for address;
    using stdStorage for StdStorage;

    uint256 public constant INITIAL_SUPPLY = 1e6 ether;
    uint256 public constant ETH_AMOUNT = 1 ether;
    uint256 public constant ERC20_AMOUNT = 1000 ether;
    uint256 internal constant ERC20_ISSUANCE_AMOUNT = 100 ether;

    CCIPReceiver ccip;
    IndexFactoryBalancer balancer;
    MockERC20 mockToken;

    address user = address(1);

    function setUp() external {
        deployAllContracts();

        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 10e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 10e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 10e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 10e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 10e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);

        indexFactoryStorage.setVault(address(crossChainVault));

        balancer = new IndexFactoryBalancer();
        balancer.initialize(
            1,
            payable(address(indexToken)),
            address(indexFactoryStorage),
            address(link),
            address(mockRouter),
            wethAddress
        );
        indexFactoryStorage.setIndexFactoryBalancer(address(balancer));
        indexFactoryStorage.setVault(address(crossChainVault));

        updateOracleList();

        vm.startPrank(indexFactoryStorage.indexFactoryBalancer());
        indexFactoryStorage.updateCurrentList();
        vm.stopPrank();

        console.log("IndexFactory:", address(factory));
        console.log("IndexFactoryStorage:", address(indexFactoryStorage));
        console.log("IndexFactoryBalancer:", address(balancer));
        console.log("Vault:", address(crossChainVault));
    }

    function testInitialization() public {
        assertEq(factory.getRouter(), address(mockRouter), "Router address should match");
        assertEq(address(factory.indexToken()), address(indexToken), "IndexToken address should match");
        assertEq(address(factory.weth()), address(weth), "WETH address should match");
        assertEq(factory.currentChainSelector(), 1, "Chain selector should match");
    }

    function updateOracleList() public {
        address[] memory assetList = new address[](4);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(usdt);

        uint256[] memory tokenShares = new uint256[](4);
        tokenShares[0] = 40e18;
        tokenShares[1] = 30e18;
        tokenShares[2] = 30e18;
        tokenShares[3] = 10e18;

        uint256[] memory swapFees = new uint256[](4);
        swapFees[0] = 3000;
        swapFees[1] = 3000;
        swapFees[2] = 3000;
        swapFees[3] = 3000;

        uint64[] memory chains = new uint64[](4);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;

        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }

    function testSetIndexFactoryStorage() public {
        factory.setIndexFactoryStorage(address(indexFactoryStorage));
        assertEq(
            address(factory.factoryStorage()), address(indexFactoryStorage), "Factory storage address should match"
        );
    }

    function testSetFeeReceiver() public {
        address newFeeReceiver = address(0x1234);
        factory.setFeeReceiver(newFeeReceiver);
        assertEq(factory.feeReceiver(), newFeeReceiver, "Fee receiver should match");
    }

    function testSetFeeRate() public {
        vm.warp(block.timestamp + 12 hours);

        factory.setFeeRate(50); // 0.5%
        assertEq(factory.feeRate(), 50, "Fee rate should be set to 50");
    }

    function testIssuanceIndexTokensWithEth() public {
        uint256 inputAmount = 1 ether;
        uint8 feeRateVal = factory.feeRate();
        uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, feeRateVal);
        uint256 crossChainFee = 1 ether;

        uint256 totalRequired = inputAmount + feeAmount + crossChainFee;

        vm.deal(address(this), totalRequired);

        factory.issuanceIndexTokensWithEth{value: totalRequired}(inputAmount, crossChainFee);

        assertEq(factory.issuanceNonce(), 1, "Issuance nonce did not increment");
    }

    function testCrossChainFactoryBySelector() public {
        address mockFactoryAddress = address(this);
        uint64 chainSelector = 2;

        indexFactoryStorage.setCrossChainFactory(mockFactoryAddress, chainSelector);
        address returnedFactoryAddress = factory.crossChainFactoryBySelector(chainSelector);

        assertEq(returnedFactoryAddress, mockFactoryAddress, "Cross-chain factory address is incorrect");
    }

    function testCrossChainToken() public {
        address mockTokenAddress = address(mockToken);
        uint64 chainSelector = 1;
        uint24 swapFee = 3000;

        indexFactoryStorage.setCrossChainToken(chainSelector, mockTokenAddress, swapFee);
        address returnedTokenAddress = factory.crossChainToken(chainSelector);

        assertEq(returnedTokenAddress, mockTokenAddress, "Cross-chain token address is incorrect");
    }

    // function testConvertEthToUsd() public {
    //     uint256 ethAmount = 1 ether;

    //     // Set a mock price in the factory storage
    //     indexFactoryStorage.setPriceInWei(2000e18); // Example: 1 ETH = 2000 USD

    //     uint256 usdValue = factory.convertEthToUsd(ethAmount);
    //     assertEq(usdValue, 2000e18, "ETH to USD conversion mismatch");
    // }

    function testPortfolioBalance() public {
        uint256 balance = factory.getPortfolioBalance();
        assertEq(balance, 0, "Portfolio balance should start at 0");
    }

    function testIssuanceIndexTokens() public {
        // 1) Transfer ownership if needed
        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();

        // 2) The user who issues tokens is 'addUser'
        // Provide them with enough USDT: input + fee
        uint256 inputAmount = ERC20_ISSUANCE_AMOUNT;
        uint256 fee = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
        uint256 totalNeeded = inputAmount + fee;

        deal(address(usdt), user, totalNeeded);

        vm.startPrank(user);
        usdt.approve(address(factory), totalNeeded);

        factory.issuanceIndexTokens(address(usdt), inputAmount, 0, /* crossChainFee */ 3000);

        // 5) issuanceNonce should increment
        uint256 n = factory.issuanceNonce();
        assertEq(n, 1, "Issuance nonce mismatch after ERC20 issuance");

        vm.stopPrank();
    }

    function testIssuanceERC20_NoSTF() external {
        // e.g. user wants 100 USDT issuance
        uint256 inputAmount = 100e18;
        uint256 fee = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
        uint256 totalNeeded = inputAmount + fee;

        // Give user enough USDT
        deal(address(usdt), user, totalNeeded);

        // user approves the factory
        vm.startPrank(user);
        usdt.approve(address(factory), totalNeeded);

        // do issuance
        factory.issuanceIndexTokens(address(usdt), inputAmount, 0, 3000);

        // now check issuanceNonce
        uint256 n = factory.issuanceNonce();
        assertEq(n, 1, "Issuance nonce did not increment, likely STF revert if it didn't increment");

        vm.stopPrank();
    }

    function testIssuanceNoRevert() external {
        uint256 inputAmount = 100e18;
        uint8 feeRateVal = factory.feeRate();
        uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, feeRateVal);
        uint256 totalNeeded = inputAmount + feeAmount;

        deal(address(usdt), user, 1000000e18);

        vm.startPrank(user);
        usdt.approve(address(factory), 10000 ether);
        usdt.approve(address(swapRouter), 10000 ether);
        usdt.approve(address(crossChainVault), 10000 ether);
        usdt.approve(address(indexFactoryStorage), 10000 ether);
        usdt.approve(0x1deD944D91BD4062EBc9d8782D80e8b0f84bd796, 10000 ether);

        factory.issuanceIndexTokens(address(usdt), inputAmount, 0, 3000);

        uint256 n = factory.issuanceNonce();
        assertEq(n, 1, "issuanceNonce should be 1 after successful issuance");
        vm.stopPrank();
    }

    // function testIssuanceWithEth() public {
    //     // We'll do a smaller crossChainFee for demonstration
    //     uint256 inputAmount = 1 ether;
    //     uint256 fee = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
    //     uint256 crossChainFee = 0.1 ether;
    //     uint256 totalNeeded = inputAmount + fee + crossChainFee;

    //     vm.deal(address(this), totalNeeded);
    //     // Issue
    //     factory.issuanceIndexTokensWithEth{value: totalNeeded}(inputAmount, crossChainFee);

    //     // factory.completeIssuanceRequest(factory.issuanceNonce(), bytes32(0));

    //     // Confirm minted tokens if your code finalizes locally
    //     uint256 minted = indexToken.balanceOf(address(this));
    //     // assertTrue(minted > 0, "No tokens minted from ETH issuance");
    // }

    // function testIssuanceWithERC20() public {
    //     uint256 inputAmount = 1000 ether;
    //     uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
    //     uint256 crossChainFee = 0; // not testing crossChain
    //     uint256 totalNeeded = inputAmount + feeAmount;

    //     // Provide 'this' with enough USDT
    //     deal(address(usdt), address(this), totalNeeded);
    //     // Approve
    //     usdt.approve(address(factory), totalNeeded);

    //     factory.issuanceIndexTokens(address(usdt), inputAmount, crossChainFee, 3000);

    //     // Optional check minted tokens
    //     uint256 mintedTokens = indexToken.balanceOf(address(this));
    //     assertTrue(mintedTokens > 0, "No index tokens minted with ERC20 issuance");
    // }

    // function testRedemption() public {
    //     // 1) Issue first
    //     {
    //         uint256 input = 1000 ether;
    //         uint256 fee = FeeCalculation.calculateFee(input, factory.feeRate());
    //         uint256 totalNeeded = input + fee;
    //         // Provide USDT to 'this'
    //         deal(address(usdt), address(this), totalNeeded);
    //         // Approve
    //         usdt.approve(address(factory), totalNeeded);

    //         // Issue
    //         factory.issuanceIndexTokens(address(usdt), input, 0, 3000);
    //     }

    //     // 2) Confirm minted
    //     uint256 bal = indexToken.balanceOf(address(this));
    //     assertTrue(bal > 0, "No tokens minted for redemption test");

    //     // 3) Redeem them
    //     // We'll redeem all minted to USDT
    //     factory.redemption(bal, 0, address(usdt), 3000);

    //     // 4) Check we got USDT
    //     uint256 usdtBalAfter = usdt.balanceOf(address(this));
    //     assertTrue(usdtBalAfter > 0, "No USDT redeemed");
    // }
}
