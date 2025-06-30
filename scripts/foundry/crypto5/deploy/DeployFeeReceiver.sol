// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/ccip/CrossChainFeeReceiver.sol";

contract DeployFeeReceiver is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // string memory targetChain = "sepolia";
        string memory targetChain = "arbitrum_mainnet";

        address crossChainFactoryStorage;
        address ccipRouter;
        address chainlinkToken;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            ccipRouter = vm.envAddress("ARBITRUM_SEPOLIA_CCIP_ROUTER_ADDRESS");
            crossChainFactoryStorage =
                vm.envAddress("CR5_ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainlinkToken = vm.envAddress("BSC_CHAINLINK_TOKEN_ADDRESS");
            ccipRouter = vm.envAddress("BSC_CCIP_ROUTER_ADDRESS");
            crossChainFactoryStorage = vm.envAddress("BSC_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainFeeReceiver feeReceiverImplementation = new CrossChainFeeReceiver();

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address)", crossChainFactoryStorage, ccipRouter, chainlinkToken
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(feeReceiverImplementation), address(proxyAdmin), data);

        console.log("CrossChainFeeReceiver implementation deployed at:", address(feeReceiverImplementation));
        console.log("CrossChainFeeReceiver proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for CrossChainFeeReceiver deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
