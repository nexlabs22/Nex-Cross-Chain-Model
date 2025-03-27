// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../../../contracts/factory/IndexFactoryStorage.sol";
import "../../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";
import "../../../../../contracts/token/IndexToken.sol";

/**
    forge script scripts/foundry/crypto5/hooks/utils/getIndexTokenPrice.s.sol
*/
contract getIndexTokenPrice is Script {
    string public arbitrumRpc;
    string public bscRpc;
    uint256 arbFork;
    uint256 bscFork;

    address indexFactoryStorage;
    address weth;
    address wbnb;
    address vaultOnArb;
    address vaultOnBsc;
    address crossChainFactoryStorage;
    address indexToken;

    function run() external {
        arbitrumRpc = vm.envString("ARBITRUM_RPC_URL");
        bscRpc = vm.envString("BSC_RPC_URL");

        indexFactoryStorage = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        crossChainFactoryStorage = vm.envAddress("BSC_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        weth = vm.envAddress("CR5_WETH_ADDRESS");
        wbnb = vm.envAddress("CR5_WBNB_ADDRESS");
        vaultOnArb = vm.envAddress("CR5_ARBITRUM_VAULT_PROXY_ADDRESS");
        vaultOnBsc = vm.envAddress("BSC_VAULT_PROXY_ADDRESS");
        indexToken = vm.envAddress("CR5_ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");

        arbFork = vm.createFork(arbitrumRpc);
        vm.selectFork(arbFork);

        address[] memory arbTokens = getArbitrumUnderlyingAsset();

        uint256 wethValuesOnArb =
            checkMultipleTokenBalancesForArbitrum(arbTokens, vaultOnArb, indexFactoryStorage, weth);

        uint256 totalSupply = IndexToken(payable(indexToken)).totalSupply();

        bscFork = vm.createFork(bscRpc);
        vm.selectFork(bscFork);

        address[] memory bscTokens = getBscUnderlyingAsset();

        uint256 wethValuesOnBsc =
            checkMultipleTokenBalancesForBsc(bscTokens, vaultOnBsc, crossChainFactoryStorage, wbnb);

        uint256 totalValue = wethValuesOnArb + wethValuesOnBsc;
        // uint256 indexTokenPrice = totalValue / totalSupply * 1e18;
        uint256 indexTokenPrice = (totalValue * 1e18) / totalSupply;

        console.log("Index Token price: ", indexTokenPrice);
    }

    function checkMultipleTokenBalancesForArbitrum(
        address[] memory tokens,
        address vaultAddress,
        address sourceAddress,
        address weth
    ) public view returns (uint256) {
        uint256 totalValue;

        uint256 ethPrice = IndexFactoryStorage(sourceAddress).priceInWei();

        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(vaultAddress);

            address[] memory path = new address[](2);
            path[0] = address(token);
            path[1] = address(weth);

            uint24[] memory fee = new uint24[](1);
            fee[0] = 100;

            if (address(token) != weth) {
                uint256 valuesInWeth = IndexFactoryStorage(sourceAddress).getAmountOut(path, fee, balance);
                totalValue += valuesInWeth;
            } else {
                totalValue += balance;
            }

            console.log("Token:", tokens[i]);
            console.log("Balance:", balance);
            console.log("-------------------------------------");
        }

        uint256 totalValueInUsd = totalValue * ethPrice / 1e18;

        console.log("Total Values: ", totalValueInUsd);

        return totalValueInUsd;
    }

    function checkMultipleTokenBalancesForBsc(
        address[] memory tokens,
        address vaultAddress,
        address sourceAddress,
        address weth
    ) public view returns (uint256) {
        uint256 totalValue;

        uint256 ethPrice = CrossChainIndexFactoryStorage(sourceAddress).priceInWei();

        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(vaultAddress);

            address[] memory path = new address[](2);
            path[0] = address(token);
            path[1] = address(weth);

            uint24[] memory fee = new uint24[](1);
            fee[0] = 2500;

            if (address(token) != weth) {
                uint256 valuesInWeth = CrossChainIndexFactoryStorage(sourceAddress).getAmountOut(path, fee, balance);
                totalValue += valuesInWeth;
            } else {
                totalValue += balance;
            }

            console.log("-------------------------------------");
            console.log("Token:", tokens[i]);
            console.log("Balance:", balance);
            console.log("-------------------------------------");
        }

        uint256 totalValueInUsd = totalValue * ethPrice / 1e18;

        console.log("Total Values: ", totalValueInUsd);

        return totalValueInUsd;
    }

    function getArbitrumUnderlyingAsset() public view returns (address[] memory) {
        address[] memory tokens = new address[](2);
        tokens[0] = vm.envAddress("CR5_BITCOIN_ADDRESS");
        tokens[1] = vm.envAddress("CR5_WETH_ADDRESS");

        return tokens;
    }

    function getBscUnderlyingAsset() public view returns (address[] memory) {
        address[] memory tokens = new address[](3);
        tokens[0] = vm.envAddress("CR5_XRP_ADDRESS");
        tokens[1] = vm.envAddress("CR5_SOLANA_ADDRESS");
        tokens[2] = vm.envAddress("CR5_WBNB_ADDRESS");

        return tokens;
    }
}
