// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockPriceFeed is AggregatorV3Interface {
    int256 private price;
    uint8 private decimalsValue;
    uint256 private updatedAt;

    constructor() {
        updatedAt = block.timestamp;
    }

    function setPrice(int256 _price) external {
        price = _price;
        updatedAt = block.timestamp;
    }

    function setDecimals(uint8 _decimals) external {
        decimalsValue = _decimals;
    }

    function decimals() external view override returns (uint8) {
        return decimalsValue;
    }

    function description() external pure override returns (string memory) {
        return "Mock Price Feed";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function latestRoundData()
        external
        view
        override
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt_, uint80 answeredInRound)
    {
        return (
            1, // Mock round ID
            price, // Mock price
            updatedAt, // Started at timestamp
            updatedAt, // Updated at timestamp
            1 // Answered in round
        );
    }

    function getRoundData(uint80 /* _roundId */ )
        external
        view
        override
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt_, uint80 answeredInRound)
    {
        // Mock data for specific rounds
        return (
            1,
            2000 * 10 ** 8, // Example price in 8 decimal format
            block.timestamp,
            block.timestamp,
            1
        );
    }
}
