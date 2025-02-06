// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {IndexToken} from "../../../contracts/token/IndexToken.sol";

contract UpgradeIndexToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADMIN_ADDRESS");
        address indexTokenProxyAddress = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");

        // Testnet
        // address proxyAdminAddress = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADMIN_ADDRESS");
        // address indexTokenProxyAddress = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");

        IndexToken newIndexTokenImplementation = new IndexToken();
        console.log("New IndexToken implementation deployed at:", address(newIndexTokenImplementation));

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(indexTokenProxyAddress)), address(newIndexTokenImplementation)
        );

        console.log("IndexToken proxy upgraded to new implementation at:", address(newIndexTokenImplementation));

        vm.stopBroadcast();
    }
}
