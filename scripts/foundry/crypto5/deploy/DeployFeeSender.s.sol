// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/ccip/CrossChainFeeSender.sol";

contract DeployFeeSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // string memory targetChain = "sepolia";
        string memory targetChain = "arbitrum_mainnet";

        address indexFactoryStorageProxy;
        address chainlinkToken;
        address wethAddress;
        address ccipRouter;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            ccipRouter = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            ccipRouter = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainFeeSender feeSenderImplementation = new CrossChainFeeSender();

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address,address)",
            indexFactoryStorageProxy,
            chainlinkToken,
            ccipRouter,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(feeSenderImplementation), address(proxyAdmin), data);

        console.log("CrossChainFeeSender implementation deployed at:", address(feeSenderImplementation));
        console.log("CrossChainFeeSender proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for CrossChainFeeSender deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
