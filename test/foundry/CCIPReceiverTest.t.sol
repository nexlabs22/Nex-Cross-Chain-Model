// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/ccip/CCIPReceiver.sol";

contract CCIPReceiverTest is Test {
    CCIPReceiverTestImpl receiver;
    address mockRouter;

    function setUp() public {
        mockRouter = address(new MockRouter2());
        receiver = new CCIPReceiverTestImpl();
        receiver.initializeReceiver(mockRouter);
    }

    function testFailInitialization() public {
        assertEq(receiver.getRouter(), mockRouter, "Router address should match");

        vm.expectRevert(CCIPReceiver.InvalidRouter.selector);
        receiver.initializeReceiver(address(0));
    }

    function testSupportsInterface() public {
        assertTrue(
            receiver.supportsInterface(type(IAny2EVMMessageReceiver).interfaceId),
            "Should support IAny2EVMMessageReceiver"
        );
        assertTrue(receiver.supportsInterface(type(IERC165).interfaceId), "Should support IERC165");

        assertFalse(receiver.supportsInterface(0xdeadbeef), "Should not support arbitrary interface");
    }

    function testOnlyRouterModifier() public {
        Client.Any2EVMMessage memory message;

        vm.prank(address(0xdead));
        vm.expectRevert(abi.encodeWithSelector(CCIPReceiver.InvalidRouter.selector, address(0xdead)));
        receiver.ccipReceive(message);

        vm.prank(mockRouter);
        receiver.ccipReceive(message);
        assertTrue(receiver.receivedMessage(), "Message should be received");
    }
}

contract CCIPReceiverTestImpl is CCIPReceiver {
    bool private _messageReceived;

    function initializeReceiver(address router) external initializer {
        __ccipReceiver_init(router);
    }

    function _ccipReceive(Client.Any2EVMMessage memory) internal override {
        _messageReceived = true;
    }

    function receivedMessage() public view returns (bool) {
        return _messageReceived;
    }
}
