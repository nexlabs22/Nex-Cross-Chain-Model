// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";

contract UpgradeCrossChainIndexFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address proxyAdminAddress = vm.envAddress("BSC_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADMIN_ADDRESS");
        address crossChainIndexFactoryStorageProxyAddress =
            vm.envAddress("BSC_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");

        CrossChainIndexFactoryStorage newCrossChainIndexFactoryStorageImplementation =
            new CrossChainIndexFactoryStorage();
        console.log(
            "New CrossChainIndexFactory implementation deployed at:",
            address(newCrossChainIndexFactoryStorageImplementation)
        );

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(crossChainIndexFactoryStorageProxyAddress)),
            address(newCrossChainIndexFactoryStorageImplementation)
        );

        console.log(
            "CrossChainIndexFactoryStorage proxy upgraded to new implementation at:",
            address(newCrossChainIndexFactoryStorageImplementation)
        );

        vm.stopBroadcast();
    }
}
