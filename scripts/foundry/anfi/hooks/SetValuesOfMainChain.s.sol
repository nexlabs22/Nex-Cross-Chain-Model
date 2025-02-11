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
    }

    struct MockFillEnv {
        uint64 mainChainSelector;
        uint64 otherChainSelector;
        address wethAddress;
        address functionsOracleProxy;
        bool isTestnet;
        address wethAddressArbSepolia;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        string memory targetChain = "sepolia";

        // 1. setIndexFactoryStorageValues
        _setIndexFactoryStorageValues(targetChain);

        // 2. setIndexTokenValues
        _setIndexTokenValues(targetChain);

        // 3. setMockFillAssetsList
        _setMockFillAssetsList(targetChain);

        // 4. setFunctionsOracle
        _setFunctionsOracle(targetChain);

        vm.stopBroadcast();

        console.log("All set functions completed successfully!");
    }

    function _setIndexFactoryStorageValues(string memory targetChain) internal {
        FactoryStorageEnv memory data = _readIndexFactoryStorageEnvVars(targetChain);

        _applyIndexFactoryStorageValues(data);

        console.log("Done: _setIndexFactoryStorageValues()");
    }

    function _readIndexFactoryStorageEnvVars(string memory targetChain)
        internal
        view
        returns (FactoryStorageEnv memory data)
    {
        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            data.indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            data.mainCrossChainTokenAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            data.otherCrossChainTokenAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            data.crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            data.weth = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            data.mainChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            data.indexFactoryProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            data.priceOracle = vm.envAddress("SEPOLIA_PRICE_ORACLE");
            data.vaultProxy = vm.envAddress("SEPOLIA_VAULT_PROXY_ADDRESS");
            data.indexFactoryBalancerProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            data.coreSenderProxy = vm.envAddress("SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
            data.balancerSenderProxy = vm.envAddress("SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            data.wethAddressArbSepolia = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            data.indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            data.mainCrossChainTokenAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_TOKEN_ADDRESS");
            data.otherCrossChainTokenAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
            data.crossChainFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADMIN_ADDRESS");
            data.weth = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            data.mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            data.indexFactoryProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            data.priceOracle = vm.envAddress("ARBITRUM_PRICE_ORACLE");
            data.vaultProxy = vm.envAddress("ARBITRUM_VAULT_PROXY_ADDRESS");
            data.indexFactoryBalancerProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            data.coreSenderProxy = vm.envAddress("ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
            data.balancerSenderProxy = vm.envAddress("ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain (FactoryStorageValues)");
        }
    }

    function _applyIndexFactoryStorageValues(FactoryStorageEnv memory data) internal {
        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        address[] memory path = new address[](2);
        path[0] = data.weth;
        path[1] = data.mainCrossChainTokenAddress;

        IndexFactoryStorage(data.indexFactoryStorageProxy).setCrossChainToken(
            data.otherChainSelector, data.mainCrossChainTokenAddress, path, feesData
        );

        IndexFactoryStorage(data.indexFactoryStorageProxy).setCrossChainFactory(
            data.crossChainFactoryProxy, data.otherChainSelector
        );

        IndexFactoryStorage(data.indexFactoryStorageProxy).setIndexFactory(data.indexFactoryProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setPriceOracle(data.priceOracle);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setVault(data.vaultProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setIndexFactoryBalancer(data.indexFactoryBalancerProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setCoreSender(data.coreSenderProxy);
        IndexFactoryStorage(data.indexFactoryStorageProxy).setBalancerSender(data.balancerSenderProxy);
    }

    function _setIndexTokenValues(string memory targetChain) internal {
        address indexFactoryProxy;
        address indexTokenProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexFactoryProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexFactoryProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain (IndexTokenValues)");
        }

        IndexToken(payable(indexTokenProxy)).setMinter(indexFactoryProxy, true);

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
            data.otherChainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            data.wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            data.functionsOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            data.wethAddressArbSepolia = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            data.isTestnet = true;
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            data.mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            data.otherChainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            data.wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            data.functionsOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
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
                data.functionsOracleProxy, data.mainChainSelector, data.otherChainSelector, data.wethAddress
            );
        }
    }

    function _fillMockAssetsListMainnet(
        address functionsOracleProxy,
        uint64 mainChainSelector,
        uint64 otherChainSelector,
        address wethAddress
    ) internal {
        address[] memory assetList = new address[](2);
        assetList[0] = 0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8; // BITCOIN
        assetList[1] = 0x6694340fc020c5E6B96567843da2df01b2CE1eb6; // XAUT

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 70000000000000000000;
        marketShares[1] = 30000000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = mainChainSelector;
        chainSelectors[1] = otherChainSelector;

        bytes[] memory pathData = new bytes[](2);
        for (uint256 i = 0; i < 2; i++) {
            address[] memory path = new address[](2);
            path[0] = wethAddress;
            path[1] = assetList[i];
            pathData[i] = abi.encode(path, feesData);
        }

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);
        console.log("Called mockFillAssetsList() [mainnet style].");
    }

    function _fillMockAssetsListTestnet(
        address functionsOracleProxy,
        uint64 mainChainSelector,
        uint64 otherChainSelector,
        address wethAddress,
        address wethAddressArbSepolia
    ) internal {
        address[] memory assetList = new address[](2);
        assetList[0] = 0x6Ea5aD162d5b74Bc9e4C3e4eEB18AE6861407221; // sepoliaBitcoin
        assetList[1] = 0x0C3711069cf889Fc47B3Da3700fFFDc2e16A4DaD; // arbSepoliaXaut
        // assetList[1] = 0x8B0D01137979e409Bba15098aA5665c647774003; // arbSepoliaXaut

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 70000000000000000000;
        marketShares[1] = 30000000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = mainChainSelector;
        chainSelectors[1] = otherChainSelector;

        bytes[] memory pathData = new bytes[](2);
        address[] memory path = new address[](2);
        path[0] = wethAddress;
        path[1] = assetList[0];
        pathData[0] = abi.encode(path, feesData);

        // For Arb Sepolia
        address[] memory path1 = new address[](2);
        path1[0] = wethAddressArbSepolia;
        path1[1] = assetList[1];
        pathData[1] = abi.encode(path1, feesData);

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);
        console.log("Called mockFillAssetsList() [testnet style].");
    }

    function _setFunctionsOracle(string memory targetChain) internal {
        address balancerSenderProxy;
        address indexFactoryBalancerProxy;
        address functionsOracleProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            balancerSenderProxy = vm.envAddress("SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            balancerSenderProxy = vm.envAddress("ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        FunctionsOracle(functionsOracleProxy).setIndexFactoryBalancer(indexFactoryBalancerProxy);
        FunctionsOracle(functionsOracleProxy).setBalancerSender(balancerSenderProxy);

        console.log("Done: _setFunctionsOracle()");
    }
}
