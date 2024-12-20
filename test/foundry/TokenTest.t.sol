// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/uniswap/Token2.sol";

contract TokenTest is Test {
    Token2 private token;
    address private owner = address(0x1);
    address private user = address(0x2);

    uint256 private initialSupply = 1_000_000 * 10 ** 6;

    function setUp() public {
        vm.prank(owner);
        token = new Token2(initialSupply);
    }

    function testInitialSupply() public {
        assertEq(token.totalSupply(), initialSupply, "Total supply mismatch");
        assertEq(token.balanceOf(owner), initialSupply, "Owner balance mismatch");
    }

    function testTransfer() public {
        uint256 transferAmount = 100 * 10 ** 6;

        vm.prank(owner);
        token.transfer(user, transferAmount);

        assertEq(token.balanceOf(owner), initialSupply - transferAmount, "Owner balance mismatch after transfer");
        assertEq(token.balanceOf(user), transferAmount, "User balance mismatch after transfer");
    }

    function testTransferRevertsOnInsufficientBalance() public {
        uint256 transferAmount = 100 * 10 ** 6;

        vm.prank(user);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        token.transfer(owner, transferAmount);
    }

    function testDecimals() public {
        assertEq(token.decimals(), 6, "Token decimals mismatch");
    }

    function testApproveAndAllowance() public {
        uint256 approvalAmount = 500 * 10 ** 6;

        vm.prank(owner);
        token.approve(user, approvalAmount);

        assertEq(token.allowance(owner, user), approvalAmount, "Allowance mismatch");
    }

    function testTransferFrom() public {
        uint256 approvalAmount = 500 * 10 ** 6;
        uint256 transferAmount = 300 * 10 ** 6;

        vm.prank(owner);
        token.approve(user, approvalAmount);

        vm.prank(user);
        token.transferFrom(owner, user, transferAmount);

        assertEq(token.balanceOf(owner), initialSupply - transferAmount, "Owner balance mismatch after transferFrom");
        assertEq(token.balanceOf(user), transferAmount, "User balance mismatch after transferFrom");
        assertEq(token.allowance(owner, user), approvalAmount - transferAmount, "Allowance mismatch after transferFrom");
    }

    function testTransferFromRevertsOnInsufficientAllowance() public {
        uint256 approvalAmount = 200 * 10 ** 6;
        uint256 transferAmount = 300 * 10 ** 6;

        vm.prank(owner);
        token.approve(user, approvalAmount);

        vm.prank(user);
        vm.expectRevert("ERC20: insufficient allowance");
        token.transferFrom(owner, user, transferAmount);
    }
}
