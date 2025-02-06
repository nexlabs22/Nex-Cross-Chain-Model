// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";

import "../../../../contracts/vault/CrossChainFactory.sol";
import "../../../../contracts/vault/Vault.sol";

/**
 * @title CombinedSetCrossChainValues
 * @notice This script unifies:
 *   - SetCrossChainFactoryValues
 *   - SetVaultValues
 *
 *   It reads environment variables depending on the chain ("sepolia" or "arbitrum_mainnet")
 *   and calls the relevant setter functions:
 *     1) CrossChainIndexFactory.setCrossChainToken()
 *     2) CrossChainIndexFactory.setPriceOracle()
 *     3) Vault.setOperator()
 *
 *   Modify the `targetChain` in `run()` as needed, or adjust environment references
 *   to match your setup.
 */
contract CombinedSetCrossChainValues is Script, Test {
    function run() external {
        // 1. Load your private key from env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 2. Start broadcast
        vm.startBroadcast(deployerPrivateKey);

        // 3. Decide which chain environment to use:
        string memory targetChain = "arbitrum_sepolia";
        // or "arbitrum_mainnet"

        // 4. Call the two internal set-value functions
        _setCrossChainFactoryValues(targetChain);
        _setVaultValues(targetChain);

        // 5. Stop broadcast
        vm.stopBroadcast();

        console.log("All cross-chain set operations completed successfully!");
    }

    // ------------------------------------------------------------------------
    // 1) CROSS CHAIN FACTORY VALUES
    // ------------------------------------------------------------------------
    function _setCrossChainFactoryValues(string memory targetChain) internal {
        // Local variables from your original script
        address crossChainFactoryProxy;
        address priceOracle;
        uint64 chainSelector;
        address crossChainToken;
        address weth;

        // Load from env based on chain
        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            // ARBITRUM_SEPOLIA addresses stored under "sepolia" environment logic
            crossChainFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ARBITRUM_SEPOLIA_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("SEPOLIA_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ARBITRUM_SEPOLIA_WETH_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            // ETHEREUM addresses stored under "arbitrum_mainnet" environment logic
            crossChainFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
            priceOracle = vm.envAddress("ETHEREUM_PRICE_ORACLE");
            chainSelector = uint64(vm.envUint("ARBITRUM_CHAIN_SELECTOR"));
            crossChainToken = vm.envAddress("ETHEREUM_CROSS_CHAIN_TOKEN_ADDRESS");
            weth = vm.envAddress("ETHEREUM_WETH_ADDRESS");
        } else {
            revert("Unsupported target chain for _setCrossChainFactoryValues");
        }

        // Build path + fees
        uint24[] memory feesData = new uint24[](1);
        feesData[0] = 3000;

        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = crossChainToken;

        // Perform the calls
        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setCrossChainToken(
            chainSelector, crossChainToken, path, feesData
        );
        CrossChainIndexFactory(payable(crossChainFactoryProxy)).setPriceOracle(priceOracle);

        console.log("Done: _setCrossChainFactoryValues()");
    }

    // ------------------------------------------------------------------------
    // 2) VAULT VALUES
    // ------------------------------------------------------------------------
    function _setVaultValues(string memory targetChain) internal {
        address crossChainVault;
        address crossChainIndexFactoryProxy;

        if (keccak256(bytes(targetChain)) == keccak256("arbitrum_sepolia")) {
            crossChainVault = vm.envAddress("ARBITRUM_SEPOLIA_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ARBITRUM_SEPOLIA_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else if (keccak256(bytes(targetChain)) == keccak256("ethereum_mainnet")) {
            crossChainVault = vm.envAddress("ETHEREUM_VAULT_PROXY_ADDRESS");
            crossChainIndexFactoryProxy = vm.envAddress("ETHEREUM_CROSS_CHAIN_FACTORY_PROXY_ADDRESS");
        } else {
            revert("Unsupported target chain for _setVaultValues");
        }

        // Set the crossChainIndexFactoryProxy as operator in the Vault
        Vault(crossChainVault).setOperator(crossChainIndexFactoryProxy, true);

        console.log("Done: _setVaultValues()");
    }
}
