// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";

contract SetCrossChainFactoryValues is Script {
    address crossChainFactoryStorageProxy;
    address crossChainFactoryProxy;
    address priceOracle;
    uint64 chainSelector;
    address weth;
    address crossChainToken;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            crossChainFactoryStorageProxy =
                vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            crossChainFactoryStorageProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
            crossChainFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ETHEREUM_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ETHEREUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(crossChainToken);

        vm.startBroadcast(deployerPrivateKey);

        CrossChainIndexFactoryStorage(payable(crossChainFactoryStorageProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, feesData
        );
        CrossChainIndexFactoryStorage(payable(crossChainFactoryStorageProxy)).setPriceOracle(priceOracle);
        CrossChainIndexFactoryStorage(payable(crossChainFactoryStorageProxy)).setCrossChainFactory(
            crossChainFactoryProxy
        );

        vm.stopBroadcast();
    }
}
