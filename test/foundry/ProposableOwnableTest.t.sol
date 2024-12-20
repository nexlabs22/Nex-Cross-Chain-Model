// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/proposable/ProposableOwnable.sol";

contract ProposableOwnableTest is Test {
    ProposableOwnableMock proposableOwnable;
    address owner = address(0x1);
    address proposedOwner = address(0x2);
    address nonProposedOwner = address(0x3);

    function setUp() public {
        proposableOwnable = new ProposableOwnableMock();
        vm.prank(owner);
        proposableOwnable.initialize(owner);
    }

    function testProposeOwner() public {
        vm.prank(owner);
        proposableOwnable.proposeOwner(proposedOwner);
        assertEq(proposableOwnable.proposedOwner(), proposedOwner, "Proposed owner mismatch");
    }

    function testProposeOwner_RevertOnZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("ProposableOwnable: new owner is the zero address");
        proposableOwnable.proposeOwner(address(0));
    }

    function testTransferOwnership_Success() public {
        vm.prank(owner);
        proposableOwnable.proposeOwner(proposedOwner);

        vm.prank(proposedOwner);
        proposableOwnable.transferOwnership(proposedOwner);

        assertEq(proposableOwnable.owner(), proposedOwner, "Ownership was not transferred");
    }

    function testTransferOwnership_RevertOnNotProposedOwner() public {
        vm.prank(owner);
        proposableOwnable.proposeOwner(proposedOwner);

        vm.prank(nonProposedOwner);
        vm.expectRevert("ProposableOwnable: new owner is not proposed owner");
        proposableOwnable.transferOwnership(nonProposedOwner);
    }

    function testTransferOwnership_RevertOnNotCaller() public {
        vm.prank(owner);
        proposableOwnable.proposeOwner(proposedOwner);

        vm.prank(nonProposedOwner);
        vm.expectRevert("ProposableOwnable: this call must be made by the new owner");
        proposableOwnable.transferOwnership(proposedOwner);
    }
}

contract ProposableOwnableMock is ProposableOwnable {
    function initialize(address _owner) public {
        _transferOwnership(_owner);
    }
}
