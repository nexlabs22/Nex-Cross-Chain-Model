// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenFaucet is Ownable {

    function withdrawToken(address _token, uint _amount) public onlyOwner {
        IERC20(_token).transfer(msg.sender, _amount);
    }

    function getToken(address _token) public {
        IERC20(_token).transfer(msg.sender, 1000e18);
    }
}