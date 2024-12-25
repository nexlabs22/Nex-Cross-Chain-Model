// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import {CrossChainIndexFactory} from "../../contracts/vault/CrossChainFactory.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "../mocks/MockERC20.sol";
import "../../contracts/test/MockRouter2.sol";
import "../../contracts/test/LinkToken.sol";
import "../../contracts/vault/Vault.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../contracts/ccip/CCIPReceiver.sol";
import "../../contracts/interfaces/ISwapRouter.sol";
import "../../contracts/interfaces/IUniswapV2Router02.sol";
import "../mocks/MockPriceFeed.sol";
import "./ContractDeployer.sol";

contract CCFTest is Test, ContractDeployer {
    CCIPReceiver ccip;

    function setUp() public {
        deployAllContracts();
        addLiquidityETH(positionManager, factoryAddress, token0, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token1, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token2, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token3, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, token4, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, crossChainToken, wethAddress, 1000e18, 1e18);
        addLiquidityETH(positionManager, factoryAddress, usdt, wethAddress, 1000e18, 1e18);
    }

    function testPublicVariables() public {
        uint8 actualFeeRate = crossChainIndexFactory.feeRate();
        assertEq(actualFeeRate, 0, "feeRate mismatch: default should be 0");

        uint256 actualLatestFeeUpdate = crossChainIndexFactory.latestFeeUpdate();
        assertEq(actualLatestFeeUpdate, 0, "latestFeeUpdate mismatch: default should be 0");

        uint64 actualChainSelector = crossChainIndexFactory.currentChainSelector();
        assertEq(actualChainSelector, 2, "currentChainSelector mismatch: expecting 2");
    }

    function testSetPriceOracle() public {
        address newOracle = address(0x1234);
        crossChainIndexFactory.setPriceOracle(newOracle);

        assertEq(crossChainIndexFactory.priceOracle(), newOracle, "priceOracle mismatch");
    }

    function testSetCcipRouter() public {
        address newRouter = address(0x9999);
        crossChainIndexFactory.setCcipRouter(newRouter);
    }

    function testSetCrossChainToken() public {
        uint64 chainSelector = 2;
        address crossChainTok = address(crossChainToken);
        uint24 swapFee = 3000;

        crossChainIndexFactory.setCrossChainToken(chainSelector, crossChainTok, swapFee);

        address stored = crossChainIndexFactory.crossChainToken(chainSelector);
        assertEq(stored, crossChainTok, "crossChainToken mismatch");

        uint24 gotFee = crossChainIndexFactory.crossChainTokenSwapFee(chainSelector, crossChainTok);
        assertEq(gotFee, swapFee, "crossChainTokenSwapFee mismatch");
    }

    function testSetVault() public {
        Vault newVault = new Vault();
        newVault.initialize();

        crossChainIndexFactory.setVault(payable(address(newVault)));

        assertEq(address(crossChainIndexFactory.vault()), address(newVault), "vault mismatch");
    }

    function testPauseUnpause() public {
        crossChainIndexFactory.pause();
        bool paused = crossChainIndexFactory.paused();
        assertTrue(paused, "paused should be true after .pause()");

        // can't re-pause
        vm.expectRevert("Pausable: paused");
        crossChainIndexFactory.pause();

        // unpause
        crossChainIndexFactory.unpause();
        paused = crossChainIndexFactory.paused();
        assertFalse(paused, "paused should be false after .unpause()");
    }

    function testEstimateAmountOut() public {
        address priceOr = address(0xABCDEF111111);
        crossChainIndexFactory.setPriceOracle(priceOr);
        // we can now mock it
        vm.mockCall(
            priceOr,
            abi.encodeWithSelector(
                IPriceOracle.estimateAmountOut.selector,
                factoryAddress,
                address(token0),
                address(token1),
                uint128(1e18),
                uint24(3000)
            ),
            abi.encode(222)
        );

        uint256 out = crossChainIndexFactory.estimateAmountOut(address(token0), address(token1), 1e18, 3000);
        assertEq(out, 222, "estimateAmountOut mismatch");
    }

    function testSendMessage() public {
        bytes memory data = "Hello cross chain!";

        vm.prank(address(this));
        bytes32 msgId = crossChainIndexFactory.sendMessage(2, add1, data, CrossChainIndexFactory.PayFeesIn.LINK);
        console.logBytes32(msgId);
    }

    function testConvertEthToUsd() public {
        uint256 usdValue = crossChainIndexFactory.convertEthToUsd(1e18);
        assertEq(usdValue, 2000e18, "convertEthToUsd mismatch for 1 ETH");
    }

    function testPriceInWei() public {
        uint256 priceWeis = crossChainIndexFactory.priceInWei();
        assertEq(priceWeis, 2000e18, "priceInWei mismatch");
    }

    function test_getAmountOut_SuccessfulGetAmountOut() public {
        uint256 amountIn = 1e18;
        uint24 swapFee = 3000;
        uint256 expectedAmountOut = 222;

        address priceOracle = address(0xABCDEF111111);
        crossChainIndexFactory.setPriceOracle(priceOracle);

        vm.mockCall(
            priceOracle,
            abi.encodeWithSelector(
                IPriceOracle.estimateAmountOut.selector,
                factoryAddress,
                address(token0),
                address(token1),
                uint128(amountIn),
                swapFee
            ),
            abi.encode(expectedAmountOut)
        );

        uint256 amountOut = crossChainIndexFactory.getAmountOut(address(token0), address(token1), amountIn, swapFee);

        assertEq(amountOut, expectedAmountOut, "getAmountOut mismatch");
    }

    function test_sendMessage_SuccessfulSendMessage() public {
        bytes memory data = "Hello cross chain!";
        bytes32 expectedMessageId = bytes32("expectedMessageId");

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(
                IRouterClient.getFee.selector,
                uint64(2),
                abi.encode(
                    Client.EVM2AnyMessage({
                        receiver: abi.encode(add1),
                        data: data,
                        tokenAmounts: new Client.EVMTokenAmount[](0),
                        extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 900_000})),
                        feeToken: address(link)
                    })
                )
            ),
            abi.encode(0)
        );

        vm.mockCall(
            address(router),
            abi.encodeWithSelector(
                IRouterClient.ccipSend.selector,
                uint64(2),
                abi.encode(
                    Client.EVM2AnyMessage({
                        receiver: abi.encode(add1),
                        data: data,
                        tokenAmounts: new Client.EVMTokenAmount[](0),
                        extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 900_000})),
                        feeToken: address(link)
                    })
                )
            ),
            abi.encode(expectedMessageId)
        );

        vm.prank(address(this));
        bytes32 msgId = crossChainIndexFactory.sendMessage(2, add1, data, CrossChainIndexFactory.PayFeesIn.Native);

        //    assertEq(msgId, expectedMessageId, "sendMessage mismatch");
    }
}
