// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "./OlympixUnitTest.sol";
import "../../contracts/token/IndexToken.sol";
import "./ContractDeployer.sol";

contract IndexTokenTest is Test, ContractDeployer {
    function setUp() public {}

    function test_setMinter_DisableMinter() public {
        IndexToken indexToken = new IndexToken();
        indexToken.initialize("Index Token", "IT", 0, address(1), 1000);
        indexToken.setMinter(address(2), true);
        indexToken.setMinter(address(2), false);
        (bool success, bytes memory data) =
            address(indexToken).staticcall(abi.encodeWithSelector(indexToken.isMinter.selector, address(2)));
        bool isMinter = abi.decode(data, (bool));
        assertTrue(!isMinter);
    }
}
