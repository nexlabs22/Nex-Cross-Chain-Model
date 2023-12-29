// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract MockCCIP {
  

  function receive(address to, uint256 amount) public returns(address, uint) {
   return (to, amount);
  }

  function send(address from, uint256 amount) public returns(address, uint) {
   return (from, amount);
  }
}