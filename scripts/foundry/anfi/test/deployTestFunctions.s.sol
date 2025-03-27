// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

// import "../../../../contracts/test/FunctionsTest.sol";
// import "../../../../contracts/test/FunctionsTest2.sol";
import "../../../../contracts/test/FunctionsTest3.sol";

// address = 0xAbBA08355e0FD63878916EDc73115917747Bb7AB //arbitrum
// address = 0xd8e685ac3ae16789e9000af6be8a19080d15d267 //testnet

/**
forge script scripts/foundry/anfi/test/deployTestFunctions.s.sol \
>   --rpc-url $ETHEREUM_SEPOLIA_RPC_URL \
>   --private-key $PRIVATE_KEY \
>   --broadcast \
>   --verify \
>   --etherscan-api-key $ETHERSCAN_API_KEY

// mainnet
forge script scripts/foundry/anfi/test/deployTestFunctions.s.sol --rpc-url $ARBITRUM_RPC_URL --private-key $PRIVATE_KEY --verify --etherscan-api-key $ARBISCAN_API_KEY --broadcast
 */
contract DeployTestFunctions is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        FunctionsTest3 functionsTest = new FunctionsTest3();

        console.log("FunctionsTest deployed at:", address(functionsTest));

        vm.stopBroadcast();
    }
}
