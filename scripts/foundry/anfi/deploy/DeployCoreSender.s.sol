// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/CoreSender.sol";

contract DeployCoreSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "sepolia";

        address indexTokenProxy;
        address router;
        address wethAddress;
        address indexFactoryStorageProxy;
        address functionOracleProxy;
        address chainlinkToken;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CoreSender coreSenderImplementation = new CoreSender();

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address,address,address,address)",
            payable(indexTokenProxy),
            indexFactoryStorageProxy,
            functionOracleProxy,
            chainlinkToken,
            router,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(coreSenderImplementation), address(proxyAdmin), data);

        console.log("CoreSender implementation deployed at:", address(coreSenderImplementation));
        console.log("CoreSender proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for CoreSender deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
