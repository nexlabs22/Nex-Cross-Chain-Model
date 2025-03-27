// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {IndexToken} from "../../../../contracts/token/IndexToken.sol";
import {FunctionsOracle} from "../../../../contracts/factory/FunctionsOracle.sol";
import {IndexFactoryStorage} from "../../../../contracts/factory/IndexFactoryStorage.sol";
import {CoreSender} from "../../../../contracts/factory/CoreSender.sol";
import {BalancerSender} from "../../../../contracts/factory/BalancerSender.sol";
import {IndexFactory} from "../../../../contracts/factory/IndexFactory.sol";
import {IndexFactoryBalancer} from "../../../../contracts/factory/IndexFactoryBalancer.sol";
import {Vault} from "../../../../contracts/vault/Vault.sol";
import {PriceOracleByteCode} from "../../../../contracts/test/PriceOracleByteCode.sol";

contract DeployAllContractsScript is Script, Test, PriceOracleByteCode {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        string memory targetChain = "sepolia";
        // string memory targetChain = "arbitrum_mainnet";

        address indexTokenProxy = _deployIndexToken(targetChain);

        address functionsOracleProxy = _deployFunctionsOracle(targetChain);

        address indexFactoryStorageProxy =
            _deployIndexFactoryStorage(targetChain, indexTokenProxy, functionsOracleProxy);

        address coreSenderProxy =
            _deployCoreSender(targetChain, indexTokenProxy, indexFactoryStorageProxy, functionsOracleProxy);

        address balancerSenderProxy = _deployBalancerSender(targetChain, indexFactoryStorageProxy, functionsOracleProxy);

        address indexFactoryProxy = _deployIndexFactory(
            targetChain, indexTokenProxy, indexFactoryStorageProxy, functionsOracleProxy, coreSenderProxy
        );

        address indexFactoryBalancerProxy = _deployIndexFactoryBalancer(
            targetChain, indexFactoryStorageProxy, functionsOracleProxy, balancerSenderProxy
        );

        address vaultProxy = _deployVault();

        address priceOracle = _deployPriceOracle();

        vm.stopBroadcast();

        console.log("\n==== ALL CONTRACTS DEPLOYED ====");
        console.log("indexTokenProxy:           ", indexTokenProxy);
        console.log("functionsOracleProxy:      ", functionsOracleProxy);
        console.log("indexFactoryStorageProxy:  ", indexFactoryStorageProxy);
        console.log("coreSenderProxy:           ", coreSenderProxy);
        console.log("balancerSenderProxy:       ", balancerSenderProxy);
        console.log("indexFactoryProxy:         ", indexFactoryProxy);
        console.log("indexFactoryBalancerProxy: ", indexFactoryBalancerProxy);
        console.log("vaultProxy:                ", vaultProxy);
        console.log("priceOracle:               ", priceOracle);
    }

    function _deployIndexToken(string memory targetChain) internal returns (address) {
        uint256 feeRatePerDayScaled;
        address feeReceiver;
        uint256 supplyCeiling;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            feeRatePerDayScaled = vm.envUint("SEPOLIA_FEE_RATE_PER_DAY_SCALED");
            feeReceiver = vm.envAddress("SEPOLIA_FEE_RECEIVER");
            supplyCeiling = vm.envUint("SEPOLIA_SUPPLY_CEILING");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            feeRatePerDayScaled = vm.envUint("ARBITRUM_FEE_RATE_PER_DAY_SCALED");
            feeReceiver = vm.envAddress("ARBITRUM_FEE_RECEIVER");
            supplyCeiling = vm.envUint("ARBITRUM_SUPPLY_CEILING");
        } else {
            revert("Unsupported target chain for IndexToken");
        }

        string memory tokenName = "CRYPTO5";
        string memory tokenSymbol = "CR5";

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexToken indexTokenImplementation = new IndexToken();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(string,string,uint256,address,uint256)",
            tokenName,
            tokenSymbol,
            feeRatePerDayScaled,
            feeReceiver,
            supplyCeiling
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexTokenImplementation), address(proxyAdmin), initData);

        console.log("\n=== IndexToken ===");
        console.log("Implementation:", address(indexTokenImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployFunctionsOracle(string memory targetChain) internal returns (address) {
        address chainlinkToken;
        address router;
        bytes32 newDonId;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("SEPOLIA_NEW_DON_ID");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_FUNCTIONS_ROUTER_ADDRESS");
            newDonId = vm.envBytes32("ARBITRUM_NEW_DON_ID");
        } else {
            revert("Unsupported target chain for FunctionsOracle");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        FunctionsOracle functionsOracleImplementation = new FunctionsOracle();

        bytes memory initData =
            abi.encodeWithSignature("initialize(address,address,bytes32)", chainlinkToken, router, newDonId);

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(functionsOracleImplementation), address(proxyAdmin), initData);

        console.log("\n=== FunctionsOracle ===");
        console.log("Implementation:", address(functionsOracleImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactoryStorage(
        string memory targetChain,
        address indexTokenProxy,
        address functionsOracleProxy
    ) internal returns (address) {
        uint64 chainSelector;
        address chainlinkToken;
        address toUsdPriceFeed;
        address wethAddress;
        address swapRouterV3;
        address factoryV3;
        address swapRouterV2;
        address factoryV2;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            indexTokenProxy = indexTokenProxy;
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            toUsdPriceFeed = vm.envAddress("SEPOLIA_TO_USD_PRICE_FEED");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("SEPOLIA_ROUTER_V2_ADDRESS");
            factoryV2 = vm.envAddress("SEPOLIA_FACTORY_V2_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            indexTokenProxy = indexTokenProxy;
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_TO_USD_PRICE_FEED");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_PANCAKESWAP_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_PANCAKESWAP_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_PANCAKESWAP_ROUTER_V2_ADDRESS");
            factoryV2 = vm.envAddress("ARBITRUM_PANCAKESWAP_FACTORY_V2_ADDRESS");
        } else {
            revert("Unsupported target chain for IndexFactoryStorage");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexFactoryStorage indexFactoryStorageImplementation = new IndexFactoryStorage();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address,address,address,address,address)",
            chainSelector,
            indexTokenProxy,
            functionsOracleProxy,
            toUsdPriceFeed,
            chainlinkToken,
            wethAddress,
            swapRouterV3,
            factoryV3,
            swapRouterV2,
            factoryV2
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryStorageImplementation), address(proxyAdmin), initData);

        console.log("\n=== IndexFactoryStorage ===");
        console.log("Implementation:", address(indexFactoryStorageImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployCoreSender(
        string memory targetChain,
        address indexTokenProxy,
        address indexFactoryStorageProxy,
        address functionsOracleProxy
    ) internal returns (address) {
        address router;
        address wethAddress;
        address chainlinkToken;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
        } else {
            revert("Unsupported target chain for CoreSender");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CoreSender coreSenderImplementation = new CoreSender();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,address,address,address,address,address)",
            payable(indexTokenProxy),
            indexFactoryStorageProxy,
            functionsOracleProxy,
            chainlinkToken,
            router,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(coreSenderImplementation), address(proxyAdmin), initData);

        console.log("\n=== CoreSender ===");
        console.log("Implementation:", address(coreSenderImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployBalancerSender(
        string memory targetChain,
        address indexFactoryStorageProxy,
        address functionsOracleProxy
    ) internal returns (address) {
        uint64 chainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for BalancerSender");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        BalancerSender balancerSenderImplementation = new BalancerSender();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address)",
            chainSelector,
            indexFactoryStorageProxy,
            functionsOracleProxy,
            chainlinkToken,
            router,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(balancerSenderImplementation), address(proxyAdmin), initData);

        console.log("\n=== BalancerSender ===");
        console.log("Implementation:", address(balancerSenderImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactory(
        string memory targetChain,
        address indexTokenProxy,
        address indexFactoryStorageProxy,
        address functionsOracleProxy,
        address coreSenderProxy
    ) internal returns (address) {
        uint64 currentChainSelector;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for IndexFactory");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexFactory indexFactoryImplementation = new IndexFactory();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address)",
            currentChainSelector,
            payable(indexTokenProxy),
            indexFactoryStorageProxy,
            functionsOracleProxy,
            coreSenderProxy,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryImplementation), address(proxyAdmin), initData);

        console.log("\n=== IndexFactory ===");
        console.log("Implementation:", address(indexFactoryImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactoryBalancer(
        string memory targetChain,
        address indexFactoryStorageProxy,
        address functionsOracleProxy,
        address balancerSenderProxy
    ) internal returns (address) {
        uint64 currentChainSelector;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for IndexFactoryBalancer");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        IndexFactoryBalancer indexFactoryBalancerImplementation = new IndexFactoryBalancer();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address)",
            currentChainSelector,
            indexFactoryStorageProxy,
            functionsOracleProxy,
            payable(balancerSenderProxy),
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryBalancerImplementation), address(proxyAdmin), initData);

        console.log("\n=== IndexFactoryBalancer ===");
        console.log("Implementation:", address(indexFactoryBalancerImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployVault() internal returns (address) {
        ProxyAdmin proxyAdmin = new ProxyAdmin();
        Vault vaultImplementation = new Vault();

        bytes memory initData = abi.encodeWithSignature("initialize()");

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(proxyAdmin), initData);

        console.log("\n=== Vault ===");
        console.log("Implementation:", address(vaultImplementation));
        console.log("Proxy:         ", address(proxy));
        console.log("ProxyAdmin:    ", address(proxyAdmin));

        return address(proxy);
    }

    function _deployPriceOracle() internal returns (address) {
        address priceOracle = _deployByteCode(priceOracleByteCode);

        console.log("\n=== PriceOracle ===");
        console.log("Implementation:", address(priceOracle));

        return priceOracle;
    }

    function _deployByteCode(bytes memory bytecode) internal returns (address) {
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        return deployed;
    }
}
