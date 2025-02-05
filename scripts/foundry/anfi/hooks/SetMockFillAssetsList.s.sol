// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";
import {IndexFactoryStorage} from "../../../contracts/factory/IndexFactoryStorage.sol";

contract SetMockFillAssetsList is Script {
    // Mainnet
    address indexFactoryStorageProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");

    // Testnet
    // address indexFactoryStorageProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Mainnet Mock
        fillMockAssetsListMainnet();

        // Testnet Mock
        // fillMockAssetsListTestnet();

        vm.stopBroadcast();

        console.log("Values set successfully.");
    }

    function fillMockAssetsListMainnet() internal {
        // address wethAddress = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

        address[] memory assetList = new address[](2);
        assetList[0] = 0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8; // BITCOIN
        assetList[1] = 0x6694340fc020c5E6B96567843da2df01b2CE1eb6; // XAUT

        uint256[] memory marketShares = new uint256[](2);
        marketShares[0] = 280000000000000000;
        marketShares[1] = 230000000000000000;

        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        bytes[] memory pathData = new bytes[](2);
        for (uint256 i = 0; i < 2; i++) {
            address[] memory path = new address[](2);
            path[0] = wethAddress;
            path[1] = assetList[i];
            pathData[i] = abi.encode(path, feesData);
        }

        IndexFactoryStorage(indexFactoryStorageProxy).mockFillAssetsList(assetList, pathData, marketShares);

        console.log("Called mockFillAssetsList() with your 2 assets data.");
    }

    // function fillMockAssetsListTestnet() internal {
    //     address[] memory assetList = new address[](2);
    //     assetList[0] = 0x9CD4f9Bec89e00A560840174Dc8054Fb4b3e1858; // sepoliaBitcoin
    //     assetList[1] = 0x8B0D01137979e409Bba15098aA5665c647774003; // arbSepoliaVaut

    //     uint256[] memory marketShares = new uint256[](2);
    //     marketShares[0] = 15000000000000000000; // 15e18
    //     marketShares[1] = 12500000000000000000; // 12.5e18

    //     uint24[] memory feesData = new uint24[](1);
    //     feesData[0] = 3000;

    //     bytes[] memory pathData = new bytes[](11);
    //     for (uint256 i = 0; i < 2; i++) {
    //         address[] memory path = new address[](2);
    //         path[0] = wethAddress;
    //         path[1] = assetList[i];
    //         pathData[i] = abi.encode(path, feesData);
    //     }

    //     IndexFactoryStorage(indexFactoryStorageProxy).mockFillAssetsList(
    //         assetList, pathData, marketShares
    //     );

    //     console.log("Called mockFillAssetsList() with your 2 assets data.");
    // }
}
