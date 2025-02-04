// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/factory/IndexFactoryStorage.sol";

contract DeployIndexFactoryStorage is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory targetChain = "sepolia";

        uint64 chainSelector;
        address indexTokenProxy;
        address chainlinkToken;
        address router;
        bytes32 newDonId;
        address toUsdPriceFeed;
        address wethAddress;
        address swapRouterV3;
        address factoryV3;
        address swapRouterV2;
        address factoryV2;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("SEPOLIA_NEW_DON_ID");
            toUsdPriceFeed = vm.envAddress("SEPOLIA_TO_USD_PRICE_FEED");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("SEPOLIA_ROUTER_V2_ADDRESS");
            factoryV2 = vm.envAddress("SEPOLIA_FACTORY_V2_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("ARBITRUM_NEW_DON_ID");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_TO_USD_PRICE_FEED");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_ROUTER_V2_ADDRESS");
            factoryV2 = vm.envAddress("ARBITRUM_FACTORY_V2_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        vm.startBroadcast(deployerPrivateKey);

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexFactoryStorage indexFactoryStorageImplementation = new IndexFactoryStorage();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,bytes32,address,address,address,address,address,address)",
            chainSelector,
            indexTokenProxy,
            chainlinkToken,
            router,
            newDonId,
            toUsdPriceFeed,
            wethAddress,
            swapRouterV3,
            factoryV3,
            swapRouterV2,
            factoryV2
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryStorageImplementation), address(proxyAdmin), data);

        console.log("IndexFactoryStorage implementation deployed at:", address(indexFactoryStorageImplementation));
        console.log("IndexFactoryStorage proxy deployed at:", address(proxy));
        console.log("ProxyAdmin for IndexFactoryStorage deployed at:", address(proxyAdmin));

        vm.stopBroadcast();
    }
}
