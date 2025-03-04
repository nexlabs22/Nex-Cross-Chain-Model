// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

// import "../../../../contracts/test/FunctionsTest.sol";
import "../../../../contracts/test/FunctionsTest2.sol";

// address = 0xd8e685ac3ae16789e9000af6be8a19080d15d267

/**
forge script scripts/foundry/anfi/test/deployTestFunctions.s.sol \
>   --rpc-url $ETHEREUM_SEPOLIA_RPC_URL \
>   --private-key $PRIVATE_KEY \
>   --broadcast \
>   --verify \
>   --etherscan-api-key $ETHERSCAN_API_KEY
 */
contract DeployTestFunctions is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        FunctionsTest2 functionsTest = new FunctionsTest2();

        console.log("FunctionsTest deployed at:", address(functionsTest));

        vm.stopBroadcast();
    }
}
