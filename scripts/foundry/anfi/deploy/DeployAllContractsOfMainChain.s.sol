// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {IndexToken} from "../../../../contracts/token/IndexToken.sol";
import {IndexFactoryStorage} from "../../../../contracts/factory/IndexFactoryStorage.sol";
import {IndexFactory} from "../../../../contracts/factory/IndexFactory.sol";
import {IndexFactoryBalancer} from "../../../../contracts/factory/IndexFactoryBalancer.sol";
import {Vault} from "../../../../contracts/vault/Vault.sol";
import {PriceOracleByteCode} from "../../../../contracts/test/PriceOracleByteCode.sol";

contract DeployAndLinkScript is Script, Test, PriceOracleByteCode {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        string memory targetChain = "sepolia";

        // 1. Deploy IndexToken
        address indexTokenProxy = _deployIndexToken(targetChain);

        // 2. Deploy IndexFactoryStorage (requires indexTokenProxy)
        address indexFactoryStorageProxy = _deployIndexFactoryStorage(targetChain, indexTokenProxy);

        // 3. Deploy IndexFactory (requires indexTokenProxy)
        address indexFactoryProxy = _deployIndexFactory(targetChain, indexTokenProxy);

        // 4. Deploy IndexFactoryBalancer (requires indexTokenProxy)
        address indexFactoryBalancerProxy = _deployIndexFactoryBalancer(targetChain, indexTokenProxy);

        // 5. Deploy Vault
        address vaultProxy = _deployVault();

        // 6. Deploy PriceOracle
        address priceOracle = _deployPriceOracle();

        _linkContracts(
            indexFactoryStorageProxy,
            indexFactoryProxy,
            indexTokenProxy,
            vaultProxy,
            priceOracle,
            indexFactoryBalancerProxy
        );
        /* optionally crossChainFactoryProxy, if needed */

        vm.stopBroadcast();
    }

    // ---------------------------------------------------------------------
    // DEPLOY FUNCTIONS
    // ---------------------------------------------------------------------
    function _deployIndexToken(string memory targetChain) internal returns (address) {
        // read from env
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

        string memory tokenName = "Anti Inflation Index";
        string memory tokenSymbol = "ANFI";

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

        console.log("=== IndexToken ===");
        console.log("Implementation:", address(indexTokenImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactoryStorage(string memory targetChain, address indexTokenProxy)
        internal
        returns (address)
    {
        uint64 chainSelector;
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
            revert("Unsupported target chain for IndexFactoryStorage");
        }

        IndexFactoryStorage indexFactoryStorageImplementation = new IndexFactoryStorage();
        ProxyAdmin proxyAdmin = new ProxyAdmin();

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

        console.log("=== IndexFactoryStorage ===");
        console.log("Implementation:", address(indexFactoryStorageImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactory(string memory targetChain, address indexTokenProxy) internal returns (address) {
        uint64 currentChainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for IndexFactory");
        }

        IndexFactory indexFactoryImplementation = new IndexFactory();
        ProxyAdmin proxyAdmin = new ProxyAdmin();

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

        console.log("=== IndexFactory ===");
        console.log("Implementation:", address(indexFactoryImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployIndexFactoryBalancer(string memory targetChain, address indexTokenProxy)
        internal
        returns (address)
    {
        uint64 currentChainSelector;
        address chainlinkToken;
        address router;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            currentChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("SEPOLIA_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            currentChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            chainlinkToken = vm.envAddress("ARBITRUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ARBITRUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for IndexFactoryBalancer");
        }

        IndexFactoryBalancer indexFactoryBalancerImplementation = new IndexFactoryBalancer();
        ProxyAdmin proxyAdmin = new ProxyAdmin();

        bytes memory data = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address)",
            currentChainSelector,
            payable(indexTokenProxy),
            chainlinkToken,
            router,
            wethAddress
        );

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(indexFactoryBalancerImplementation), address(proxyAdmin), data);

        console.log("=== IndexFactoryBalancer ===");
        console.log("Implementation:", address(indexFactoryBalancerImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployVault() internal returns (address) {
        ProxyAdmin proxyAdmin = new ProxyAdmin();
        Vault vaultImplementation = new Vault();

        bytes memory data = abi.encodeWithSignature("initialize()");

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(proxyAdmin), data);

        console.log("=== Vault ===");
        console.log("Implementation:", address(vaultImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployPriceOracle() internal returns (address) {
        address deployed = _deployByteCode(priceOracleByteCode);

        console.log("=== PriceOracle ===");
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

    function _linkContracts(
        address indexFactoryStorageProxy,
        address indexFactoryProxy,
        address indexTokenProxy,
        address vaultProxy,
        address priceOracle,
        address indexFactoryBalancerProxy
    ) internal {
        uint64 otherChainSelector = 999; // e.g. 999 for demonstration
        address mainCrossChainTokenAddress = 0x000000000000000000000000000000000000dEaD; // placeholder

        address[] memory path = new address[](2);
        path[0] = 0x0000000000000000000000000000000000000000; // WETH or whatever
        path[1] = mainCrossChainTokenAddress;
        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        address crossChainFactoryProxy = 0x000000000000000000000000000000000000bEEF; // placeholder

        IndexFactoryStorage(indexFactoryStorageProxy).setCrossChainToken(
            otherChainSelector, mainCrossChainTokenAddress, path, feesData
        );
        IndexFactoryStorage(indexFactoryStorageProxy).setCrossChainFactory(crossChainFactoryProxy, otherChainSelector);
        IndexFactoryStorage(indexFactoryStorageProxy).setIndexFactory(indexFactoryProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setPriceOracle(priceOracle);
        IndexFactoryStorage(indexFactoryStorageProxy).setVault(vaultProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setIndexFactoryBalancer(indexFactoryBalancerProxy);
        IndexFactory(payable(indexFactoryProxy)).setIndexFactoryStorage(indexFactoryStorageProxy);
        IndexToken(payable(indexTokenProxy)).setMinter(indexFactoryProxy, true);

        console.log("=== LINKING COMPLETE ===");
    }
}
