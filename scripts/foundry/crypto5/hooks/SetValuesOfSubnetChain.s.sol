// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import "../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";
import "../../../../contracts/vault/Vault.sol";

contract CombinedSetCrossChainValues is Script, Test {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // string memory targetChain = "arbitrum_sepolia";
        string memory targetChain = "bsc_mainnet";

        _setCrossChainFactoryValues(targetChain);
        _setVaultValues(targetChain);

        vm.stopBroadcast();

        console.log("All cross-chain set operations completed successfully!");
    }

    function _setCrossChainFactoryValues(string memory targetChain) internal {
        address crossChainFactoryProxy;
        address priceOracle;
        uint64 chainSelector;
        address crossChainToken;
        address weth;
        address crossChainIndexFactoryStorageProxy;
        address coreSenderProxy;
        address balancerSenderProxy;

        uint24[] memory feesData = new uint24[](1);

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            crossChainFactoryProxy = vm.envAddress("CR5_ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            crossChainIndexFactoryStorageProxy =
                vm.envAddress("CR5_ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("CR5_SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
            balancerSenderProxy = vm.envAddress("CR5_SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            feesData[0] = 3000;
        } else if (keccak256(bytes(targetChain)) == keccak256("bsc_mainnet")) {
            crossChainFactoryProxy = vm.envAddress("BSC_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("BSC_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("BSC_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("BSC_WETH_ADDRESS");
            crossChainIndexFactoryStorageProxy = vm.envAddress("BSC_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("CR5_ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
            balancerSenderProxy = vm.envAddress("CR5_ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
            feesData[0] = 500;
        } else {
            revert("Unsupported target chain for _setCrossChainFactoryValues");
        }

        address btcbAddress = vm.envAddress("BSC_BTCB_ADDRESS");

        uint24[] memory bnbFeesData = new uint24[](2);
        bnbFeesData[0] = 500;
        bnbFeesData[1] = 500;

        address[] memory path = new address[](3);
        path[0] = weth;
        path[1] = btcbAddress;
        path[2] = crossChainToken;

        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, bnbFeesData
        );
        // address[] memory path = new address[](2);
        // path[0] = weth;
        // path[1] = crossChainToken;

        // CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setCrossChainToken(
        //     chainSelector, crossChainToken, path, feesData
        // );
        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setPriceOracle(priceOracle);
        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setCrossChainFactory(
            crossChainFactoryProxy
        );

        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setVerifiedFactory(
            coreSenderProxy, chainSelector, true
        );
        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setVerifiedFactory(
            balancerSenderProxy, chainSelector, true
        );

        console.log("Done: _setCrossChainFactoryValues()");
    }

    function _setVaultValues(string memory targetChain) internal {
        address crossChainVault;
        address crossChainIndexFactoryProxy;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            crossChainVault = vm.envAddress("CR5_ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("CR5_ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("bsc_mainnet")) {
            crossChainVault = vm.envAddress("BSC_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("BSC_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain for _setVaultValues");
        }

        Vault(crossChainVault).setOperator(crossChainIndexFactoryProxy, true);

        console.log("Done: _setVaultValues()");
    }
}
