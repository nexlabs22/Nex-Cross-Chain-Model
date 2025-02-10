// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/CrossChainIndexFactory.sol";

contract DeployCrossChainIndexFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "arbitrum_sepolia";

        address chainlinkToken;
        address router;
        address crossChainIndexFactoryStorageProxy;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_SEPOLIA_CCIP_ROUTER_ADDRESS");

            crossChainIndexFactoryStorageProxy =
                vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainlinkToken = vm.envAddress("ETHEREUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ETHEREUM_CCIP_ROUTER_ADDRESS");

            crossChainIndexFactoryStorageProxy =
                vm.envAddress("ETHEREUM_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainIndexFactory crossChainFactoryImplementation = new CrossChainIndexFactory();

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address)", crossChainIndexFactoryStorageProxy, router, chainlinkToken
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(crossChainFactoryImplementation), address(proxyAdmin), data);

        console.log("CrossChainFactory implementation deployed at:", address(crossChainFactoryImplementation));
        console.log("CrossChainFactory proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for CrossChainFactory deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
