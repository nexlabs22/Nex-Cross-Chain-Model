// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.20;

// import {Script} from "forge-std/Script.sol";
// import {console} from "forge-std/Test.sol";

// // Import interfaces for your deployed contracts (adjust the paths as needed)
// import "../../../../contracts/token/IndexToken.sol";
// import "../../../../contracts/factory/IndexFactory.sol";
// import "../../../../contracts/factory/IndexFactoryStorage.sol";
// import "../../../../contracts/vault/Vault.sol";
// import "../../../../contracts/vault/CrossChainFactory.sol";
// import "../../../../contracts/factory/IndexFactoryBalancer.sol";
// import "../../../../contracts/vault/CrossChainVault.sol";

// contract SetContractsRelationsWithTargetChain is Script {
//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

//         // Get the target chain from environment or set it manually.
//         // Valid values: "sepolia", "arbitrum_sepolia", "arbitrum_mainnet", "ethereum_mainnet"
//         string memory targetChain = vm.envString("TARGET_CHAIN");
//         // For example, for testnet main chain:
//         // string memory targetChain = "sepolia";

//         // ------------------------------
//         // Read the deployed contract addresses based on the target chain.
//         // ------------------------------
//         address indexTokenAddress;
//         address indexFactoryAddress;
//         address indexFactoryStorageAddress;
//         address vaultAddress;
//         address crossChainFactoryAddress;
//         address crossChainVaultAddress;
//         address indexFactoryBalancerAddress;
//         address wethAddress;
//         address priceOracleAddress;

//         // Instead of a single cross-chain token address, we now load two:
//         // one for the main chain and one for the other chain.
//         address mainChainCrossChainTokenAddress;
//         address otherChainCrossChainTokenAddress;

//         if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
//             indexTokenAddress = vm.envAddress("SEPOLIA_INDEX_TOKEN_ADDRESS");
//             indexFactoryAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_ADDRESS");
//             indexFactoryStorageAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_STORAGE_ADDRESS");
//             vaultAddress = vm.envAddress("SEPOLIA_VAULT_ADDRESS");
//             crossChainFactoryAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_FACTORY_ADDRESS");
//             crossChainVaultAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_VAULT_ADDRESS");
//             indexFactoryBalancerAddress = vm.envAddress("SEPOLIA_INDEX_FACTORY_BALANCER_ADDRESS");
//             // For testnet main chain (Sepolia), the main chain token comes from Sepolia...
//             mainChainCrossChainTokenAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
//             // ...and the other chain token comes from Arbitrum Sepolia.
//             otherChainCrossChainTokenAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
//             wethAddress = vm.envAddress("SEPOLIA_WETH_ADDRESS");
//             priceOracleAddress = vm.envAddress("SEPOLIA_PRICE_ORACLE_ADDRESS");
//         } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
//             indexTokenAddress = vm.envAddress("ARBITRUM_SEPOLIA_INDEX_TOKEN_ADDRESS");
//             indexFactoryAddress = vm.envAddress("ARBITRUM_SEPOLIA_INDEX_FACTORY_ADDRESS");
//             indexFactoryStorageAddress = vm.envAddress("ARBITRUM_SEPOLIA_INDEX_FACTORY_STORAGE_ADDRESS");
//             vaultAddress = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_ADDRESS");
//             crossChainFactoryAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_ADDRESS");
//             crossChainVaultAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_VAULT_ADDRESS");
//             indexFactoryBalancerAddress = vm.envAddress("ARBITRUM_SEPOLIA_INDEX_FACTORY_BALANCER_ADDRESS");
//             // If running on Arbitrum Sepolia as the target, you might reverse the assignment:
//             mainChainCrossChainTokenAddress = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
//             otherChainCrossChainTokenAddress = vm.envAddress("SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
//             wethAddress = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
//             priceOracleAddress = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE_ADDRESS");
//         } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
//             indexTokenAddress = vm.envAddress("ARBITRUM_INDEX_TOKEN_ADDRESS");
//             indexFactoryAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_ADDRESS");
//             indexFactoryStorageAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_STORAGE_ADDRESS");
//             vaultAddress = vm.envAddress("ARBITRUM_VAULT_ADDRESS");
//             crossChainFactoryAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_FACTORY_ADDRESS");
//             crossChainVaultAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_VAULT_ADDRESS");
//             indexFactoryBalancerAddress = vm.envAddress("ARBITRUM_INDEX_FACTORY_BALANCER_ADDRESS");
//             // For mainnet, when using Arbitrum as the main chain:
//             mainChainCrossChainTokenAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_TOKEN_ADDRESS");
//             otherChainCrossChainTokenAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
//             wethAddress = vm.envAddress("ARBITRUM_WETH_ADDRESS");
//             priceOracleAddress = vm.envAddress("ARBITRUM_PRICE_ORACLE_ADDRESS");
//         } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
//             indexTokenAddress = vm.envAddress("ETHEREUM_INDEX_TOKEN_ADDRESS");
//             indexFactoryAddress = vm.envAddress("ETHEREUM_INDEX_FACTORY_ADDRESS");
//             indexFactoryStorageAddress = vm.envAddress("ETHEREUM_INDEX_FACTORY_STORAGE_ADDRESS");
//             vaultAddress = vm.envAddress("ETHEREUM_VAULT_ADDRESS");
//             crossChainFactoryAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_ADDRESS");
//             crossChainVaultAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_VAULT_ADDRESS");
//             indexFactoryBalancerAddress = vm.envAddress("ETHEREUM_INDEX_FACTORY_BALANCER_ADDRESS");
//             // For Ethereum Mainnet target, you might use Ethereum's cross-chain token as main
//             // and Arbitrum's as the other, or vice versa. Here we choose:
//             mainChainCrossChainTokenAddress = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
//             otherChainCrossChainTokenAddress = vm.envAddress("ARBITRUM_CROSS_CHAIN_TOKEN_ADDRESS");
//             wethAddress = vm.envAddress("ETHEREUM_WETH_ADDRESS");
//             priceOracleAddress = vm.envAddress("ETHEREUM_PRICE_ORACLE_ADDRESS");
//         } else {
//             revert("Unsupported target chain");
//         }

//         // ------------------------------
//         // Read chain selector values from the environment.
//         // (When the chain selector is 1 it means it's the main chain; 2 means other chain.)
//         // ------------------------------
//         uint64 sepoliaChainSelector = vm.envUint("SEPOLIA_CHAIN_SELECTOR");
//         uint64 arbitrumSepoliaChainSelector = vm.envUint("ARBITRUM_SEPOLIA_CHAIN_SELECTOR");
//         uint64 arbitrumMainnetChainSelector = vm.envUint("ARBITRUM_CHAIN_SELECTOR");
//         uint64 ethereumMainnetChainSelector = vm.envUint("ETHEREUM_CHAIN_SELECTOR");

//         // Determine which chain selectors to use for linking.
//         // For testnet, we assume the main chain is "sepolia" and the other chain is "arbitrum_sepolia".
//         // For mainnet, we assume the main chain is "arbitrum_mainnet" and the other chain is "ethereum_mainnet".
//         uint64 mainChainSelector;
//         uint64 otherChainSelector;
//         if (keccak256(bytes(targetChain)) == keccak256("sepolia")) {
//             mainChainSelector = sepoliaChainSelector; // should be 1
//             otherChainSelector = arbitrumSepoliaChainSelector; // should be 2
//         } else if (keccak256(bytes(targetChain)) == keccak256("arbitrum_mainnet")) {
//             mainChainSelector = arbitrumMainnetChainSelector; // should be 1
//             otherChainSelector = ethereumMainnetChainSelector; // should be 2
//         } else {
//             // For linking, we expect the script to be run on a main chain.
//             revert("Linking script should run on a main chain (sepolia or arbitrum_mainnet).");
//         }

//         // ------------------------------
//         // Instantiate the contract interfaces.
//         // ------------------------------
//         IndexToken indexToken = IndexToken(indexTokenAddress);
//         IndexFactory indexFactory = IndexFactory(indexFactoryAddress);
//         IndexFactoryStorage indexFactoryStorage = IndexFactoryStorage(indexFactoryStorageAddress);
//         Vault vault = Vault(vaultAddress);
//         CrossChainFactory crossChainIndexFactory = CrossChainFactory(crossChainFactoryAddress);
//         CrossChainVault crossChainVault = CrossChainVault(crossChainVaultAddress);
//         IndexFactoryBalancer indexFactoryBalancer = IndexFactoryBalancer(indexFactoryBalancerAddress);

//         // ------------------------------
//         // Prepare fee data and path for cross-chain token settings.
//         // ------------------------------
//         uint24[] memory feesData = new uint24[](1);
//         feesData[0] = 3000; // Example fee value.
//         address[] memory path = new address[](2);
//         path[0] = wethAddress;
//         // For the swap path we use the main chain cross-chain token address.
//         path[1] = mainChainCrossChainTokenAddress;

//         vm.startBroadcast(deployerPrivateKey);

//         // 1. Set indexToken's minter: allow indexFactory to mint tokens.
//         indexToken.setMinter(address(indexFactory), true);
//         console.log("indexToken: set minter to indexFactory");

//         // 2. Configure cross-chain token settings in indexFactoryStorage.
//         // Set one entry for the secondary chain (using the other chain selector)
//         // and one for the main chain (using the main chain selector).
//         indexFactoryStorage.setCrossChainToken(otherChainSelector, otherChainCrossChainTokenAddress, path, feesData);
//         indexFactoryStorage.setCrossChainToken(mainChainSelector, mainChainCrossChainTokenAddress, path, feesData);
//         console.log(
//             "indexFactoryStorage: set cross-chain token for chain selectors %s (main) and %s (other)",
//             mainChainSelector,
//             otherChainSelector
//         );

//         // 3. Set the crossChainFactory address in indexFactoryStorage using the other chain selector.
//         indexFactoryStorage.setCrossChainFactory(crossChainFactoryAddress, otherChainSelector);
//         console.log("indexFactoryStorage: set cross-chain factory for selector %s", otherChainSelector);

//         // 4. Link the indexFactory address in indexFactoryStorage.
//         indexFactoryStorage.setIndexFactory(indexFactoryAddress);
//         console.log("indexFactoryStorage: set indexFactory address");

//         // 5. Set the price oracle address in indexFactoryStorage.
//         indexFactoryStorage.setPriceOracle(priceOracleAddress);
//         console.log("indexFactoryStorage: set price oracle");

//         // 6. Set the vault address in indexFactoryStorage.
//         indexFactoryStorage.setVault(vaultAddress);
//         console.log("indexFactoryStorage: set vault address");

//         // 7. Set the operator for the vault to allow indexFactory.
//         vault.setOperator(address(indexFactory), true);
//         console.log("vault: set operator indexFactory");

//         // 8. Configure indexFactory to point to indexFactoryStorage.
//         indexFactory.setIndexFactoryStorage(indexFactoryStorageAddress);
//         console.log("indexFactory: set indexFactoryStorage address");

//         // 9. Configure crossChainIndexFactory with cross-chain token settings.
//         // Here we use the mainChainSelector.
//         crossChainIndexFactory.setCrossChainToken(mainChainSelector, mainChainCrossChainTokenAddress, path, feesData);
//         crossChainIndexFactory.setPriceOracle(priceOracleAddress);
//         console.log(
//             "crossChainIndexFactory: set cross-chain token and price oracle with selector %s", mainChainSelector
//         );

//         // 10. Set the operator of crossChainVault to be crossChainIndexFactory.
//         crossChainVault.setOperator(address(crossChainIndexFactory), true);
//         console.log("crossChainVault: set operator to crossChainIndexFactory");

//         // 11. Also, set the operator of the main vault to indexFactoryBalancer.
//         vault.setOperator(address(indexFactoryBalancer), true);
//         console.log("vault: set operator indexFactoryBalancer");

//         // 12. Finally, link the indexFactoryBalancer address in indexFactoryStorage.
//         indexFactoryStorage.setIndexFactoryBalancer(indexFactoryBalancerAddress);
//         console.log("indexFactoryStorage: set indexFactoryBalancer address");

//         vm.stopBroadcast();
//     }
// }
