// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import {ConfirmedOwnerWithProposal} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwnerWithProposal.sol";
import {ConfirmedOwnerWithProposal} from "./ConfirmedOwnerWithProposal.sol";

/// @title The ConfirmedOwner contract
/// @notice A contract with helpers for basic contract ownership.
contract ConfirmedOwner is ConfirmedOwnerWithProposal {
//   constructor(address newOwner) ConfirmedOwnerWithProposal(newOwner, address(0)) {}
    function __ConfirmedOwner_init(address newOwner) internal {
        __ConfirmedOwnerWithProposal_init(newOwner, address(0));
    }
}
