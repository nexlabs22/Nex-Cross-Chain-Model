// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../../../contracts/factory/IndexFactory.sol";
import "../../../contracts/token/IndexToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnchainTest is Script {
    IndexToken indexToken;

    // Mainnet
    // address user = vm.envAddress("USER");
    // address weth = vm.envAddress("ARBITRUM_WETH_ADDRESS");
    // address usdt = vm.envAddress("SEPOLIA_USDC_ADDRESS");
    // address indexFactoryProxy = vm.envAddress("ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
    // address indexTokenProxy = vm.envAddress("ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");

    // Testnet
    address user = vm.envAddress("USER");
    address weth = vm.envAddress("SEPOLIA_WETH_ADDRESS");
    address usdt = vm.envAddress("SEPOLIA_USDT_ADDRESS");
    address indexFactoryProxy = vm.envAddress("SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
    address indexTokenProxy = vm.envAddress("SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        indexToken = IndexToken(payable(indexTokenProxy));

        // string memory targetChain = "sepolia";

        // Issuance With ETH
        issuanceAndRedemptionWithEth();

        // Issuance with ERC20 Token
        // issuanceAndRedemptionWithUsdt();

        vm.stopBroadcast();
    }

    function issuanceAndRedemptionWithEth() public {
        IndexFactory(payable(indexFactoryProxy)).issuanceIndexTokensWithEth{value: (1e14 * 1001) / 1000}(1e14, 0);

        // address[] memory path = new address[](2);
        // path[0] = weth;
        // path[1] = usdt;
        // uint24[] memory fees = new uint24[](1);
        // fees[0] = 3000;

        // IndexFactory(payable(indexFactoryProxy)).redemption(
        //     indexToken.balanceOf(address(user)), 0, address(weth), path, fees
        // );
    }

    // function issuanceAndRedemptionWithUsdt() public {
    //     IERC20(usdt).approve(address(indexFactoryProxy), 1001e18);

    //     address[] memory path = new address[](2);
    //     path[0] = address(usdt);
    //     path[1] = address(weth);
    //     uint24[] memory fees = new uint24[](1);
    //     fees[0] = 3000;

    //     // IndexFactory(payable(indexFactoryProxy)).issuanceIndexTokens(address(usdt), path0, fees0, 100e18);
    //     IndexFactory(payable(indexFactoryProxy)).issuanceIndexTokens(address(usdt), path, fees, 1000e18, 0);

    //     IndexFactory(payable(indexFactoryProxy)).redemption(indexToken.balanceOf(address(user)), 0, address(usdt), path2, fees2);
    // }
}
