// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/factory/IndexFactoryStorage.sol";

contract SetIndexFactoryStorageValues is Script {
    address indexFactoryStorageProxy;
    address mainCrossChainTokenAddress;
    address otherCrossChainTokenAddress;
    address weth;
    address crossChainFactoryProxy;
    address indexFactoryProxy;
    uint64 mainChainSelector;
    uint64 otherChainSelector;
    address priceOracle;
    address vaultProxy;
    address indexFactoryBalancerProxy;
    address coreSenderProxy;
    address balancerSenderProxy;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            mainCrossChainTokenAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            otherCrossChainTokenAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            weth = vm.envAddress("SEPOLIA_WETH_ADDRESS");
            mainChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            otherChainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            indexFactoryProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("SEPOLIA_PRICE_ORACLE");
            vaultProxy = vm.envAddress("SEPOLIA_VAULT_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("SEPOLIA_CORE_SENDER_PROXY_ADDRESS");
            balancerSenderProxy = vm.envAddress("SEPOLIA_BALANCER_SENDER_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            mainCrossChainTokenAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_TOKEN_ADDRESS");
            otherCrossChainTokenAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
            crossChainFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADMIN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_WETH_ADDRESS");
            mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            otherChainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            indexFactoryProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_PRICE_ORACLE");
            vaultProxy = vm.envAddress("ARBITRUM_VAULT_PROXY_ADDRESS");
            indexFactoryBalancerProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");
            coreSenderProxy = vm.envAddress("ARBITRUM_CORE_SENDER_PROXY_ADDRESS");
            balancerSenderProxy = vm.envAddress("ARBITRUM_BALANCER_SENDER_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(mainCrossChainTokenAddress);

        vm.startBroadcast(deployerPrivateKey);

        IndexFactoryStorage(indexFactoryStorageProxy).setCrossChainToken(
            otherChainSelector, mainCrossChainTokenAddress, path, feesData
        );
        IndexFactoryStorage(indexFactoryStorageProxy).setCrossChainFactory(crossChainFactoryProxy, otherChainSelector);
        IndexFactoryStorage(indexFactoryStorageProxy).setIndexFactory(indexFactoryProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setPriceOracle(priceOracle);
        IndexFactoryStorage(indexFactoryStorageProxy).setVault(vaultProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setIndexFactoryBalancer(indexFactoryBalancerProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setCoreSender(coreSenderProxy);
        IndexFactoryStorage(indexFactoryStorageProxy).setBalancerSender(balancerSenderProxy);

        vm.stopBroadcast();
    }
}
