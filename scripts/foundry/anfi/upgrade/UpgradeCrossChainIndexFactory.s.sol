// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/CrossChainIndexFactory.sol";

contract UpgradeCrossChainIndexFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADMIN_ADDRESS");
        address crossChainIndexFactoryProxyAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");

        // // Testnet
        // address proxyAdminAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADMIN_ADDRESS");
        // address crossChainIndexFactoryProxyAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");

        CrossChainIndexFactory newCrossChainIndexFactoryImplementation = new CrossChainIndexFactory();
        console.log(
            "New CrossChainIndexFactory implementation deployed at:", address(newCrossChainIndexFactoryImplementation)
        );

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(crossChainIndexFactoryProxyAddress)),
            address(newCrossChainIndexFactoryImplementation)
        );

        console.log(
            "CrossChainIndexFactory proxy upgraded to new implementation at:",
            address(newCrossChainIndexFactoryImplementation)
        );

        vm.stopBroadcast();
    }
}
