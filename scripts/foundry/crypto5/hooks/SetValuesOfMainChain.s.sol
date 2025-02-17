// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import {IndexFactoryStorage} from "../../../../contracts/factory/IndexFactoryStorage.sol";
import {IndexFactory} from "../../../../contracts/factory/IndexFactory.sol";
import {IndexToken} from "../../../../contracts/token/IndexToken.sol";
import "../../../../contracts/factory/CoreSender.sol";
import "../../../../contracts/factory/BalancerSender.sol";
import "../../../../contracts/factory/FunctionsOracle.sol";
import "../../../../contracts/vault/Vault.sol";

contract CombinedSetValuesScript is Script, Test {
    struct FactoryStorageEnv {
        address indexFactoryStorageProxy;
        address mainCrossChainTokenAddress;
        address otherCrossChainTokenAddress;
        address crossChainFactoryProxy;
        address weth;
        uint64 mainChainSelector;
        uint64 otherChainSelector;
        address indexFactoryProxy;
        address priceOracle;
        address vaultProxy;
        address indexFactoryBalancerProxy;
        address coreSenderProxy;
        address balancerSenderProxy;
        address wethAddressArbSepolia;
        address wethEthereumAddress;
    }

    struct MockFillEnv {
        uint64 mainChainSelector;
        uint64 otherChainSelector;
        address wethAddress;
        address functionsOracleProxy;
        bool isTestnet;
        address wethAddressArbSepolia;
        address wethEthereumAddress;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // string memory targetChain = "sepolia";
        string memory targetChain = "arbitrum_mainnet";

        // 1. setIndexFactoryStorageValues
        _setIndexFactoryStorageValues(targetChain);

        // 2. setIndexTokenValues
        _setIndexTokenValues(targetChain);

        // 3. setMockFillAssetsList
        _setMockFillAssetsList(targetChain);

        // 4. setFunctionsOracle
        _setFunctionsOracle(targetChain);

        _setVault(targetChain);

        vm.stopBroadcast();

        console.log("All set functions completed successfully!");
    }

    function _setIndexFactoryStorageValues(string memory targetChain) internal {
        FactoryStorageEnv memory data = _readIndexFactoryStorageEnvVars(targetChain);

        _applyIndexFactoryStorageValues(data, targetChain);

        console.log("Done: _setIndexFactoryStorageValues()");
    }

    function _readIndexFactoryStorageEnvVars(string memory targetChain)
        internal
        view
        returns (FactoryStorageEnv memory data)
    {
        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            data.indexFactoryStorageProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            data.mainCrossChainTokenAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            data.otherCrossChainTokenAddress = vm.envAddress("UNICHAIN_CROSS_CHAIN_TOKEN_ADDRESS");
            data.crossChainFactoryProxy = vm.envAddress("UNICHAIN_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            data.weth = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            data.mainChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("UNICHAIN_CHAIN_SELECTOR"));
            data.indexFactoryProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            data.priceOracle = vm.envAddress("CR5_SEPOLIA_PRICE_ORACLE");
            data.vaultProxy = vm.envAddress("CR5_SEPOLIA_VAULT_PROXY_ADDRESS");
            data.indexFactoryBalancerProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            data.coreSenderProxy = vm.envAddress("CR5_SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
            data.balancerSenderProxy = vm.envAddress("CR5_SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            data.wethAddressArbSepolia = vm.envAddress("UNICHAIN_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            data.indexFactoryStorageProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            data.mainCrossChainTokenAddress = vm.envAddress("CR5_ARBITRUM_CROSS_CHAIN_TOKEN_ADDRESS");
            data.otherCrossChainTokenAddress = vm.envAddress("BSC_CROSS_CHAIN_TOKEN_ADDRESS");
            data.crossChainFactoryProxy = vm.envAddress("BSC_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            data.weth = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            data.mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("BSC_CHAIN_SELECTOR"));
            data.indexFactoryProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            data.priceOracle = vm.envAddress("CR5_ARBITRUM_PRICE_ORACLE");
            data.vaultProxy = vm.envAddress("CR5_ARBITRUM_VAULT_PROXY_ADDRESS");
            data.indexFactoryBalancerProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            data.coreSenderProxy = vm.envAddress("CR5_ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
            data.balancerSenderProxy = vm.envAddress("CR5_ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
            data.wethEthereumAddress = vm.envAddress("BSC_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain (FactoryStorageValues)");
        }
    }

    function _applyIndexFactoryStorageValues(FactoryStorageEnv memory data, string memory targetChain) internal {
        address wbtcAddress = vm.envAddress("CR5_BITCOIN_ADDRESS");

        uint24[] memory sepoliaFeesData = new uint24[](1);
        uint24[] memory arbitrumFeesData = new uint24[](2);

        sepoliaFeesData[0] = 3000;

        arbitrumFeesData[0] = 100;
        arbitrumFeesData[1] = 500;

        address[] memory path = new address[](3);
        path[0] = data.weth;
        path[1] = wbtcAddress;
        path[2] = data.mainCrossChainTokenAddress;

        IndexFactoryStorage(data.indexFactoryStorageProxy).setCrossChainToken(
            data.otherChainSelector, data.mainCrossChainTokenAddress, path, arbitrumFeesData
        );

        IndexFactoryStorage(data.indexFactoryStorageProxy).setCrossChainFactory(
            data.crossChainFactoryProxy, data.otherChainSelector
        );

        IndexFactoryStorage(data.indexFactoryStorageProxy).setIndexFactory(data.indexFactoryProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setCoreSender(data.coreSenderProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setPriceOracle(data.priceOracle);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setVault(data.vaultProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setBalancerSender(data.balancerSenderProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setIndexFactoryBalancer(data.indexFactoryBalancerProxy);
    }

    function _setIndexTokenValues(string memory targetChain) internal {
        address indexFactoryProxy;
        address indexTokenProxy;
        address coreSenderProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexFactoryProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("CR5_SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("CR5_SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexFactoryProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("CR5_ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("CR5_ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain (IndexTokenValues)");
        }

        IndexToken(payable(indexTokenProxy)).setMinter(indexFactoryProxy, true);
        IndexToken(payable(indexTokenProxy)).setMinter(coreSenderProxy, true);

        console.log("Done: _setIndexTokenValues()");
    }

    function _setMockFillAssetsList(string memory targetChain) internal {
        MockFillEnv memory data = _readMockFillAssetsListEnvVars(targetChain);

        _applyMockFillAssetsList(data);

        console.log("Done: _setMockFillAssetsList()");
    }

    function _readMockFillAssetsListEnvVars(string memory targetChain)
        internal
        view
        returns (MockFillEnv memory data)
    {
        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            data.mainChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("UNICHAIN_CHAIN_SELECTOR"));
            data.wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            data.functionsOracleProxy = vm.envAddress("CR5_SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            data.wethAddressArbSepolia = vm.envAddress("UNICHAIN_WETH_ADDRESS");
            data.isTestnet = true;
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            data.mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("BSC_CHAIN_SELECTOR"));
            data.wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            data.functionsOracleProxy = vm.envAddress("CR5_ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            data.wethEthereumAddress = vm.envAddress("BSC_WETH_ADDRESS");
            data.isTestnet = false;
        } else {
            revert("Unsupported target chain (MockFillAssetsList)");
        }
    }

    function _applyMockFillAssetsList(MockFillEnv memory data) internal {
        if (data.isTestnet) {
            _fillMockAssetsListTestnet(
                data.functionsOracleProxy,
                data.mainChainSelector,
                data.otherChainSelector,
                data.wethAddress,
                data.wethAddressArbSepolia
            );
        } else {
            _fillMockAssetsListMainnet(
                data.functionsOracleProxy,
                data.mainChainSelector,
                data.otherChainSelector,
                data.wethAddress,
                data.wethEthereumAddress
            );
        }
    }

    function _fillMockAssetsListMainnet(
        address functionsOracleProxy,
        uint64 mainChainSelector,
        uint64 otherChainSelector,
        address wethAddress,
        address wethEthereumAddress
    ) internal {
        (address[] memory assetList, uint256[] memory marketShares, uint64[] memory chainSelectors) =
            _getAssetData(mainChainSelector, otherChainSelector);

        bytes[] memory pathData = _getPathData(wethAddress, wethEthereumAddress, assetList);

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);
        console.log("Called mockFillAssetsList() [mainnet style].");
    }

    function _getAssetData(uint64 mainChainSelector, uint64 otherChainSelector)
        internal
        view
        returns (address[] memory, uint256[] memory, uint64[] memory)
    {
        address wbtcAddress = vm.envAddress("CR5_BITCOIN_ADDRESS");
        address wethArbAddress = vm.envAddress("CR5_WETH_ADDRESS");
        address xrpAddress = vm.envAddress("CR5_XRP_ADDRESS");
        address solanaAddress = vm.envAddress("CR5_SOLANA_ADDRESS");
        address wbnbAddress = vm.envAddress("CR5_WBNB_ADDRESS");

        address[] memory assetList = new address[](5);
        assetList[0] = wbtcAddress;
        assetList[1] = wethArbAddress;
        assetList[2] = xrpAddress;
        assetList[3] = solanaAddress;
        assetList[4] = wbnbAddress;

        uint256[] memory marketShares = new uint256[](5);
        marketShares[0] = 72000000000000000000;
        marketShares[1] = 14000000000000000000;
        marketShares[2] = 6000000000000000000;
        marketShares[3] = 4000000000000000000;
        marketShares[4] = 4000000000000000000;

        uint64[] memory chainSelectors = new uint64[](5);
        chainSelectors[0] = mainChainSelector;
        chainSelectors[1] = mainChainSelector;
        chainSelectors[2] = otherChainSelector;
        chainSelectors[3] = otherChainSelector;
        chainSelectors[4] = otherChainSelector;

        return (assetList, marketShares, chainSelectors);
    }

    function _getPathData(address wethAddress, address wethEthereumAddress, address[] memory assetList)
        internal
        pure
        returns (bytes[] memory)
    {
        bytes[] memory pathData = new bytes[](5);

        pathData[0] = _encodePath(wethAddress, assetList[0], 100); // WBTC
        pathData[1] = _encodePath(wethAddress, assetList[1], 100); // WETH
        pathData[2] = _encodePath(wethEthereumAddress, assetList[2], 2500); // XRP
        pathData[3] = _encodePath(wethEthereumAddress, assetList[3], 2500); // SOLANA
        pathData[4] = _encodePath(wethEthereumAddress, assetList[4], 2500); // WBNB

        return pathData;
    }

    function _encodePath(address from, address to, uint24 fee) internal pure returns (bytes memory) {
        uint24[] memory feesData = new uint24[](1);
        feesData[0] = fee;

        address[] memory path = new address[](2);
        path[0] = from;
        path[1] = to;

        return abi.encode(path, feesData);
    }

    // function _fillMockAssetsListMainnet(
    //     address functionsOracleProxy,
    //     uint64 mainChainSelector,
    //     uint64 otherChainSelector,
    //     address wethAddress,
    //     address wethEthereumAddress
    // ) internal {
    //     address wbtcAddress = vm.envAddress("CR5_BITCOIN_ADDRESS");
    //     address wethArbAddress = vm.envAddress("CR5_WETH_ADDRESS");
    //     address xrpAddress = vm.envAddress("CR5_XRP_ADDRESS");
    //     address solanaAddress = vm.envAddress("CR5_SOLANA_ADDRESS");
    //     address wbnbAddress = vm.envAddress("CR5_WBNB_ADDRESS");

    //     address[] memory assetList = new address[](5);
    //     assetList[0] = wbtcAddress;
    //     assetList[1] = wethArbAddress;
    //     assetList[2] = xrpAddress;
    //     assetList[3] = solanaAddress;
    //     assetList[4] = wbnbAddress;

    //     uint256[] memory marketShares = new uint256[](5);
    //     marketShares[0] = 72000000000000000000;
    //     marketShares[1] = 14000000000000000000;
    //     marketShares[2] = 6000000000000000000;
    //     marketShares[3] = 4000000000000000000;
    //     marketShares[4] = 4000000000000000000;

    //     uint64[] memory chainSelectors = new uint64[](5);
    //     chainSelectors[0] = mainChainSelector;
    //     chainSelectors[1] = mainChainSelector;
    //     chainSelectors[2] = otherChainSelector;
    //     chainSelectors[3] = otherChainSelector;
    //     chainSelectors[4] = otherChainSelector;

    //     // WBTC
    //     uint24[] memory feesData = new uint24[](1);
    //     feesData[0] = 100;
    //     bytes[] memory pathData = new bytes[](5);
    //     address[] memory path = new address[](2);
    //     path[0] = wethAddress;
    //     path[1] = assetList[0];
    //     pathData[0] = abi.encode(path, feesData);

    //     // WETH
    //     uint24[] memory feesData1 = new uint24[](1);
    //     feesData1[0] = 100;
    //     address[] memory path1 = new address[](2);
    //     path1[0] = wethAddress;
    //     path1[1] = assetList[1];
    //     pathData[1] = abi.encode(path1, feesData1);

    //     // XRP
    //     uint24[] memory feesData2 = new uint24[](1);
    //     feesData2[0] = 2500;
    //     address[] memory path2 = new address[](2);
    //     path2[0] = wethEthereumAddress;
    //     path2[1] = assetList[2];
    //     pathData[2] = abi.encode(path2, feesData2);

    //     // SOLANA
    //     uint24[] memory feesData3 = new uint24[](1);
    //     feesData3[0] = 2500;
    //     address[] memory path3 = new address[](2);
    //     path3[0] = wethEthereumAddress;
    //     path3[1] = assetList[3];
    //     pathData[3] = abi.encode(path3, feesData3);

    //     // WBNB
    //     uint24[] memory feesData4 = new uint24[](1);
    //     feesData4[0] = 2500;
    //     address[] memory path4 = new address[](2);
    //     path4[0] = wethEthereumAddress;
    //     path4[1] = assetList[4];
    //     pathData[4] = abi.encode(path4, feesData4);

    //     FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);
    //     console.log("Called mockFillAssetsList() [mainnet style].");
    // }

    function _fillMockAssetsListTestnet(
        address functionsOracleProxy,
        uint64 mainChainSelector,
        uint64 otherChainSelector,
        address wethAddress,
        address wethAddressArbSepolia
    ) internal {
        address[] memory assetList = new address[](5);
        assetList[0] = 0x6Ea5aD162d5b74Bc9e4C3e4eEB18AE6861407221; // sepoliaBitcoin
        assetList[1] = 0x3eb804cd437c27f5aEB6Be7AbbB32D21a69Ca49e; // sepoliaTestBinanceAddress
        assetList[2] = 0x357ECA9754fDc02A9860973E261FB08DE0f3b094; // sepoliaTestSolanaAddress
        assetList[3] = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14; // sepoliaWeth
        assetList[4] = 0xE24D95E308E486B3Ae3e71dA6ce7b9A7A5636f0F; // unichainTestRippleAddress

        uint256[] memory marketShares = new uint256[](5);
        marketShares[0] = 72000000000000000000;
        marketShares[1] = 4000000000000000000;
        marketShares[2] = 4000000000000000000;
        marketShares[3] = 14000000000000000000;
        marketShares[4] = 6000000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        uint64[] memory chainSelectors = new uint64[](5);
        chainSelectors[0] = mainChainSelector;
        chainSelectors[1] = mainChainSelector;
        chainSelectors[2] = mainChainSelector;
        chainSelectors[3] = mainChainSelector;
        chainSelectors[4] = otherChainSelector;

        bytes[] memory pathData = new bytes[](5);
        address[] memory path = new address[](2);
        path[0] = wethAddress;
        path[1] = assetList[0];
        pathData[0] = abi.encode(path, feesData);

        address[] memory path1 = new address[](2);
        path1[0] = wethAddress;
        path1[1] = assetList[1];
        pathData[1] = abi.encode(path1, feesData);

        address[] memory path2 = new address[](2);
        path2[0] = wethAddress;
        path2[1] = assetList[2];
        pathData[2] = abi.encode(path2, feesData);

        address[] memory path3 = new address[](2);
        path3[0] = wethAddress;
        path3[1] = assetList[3];
        pathData[3] = abi.encode(path3, feesData);

        // For Unichain testnet
        address[] memory path4 = new address[](2);
        path4[0] = wethAddressArbSepolia;
        path4[1] = assetList[4];
        pathData[4] = abi.encode(path4, feesData);

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);
        console.log("Called mockFillAssetsList() [testnet style].");
    }

    function _setFunctionsOracle(string memory targetChain) internal {
        address balancerSenderProxy;
        address indexFactoryBalancerProxy;
        address functionsOracleProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            balancerSenderProxy = vm.envAddress("CR5_SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("CR5_SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            balancerSenderProxy = vm.envAddress("CR5_ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("CR5_ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        FunctionsOracle(functionsOracleProxy).setIndexFactoryBalancer(indexFactoryBalancerProxy);
        FunctionsOracle(functionsOracleProxy).setBalancerSender(balancerSenderProxy);

        console.log("Done: _setFunctionsOracle()");
    }

    function _setVault(string memory targetChain) internal {
        address indexFactoryProxy;
        address indexFactoryBalancerProxy;
        address vaultProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexFactoryProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            vaultProxy = vm.envAddress("CR5_SEPOLIA_VAULT_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexFactoryProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            vaultProxy = vm.envAddress("CR5_ARBITRUM_VAULT_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        Vault(vaultProxy).setOperator(indexFactoryProxy, true);
        Vault(vaultProxy).setOperator(indexFactoryBalancerProxy, true);

        console.log("Done: _setVault()");
    }
}
