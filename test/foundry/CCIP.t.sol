// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {
    CCIPLocalSimulator,
    IRouterClient,
    LinkToken,
    BurnMintERC677Helper
} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {MockRouter2} from "contracts/test/MockRouter2.sol";
import {MockRouter3} from "contracts/test/MockRouter3.sol";
contract CCIPTest is Test {
    CCIPLocalSimulator public ccipLocalSimulator;

    address alice;
    address bob;
    IRouterClient router;
    MockRouter2 router2;
    MockRouter3 router3;
    uint64 destinationChainSelector;
    BurnMintERC677Helper ccipBnMToken;
    LinkToken linkToken;

    function setUp() public {
        ccipLocalSimulator = new CCIPLocalSimulator();

        (uint64 chainSelector, IRouterClient sourceRouter,,, LinkToken link, BurnMintERC677Helper ccipBnM,) =
            ccipLocalSimulator.configuration();

        alice = makeAddr("alice");
        bob = makeAddr("bob");

        router = sourceRouter;
        router2 = new MockRouter2();
        router3 = new MockRouter3();
        destinationChainSelector = chainSelector;
        ccipBnMToken = ccipBnM;
        linkToken = link;
    }

    function prepareScenario()
        public
        returns (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend)
    {
        vm.startPrank(alice);

        ccipBnMToken.drip(alice);

        amountToSend = 100;
        ccipBnMToken.approve(address(router), amountToSend);
        ccipBnMToken.approve(address(router2), amountToSend);
        ccipBnMToken.approve(address(router3), amountToSend);

        tokensToSendDetails = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenToSendDetails =
            Client.EVMTokenAmount({token: address(ccipBnMToken), amount: amountToSend});
        tokensToSendDetails[0] = tokenToSendDetails;

        vm.stopPrank();
    }

    function test_transferTokensFromEoaToEoaPayFeesInLink() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        ccipLocalSimulator.requestLinkFromFaucet(alice, 5 ether);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(bob),
            data: abi.encode(""),
            tokenAmounts: tokensToSendDetails,
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 0})),
            feeToken: address(linkToken)
        });

        uint256 fees = router.getFee(destinationChainSelector, message);
        linkToken.approve(address(router), fees);

        router.ccipSend(destinationChainSelector, message);
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);
        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }

    function test_transferTokensFromEoaToEoaPayFeesInLink2() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        ccipLocalSimulator.requestLinkFromFaucet(alice, 5 ether);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(bob),
            data: abi.encode(""),
            tokenAmounts: tokensToSendDetails,
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 0})),
            feeToken: address(linkToken)
        });

        uint256 fees = router2.getFee(destinationChainSelector, message);
        // linkToken.approve(address(router2), fees);

        router2.ccipSend(destinationChainSelector, message);
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);
        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }


    function test_transferTokensFromEoaToEoaPayFeesInLink3() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        ccipLocalSimulator.requestLinkFromFaucet(alice, 5 ether);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(bob),
            data: abi.encode(""),
            tokenAmounts: tokensToSendDetails,
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 0})),
            feeToken: address(linkToken)
        });

        uint256 fees = router3.getFee(destinationChainSelector, message);
        // linkToken.approve(address(router2), fees);

        router3.ccipSend(destinationChainSelector, message);
        router3.executeAllMessages();
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);
        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }


    function test_transferTokensFromEoaToEoaPayFeesInNative() external {
        (Client.EVMTokenAmount[] memory tokensToSendDetails, uint256 amountToSend) = prepareScenario();

        uint256 balanceOfAliceBefore = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobBefore = ccipBnMToken.balanceOf(bob);

        vm.startPrank(alice);
        deal(alice, 5 ether);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(bob),
            data: abi.encode(""),
            tokenAmounts: tokensToSendDetails,
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 0})),
            feeToken: address(0)
        });

        uint256 fees = router.getFee(destinationChainSelector, message);
        router.ccipSend{value: fees}(destinationChainSelector, message);
        vm.stopPrank();

        uint256 balanceOfAliceAfter = ccipBnMToken.balanceOf(alice);
        uint256 balanceOfBobAfter = ccipBnMToken.balanceOf(bob);
        assertEq(balanceOfAliceAfter, balanceOfAliceBefore - amountToSend);
        assertEq(balanceOfBobAfter, balanceOfBobBefore + amountToSend);
    }
}