// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/ccip/CrossChainFeeSender.sol";

contract UpgradeCrossChainFeeSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // address proxyAdminAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_FEE_SENDER_PROXY_ADMIN_ADDRESS");
        // address crossChainFeeSenderProxyAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_FEE_SENDER_PROXY_ADDRESS");

        address proxyAdminAddress = vm.envAddress("SEPOLIA_FEE_SENDER_PROXY_ADMIN_ADDRESS");
        address crossChainFeeSenderProxyAddress = vm.envAddress("SEPOLIA_FEE_SENDER_PROXY_ADDRESS");

        CrossChainFeeSender newCrossChainFeeSenderImplementation = new CrossChainFeeSender();
        console.log(
            "New CrossChainFeeSender implementation deployed at:", address(newCrossChainFeeSenderImplementation)
        );

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(crossChainFeeSenderProxyAddress)),
            address(newCrossChainFeeSenderImplementation)
        );

        console.log(
            "CrossChainFeeSender proxy upgraded to new implementation at:",
            address(newCrossChainFeeSenderImplementation)
        );

        vm.stopBroadcast();
    }
}
