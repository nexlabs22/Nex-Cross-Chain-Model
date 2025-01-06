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
