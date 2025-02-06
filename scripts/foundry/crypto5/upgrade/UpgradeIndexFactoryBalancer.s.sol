// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {IndexFactoryBalancer} from "../../../contracts/factory/IndexFactoryBalancer.sol";

contract UpgradeIndexFactoryBalancer is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADMIN_ADDRESS");
        address indexFactoryBalancerProxyAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");

        // Testnet
        // address proxyAdminAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADMIN_ADDRESS");
        // address indexFactoryBalancerProxyAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");

        IndexFactoryBalancer newIndexFactoryBalanacerImplementation = new IndexFactoryBalancer();
        console.log(
            "New IndexFactoryBalancer implementation deployed at:", address(newIndexFactoryBalanacerImplementation)
        );

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(indexFactoryBalancerProxyAddress)),
            address(newIndexFactoryBalanacerImplementation)
        );

        console.log(
            "IndexFactoryBalancer proxy upgraded to new implementation at:",
            address(newIndexFactoryBalanacerImplementation)
        );

        vm.stopBroadcast();
    }
}
