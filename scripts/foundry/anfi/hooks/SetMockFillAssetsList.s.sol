// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import "../../../../contracts/factory/FunctionsOracle.sol";

contract SetMockFillAssetsList is Script {
    uint64 mainChainSelector;
    uint64 otherChainSelector;
    address functionsOracleProxy;
    address wethAddress;

    function run() public {
        string memory targetChain = "sepolia";

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            functionsOracleProxy = vm.envAddress("SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            mainChainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            otherChainSelector = uint64(vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            functionsOracleProxy = vm.envAddress("ARBITRUM_FUNCTIONS_ORACLE_PROXY_ADDRESS");
            mainChainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            otherChainSelector = uint64(vm.envUint("ETHEREUM_CHAIN_SELECTOR"));
            wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain");
        }

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
            fillMockAssetsListTestnet();
        } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
            fillMockAssetsListMainnet();
        } else {
            revert("Unsupported target chain");
        }

        vm.stopBroadcast();

        console.log("Values set successfully.");
    }

    function fillMockAssetsListMainnet() internal {
        address[] memory assetList = new address[](2);
        assetList[0] = 0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f; // BITCOIN
        assetList[1] = 0x68749665FF8D2d112Fa859AA293F07A622782F38; // XAUT

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 70000000000000000000;
        marketShares[1] = 30000000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = mainChainSelector; // arbitrum
        chainSelectors[1] = otherChainSelector; // ethereum

        bytes[] memory pathData = new bytes[](2);
        for (uint256 i = 0; i < 2; i++) {
            address[] memory path = new address[](2);
            path[0] = wethAddress;
            path[1] = assetList[i];
            pathData[i] = abi.encode(path, feesData);
        }

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);

        console.log("Called mockFillAssetsList() with your 2 assets data.");
    }

    function fillMockAssetsListTestnet() internal {
        address[] memory assetList = new address[](2);
        assetList[0] = 0x6Ea5aD162d5b74Bc9e4C3e4eEB18AE6861407221; // sepoliaBitcoin
        assetList[1] = 0x8B0D01137979e409Bba15098aA5665c647774003; // arbSepoliaXaut

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 70000000000000000000;
        marketShares[1] = 30000000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        uint64[] memory chainSelectors = new uint64[](2);
        chainSelectors[0] = mainChainSelector; // sepolia
        chainSelectors[1] = otherChainSelector; // arb sepolia

        bytes[] memory pathData = new bytes[](11);
        for (uint256 i = 0; i < 2; i++) {
            address[] memory path = new address[](2);
            path[0] = wethAddress;
            path[1] = assetList[i];
            pathData[i] = abi.encode(path, feesData);
        }

        FunctionsOracle(functionsOracleProxy).mockFillAssetsList(assetList, pathData, marketShares, chainSelectors);

        console.log("Called mockFillAssetsList() with your 2 assets data.");
    }
}
