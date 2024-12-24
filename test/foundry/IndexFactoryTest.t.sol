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

    CCIPReceiver ccip;
    IndexFactoryBalancer balancer;
    MockERC20 mockToken;

    function setUp() external {
        deployAllContracts();

        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);

        updateOracleList();

        indexFactoryStorage.setVault(address(crossChainVault));

        balancer = new IndexFactoryBalancer();
        indexFactoryStorage.setIndexFactoryBalancer(address(balancer));

        vm.startPrank(indexFactoryStorage.indexFactoryBalancer());
        indexFactoryStorage.updateCurrentList();
        vm.stopPrank();
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
        updateOracleList();

        factory.proposeOwner(owner);
        vm.startPrank(owner);
        factory.transferOwnership(owner);
        vm.stopPrank();

        payable(add1).transfer(10 ether);

        uint256 inputAmount = 100 ether;
        uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, factory.feeRate());

        uint256 totalNeeded = inputAmount + feeAmount;

        deal(address(usdt), add1, totalNeeded);

        vm.startPrank(add1);
        usdt.approve(address(factory), totalNeeded);

        factory.issuanceIndexTokens(address(usdt), inputAmount, 0, 3000);

        assertEq(factory.issuanceNonce(), 1, "Issuance nonce did not increment");
        vm.stopPrank();
    }

    // function testIssuanceIndexTokens() public {
    //     updateOracleList();

    //     factory.proposeOwner(owner);
    //     vm.startPrank(owner);
    //     factory.transferOwnership(owner);
    //     vm.stopPrank();
    //     payable(add1).transfer(11e18);
    //     usdt.transfer(add1, 1001e18);
    //     vm.startPrank(add1);

    //     uint256 inputAmount = 100 ether;
    //     uint256 fee = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
    //     uint256 crossChainFee = 1 ether; // If your logic needs it
    //     uint256 totalNeeded = inputAmount + fee; // Possibly + crossChainFee if required in ERC20

    //     // deal()
    //     // token0.mint(address(this), totalNeeded);
    //     deal(address(usdt), address(add1), 1001 ether);
    //     usdt.approve(address(factory), 1001 ether);

    //     factory.issuanceIndexTokens(address(usdt), 1000e18, 0, 3000);

    //     // factory.redemption(indexToken.balanceOf(address(add1)), 0, address(usdt), 3000);

    //     // Confirm issuanceNonce or minted tokens
    //     assertEq(factory.issuanceNonce(), 1, "Issuance nonce not incremented");
    // }

    function testIssuanceWithEth() public {
        uint256 inputAmount = 1 ether;
        uint256 fee = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
        uint256 crossChainFee = 0.1 ether;
        uint256 totalNeeded = inputAmount + fee + crossChainFee;

        vm.deal(address(this), totalNeeded);

        factory.issuanceIndexTokensWithEth{value: totalNeeded}(inputAmount, crossChainFee);

        uint256 minted = indexToken.balanceOf(address(this));
        assertTrue(minted > 0, "No tokens minted for local ETH issuance");
    }

    function testIssuanceWithERC20() public {
        uint256 inputAmount = 1000 ether;

        uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, factory.feeRate());
        uint256 crossChainFee = 0; // if not testing crossChain here
        uint256 totalNeeded = inputAmount + feeAmount;

        deal(address(usdt), address(this), totalNeeded);

        usdt.approve(address(factory), totalNeeded);

        factory.issuanceIndexTokens(address(usdt), inputAmount, crossChainFee, 3000);

        uint256 mintedTokens = indexToken.balanceOf(address(this));
    }

    function testRedemption() public {
        {
            uint256 input = 1000 ether;
            uint256 fee = FeeCalculation.calculateFee(input, factory.feeRate());
            uint256 totalNeeded = input + fee;
            deal(address(usdt), address(this), totalNeeded);
            usdt.approve(address(factory), totalNeeded);
            factory.issuanceIndexTokens(address(usdt), input, 0, 3000);
        }

        uint256 bal = indexToken.balanceOf(address(this));
        assertTrue(bal > 0, "No tokens minted for redemption");

        factory.redemption(bal, 0, address(usdt), 3000);

        uint256 usdtAfter = usdt.balanceOf(address(this));
        assertTrue(usdtAfter > 0, "No tokens redeemed");
    }
}
