// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/CoreSender.sol";

contract UpgradeCoreSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address proxyAdminAddress = vm.envAddress("CR5_ARBITRUM_CORE_SENDER_PROXY_ADMIN_ADDRESS");
        address coreSenderStorageProxyAddress = vm.envAddress("CR5_ARBITRUM_CORE_SENDER_PROXY_ADDRESS");

        // address proxyAdminAddress = vm.envAddress("CR5_SEPOLIA_CORE_SENDER_PROXY_ADMIN_ADDRESS");
        // address coreSenderStorageProxyAddress = vm.envAddress("CR5_SEPOLIA_CORE_SENDER_PROXY_ADDRESS");

        CoreSender newCoreSenderImplementation = new CoreSender();
        console.log("New CoreSender implementation deployed at:", address(newCoreSenderImplementation));

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(coreSenderStorageProxyAddress)), address(newCoreSenderImplementation)
        );

        console.log("CoreSender proxy upgraded to new implementation at:", address(newCoreSenderImplementation));

        vm.stopBroadcast();
    }
}
