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

        uint64 currentChainSelector = vm.envUint("CURRENT_CHAIN_SELECTOR");
        address indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
        address chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
        address router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
        address wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();

        IndexFactory indexFactoryImplementation = new IndexFactory();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address)",
            currentChainSelector,
            payable(indexTokenProxy),
            chainlinkToken,
            router,
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
