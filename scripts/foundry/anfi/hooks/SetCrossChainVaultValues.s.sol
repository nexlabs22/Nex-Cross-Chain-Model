// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/vault/Vault.sol";

contract SetVaultValues is Script {
    address crossChainVault;
    address crossChainIndexFactoryProxy;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            crossChainVault = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            crossChainVault = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        Vault(crossChainVault).setOperator(crossChainIndexFactoryProxy, true);

        vm.stopBroadcast();
    }
}
