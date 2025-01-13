// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "./OlympixUnitTest.sol";
import "../../contracts/token/IndexToken.sol";
import "./ContractDeployer.sol";

contract IndexTokenTest is Test {
    IndexToken indexToken;

    address add1 = address(1);

    function setUp() public {
        indexToken = new IndexToken();
        indexToken.initialize("Index Token", "IT", 0, address(1), 1000);
    }

    function testMintToWithinSupplyCeiling() public {
        indexToken.setMinter(address(this), true);
        uint256 currentSupply = indexToken.totalSupply();
        uint256 mintAmount = 100;

        // Mint within the supply ceiling
        indexToken.mint(address(2), mintAmount);

        // Assert that the total supply has increased correctly
        assertEq(
            indexToken.totalSupply(), currentSupply + mintAmount, "Total supply should increase by the mint amount"
        );
    }

    function testMintToExceedsSupplyCeiling() public {
        indexToken.setMinter(address(this), true);
        uint256 supplyCeiling = indexToken.supplyCeiling();
        uint256 currentSupply = indexToken.totalSupply();
        uint256 excessAmount = supplyCeiling - currentSupply + 1;

        // Expect a revert when minting exceeds the supply ceiling
        vm.expectRevert("will exceed supply ceiling");
        indexToken.mint(address(2), excessAmount);
    }

    function testMintToRestrictedReceiver() public {
        indexToken.setMinter(address(this), true);
        indexToken.toggleRestriction(address(2)); // Restrict the recipient address

        // Expect a revert when minting to a restricted address
        vm.expectRevert("to is restricted");
        indexToken.mint(address(2), 100);
    }

    function testMintToRestrictedSender() public {
        indexToken.setMinter(address(3), true); // Authorize another account as a minter
        indexToken.toggleRestriction(address(3)); // Restrict the sender

        vm.prank(address(3)); // Simulate the call from the restricted minter
        vm.expectRevert("msg.sender is restricted");
        indexToken.mint(address(2), 100);
    }

    function testMintToSupplyDecreasesIncorrectly() public {
        indexToken.setMinter(address(this), true);
        uint256 currentSupply = indexToken.totalSupply();
        uint256 mintAmount = 100;

        // Mint and verify the total supply increases correctly
        indexToken.mint(address(2), mintAmount);

        // Assert that the total supply does not decrease (target mutation)
        assertGt(indexToken.totalSupply(), currentSupply, "Total supply should not decrease");
    }

    function test_setMinter_DisableMinter() public {
        indexToken.setMinter(address(2), true);
        indexToken.setMinter(address(2), false);
        (bool success, bytes memory data) =
            address(indexToken).staticcall(abi.encodeWithSelector(indexToken.isMinter.selector, address(2)));
        bool isMinter = abi.decode(data, (bool));
        assertTrue(!isMinter);
    }

    function testMintToFeeReceiverRevert() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.mintToFeeReceiver();
    }

    function testSetMethodologist() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.setMethodologist(address(0x987));
    }

    function testSetFeeRateRevert() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.setFeeRate(1);
    }

    function testSetFeeReceiver() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.setFeeReceiver(address(0x987));
    }

    function testSetMinterRevert() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.setMinter(address(0x987), true);
    }

    function setSupplyCeilingRevert() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.setSupplyCeiling(1e18);
    }

    function testPauseRevert() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.pause();
    }

    function testUnPauseRevert() public {
        indexToken.pause();

        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.unpause();
    }

    function testToggleRestriction() public {
        vm.startPrank(add1);
        vm.expectRevert("Ownable: caller is not the owner");
        indexToken.toggleRestriction(address(0x987));
    }
}
