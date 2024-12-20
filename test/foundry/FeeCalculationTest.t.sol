// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/libraries/FeeCalculation.sol";

contract FeeCalculationTest is Test {
    using FeeCalculation for uint256;

    function testCalculateFee_ValidInput() public {
        uint256 amount = 10000;
        uint8 feeRate = 50;

        uint256 expectedFee = 50;
        uint256 calculatedFee = FeeCalculation.calculateFee(amount, feeRate);

        assertEq(calculatedFee, expectedFee, "Calculated fee should match expected fee");
    }

    function testCalculateFee_ZeroAmount() public {
        uint256 amount = 0;
        uint8 feeRate = 50;

        uint256 expectedFee = 0;
        uint256 calculatedFee = FeeCalculation.calculateFee(amount, feeRate);

        assertEq(calculatedFee, expectedFee, "Fee should be zero when amount is zero");
    }

    function testCalculateFee_ZeroFeeRate() public {
        uint256 amount = 10000;
        uint8 feeRate = 0;

        uint256 expectedFee = 0;
        uint256 calculatedFee = FeeCalculation.calculateFee(amount, feeRate);

        assertEq(calculatedFee, expectedFee, "Fee should be zero when fee rate is zero");
    }

    function testCalculateFee_MaxAmount() public {
        uint256 amount = type(uint256).max;
        uint8 feeRate = 1;

        uint256 expectedFee = (type(uint256).max / 10000);
        uint256 calculatedFee = FeeCalculation.calculateFee(amount, feeRate);

        assertEq(calculatedFee, expectedFee, "Calculated fee should handle max uint value");
    }
}
