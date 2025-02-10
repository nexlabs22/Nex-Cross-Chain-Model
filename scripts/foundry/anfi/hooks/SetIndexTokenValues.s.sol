// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/token/IndexToken.sol";

contract SetIndexTokenValues is Script {
    address indexFactoryProxy;
    address indexTokenProxy;
    address coreSenderProxy;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexFactoryProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexFactoryProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        IndexToken(payable(indexTokenProxy)).setMinter(indexFactoryProxy, true);
        IndexToken(payable(indexTokenProxy)).setMinter(coreSenderProxy, true);

        vm.stopBroadcast();
    }
}
