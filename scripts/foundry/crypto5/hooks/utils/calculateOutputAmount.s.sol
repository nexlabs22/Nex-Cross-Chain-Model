// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../../../contracts/factory/FunctionsOracle.sol";
import "../../../../../contracts/factory/IndexFactoryStorage.sol";
import "../../../../../contracts/token/IndexToken.sol";
import "../../../../../contracts/vault/CrossChainIndexFactoryStorage.sol";

contract CalculateAmountOut is Script {
    string public sepoliaRpc;
    string public arbSepoliaRpc;
    uint256 sepoliaFork;
    uint256 arbSepoliaFork;

    address indexFactoryStorageProxy;
    address crossChainFactoryStorageProxy;
    address indexTokenProxy;
    address vaultOnSepoliaProxy;
    address vaultOnArbSepoliaProxy;
    address functionsOracleProxy;
    address wethOnSepolia;
    address wethOnArbSepolia;
    address crossChainTokenAddressOnSepolia;
    address crossChainTokenAddressOnArbSepolia;

    uint256 inputAmount = 1e16;
    uint256 totalNewPortfolioBalance;
    uint256 totalOldPortfolioBalance;

    function run() external {
        sepoliaRpc = vm.envString("ETHEREUM_SEPOLIA_RPC_URL");
        arbSepoliaRpc = vm.envString("ARBITRUM_SEPOLIA_RPC_URL");

        indexFactoryStorageProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        crossChainFactoryStorageProxy =
            vm.envAddress("CR5_ARBITRUM_SEPOLIA_CROSS_CHAIN_INDEX_FACTORY_STORAGE_PROXY_ADDRESS");
        wethOnSepolia = vm.envAddress("SEPOLIA_WETH_ADDRESS");
        wethOnArbSepolia = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        vaultOnSepoliaProxy = vm.envAddress("CR5_SEPOLIA_VAULT_PROXY_ADDRESS");
        vaultOnArbSepoliaProxy = vm.envAddress("CR5_ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
        indexTokenProxy = vm.envAddress("CR5_SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
        functionsOracleProxy = vm.envAddress("CR5_SEPOLIA_FUNCTIONS_ORACLE_PROXY_ADDRESS");
        crossChainTokenAddressOnSepolia = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
        crossChainTokenAddressOnArbSepolia = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");

        sepoliaFork = vm.createFork(sepoliaRpc);
        vm.selectFork(sepoliaFork);

        uint256 portfolioBalance = IndexFactoryStorage(indexFactoryStorageProxy).getPortfolioBalance();
        console.log("Portfolio Balance: ", portfolioBalance);
        // vm.selectFork(sepoliaFork);

        address[] memory sepoliaTokens = getSepoliaUnderlyingAsset();
        calculateAmountsOnSepolia(sepoliaTokens, vaultOnSepoliaProxy, wethOnSepolia);

        arbSepoliaFork = vm.createFork(arbSepoliaRpc);
        // vm.selectFork(arbSepoliaFork);

        address[] memory arbSepoliaTokens = getArbSepoliaUnderlyingAsset();
        calculateAmountsOnArbSepolia(arbSepoliaTokens, vaultOnArbSepoliaProxy, wethOnArbSepolia);

        uint256 price = caluclatePrice();
        console.log("Index Token prices", price);
    }

    function getCrossChainTokenOutputOnSepolia(address weth, uint256 amount) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = crossChainTokenAddressOnSepolia;

        uint24[] memory fee = new uint24[](1);
        fee[0] = 3000;

        uint256 valuesInWeth = IndexFactoryStorage(indexFactoryStorageProxy).getAmountOut(path, fee, amount);

        return valuesInWeth;
    }

    function getCrossChainTokenOutputOnArbSepolia(address weth, uint256 amount) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = crossChainTokenAddressOnArbSepolia;
        path[1] = address(weth);

        uint24[] memory fee = new uint24[](1);
        fee[0] = 3000;

        uint256 valuesInWeth =
            CrossChainIndexFactoryStorage(crossChainFactoryStorageProxy).getAmountOut(path, fee, amount);

        return valuesInWeth;
    }

    function calculateAmountsOnSepolia(address[] memory tokens, address vaultAddress, address weth)
        public
        returns (uint256)
    {
        vm.selectFork(sepoliaFork);

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 tradeValue;
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(vaultAddress);

            address[] memory path = new address[](2);
            path[0] = address(token);
            path[1] = address(weth);

            uint24[] memory fee = new uint24[](1);
            fee[0] = 3000;

            uint256 marketShare = FunctionsOracle(payable(functionsOracleProxy)).tokenCurrentMarketShare(address(token));

            uint256 valuesInWeth;

            if (address(token) != weth) {
                valuesInWeth = IndexFactoryStorage(indexFactoryStorageProxy).getAmountOut(path, fee, balance);
                tradeValue = (inputAmount * marketShare) / 100e18;
            } else {
                valuesInWeth = balance;
                tradeValue = (inputAmount * marketShare) / 100e18;
            }
            console.log("Sepolia trade value: ", tradeValue);
            console.log("Sepolia value in weth: ", valuesInWeth);

            totalOldPortfolioBalance += valuesInWeth;
            totalNewPortfolioBalance += valuesInWeth;
            totalNewPortfolioBalance += tradeValue;
        }

        return totalNewPortfolioBalance;
    }

    function calculateAmountsOnArbSepolia(address[] memory tokens, address vaultAddress, address weth)
        public
        returns (uint256)
    {
        for (uint256 i = 0; i < tokens.length; i++) {
            vm.selectFork(arbSepoliaFork);

            uint256 tradeValue;
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(vaultAddress);
            console.log("Arb Sepolia vault balance: ", balance);

            address[] memory path = new address[](2);
            path[0] = address(token);
            path[1] = address(weth);

            uint24[] memory fee = new uint24[](1);
            fee[0] = 3000;

            uint256 valuesInWeth =
                CrossChainIndexFactoryStorage(crossChainFactoryStorageProxy).getAmountOut(path, fee, balance);

            console.log("Arb Sepolia value in weth: ", valuesInWeth);

            totalOldPortfolioBalance += valuesInWeth;

            vm.selectFork(sepoliaFork);

            uint256 marketShare = FunctionsOracle(payable(functionsOracleProxy)).tokenCurrentMarketShare(address(token));

            // Calclate real trade value
            tradeValue = (inputAmount * marketShare) / 100e18;
            console.log("Arb Sepolia trade value: ", tradeValue);

            uint256 crossChainAmount = getCrossChainTokenOutputOnSepolia(wethOnSepolia, tradeValue);

            vm.selectFork(arbSepoliaFork);
            uint256 subChainAmountOut = getCrossChainTokenOutputOnArbSepolia(weth, crossChainAmount);
            console.log("Sub Chain Amount out: ", subChainAmountOut);

            totalNewPortfolioBalance += valuesInWeth;
            totalNewPortfolioBalance += subChainAmountOut;
        }
    }

    function caluclatePrice() public returns (uint256) {
        vm.selectFork(sepoliaFork);

        uint256 oldTotalSupply = IndexToken(payable(indexTokenProxy)).totalSupply();
        console.log("Old total supply: ", oldTotalSupply);

        uint256 newTotalSupply = (oldTotalSupply * totalNewPortfolioBalance) / totalOldPortfolioBalance;
        console.log("New total supply: ", newTotalSupply);

        console.log("Old portfolio balance: ", totalOldPortfolioBalance);
        console.log("New portfolio balance: ", totalNewPortfolioBalance);
        uint256 mintAmount = newTotalSupply - oldTotalSupply;
        console.log("Mint amount", mintAmount);
        uint256 price = mintAmount / inputAmount;
        console.log("Price: ", price);
        return price;
    }

    function getSepoliaUnderlyingAsset() public pure returns (address[] memory) {
        address[] memory tokens = new address[](4);
        tokens[0] = 0x6Ea5aD162d5b74Bc9e4C3e4eEB18AE6861407221;
        tokens[1] = 0x3eb804cd437c27f5aEB6Be7AbbB32D21a69Ca49e;
        tokens[2] = 0x357ECA9754fDc02A9860973E261FB08DE0f3b094;
        tokens[3] = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;

        return tokens;
    }

    function getArbSepoliaUnderlyingAsset() public pure returns (address[] memory) {
        address[] memory tokens = new address[](1);
        tokens[0] = 0xf4A357354fab7DEAC6fAa1992d84138704C01f45;

        return tokens;
    }
}
