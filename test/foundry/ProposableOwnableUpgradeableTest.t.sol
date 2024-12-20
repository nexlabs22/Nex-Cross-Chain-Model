// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/proposable/ProposableOwnableUpgradeable.sol";

contract ProposableOwnableUpgradeableTest is Test {
    ProposableOwnableUpgradeableMock proposableOwnableUpgradeable;
    address owner = address(0x1);
    address proposedOwner = address(0x2);
    address nonProposedOwner = address(0x3);

    function setUp() public {
        proposableOwnableUpgradeable = new ProposableOwnableUpgradeableMock();
        vm.prank(owner);
        proposableOwnableUpgradeable.initialize(owner);
    }

    function testProposeOwner() public {
        vm.prank(owner);
        proposableOwnableUpgradeable.proposeOwner(proposedOwner);
        assertEq(proposableOwnableUpgradeable.proposedOwner(), proposedOwner, "Proposed owner mismatch");
    }

    function testProposeOwner_RevertOnZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("ProposableOwnable: new owner is the zero address");
        proposableOwnableUpgradeable.proposeOwner(address(0));
    }

    function testTransferOwnership_Success() public {
        vm.prank(owner);
        proposableOwnableUpgradeable.proposeOwner(proposedOwner);

        vm.prank(proposedOwner);
        proposableOwnableUpgradeable.transferOwnership(proposedOwner);

        assertEq(proposableOwnableUpgradeable.owner(), proposedOwner, "Ownership was not transferred");
    }

    function testTransferOwnership_RevertOnNotProposedOwner() public {
        vm.prank(owner);
        proposableOwnableUpgradeable.proposeOwner(proposedOwner);

        vm.prank(nonProposedOwner);
        vm.expectRevert("ProposableOwnable: new owner is not proposed owner");
        proposableOwnableUpgradeable.transferOwnership(nonProposedOwner);
    }

    function testTransferOwnership_RevertOnNotCaller() public {
        vm.prank(owner);
        proposableOwnableUpgradeable.proposeOwner(proposedOwner);

        vm.prank(nonProposedOwner);
        vm.expectRevert("ProposableOwnable: this call must be made by the new owner");
        proposableOwnableUpgradeable.transferOwnership(proposedOwner);
    }
}

contract ProposableOwnableUpgradeableMock is ProposableOwnableUpgradeable {
    function initialize(address _owner) public initializer {
        __Ownable_init();
        _transferOwnership(_owner);
    }
}
