// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/FunctionsOracle.sol";

contract DeployFunctionsOracle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "sepolia";

        address chainlinkToken;
        address router;
        bytes32 newDonId;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("SEPOLIA_NEW_DON_ID");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("ARBITRUM_NEW_DON_ID");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        FunctionsOracle functionsOracleImplementation = new FunctionsOracle();

        bytes memory data =
            abi.encodeWithSignature("initialize(address,address,bytes32)", chainlinkToken, router, newDonId);

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(functionsOracleImplementation), address(proxyAdmin), data);

        console.log("FunctionsOracle implementation deployed at:", address(functionsOracleImplementation));
        console.log("FunctionsOracle proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for FunctionsOracle deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
