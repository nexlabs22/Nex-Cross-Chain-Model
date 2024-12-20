// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Test, console} from "forge-std/Test.sol";
import "../../contracts/libraries/MessageSender.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/factory/IndexFactory.sol";

contract MessageSenderTest is Test {
    using MessageSender for address;

    IndexFactory indexFactory;
    MockERC20 token;
    MockRouter2 router;
    LinkToken link;
    address owner;
    address receiver;

    address wethAddress = address(0x1234);

    function setUp() public {
        owner = address(this);
        receiver = address(0x123);

        link = new LinkToken();
        token = new MockERC20("Test Token", "TTK");
        router = new MockRouter2();

        token.mint(address(this), 100 ether);
        deal(address(link), address(this), 1000 ether);
        deal(address(this), 1000 ether);

        token.approve(address(router), type(uint256).max);
        link.approve(address(router), type(uint256).max);
    }

    function testSendToken_Success() public {
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
        tokensToSendDetails[0] = Client.EVMTokenAmount({token: address(token), amount: 10 ether});

        bytes memory data = abi.encode("test-data");

        console.log("Token balance before:", token.balanceOf(address(this)));
        console.log("Token allowance for router:", token.allowance(address(this), address(router)));

        bytes32 messageId = MessageSender.sendToken(
            address(router), address(link), 5, 1, data, receiver, tokensToSendDetails, IndexFactory.PayFeesIn.Native
        );

        console.logBytes32(messageId);
        console.log("Token balance after:", token.balanceOf(address(this)));

        assertTrue(messageId != bytes32(0));
    }

    function testSendToken_ExceedsMaxLength() public {
        Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](6);
        for (uint256 i = 0; i < 6; i++) {
            tokensToSendDetails[i] = Client.EVMTokenAmount({token: address(token), amount: 1 ether});
        }

        bytes memory data = abi.encode("test-data");

        vm.expectRevert("Maximum 5 different tokens can be sent per CCIP Message");
        MessageSender.sendToken(
            address(router), address(link), 5, 1, data, receiver, tokensToSendDetails, IndexFactory.PayFeesIn.Native
        );
    }

    function testSendMessage_Success() public {
        bytes memory data = abi.encode("test-data");

        bytes32 messageId =
            MessageSender.sendMessage(address(router), address(link), 1, receiver, data, IndexFactory.PayFeesIn.LINK);

        assertTrue(messageId != bytes32(0));
    }
}

// contract MockRouter is IRouterClient {
//     address public linkToken;

//     constructor(address _linkToken) {
//         linkToken = _linkToken;
//     }

//     event MessageSent(bytes32 indexed messageId);

//     function getFee(uint64, Client.EVM2AnyMessage memory) external pure override returns (uint256) {
//         return 0.1 ether; // Fixed fee for testing
//     }

//     function ccipSend(uint64, Client.EVM2AnyMessage memory) external payable override returns (bytes32) {
//         require(msg.value >= 0.1 ether, "Insufficient fee sent");

//         bytes32 mockMessageId = keccak256(abi.encodePacked(block.timestamp, msg.sender));
//         emit MessageSent(mockMessageId);

//         return mockMessageId; // Return a valid, non-zero messageId
//     }
// }
