// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/BalancerSender.sol";

contract UpgradeBalancerSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address proxyAdminAddress = vm.envAddress("CR5_ARBITRUM_BALANCER_SENDER_PROXY_ADMIN_ADDRESS");
        address BalancerSenderProxyAddress = vm.envAddress("CR5_ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");

        // address proxyAdminAddress = vm.envAddress("CR5_SEPOLIA_BALANCER_SENDER_PROXY_ADMIN_ADDRESS");
        // address BalancerSenderProxyAddress = vm.envAddress("CR5_SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");

        BalancerSender newBalancerSenderImplementation = new BalancerSender();
        console.log("New BalancerSender implementation deployed at:", address(newBalancerSenderImplementation));

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(BalancerSenderProxyAddress)), address(newBalancerSenderImplementation)
        );

        console.log("BalancerSender proxy upgraded to new implementation at:", address(newBalancerSenderImplementation));

        vm.stopBroadcast();
    }
}
