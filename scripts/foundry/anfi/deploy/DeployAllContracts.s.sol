// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "../../../../contracts/vault/CrossChainFactory.sol";
import "../../../../contracts/factory/IndexFactory.sol";
import "../../../../contracts/factory/IndexFactoryBalancer.sol";
import "../../../../contracts/factory/IndexFactoryStorage.sol";
import "../../../../contracts/token/IndexToken.sol";
import "../../../../contracts/vault/Vault.sol";

contract DeployAllContracts is Script {
    function run() external {
        // Set targetChain manually: "sepolia", "arbitrum_sepolia", "arbitrum_mainnet", or "ethereum_mainnet"
        string memory targetChain = "sepolia";

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        uint64 chainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;
        address swapRouterV3;
        address factoryV3;
        address swapRouterV2;
        address toUsdPriceFeed;
        bytes32 newDonId;
        address factoryV2;
        uint256 feeRatePerDayScaled;
        address feeReceiver;
        uint256 supplyCeiling;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("SEPOLIA_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("SEPOLIA_TO_USD_PRICE_FEED");
            newDonId = vm.envBytes32("SEPOLIA_NEW_DON_ID");
            factoryV2 = vm.envAddress("SEPOLIA_FACTORY_V2_ADDRESS");
            feeRatePerDayScaled = vm.envUint("SEPOLIA_FEE_RATE_PER_DAY_SCALED");
            feeReceiver = vm.envAddress("SEPOLIA_FEE_RECEIVER");
            supplyCeiling = vm.envUint("SEPOLIA_SUPPLY_CEILING");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            vaultAddress = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_SEPOLIA_TO_USD_PRICE_FEED");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_FUNCTIONS_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_TO_USD_PRICE_FEED");
            newDonId = vm.envBytes32("ARBITRUM_NEW_DON_ID");
            factoryV2 = vm.envAddress("ARBITRUM_FACTORY_V2_ADDRESS");
            feeRatePerDayScaled = vm.envUint("ARBITRUM_FEE_RATE_PER_DAY_SCALED");
            feeReceiver = vm.envAddress("ARBITRUM_FEE_RECEIVER");
            supplyCeiling = vm.envUint("ARBITRUM_SUPPLY_CEILING");
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

        // For testnet: main chain is "sepolia"; for mainnet: main chain is "arbitrum_mainnet".
        bool isMainChain = (
            (keccak256(bytes(targetChain)) == keccak256("sepolia"))
                || (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet"))
        );

        vm.startBroadcast(deployerPrivateKey);

        // ********************************************
        // Vault
        // ********************************************
        ProxyAdmin vaultProxyAdmin = new ProxyAdmin();
        console.log("Vault ProxyAdmin deployed at:", address(vaultProxyAdmin));

        Vault vaultImplementation = new Vault();
        bytes memory vaultData = abi.encodeWithSignature("initialize()");
        TransparentUpgradeableProxy vaultProxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(vaultProxyAdmin), vaultData);
        address vaultProxyAddress = address(vaultProxy);
        console.log("Vault deployed at:", vaultProxyAddress);

        if (isMainChain) {
            // ********************************************
            // IndexToken
            // ********************************************
            ProxyAdmin indexTokenProxyAdmin = new ProxyAdmin();
            console.log("IndexToken ProxyAdmin deployed at:", address(indexTokenProxyAdmin));

            string memory tokenName = "Anti Inflation Index";
            string memory tokenSymbol = "ANFI";
            IndexToken indexTokenImplementation = new IndexToken();
            bytes memory indexTokenData = abi.encodeWithSignature(
                "initialize(string,string,uint256,address,uint256)",
                tokenName,
                tokenSymbol,
                feeRatePerDayScaled,
                feeReceiver,
                supplyCeiling
            );
            TransparentUpgradeableProxy indexTokenProxy = new TransparentUpgradeableProxy(
                address(indexTokenImplementation), address(indexTokenProxyAdmin), indexTokenData
            );
            address indexTokenProxyAddress = address(indexTokenProxy);
            console.log("IndexToken deployed at:", indexTokenProxyAddress);

            // ********************************************
            // IndexFactory
            // ********************************************
            ProxyAdmin indexFactoryProxyAdmin = new ProxyAdmin();
            console.log("IndexFactory ProxyAdmin deployed at:", address(indexFactoryProxyAdmin));

            IndexFactory indexFactoryImplementation = new IndexFactory();
            bytes memory indexFactoryData = abi.encodeWithSignature(
                "initialize(uint64,address,address,address,address)",
                chainSelector,
                indexTokenProxyAddress,
                chainlinkToken,
                router,
                wethAddress
            );
            TransparentUpgradeableProxy indexFactoryProxy = new TransparentUpgradeableProxy(
                address(indexFactoryImplementation), address(indexFactoryProxyAdmin), indexFactoryData
            );
            console.log("IndexFactory deployed at:", address(indexFactoryProxy));

            // ********************************************
            // IndexFactoryBalancer
            // ********************************************
            ProxyAdmin indexFactoryBalancerProxyAdmin = new ProxyAdmin();
            console.log("IndexFactoryBalancer ProxyAdmin deployed at:", address(indexFactoryBalancerProxyAdmin));

            IndexFactoryBalancer indexFactoryBalancerImplementation = new IndexFactoryBalancer();
            bytes memory indexFactoryBalancerData = abi.encodeWithSignature(
                "initialize(uint64,address,address,address,address)",
                chainSelector,
                indexTokenProxyAddress,
                chainlinkToken,
                router,
                wethAddress
            );
            TransparentUpgradeableProxy indexFactoryBalancerProxy = new TransparentUpgradeableProxy(
                address(indexFactoryBalancerImplementation),
                address(indexFactoryBalancerProxyAdmin),
                indexFactoryBalancerData
            );
            console.log("IndexFactoryBalancer deployed at:", address(indexFactoryBalancerProxy));

            // ********************************************
            // IndexFactoryStorage
            // ********************************************
            ProxyAdmin indexFactoryStorageProxyAdmin = new ProxyAdmin();
            console.log("IndexFactoryStorage ProxyAdmin deployed at:", address(indexFactoryStorageProxyAdmin));

            IndexFactoryStorage indexFactoryStorageImplementation = new IndexFactoryStorage();
            bytes memory indexFactoryStorageData = abi.encodeWithSignature(
                "initialize(uint64,address,address,address,bytes32,address,address,address,address,address,address)",
                chainSelector,
                indexTokenProxyAddress,
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
            TransparentUpgradeableProxy indexFactoryStorageProxy = new TransparentUpgradeableProxy(
                address(indexFactoryStorageImplementation),
                address(indexFactoryStorageProxyAdmin),
                indexFactoryStorageData
            );
            console.log("IndexFactoryStorage deployed at:", address(indexFactoryStorageProxy));
        } else {
            ProxyAdmin crossChainFactoryProxyAdmin = new ProxyAdmin();
            console.log("CrossChainFactory ProxyAdmin deployed at:", address(crossChainFactoryProxyAdmin));

            CrossChainFactory crossChainFactoryImplementation = new CrossChainFactory();
            bytes memory crossChainFactoryData = abi.encodeWithSignature(
                "initialize(uint64,address,address,address,address,address,address,address,address)",
                chainSelector,
                vaultProxyAddress,
                chainlinkToken,
                router,
                wethAddress,
                swapRouterV3,
                factoryV3,
                swapRouterV2,
                toUsdPriceFeed
            );
            TransparentUpgradeableProxy crossChainFactoryProxy = new TransparentUpgradeableProxy(
                address(crossChainFactoryImplementation), address(crossChainFactoryProxyAdmin), crossChainFactoryData
            );
            console.log("CrossChainFactory deployed at:", address(crossChainFactoryProxy));
        }

        vm.stopBroadcast();
    }
}
