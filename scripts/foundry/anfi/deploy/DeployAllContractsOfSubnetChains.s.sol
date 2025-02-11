// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {Vault} from "../../../../contracts/vault/Vault.sol";
import {CrossChainIndexFactoryStorage} from "../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";
import {CrossChainIndexFactory} from "../../../../contracts/vault/CrossChainIndexFactory.sol";
import {PriceOracleByteCode} from "../../../../contracts/test/PriceOracleByteCode.sol";

contract DeployCrossChainAllScript is Script, Test, PriceOracleByteCode {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        string memory targetChain = "arbitrum_sepolia";

        address vaultProxy = _deployVault();

        address ccIFSProxy = _deployCrossChainIndexFactoryStorage(targetChain, vaultProxy);

        address ccIFProxy = _deployCrossChainIndexFactory(targetChain, ccIFSProxy);

        address priceOracle = _deployPriceOracle();

        vm.stopBroadcast();

        console.log("\n=== All Deployments Complete ===");
        console.log("Vault Proxy:                    ", vaultProxy);
        console.log("CrossChainIndexFactoryStorage:  ", ccIFSProxy);
        console.log("CrossChainIndexFactory:         ", ccIFProxy);
        console.log("PriceOracle:                    ", priceOracle);
    }

    function _deployVault() internal returns (address) {
        ProxyAdmin proxyAdmin = new ProxyAdmin();
        Vault vaultImplementation = new Vault();

        bytes memory initData = abi.encodeWithSignature("initialize()");

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(proxyAdmin), initData);

        console.log("=== Vault ===");
        console.log("Implementation:", address(vaultImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployCrossChainIndexFactoryStorage(string memory targetChain, address vaultProxy)
        internal
        returns (address)
    {
        uint64 chainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;
        address swapRouterV3;
        address factoryV3;
        address swapRouterV2;
        address toUsdPriceFeed;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_SEPOLIA_TO_USD_PRICE_FEED");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ETHEREUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ETHEREUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ETHEREUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ETHEREUM_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ETHEREUM_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ETHEREUM_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ETHEREUM_TO_USD_PRICE_FEED");
        } else {
            revert("Unsupported target chain for CrossChainIndexFactoryStorage");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainIndexFactoryStorage impl = new CrossChainIndexFactoryStorage();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address,address,address,address)",
            chainSelector,
            payable(vaultProxy),
            chainlinkToken,
            router,
            wethAddress,
            swapRouterV3,
            factoryV3,
            swapRouterV2,
            toUsdPriceFeed
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(impl), address(proxyAdmin), initData);

        console.log("\n=== CrossChainIndexFactoryStorage ===");
        console.log("Implementation:", address(impl));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployCrossChainIndexFactory(string memory targetChain, address ccIFSProxy) internal returns (address) {
        address chainlinkToken;
        address router;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_SEPOLIA_CCIP_ROUTER_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainlinkToken = vm.envAddress("ETHEREUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ETHEREUM_CCIP_ROUTER_ADDRESS");
        } else {
            revert("Unsupported target chain for CrossChainIndexFactory");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainIndexFactory impl = new CrossChainIndexFactory();

        bytes memory initData =
            abi.encodeWithSignature("initialize(address,address,address)", ccIFSProxy, router, chainlinkToken);

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(impl), address(proxyAdmin), initData);

        console.log("\n=== CrossChainIndexFactory ===");
        console.log("Implementation:", address(impl));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployPriceOracle() internal returns (address) {
        address deployed = _deployByteCode(priceOracleByteCode);

        console.log("\n=== PriceOracle ===");
        console.log("Implementation:", deployed);

        return deployed;
    }

    function _deployByteCode(bytes memory bytecode) internal returns (address) {
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        return deployed;
    }
}
