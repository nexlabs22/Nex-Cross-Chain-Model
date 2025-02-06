// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {IndexFactoryStorage} from "../../../contracts/factory/IndexFactoryStorage.sol";

contract UpgradeIndexFactoryStorage is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADMIN_ADDRESS");
        address indexFactoryStorageProxyAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");

        // Testnet
        // address proxyAdminAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADMIN_ADDRESS");
        // address indexFactoryStorageProxyAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");

        IndexFactoryStorage newIndexFactoryStorageImplementation = new IndexFactoryStorage();
        console.log(
            "New IndexFactoryStorage implementation deployed at:", address(newIndexFactoryStorageImplementation)
        );

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(indexFactoryStorageProxyAddress)),
            address(newIndexFactoryStorageImplementation)
        );

        console.log(
            "IndexFactoryStorage proxy upgraded to new implementation at:",
            address(newIndexFactoryStorageImplementation)
        );

        vm.stopBroadcast();
    }
}
