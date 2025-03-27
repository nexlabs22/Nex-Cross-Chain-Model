// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../../../contracts/factory/IndexFactoryStorage.sol";
import "../../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";
import "../../../../../contracts/token/IndexToken.sol";

contract getIndexTokenPrice is Script {
    string public arbitrumRpc;
    string public ethRpc;
    uint256 arbFork;
    uint256 ethFork;

    address indexFactoryStorage;
    address wethOnArbitrum;
    address wethOnEthereum;
    address vaultOnArb;
    address vaultOnEth;
    address crossChainFactoryStorage;
    address indexToken;
    address usdt;

    function run() external {
        arbitrumRpc = vm.envString("ARBITRUM_RPC_URL");
        ethRpc = vm.envString("ETHEREUM_RPC_URL");

        indexFactoryStorage = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        crossChainFactoryStorage = vm.envAddress("ETHEREUM_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        wethOnArbitrum = vm.envAddress("ARBITRUM_WETH_ADDRESS");
        wethOnEthereum = vm.envAddress("ETHEREUM_WETH_ADDRESS");
        vaultOnArb = vm.envAddress("ARBITRUM_VAULT_PROXY_ADDRESS");
        vaultOnEth = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
        indexToken = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");
        usdt = vm.envAddress("ETHEREUM_USDT_ADDRESS");

        arbFork = vm.createFork(arbitrumRpc);
        vm.selectFork(arbFork);

        address[] memory arbTokens = getArbitrumUnderlyingAsset();

        uint256 wethValuesOnArb =
            testCheckMultipleTokenBalancesForArbitrum(arbTokens, vaultOnArb, indexFactoryStorage, wethOnArbitrum);

        uint256 totalSupply = IndexToken(payable(indexToken)).totalSupply();

        ethFork = vm.createFork(ethRpc);
        vm.selectFork(ethFork);

        address[] memory ethTokens = getEthUnderlyingAsset();

        uint256 wethValuesOnEth =
            testCheckMultipleTokenBalancesForEth(ethTokens, vaultOnEth, crossChainFactoryStorage, wethOnEthereum, usdt);

        uint256 totalValue = wethValuesOnArb + wethValuesOnEth;

        console.log("Total Value on both chains: ", totalValue);
        // uint256 indexTokenPrice = totalValue / totalSupply * 1e18;
        uint256 indexTokenPrice = (totalValue * 1e18) / totalSupply;

        console.log("Real total values: ", totalValue);
        console.log("Total supply: ", totalSupply);
        console.log("Index Token price: ", indexTokenPrice);

        uint256 burnAmount = totalSupply - (totalValue / 100);
        console.log("Burn Amount: ", burnAmount);
        uint256 newTotalSupply = totalSupply - burnAmount;
        console.log("New total supply: ", newTotalSupply);
        uint256 newPrice = (totalValue * 1e18) / newTotalSupply;
        console.log("New price: ", newPrice);
    }

    function testCheckMultipleTokenBalancesForArbitrum(
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

    function testCheckMultipleTokenBalancesForEth(
        address[] memory tokens,
        address vaultAddress,
        address sourceAddress,
        address weth,
        address usdt
    ) public view returns (uint256) {
        uint256 totalValue;

        uint256 ethPrice = CrossChainIndexFactoryStorage(sourceAddress).priceInWei();

        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(vaultAddress);

            address[] memory path = new address[](3);
            path[0] = address(token);
            path[1] = address(usdt);
            path[2] = address(weth);

            uint24[] memory fee = new uint24[](2);
            fee[0] = 3000;
            fee[1] = 500;

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
        address[] memory tokens = new address[](1);
        tokens[0] = vm.envAddress("ARBITRUM_BITCOIN_ADDRESS");

        return tokens;
    }

    function getEthUnderlyingAsset() public view returns (address[] memory) {
        address[] memory tokens = new address[](1);
        tokens[0] = vm.envAddress("ETHEREUM_XAUT_ADDRESS");

        return tokens;
    }
}
