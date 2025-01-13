// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/factory/IndexFactoryStorage.sol";

contract IndexFactoryStorageMutation is Test, IndexFactoryStorage {
    function test_toWei_Mutations() public {
        int256 amount = 100;
        uint8 amountDecimals = 8;
        uint8 chainDecimals = 18;

        int256 expected = amount * int256(10 ** (chainDecimals - amountDecimals));

        {
            uint8 mutatedChainDecimals = 8;
            int256 mutatedResult = _toWei(amount, amountDecimals, mutatedChainDecimals);
            assertFalse(mutatedResult == expected, "Mutation not killed: _chainDecimals < _amountDecimals");
        }

        {
            uint256 mutatedMultiplier = 10 * (chainDecimals - amountDecimals);
            int256 mutatedResult = amount * int256(mutatedMultiplier);
            int256 result = _toWei(amount, amountDecimals, chainDecimals);
            assertFalse(mutatedResult == result, "Mutation not killed: 10 * (_chainDecimals - _amountDecimals)");
        }

        {
            int256 mutatedResult =
                amount / int256(10 / (int256(uint256(chainDecimals)) - int256(uint256(amountDecimals))));
            int256 result = _toWei(amount, amountDecimals, chainDecimals);
            assertFalse(
                mutatedResult == result,
                "Mutation not killed: _amount / int256(10 / (_chainDecimals - _amountDecimals))"
            );
        }

        {
            uint8 mutatedChainDecimals = chainDecimals + amountDecimals;
            int256 mutatedResult = amount * int256(10 ** uint256(mutatedChainDecimals));
            int256 result = _toWei(amount, amountDecimals, chainDecimals);
            assertFalse(mutatedResult == result, "Mutation not killed: _chainDecimals + _amountDecimals");
        }

        int256 actual = _toWei(amount, amountDecimals, chainDecimals);
        assertEq(expected, actual, "Original logic failed for valid input");
    }

    function testToWeiChainDecimalsGreaterThanAmountDecimals() public {
        int256 amount = 1;
        uint8 amountDecimals = 6;
        uint8 chainDecimals = 18;

        int256 result = _toWei(amount, amountDecimals, chainDecimals);

        // Expected result: amount * 10^(chainDecimals - amountDecimals)
        int256 expected = amount * int256(10 ** (chainDecimals - amountDecimals));
        assertEq(result, expected, "Result should match the expected value when chainDecimals > amountDecimals");
    }

    function testToWeiAmountDecimalsGreaterThanChainDecimals() public {
        int256 amount = 1;
        uint8 amountDecimals = 18;
        uint8 chainDecimals = 6;

        int256 result = _toWei(amount, amountDecimals, chainDecimals);

        // Expected result: amount * 10^(amountDecimals - chainDecimals)
        int256 expected = amount * int256(10 ** (amountDecimals - chainDecimals));
        assertEq(result, expected, "Result should match the expected value when amountDecimals > chainDecimals");
    }

    function testToWeiChainDecimalsEqualAmountDecimals() public {
        int256 amount = 1;
        uint8 amountDecimals = 18;
        uint8 chainDecimals = 18;

        int256 result = _toWei(amount, amountDecimals, chainDecimals);

        // Expected result: amount (no conversion needed)
        assertEq(result, amount, "Result should match the input amount when chainDecimals == amountDecimals");
    }

    function testToWeiEdgeCaseZeroAmount() public {
        int256 amount = 0;
        uint8 amountDecimals = 18;
        uint8 chainDecimals = 6;

        int256 result = _toWei(amount, amountDecimals, chainDecimals);

        // Expected result: 0 (no conversion needed)
        assertEq(result, 0, "Result should be zero for zero input amount");
    }

    function testToWeiLargeDifferenceInDecimals() public {
        int256 amount = 1;
        uint8 amountDecimals = 1;
        uint8 chainDecimals = 30;

        int256 result = _toWei(amount, amountDecimals, chainDecimals);

        // Expected result: amount * 10^(chainDecimals - amountDecimals)
        int256 expected = amount * int256(10 ** (chainDecimals - amountDecimals));
        assertEq(result, expected, "Result should handle large differences in decimals correctly");
    }
}
