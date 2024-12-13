// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Vault is Initializable, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    mapping(address => bool) public isOperator;

    event FundsWithdrawn(address token, address to, uint256 amount);

    modifier onlyOperator() {
        require(isOperator[msg.sender], "NexVault: caller is not an operator");
        _;
    }

    function initialize() external initializer {
        __Ownable_init();
    }

    function setOperator(address _operator, bool _status) external onlyOwner {
        require(_operator != address(0), "NexVault: operator address is zero");
        isOperator[_operator] = _status;
    }

    function withdrawFunds(address _token, address _to, uint256 _amount) external onlyOperator returns(bool success) {
        require(_token != address(0), "NexVault: token address is zero");
        require(_to != address(0), "NexVault: recipient address is zero");
        require(_amount > 0, "NexVault: amount is zero");
        emit FundsWithdrawn(_token, _to, _amount);
        IERC20(_token).safeTransfer(_to, _amount);
        require(IERC20(_token).balanceOf(_to) >= _amount, "Transfer failed");
        success = true;
    }
}