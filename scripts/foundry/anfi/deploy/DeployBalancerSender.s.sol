// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/BalancerSender.sol";

contract DeployBalancerSender is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "sepolia";

        uint64 currentChainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;
        address indexFactoryStorageProxy;
        address functionOracleProxy;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            functionOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        BalancerSender balancerSenderImplementation = new BalancerSender();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address)",
            currentChainSelector,
            indexFactoryStorageProxy,
            functionOracleProxy,
            chainlinkToken,
            router,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(balancerSenderImplementation), address(proxyAdmin), data);

        console.log("BalancerSender implementation deployed at:", address(balancerSenderImplementation));
        console.log("BalancerSender proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for BalancerSender deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
