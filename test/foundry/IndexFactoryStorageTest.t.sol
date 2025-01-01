// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";
import "../mocks/MockPriceFeed.sol";
import "./ContractDeployer.sol";

contract IndexFactoryStorageTest is Test, ContractDeployer {
    address swapRouterV2 = address(0x9);
    // address factoryV2 = address(0x10);
    MockPriceFeed mockAggregator;
    address toUsdPriceFeed = address(0x5);

    function setUp() external {
        deployAllContracts();
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);

        mockAggregator = new MockPriceFeed();
    }

    function updateOracleList() public {
        address[] memory assetList = new address[](5);
        assetList[0] = address(token0);
        assetList[1] = address(token1);
        assetList[2] = address(token2);
        assetList[3] = address(token3);
        assetList[4] = address(token4);

        uint256[] memory tokenShares = new uint256[](5);
        tokenShares[0] = 20e18;
        tokenShares[1] = 20e18;
        tokenShares[2] = 20e18;
        tokenShares[3] = 20e18;
        tokenShares[4] = 20e18;

        uint256[] memory swapFees = new uint256[](5);
        swapFees[0] = 3000;
        swapFees[1] = 3000;
        swapFees[2] = 3000;
        swapFees[3] = 3000;
        swapFees[4] = 3000;

        uint64[] memory chains = new uint64[](5);
        chains[0] = 1;
        chains[1] = 1;
        chains[2] = 1;
        chains[3] = 1;
        chains[4] = 2;

        link.transfer(address(indexFactoryStorage), 1e17);
        bytes32 requestId = indexFactoryStorage.requestAssetsData();
        oracle.fulfillOracleFundingRateRequest(requestId, assetList, tokenShares, swapFees, chains);
    }

    function test_setPriceFeed_SuccessfulSetPriceFeed() public {
        address newPriceFeed = address(0x123);
        indexFactoryStorage.setPriceFeed(newPriceFeed);
        assertEq(address(indexFactoryStorage.toUsdPriceFeed()), newPriceFeed);
    }

    function test_setVault_SuccessfulSetVault() public {
        address vaultAddress = address(0x11);
        indexFactoryStorage.setVault(vaultAddress);
        assertEq(address(indexFactoryStorage.vault()), vaultAddress);
    }

    function test_priceInWei_SuccessfulPriceInWei() public {
        int256 price = 1000 * 10 ** 8;
        vm.mockCall(
            address(ethPriceOracle),
            abi.encodeWithSelector(AggregatorV3Interface.latestRoundData.selector),
            abi.encode(0, price, 0, 0, 0)
        );

        uint8 decimals = 8;
        vm.mockCall(
            address(ethPriceOracle),
            abi.encodeWithSelector(AggregatorV3Interface.decimals.selector),
            abi.encode(decimals)
        );

        uint256 priceInWei = indexFactoryStorage.priceInWei();
        assertEq(priceInWei, uint256(price) * 10 ** 10);
    }

    // function test_getAmountOut_SuccessfulGetAmountOut() public {
    //     address tokenIn = address(0x1);
    //     address tokenOut = address(0x2);
    //     uint256 amountIn = 1 ether;
    //     uint24 swapFee = 3;

    //     address priceOracle = address(0x3);
    //     vm.mockCall(
    //         priceOracle,
    //         abi.encodeWithSelector(
    //             IPriceOracle.estimateAmountOut.selector, address(0), tokenIn, tokenOut, uint128(amountIn)
    //         ),
    //         abi.encode(2 ether)
    //     );

    //     indexFactoryStorage.setPriceOracle(priceOracle);

    //     uint256 amountOut = indexFactoryStorage.getAmountOut(tokenIn, tokenOut, amountIn, swapFee);
    //     // assertEq(amountOut, 2 ether);
    // }

    function test_PublicVariables_AfterInitialization() public {
        uint64 currentChainSelector = indexFactoryStorage.currentChainSelector();
        assertEq(currentChainSelector, 1, "currentChainSelector should be 1");

        bytes32 storedJobId = indexFactoryStorage.externalJobId();
        assertEq(storedJobId, jobId, "externalJobId mismatch");

        uint256 storedOraclePayment = indexFactoryStorage.oraclePayment();
        assertEq(storedOraclePayment, 1e17, "oraclePayment mismatch");

        address priceOracle = indexFactoryStorage.priceOracle();
        assertEq(priceOracle, address(priceOracleAddress), "priceOracle mismatch");

        assertEq(address(indexFactoryStorage.swapRouterV3()), address(swapRouter), "swapRouterV3 mismatch");
        assertEq(address(indexFactoryStorage.factoryV3()), address(factoryV3), "factoryV3 mismatch");
        assertEq(address(indexFactoryStorage.swapRouterV2()), address(swapRouter), "swapRouterV2 mismatch");
        assertEq(address(indexFactoryStorage.factoryV2()), address(factoryV3), "factoryV2 mismatch");

        assertEq(address(indexFactoryStorage.weth()), wethAddress, "weth address mismatch");

        address vaultAddress = address(indexFactoryStorage.vault());
        assertEq(vaultAddress, address(vault), "vault address mismatch");
    }

    function test_setPriceFeed_AccessControl_RevertForNonOwner() public {
        address newPriceFeed = address(0x123);
        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setPriceFeed(newPriceFeed);
    }

    function test_setPriceOracle_SuccessfulSetPriceOracle() public {
        address newPriceOracle = address(0x456);
        indexFactoryStorage.setPriceOracle(newPriceOracle);
        assertEq(indexFactoryStorage.priceOracle(), newPriceOracle, "priceOracle should be updated");
    }

    function test_setPriceOracle_AccessControl_RevertForNonOwner() public {
        address newPriceOracle = address(0x456);
        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setPriceOracle(newPriceOracle);
    }

    function test_setVault_AccessControl_RevertForNonOwner() public {
        address newVault = address(0x789);
        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setVault(newVault);
    }

    function test_setCrossChainToken_SuccessfulSet() public {
        uint64 chainSelector = 2;
        address crossChainToken = address(0xAAA);
        uint24 swapFee = 3000;

        indexFactoryStorage.setCrossChainToken(chainSelector, crossChainToken, swapFee);

        assertEq(indexFactoryStorage.crossChainToken(chainSelector), crossChainToken, "crossChainToken should be set");
        assertEq(
            indexFactoryStorage.crossChainTokenSwapFee(chainSelector, crossChainToken),
            swapFee,
            "crossChainTokenSwapFee should be set"
        );
    }

    function test_setCrossChainToken_AccessControl_RevertForNonOwner() public {
        uint64 chainSelector = 2;
        address crossChainToken = address(0xAAA);
        uint24 swapFee = 3000;

        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setCrossChainToken(chainSelector, crossChainToken, swapFee);
    }

    function test_setCrossChainFactory_SuccessfulSet() public {
        uint64 chainSelector = 3;
        address crossChainFactory = address(0xBBB);

        indexFactoryStorage.setCrossChainFactory(crossChainFactory, chainSelector);

        assertEq(
            indexFactoryStorage.crossChainFactoryBySelector(chainSelector),
            crossChainFactory,
            "crossChainFactoryBySelector should be set"
        );
    }

    function test_setCrossChainFactory_AccessControl_RevertForNonOwner() public {
        uint64 chainSelector = 3;
        address crossChainFactory = address(0xBBB);

        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setCrossChainFactory(crossChainFactory, chainSelector);
    }

    function test_setIndexFactory_SuccessfulSet() public {
        address newIndexFactory = address(0xCCC);
        indexFactoryStorage.setIndexFactory(newIndexFactory);
        assertEq(indexFactoryStorage.indexFactory(), newIndexFactory, "indexFactory should be set");
    }

    function test_setIndexFactoryBalancer_SuccessfulSet() public {
        address newBalancer = address(0xDDD);
        indexFactoryStorage.setIndexFactoryBalancer(newBalancer);
        assertEq(indexFactoryStorage.indexFactoryBalancer(), newBalancer, "indexFactoryBalancer should be set");
    }

    function testSetIndexFactoryRevertWithNonOwnerAddress() public {
        address newBalancer = address(0xDDD);
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setIndexFactory(newBalancer);
    }

    function test_setIndexFactoryBalancer_AccessControl_RevertForNonOwner() public {
        address newBalancer = address(0xDDD);
        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setIndexFactoryBalancer(newBalancer);
    }

    function test_setUrl_AccessControl_RevertForNonOwner() public {
        string memory before = "https://example.com/api";
        string memory afterr = "?param=value";
        vm.prank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.setUrl(before, afterr);
    }

    function test_concatenation_ReturnsCorrectString() public {
        string memory a = "Hello, ";
        string memory b = "World!";
        string memory concatenated = indexFactoryStorage.concatenation(a, b);
        assertEq(concatenated, "Hello, World!", "concatenation should return the correct string");
    }

    function test_getPortfolioBalance_WithNoTokens() public {
        uint256 portfolioBalance = indexFactoryStorage.getPortfolioBalance();
        assertEq(portfolioBalance, 0, "getPortfolioBalance should return 0 when no tokens are present");
    }

    function test_setPriceFeed_FailWhenPriceFeedAddressIsZero() public {
        vm.expectRevert("ICO: Price feed address cannot be zero address");
        indexFactoryStorage.setPriceFeed(address(0));
    }

    function test_mockFillAssetsList_FillWhenTotalCurrentListIsNotZero() public {
        vm.prank(indexFactoryStorage.owner());

        address[] memory tokens = new address[](2);
        tokens[0] = address(0x1);
        tokens[1] = address(0x2);

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 100;
        marketShares[1] = 200;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 300;
        swapFees[1] = 400;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        address[] memory newTokens = new address[](2);
        newTokens[0] = address(0x3);
        newTokens[1] = address(0x4);

        uint256[] memory newMarketShares = new uint256[](2);
        newMarketShares[0] = 300;
        newMarketShares[1] = 400;

        uint24[] memory newSwapFees = new uint24[](2);
        newSwapFees[0] = 500;
        newSwapFees[1] = 600;

        uint64[] memory newChainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        indexFactoryStorage.mockFillAssetsList(newTokens, newMarketShares, newSwapFees, newChainSelectors);

        assertEq(indexFactoryStorage.totalOracleList(), 2);
        assertEq(indexFactoryStorage.totalCurrentList(), 2);
        assertEq(indexFactoryStorage.lastUpdateTime(), block.timestamp);

        assertEq(indexFactoryStorage.oracleList(0), address(0x3));
        assertEq(indexFactoryStorage.oracleList(1), address(0x4));

        assertEq(indexFactoryStorage.tokenOracleListIndex(address(0x3)), 0);
        assertEq(indexFactoryStorage.tokenOracleListIndex(address(0x4)), 1);

        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(0x3)), 300);
        assertEq(indexFactoryStorage.tokenOracleMarketShare(address(0x4)), 400);

        assertEq(indexFactoryStorage.tokenSwapFee(address(0x3)), 500);
        assertEq(indexFactoryStorage.tokenSwapFee(address(0x4)), 600);

        assertEq(indexFactoryStorage.currentList(0), address(0x1));
        assertEq(indexFactoryStorage.currentList(1), address(0x2));

        assertEq(indexFactoryStorage.tokenCurrentMarketShare(address(0x1)), 100);
        assertEq(indexFactoryStorage.tokenCurrentMarketShare(address(0x2)), 200);

        assertEq(indexFactoryStorage.tokenCurrentListIndex(address(0x1)), 0);
        assertEq(indexFactoryStorage.tokenCurrentListIndex(address(0x2)), 1);
    }

    function testMockFillAssetsListRevertWithNonOwnerAddress() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(0x1);
        tokens[1] = address(0x2);

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 100;
        marketShares[1] = 200;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 300;
        swapFees[1] = 400;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);
    }

    function test_updateCurrentList_SuccessfulUpdate() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(0x1);
        tokens[1] = address(0x2);

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 50;
        marketShares[1] = 50;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 3000;
        swapFees[1] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.prank(indexFactoryStorage.indexFactoryBalancer());
        indexFactoryStorage.updateCurrentList();

        assertEq(indexFactoryStorage.totalCurrentList(), 2);
        assertEq(indexFactoryStorage.currentList(0), address(0x1));
        assertEq(indexFactoryStorage.currentList(1), address(0x2));
        assertEq(indexFactoryStorage.tokenCurrentMarketShare(address(0x1)), 50);
        assertEq(indexFactoryStorage.tokenCurrentMarketShare(address(0x2)), 50);
    }

    function testUpdateCurrentListRevertWithNonOwnerAddress() public {
        address[] memory tokens = new address[](2);
        tokens[0] = address(0x1);
        tokens[1] = address(0x2);

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 50;
        marketShares[1] = 50;

        uint24[] memory swapFees = new uint24[](2);
        swapFees[0] = 3000;
        swapFees[1] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = 1;
        chainSelectors[1] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        vm.startPrank(add1);
        vm.expectRevert("Caller is not index factory balancer contract.");
        indexFactoryStorage.updateCurrentList();
    }

    function test_getAmountOut_FailWhenAmountInIsZero() public view {
        indexFactoryStorage.getAmountOut(address(0x1), address(0x2), 0, 0);
    }

    function test_oracleChainSelectorTokensCount_SuccessfulOracleChainSelectorTokensCount() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        uint256 oracleChainSelectorTokensCount = indexFactoryStorage.oracleChainSelectorTokensCount(chainSelectors[0]);
        assertEq(oracleChainSelectorTokensCount, 1);
    }

    function test_allOracleChainSelectorTokens_SuccessfulAllOracleChainSelectorTokens() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        address[] memory result = indexFactoryStorage.allOracleChainSelectorTokens(chainSelectors[0]);

        assertEq(result.length, 1);
        assertEq(result[0], tokens[0]);
    }

    function test_allOracleChainSelectorVersions_SuccessfulAllOracleChainSelectorVersions() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        uint256[] memory versions = indexFactoryStorage.allOracleChainSelectorVersions(chainSelectors[0]);

        assertEq(versions.length, 1);
        assertEq(versions[0], swapFees[0]);
    }

    function test_allOracleChainSelectorTokenShares_SuccessfulAllOracleChainSelectorTokenShares() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        uint256[] memory oracleChainSelectorTokenShares = indexFactoryStorage.allOracleChainSelectorTokenShares(1);

        assertEq(oracleChainSelectorTokenShares.length, 1);
        assertEq(oracleChainSelectorTokenShares[0], 1);
    }

    function test_insertOracleData_SuccessfulInsertOracleData() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        assertEq(indexFactoryStorage.totalOracleList(), 1);
        assertEq(indexFactoryStorage.totalCurrentList(), 1);
        assertEq(indexFactoryStorage.lastUpdateTime(), block.timestamp);
    }

    // function test_updateCurrentList_SuccessfulUpdateCurrentList() public {
    //     address indexFactoryBalancer = address(0x12);
    //     indexFactoryStorage.setIndexFactoryBalancer(indexFactoryBalancer);

    //     address[] memory tokens = new address[](1);
    //     tokens[0] = address(0x1);

    //     uint256[] memory marketShares = new uint256[](1);
    //     marketShares[0] = 1;

    //     uint24[] memory swapFees = new uint24[](1);
    //     swapFees[0] = 1;

    //     uint64[] memory chainSelectors = new uint64[](1);
    //     chainSelectors[0] = 1;

    //     indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

    //     vm.startPrank(indexFactoryBalancer);

    //     indexFactoryStorage.updateCurrentList();

    //     vm.stopPrank();

    //     assertEq(indexFactoryStorage.currentFilledCount(), 1);
    //     assertEq(indexFactoryStorage.totalCurrentList(), 1);
    // }

    function test_mockUpdateCurrentList_SuccessfulMockUpdateCurrentList() public {
        indexFactoryStorage.mockUpdateCurrentList();
        assertEq(indexFactoryStorage.currentFilledCount(), 1);
        assertEq(indexFactoryStorage.totalCurrentList(), 0);
    }

    function testMockUpdateCurrentListRevertWithNonOwnerAddress() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexFactoryStorage.mockUpdateCurrentList();
    }

    function test_getOracleData_SuccessfulGetOracleData() public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(0x1);

        uint256[] memory marketShares = new uint256[](1);
        marketShares[0] = 1;

        uint24[] memory swapFees = new uint24[](1);
        swapFees[0] = 1;

        uint64[] memory chainSelectors = new uint64[](1);
        chainSelectors[0] = 1;

        indexFactoryStorage.mockFillAssetsList(tokens, marketShares, swapFees, chainSelectors);

        (
            address[] memory oracleTokens,
            uint256[] memory oracleMarketShares,
            uint256[] memory oracleSwapFees,
            uint64[] memory oracleChainSelectors
        ) = indexFactoryStorage.getOracleData(1);

        //    assertEq(oracleTokens[0], tokens[0]);
        //    assertEq(oracleMarketShares[0], marketShares[0]);
        //    assertEq(oracleSwapFees[0], swapFees[0]);
        //    assertEq(oracleChainSelectors[0], chainSelectors[0]);
    }
}
