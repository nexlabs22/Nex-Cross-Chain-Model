// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/FunctionsOracle.sol";

contract UpgradeFunctionsOracle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Mainnet
        address proxyAdminAddress = vm.envAddress("CR5_ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADMIN_ADDRESS");
        address functionsOracleBalancerProxyAddress = vm.envAddress("CR5_ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");

        // Testnet
        // address proxyAdminAddress = vm.envAddress("CR5_SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADMIN_ADDRESS");
        // address functionsOracleBalancerProxyAddress = vm.envAddress("CR5_SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");

        FunctionsOracle newFunctionsOracleImplementation = new FunctionsOracle();
        console.log("New FunctionsOracle implementation deployed at:", address(newFunctionsOracleImplementation));

        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        proxyAdmin.upgrade(
            ITransparentUpgradeableProxy(payable(functionsOracleBalancerProxyAddress)),
            address(newFunctionsOracleImplementation)
        );

        console.log(
            "FunctionsOracle proxy upgraded to new implementation at:", address(newFunctionsOracleImplementation)
        );

        vm.stopBroadcast();
    }
}
