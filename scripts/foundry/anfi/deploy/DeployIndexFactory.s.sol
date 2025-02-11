// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/IndexFactory.sol";

contract DeployIndexFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "sepolia";

        uint64 currentChainSelector;
        address indexTokenProxy;
        address wethAddress;
        address indexFactoryStorageProxy;
        address functionsOracleProxy;
        address coreSenderProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionsOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexFactory indexFactoryImplementation = new IndexFactory();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address)",
            currentChainSelector,
            payable(indexTokenProxy),
            indexFactoryStorageProxy,
            functionsOracleProxy,
            coreSenderProxy,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryImplementation), address(proxyAdmin), data);

        console.log("IndexFactory implementation deployed at:", address(indexFactoryImplementation));
        console.log("IndexFactory proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for IndexFactory deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
