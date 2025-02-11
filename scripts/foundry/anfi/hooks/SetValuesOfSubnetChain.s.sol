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

        string memory targetChain = "arbitrum_sepolia";

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

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            crossChainIndexFactoryStorageProxy =
                vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            crossChainFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ETHEREUM_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ETHEREUM_WETH_ADDRESS");
            crossChainIndexFactoryStorageProxy =
                vm.envAddress("ETHEREUM_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain for _setCrossChainFactoryValues");
        }

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = crossChainToken;

        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, feesData
        );
        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setPriceOracle(priceOracle);
        CrossChainIndexFactoryStorage(payable(crossChainIndexFactoryStorageProxy)).setCrossChainFactory(
            crossChainFactoryProxy
        );

        console.log("Done: _setCrossChainFactoryValues()");
    }

    function _setVaultValues(string memory targetChain) internal {
        address crossChainVault;
        address crossChainIndexFactoryProxy;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            crossChainVault = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            crossChainVault = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain for _setVaultValues");
        }

        Vault(crossChainVault).setOperator(crossChainIndexFactoryProxy, true);

        console.log("Done: _setVaultValues()");
    }
}
