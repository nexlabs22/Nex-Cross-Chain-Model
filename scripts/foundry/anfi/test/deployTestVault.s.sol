// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/Vault.sol";

contract DeployVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        Vault vaultImplementation = new Vault();

        bytes memory data = abi.encodeWithSignature("initialize()");

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(proxyAdmin), data);

        console.log("Vault implementation deployed at:", address(vaultImplementation));
        console.log("Vault proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for Vault deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
