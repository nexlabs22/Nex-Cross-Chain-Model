// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/CrossChainFactory.sol";

contract DeployCrossChainFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        uint64 chainSelector = vm.envAddress("TESTNET_CHAIN_SELECTOR");
        address vaultAddress = vm.envAddress("SEPOLIA_VAULT_PROXY_ADDRESS");
        address chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
        address router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
        address wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        address swapRouterV3 = vm.envAddress("SEPOLIA_ROUTER_V3_ADDRESS");
        address factoryV3 = vm.envAddress("SEPOLIA_FACTORY_V3_ADDRESS");
        address swapRouterV2 = vm.envAddress("SEPOLIA_ROUTER_V2_ADDRESS");
        address toUsdPriceFeed = vm.envAddress("SEPOLIA_TO_USD_PRICE_FEED");

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();

        CrossChainFactory crossChainFactoryImplementation = new CrossChainFactory();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint62,address,address,address,address,address,address,address,address)",
            chainSelector,
            payable(vaultAddress),
            chainlinkToken,
            router,
            wethAddress,
            swapRouterV3,
            factoryV3,
            swapRouterV2,
            toUsdPriceFeed
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(crossChainFactoryImplementation), address(proxyAdmin), data);

        console.log("CrossChainFactory implementation deployed at:", address(crossChainFactoryImplementation));
        console.log("CrossChainFactory proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for CrossChainFactory deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
