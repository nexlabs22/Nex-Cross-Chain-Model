// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Test, console} from "forge-std/Test.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";

contract MockApiOracleTest is Test {
    MockApiOracle private mockOracle;
    LinkToken private linkToken;

    address private user = address(0x1);
    address private oracle = address(0x2);

    event OracleRequest(
        bytes32 indexed specId,
        address indexed requester,
        bytes32 requestId,
        uint256 payment,
        address callbackAddr,
        bytes4 callbackFunctionId,
        uint256 cancelExpiration,
        uint256 dataVersion,
        bytes data
    );

    event CancelOracleRequest(bytes32 indexed requestId);

    function setUp() public {
        linkToken = new LinkToken();
        mockOracle = new MockApiOracle(address(linkToken));

        deal(address(linkToken), user, 100 ether);
    }

    function testOracleRequest_Success() public {
        uint256 payment = 1 ether;
        bytes32 specId = keccak256("test-spec");
        address callbackAddr = address(this);
        bytes4 callbackFunctionId = bytes4(keccak256("callback(bytes32,bytes)"));
        uint256 nonce = 1;
        uint256 dataVersion = 1;
        bytes memory data = abi.encode("test-data");

        vm.startPrank(user);
        linkToken.approve(address(mockOracle), payment);

        bytes32 expectedRequestId = keccak256(abi.encodePacked(user, nonce));
        uint256 expectedExpiration = block.timestamp + 5 minutes;

        linkToken.transferAndCall(
            address(mockOracle),
            payment,
            abi.encodeWithSelector(
                ChainlinkRequestInterface.oracleRequest.selector,
                user,
                payment,
                specId,
                callbackAddr,
                callbackFunctionId,
                nonce,
                dataVersion,
                data
            )
        );

        vm.stopPrank();
    }

    function testFailOracleRequest_RevertOnDuplicateRequestId() public {
        uint256 payment = 1 ether;
        bytes32 specId = keccak256("test-spec");
        address callbackAddr = address(this);
        bytes4 callbackFunctionId = bytes4(keccak256("callback(bytes32,bytes)"));
        uint256 nonce = 1;
        uint256 dataVersion = 1;
        bytes memory data = abi.encode("test-data");

        vm.startPrank(user);
        linkToken.approve(address(mockOracle), payment);

        linkToken.transferAndCall(
            address(mockOracle),
            payment,
            abi.encodeWithSelector(
                ChainlinkRequestInterface.oracleRequest.selector,
                user,
                payment,
                specId,
                callbackAddr,
                callbackFunctionId,
                nonce,
                dataVersion,
                data
            )
        );

        vm.expectRevert("Must use a unique ID");
        linkToken.transferAndCall(
            address(mockOracle),
            payment,
            abi.encodeWithSelector(
                ChainlinkRequestInterface.oracleRequest.selector,
                user,
                payment,
                specId,
                callbackAddr,
                callbackFunctionId,
                nonce,
                dataVersion,
                data
            )
        );

        vm.stopPrank();
    }

    function testCancelOracleRequest_Success() public {
        uint256 payment = 1 ether;
        bytes32 requestId = keccak256(abi.encodePacked(user, uint256(1)));
        bytes32 specId = keccak256("test-spec");
        address callbackAddr = address(this);
        bytes4 callbackFunctionId = bytes4(keccak256("callback(bytes32,bytes)"));
        uint256 dataVersion = 1;
        bytes memory data = abi.encode("test-data");

        vm.startPrank(user);
        linkToken.approve(address(mockOracle), payment);

        linkToken.transferAndCall(
            address(mockOracle),
            payment,
            abi.encodeWithSelector(
                ChainlinkRequestInterface.oracleRequest.selector,
                user,
                payment,
                specId,
                callbackAddr,
                callbackFunctionId,
                uint256(1),
                dataVersion,
                data
            )
        );

        vm.warp(block.timestamp + 6 minutes);

        vm.expectEmit(true, true, true, true);
        emit CancelOracleRequest(requestId);
        mockOracle.cancelOracleRequest(requestId, payment, callbackFunctionId, block.timestamp);

        vm.stopPrank();
    }

    function testFailCancelOracleRequest_RevertIfNotExpired() public {
        uint256 payment = 1 ether;
        bytes32 requestId = keccak256(abi.encodePacked(user, uint256(1)));
        bytes32 specId = keccak256("test-spec");
        address callbackAddr = address(this);
        bytes4 callbackFunctionId = bytes4(keccak256("callback(bytes32,bytes)"));
        uint256 dataVersion = 1;
        bytes memory data = abi.encode("test-data");

        vm.startPrank(user);
        linkToken.approve(address(mockOracle), payment);

        linkToken.transferAndCall(
            address(mockOracle),
            payment,
            abi.encodeWithSelector(
                ChainlinkRequestInterface.oracleRequest.selector,
                user,
                payment,
                specId,
                callbackAddr,
                callbackFunctionId,
                uint256(1),
                dataVersion,
                data
            )
        );

        vm.warp(block.timestamp + 1 minutes);

        vm.expectRevert("Request is not expired");
        mockOracle.cancelOracleRequest(requestId, payment, callbackFunctionId, block.timestamp);

        vm.stopPrank();
    }

    // function testFulfillOracleFundingRateRequest_Success() public {
    //     uint256 payment = 1 ether;
    //     bytes32 requestId = keccak256(abi.encodePacked(user, uint256(1)));
    //     bytes32 specId = keccak256("test-spec");
    //     address callbackAddr = address(this);
    //     bytes4 callbackFunctionId = this.callback.selector;
    //     uint256 dataVersion = 1;
    //     bytes memory data = abi.encode("test-data");

    //     vm.startPrank(user);
    //     linkToken.approve(address(mockOracle), payment);

    //     linkToken.transferAndCall(
    //         address(mockOracle),
    //         payment,
    //         abi.encodeWithSelector(
    //             ChainlinkRequestInterface.oracleRequest.selector,
    //             user,
    //             payment,
    //             specId,
    //             callbackAddr,
    //             callbackFunctionId,
    //             uint256(1),
    //             dataVersion,
    //             data
    //         )
    //     );
    //     vm.stopPrank();

    //     address[] memory tokens = new address[](1);
    //     tokens[0] = address(0x123);

    //     uint256[] memory marketCapShares = new uint256[](1);
    //     marketCapShares[0] = 100;

    //     uint256[] memory swapVersions = new uint256[](1);
    //     swapVersions[0] = 1;

    //     vm.startPrank(oracle);

    //     console.logBytes32(requestId);
    //     console.log("Tokens:", tokens[0]);
    //     console.log("Market Cap Shares:", marketCapShares[0]);
    //     console.log("Swap Versions:", swapVersions[0]);

    //     bool success = mockOracle.fulfillOracleFundingRateRequest(requestId, tokens, marketCapShares, swapVersions);

    //     assertTrue(success, "Fulfillment should succeed");

    //     vm.stopPrank();
    // }

    function callback(
        bytes32 requestId,
        address[] memory tokens,
        uint256[] memory marketCapShares,
        uint256[] memory swapVersions
    ) public {
        console.logBytes32(requestId);
        console.log("Tokens received in callback:", tokens[0]);
        console.log("Market Cap Shares in callback:", marketCapShares[0]);
        console.log("Swap Versions in callback:", swapVersions[0]);
    }
}
