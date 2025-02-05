// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import "../../../../contracts/vault/CrossChainFactory.sol";

contract SetCrossChainFactoryValues is Script {
    address crossChainFactoryProxy;
    address priceOracle;
    uint64 chainSelector;
    address weth;
    address crossChainToken;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
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

        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, feesData
        );
        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setPriceOracle(priceOracle);

        vm.stopBroadcast();
    }
}
