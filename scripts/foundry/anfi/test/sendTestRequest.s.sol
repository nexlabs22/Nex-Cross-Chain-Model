// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import "../../../../contracts/test/FunctionsTest.sol";
import "../../../../contracts/test/FunctionsTest2.sol";

/**
forge script scripts/foundry/anfi/test/sendTestRequest.s.sol:SendTestRequest  --rpc-url $ETHEREUM_SEPOLIA_RPC_URL   --private-key $PRIVATE_KEY   --broadcast
*/

contract SendTestRequest is Script {
    // Mainnet
    address functionsAddress = 0xd8E685ac3AE16789e9000af6bE8a19080d15d267;
    // address functionsAddress2 = 0x0eb01bA9d5eF84103474Dc999Cf91b22221AE3cf;
    // address functionsAddress2 = 0xD926c6AB9607868580D64A09E218530C23E4B685;
    address functionsAddress2 = 0xeD8349467d45E2c678C6160Ac19E1Add3eFb9539;
    FunctionsTest functions = FunctionsTest(functionsAddress);
    FunctionsTest2 functions2 = FunctionsTest2(functionsAddress2);

    string source =
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://swapi.info/api/people/${characterId}/`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.name);";

    string source2 = 
        "const ethers = await import(`npm:ethers@6.0.0`);"
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://vercel-cron-xi.vercel.app/api/getArbInData`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.data.swapVersions[0]);";

    string source3 = 
        "const ethers = await import(`npm:ethers@6.0.0`);"
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://vercel-cron-xi.vercel.app/api/getArbInData`"
        "});"
        "const { data } = apiResponse;"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const uintArray = [1, 2, 3, 4, 5, 6];"
        "const encodedData = ethers.AbiCoder.defaultAbiCoder().encode("
        "[`address[]`, `uint256[]`, `uint24[]`],"
        "[data.data.arbitrumOne_tokenAddresses, uintArray, data.data.swapVersions]"
        ");"
        "return ethers.getBytes(encodedData);";
        // "return Functions.encodeString(data.data.swapVersions[0]);";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // getData();
        // sendRequest();
        // sendRequest2();
        sendRequest3();

        vm.stopBroadcast();
    }

    // function sendRequest() internal {
    //     string[] memory args = new string[](1); 
    //     args[0] = "1";
    //     functions.sendRequest(
    //         4300,
    //         args
    //     );
    //     console.log("Request sent");
    // }

    function getData() internal {
        bytes32 requestId = functions.s_lastRequestId();
        // string memory character = functions.character();
        bytes memory response = functions.s_lastResponse();
        bytes memory error = functions.s_lastError();
        // console.log("Character:", character);
        // console.log("Request ID:", requestId);
        // console.log("Response:", response);
        // console.log("Error:", error);
    }

    function sendRequest2() internal {
        string[] memory args = new string[](1); 
        args[0] = "2";
        functions.sendRequest2(
            source2,
            4300,
            args
        );
        console.log("Request sent");
    }

    function sendRequest3() internal {
        string[] memory args = new string[](1); 
        args[0] = "2";
        functions2.sendRequest(
            source3,
            4300,
            1000000,
            args
        );
        console.log("Request sent");
    }
}
