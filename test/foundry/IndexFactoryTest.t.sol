// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../mocks/MockERC20.sol";
// import "../mocks/MockWETH.sol";
import "../../contracts/test/MockRouter2.sol";
// import "../../contracts/test/MockRouter.sol";
// import "../mocks/MockIndexFactoryStorage.sol";
import "../../contracts/factory/IndexFactory.sol";
import "../../contracts/libraries/MessageSender.sol";
import "../../contracts/ccip/CCIPReceiver.sol";

contract IndexFactoryTest is Test, IndexFactory {
    // using MessageSender for address;

    CCIPReceiver ccip;
    IndexFactory indexFactory;
    MockERC20 mockToken;
    MockWETH mockWETH;
    MockRouter2 mockRouter;
    MockIndexFactoryStorage mockStorage;
    IndexFactoryTestImpl indexFactoryImpl;
    // address owner;

    function setUp() external {
        mockToken = new MockERC20("Mock Token", "MTK");
        mockWETH = new MockWETH();
        mockRouter = new MockRouter2();
        mockStorage = new MockIndexFactoryStorage();

        // mockStorage = new MockIndexFactoryStorage(address(mockWETH)); // Pass mock WETH address

        indexFactoryImpl = new IndexFactoryTestImpl();
        indexFactoryImpl.initializeReceiver(address(mockRouter)); // Initialize router

        // Deploy IndexFactory and initialize
        indexFactory = new IndexFactory();
        indexFactory.initialize(
            1, // Chain selector
            payable(address(mockToken)), // IndexToken
            address(mockToken), // Chainlink token
            address(mockRouter), // Router
            address(mockWETH) // WETH
        );

        mockToken.approve(address(mockRouter), type(uint256).max);
        // link.approve(address(router), type(uint256).max);

        indexFactory.setIndexFactoryStorage(address(mockStorage));
    }

    function testInitialization() public {
        assertEq(indexFactory.getRouter(), address(mockRouter), "Router address should match");
        assertEq(address(indexFactory.indexToken()), address(mockToken), "IndexToken address should match");
        assertEq(address(indexFactory.weth()), address(mockWETH), "WETH address should match");
        assertEq(indexFactory.currentChainSelector(), 1, "Chain selector should match");
    }

    function testSetIndexFactoryStorage() public {
        indexFactory.setIndexFactoryStorage(address(mockStorage));
        assertEq(address(indexFactory.factoryStorage()), address(mockStorage), "Factory storage address should match");
    }

    function testSetFeeReceiver() public {
        address newFeeReceiver = address(0x1234);
        indexFactory.setFeeReceiver(newFeeReceiver);
        assertEq(indexFactory.feeReceiver(), newFeeReceiver, "Fee receiver should match");
    }

    // function testIssuanceIndexTokens() public {
    //     uint256 inputAmount = 100 ether;
    //     uint256 feeAmount = FeeCalculation.calculateFee(inputAmount, indexFactory.feeRate());
    //     uint24 swapFee = 3000;

    //     // Mint tokens and approve
    //     mockToken.mint(address(this), inputAmount + feeAmount);
    //     mockToken.approve(address(indexFactory), inputAmount + feeAmount);

    //     // Assert WETH address is valid
    //     assertEq(address(mockWETH), indexFactory.factoryStorage().weth(), "WETH address mismatch");

    //     // Call issuanceIndexTokens
    //     indexFactory.issuanceIndexTokens(address(mockToken), inputAmount, 1 ether, swapFee);

    //     // Verify nonce increment
    //     assertEq(indexFactory.issuanceNonce(), 1, "Issuance nonce should increment");
    // }

    // function testRedemption() public {
    //     uint256 redemptionAmount = 50 ether;

    //     // Mint IndexTokens to the user
    //     mockToken.mint(address(this), redemptionAmount);
    //     mockToken.approve(address(indexFactory), redemptionAmount);

    //     // Call redemption
    //     indexFactory.redemption(redemptionAmount, 1 ether, address(mockToken), 3000);

    //     // Verify nonce increment
    //     assertEq(indexFactory.redemptionNonce(), 1, "Redemption nonce should increment");
    // }

    // function testSendToken() public {
    //     Client.EVMTokenAmount[] memory tokensToSendDetails = new Client.EVMTokenAmount[](1);
    //     tokensToSendDetails[0] = Client.EVMTokenAmount({token: address(mockToken), amount: 10 ether});

    //     mockToken.mint(address(this), 10 ether);
    //     mockToken.approve(address(indexFactory), 10 ether);

    //     bytes memory data = abi.encode("test-data");

    //     // Ensure router is set correctly
    //     assert(indexFactory.getRouterAddress() != address(0));

    //     console.log("Token balance before:", mockToken.balanceOf(address(this)));
    //     console.log("Token allowance for router:", mockToken.allowance(address(this), address(mockRouter)));

    //     // Call sendToken
    //     bytes32 messageId = sendToken(1, data, address(this), tokensToSendDetails, IndexFactory.PayFeesIn.LINK);

    //     console.logBytes32(messageId);
    //     console.log("Token balance after:", mockToken.balanceOf(address(this)));

    //     assertTrue(messageId != bytes32(0), "Message ID should not be zero");
    // }

    function testSetFeeRate() public {
        // Warp time forward by 12 hours
        vm.warp(block.timestamp + 12 hours);

        // Set valid fee rate
        indexFactory.setFeeRate(50); // 0.5%
        assertEq(indexFactory.feeRate(), 50, "Fee rate should be set to 50");
    }

    // function testSendMessage() public {
    //     bytes memory data = abi.encode("test-data");
    //     bytes32 messageId = indexFactory.sendMessage(1, address(this), data, IndexFactory.PayFeesIn.LINK);

    //     assertTrue(messageId != bytes32(0), "Message ID should not be zero");
    // }
}

contract MockWETH is MockERC20 {
    constructor() MockERC20("Wrapped ETH", "WETH") {}

    function deposit() public payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }
}

contract MockRouter {
    function getFee(uint64, Client.EVM2AnyMessage memory) external pure returns (uint256) {
        return 0.1 ether;
    }

    function ccipSend(uint64, Client.EVM2AnyMessage memory) external payable returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, msg.sender));
    }
}

contract MockIndexFactoryStorage {
    function crossChainFactoryBySelector(uint64) external pure returns (address) {
        return address(0x123);
    }

    function crossChainToken(uint64) external pure returns (address) {
        return address(0x456);
    }

    function priceInWei() external pure returns (uint256) {
        return 1 ether;
    }

    function getAmountOut(address, address, uint256, uint24) external pure returns (uint256) {
        return 100;
    }
}

contract IndexFactoryTestImpl is IndexFactory {
    bool private _messageReceived;

    function initializeReceiver(address router) external initializer {
        __ccipReceiver_init(router);
    }
}
