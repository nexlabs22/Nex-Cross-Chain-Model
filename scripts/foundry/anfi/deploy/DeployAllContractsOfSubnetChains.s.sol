// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {Vault} from "../../../../contracts/vault/Vault.sol";
import {CrossChainIndexFactory} from "../../../../contracts/vault/CrossChainFactory.sol";
import {PriceOracleByteCode} from "../../../../contracts/test/PriceOracleByteCode.sol";

contract DeployCrossChainVaultOracle is Script, Test, PriceOracleByteCode {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        string memory targetChain = "arbitrum_sepolia";

        address vaultProxy = _deployVault();

        address crossChainFactoryProxy = _deployCrossChainFactory(targetChain);

        address priceOracle = _deployPriceOracle();

        _linkContracts(targetChain, vaultProxy, crossChainFactoryProxy, priceOracle);

        vm.stopBroadcast();
    }

    function _deployVault() internal returns (address) {
        ProxyAdmin proxyAdmin = new ProxyAdmin();
        Vault vaultImplementation = new Vault();

        bytes memory initData = abi.encodeWithSignature("initialize()");

        TransparentUpgradeableProxy proxy =
            new TransparentUpgradeableProxy(address(vaultImplementation), address(proxyAdmin), initData);

        console.log("=== Vault Deployment ===");
        console.log("Vault Implementation:", address(vaultImplementation));
        console.log("Vault Proxy:", address(proxy));
        console.log("Vault ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployCrossChainFactory(string memory targetChain) internal returns (address) {
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
            router = vm.envAddress("ARBITRUM_SEPOLIA_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ARBITRUM_SEPOLIA_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ARBITRUM_SEPOLIA_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ARBITRUM_SEPOLIA_TO_USD_PRICE_FEED");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            vaultAddress = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
            chainlinkToken = vm.envAddress("ETHEREUM_CHAINLINK_TOKEN_ADDRESS");
            router = vm.envAddress("ETHEREUM_CCIP_ROUTER_ADDRESS");
            wethAddress = vm.envAddress("ETHEREUM_WETH_ADDRESS");
            swapRouterV3 = vm.envAddress("ETHEREUM_ROUTER_V3_ADDRESS");
            factoryV3 = vm.envAddress("ETHEREUM_FACTORY_V3_ADDRESS");
            swapRouterV2 = vm.envAddress("ETHEREUM_ROUTER_V2_ADDRESS");
            toUsdPriceFeed = vm.envAddress("ETHEREUM_TO_USD_PRICE_FEED");
        } else {
            revert("Unsupported target chain");
        }

        ProxyAdmin proxyAdmin = new ProxyAdmin();
        CrossChainIndexFactory crossChainFactoryImplementation = new CrossChainIndexFactory();

        bytes memory initData = abi.encodeWithSignature(
            "initialize(uint64,address,address,address,address,address,address,address,address)",
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
            new TransparentUpgradeableProxy(address(crossChainFactoryImplementation), address(proxyAdmin), initData);

        console.log("=== CrossChainFactory Deployment ===");
        console.log("Implementation:", address(crossChainFactoryImplementation));
        console.log("Proxy:", address(proxy));
        console.log("ProxyAdmin:", address(proxyAdmin));

        return address(proxy);
    }

    function _deployPriceOracle() internal returns (address) {
        address priceOracle = _deployByteCode(priceOracleByteCode);

        console.log("=== PriceOracle Deployment ===");
        console.log("PriceOracle Implementation:", priceOracle);

        return priceOracle;
    }

    function _deployByteCode(bytes memory bytecode) internal returns (address) {
        address deployed;
        assembly {
            deployed := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        return deployed;
    }

    function _linkContracts(
        string memory targetChain,
        address newVaultProxy,
        address crossChainFactoryProxy,
        address priceOracle
    ) internal {
        Vault(newVaultProxy).setOperator(crossChainFactoryProxy, true);
        console.log("Vault.setOperator() done for crossChainFactoryProxy");

        uint64 chainSelector;
        address crossChainToken;
        address wethAddress;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN");
            wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            chainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN");
            wethAddress = vm.envAddress("ETHEREUM_WETH_ADDRESS");
        } else {
            revert("Unsupported chain for linking");
        }

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        address[] memory path = new address[](2);
        path[0] = wethAddress; // from WETH
        path[1] = crossChainToken; // to crossChainToken

        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, feesData
        );
        console.log("CrossChainIndexFactory.setCrossChainToken() done");

        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setPriceOracle(priceOracle);
        console.log("CrossChainIndexFactory.setPriceOracle() done");

        console.log("=== All linking completed ===");
    }
}
