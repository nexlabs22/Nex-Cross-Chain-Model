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
        string memory targetChain = "arbitrum_sepolia";

        uint64 chainSelector;
        address vaultAddress;
        address chainlinkToken;
        address router;
        address wethAddress;
        address swapRouterV3;
        address factoryV3;
        address swapRouterV2;
        address toUsdPriceFeed;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            vaultAddress = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_SEPOLIA_TO_USD_PRICE_FEED");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            vaultAddress = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ETHEREUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ETHEREUM_FUNCTIONS_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ETHEREUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ETHEREUM_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ETHEREUM_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ETHEREUM_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ETHEREUM_TO_USD_PRICE_FEED");
        } else {
            revert("Unsupported target chain");
        }

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
