// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../../../contracts/factory/IndexFactory.sol";
import "../../../contracts/token/IndexToken.sol";
import "../../../contracts/factory/IndexFactoryBalancer.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnchainTest is Script {
    IndexToken indexToken;

    // // Mainnet
    address user = vm.envAddress("USER");
    address weth = vm.envAddress("ARBITRUM_WETH_ADDRESS");
    address usdc = vm.envAddress("ARBITRUM_USDC_ADDRESS");
    address indexFactoryProxy = vm.envAddress("CR5_ARBITRUM_INDEX_FACTORY_PROXY_ADDRESS");
    address indexTokenProxy = vm.envAddress("CR5_ARBITRUM_INDEX_TOKEN_PROXY_ADDRESS");

    // Testnet
    // address user = vm.envAddress("USER");
    // address weth = vm.envAddress("SEPOLIA_WETH_ADDRESS");
    // address usdc = vm.envAddress("SEPOLIA_USDT_ADDRESS");
    // address indexFactoryProxy = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_PROXY_ADDRESS");
    // address indexTokenProxy = vm.envAddress("CR5_SEPOLIA_INDEX_TOKEN_PROXY_ADDRESS");
    // address indexFactoryBalancer = vm.envAddress("CR5_SEPOLIA_INDEX_FACTORY_BALANCER_PROXY_ADDRESS");

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        indexToken = IndexToken(payable(indexTokenProxy));

        // string memory targetChain = "sepolia";

        // Issuance With ETH
        // issuanceAndRedemptionWithEth();

        issuanceIndexTokens();

        // Issuance with ERC20 Token
        // issuanceAndRedemptionWithUsdt();

        // redemption();

        // askValue();

        vm.stopBroadcast();
    }

    // function askValue() public {
    //     IndexFactoryBalancer(indexFactoryBalancer).askValues();
    // }

    function issuanceIndexTokens() public {
        uint256 inputAmount = 2e5;
        address[] memory path = new address[](2);
        path[0] = address(usdc);
        path[1] = address(weth);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 100;
        uint256 issuanceFee =
            IndexFactory(payable(indexFactoryProxy)).getIssuanceFee(address(usdc), path, fees, inputAmount);
        IERC20(usdc).approve(address(indexFactoryProxy), (inputAmount * 1001) / 1000);
        // redemption input token path data

        IndexFactory(payable(indexFactoryProxy)).issuanceIndexTokens{value: issuanceFee}(
            address(usdc), path, fees, inputAmount
        );
    }

    function issuanceAndRedemptionWithEth() public {
        // uint256 inputAmount = 1e16;
        // address[] memory path = new address[](2);
        // path[0] = address(usdc);
        // path[1] = address(weth);
        // uint24[] memory fees = new uint24[](1);
        // fees[0] = 3000;
        // uint256 issuanceFee =
        //     IndexFactory(payable(indexFactoryProxy)).getIssuanceFee(address(weth), path, fees, inputAmount);
        // console.log("Issuance fee", issuanceFee);
        // uint256 finalInputAmount = (inputAmount * 1001) / 1000 + issuanceFee;
        // IndexFactory(payable(indexFactoryProxy)).issuanceIndexTokensWithEth{value: finalInputAmount}(inputAmount);

        // address[] memory path = new address[](2);
        // path[0] = address(weth);
        // path[1] = address(weth);
        // uint24[] memory fees = new uint24[](1);
        // fees[0] = 3000;

        // uint256 redemptionFee =
        //     IndexFactory(payable(indexFactoryProxy)).getRedemptionFee((indexToken.balanceOf(address(user)) * 90) / 100);

        // IndexFactory(payable(indexFactoryProxy)).redemption{value: redemptionFee}(
        //     (indexToken.balanceOf(address(user)) * 90) / 100, address(weth), path, fees
        // );
    }

    function redemption() public {
        uint256 inputAmount = 29057661905028232;
        address[] memory path = new address[](2);
        path[0] = address(weth);
        path[1] = address(weth);
        uint24[] memory fees = new uint24[](1);
        fees[0] = 3000;

        uint256 redemptionFee = IndexFactory(payable(indexFactoryProxy)).getRedemptionFee(inputAmount);

        IndexFactory(payable(indexFactoryProxy)).redemption{value: redemptionFee}(
            inputAmount, address(weth), path, fees
        );
        // address[] memory path = new address[](2);
        // path[0] = address(weth);
        // path[1] = address(weth);
        // uint24[] memory fees = new uint24[](1);
        // fees[0] = 3000;

        // // IndexFactory(payable(indexFactoryProxy)).redemption(200000000000000000000, 0, address(weth), path, fees);
        // IndexFactory(payable(indexFactoryProxy)).redemption(
        //     IERC20(indexTokenProxy).balanceOf(user), address(weth), path, fees
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
