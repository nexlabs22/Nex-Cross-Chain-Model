// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../contracts/vault/Vault.sol";

contract UpgradeVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("ARBITRUM_VAULT_PROXY_ADMIN_ADDRESS");
        address vaultProxyAddress = vm.envAddress("ARBITRUM_VAULT_PROXY_ADDRESS");

        // Testnet
        // address proxyAdminAddress = vm.envAddress("SEPOLIA_VAULT_PROXY_ADMIN_ADDRESS");
        // address vaultProxyAddress = vm.envAddress("SEPOLIA_VAULT_PROXY_ADDRESS");

        Vault newVaultImplementation = new Vault();
        console.log("New Vault implementation deployed at:", address(newVaultImplementation));

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(ITransparentUpgradeableProxy(payable(vaultProxyAddress)), address(newVaultImplementation));

        console.log("Vault proxy upgraded to new implementation at:", address(newVaultImplementation));

        vm.stopBroadcast();
    }
}
