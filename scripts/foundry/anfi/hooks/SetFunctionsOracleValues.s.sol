// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/factory/FunctionsOracle.sol";

contract SetFunctionsOracleValues is Script {
    address balancerSenderProxy;
    address indexFactoryBalancerProxy;
    address functionsOracleProxy;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            balancerSenderProxy = vm.envAddress("SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            balancerSenderProxy = vm.envAddress("ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        FunctionsOracle(functionsOracleProxy).setIndexFactoryBalancer(indexFactoryBalancerProxy);
        FunctionsOracle(functionsOracleProxy).setBalancerSender(balancerSenderProxy);

        vm.stopBroadcast();
    }
}
