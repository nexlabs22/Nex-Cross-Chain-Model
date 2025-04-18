// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "forge-std/Test.sol";
import "../../contracts/token/IndexToken.sol";
import "../../contracts/test/MockV3Aggregator.sol";
import "../../contracts/test/MockApiOracle.sol";
import "../../contracts/test/LinkToken.sol";
import "./ContractDeployer.sol";


contract CounterTest is Test, ContractDeployer {


    uint256 internal constant SCALAR = 1e20;
    // bytes32 jobId = "6b88e0402e5d415eb946e528b8e0c7ba";

    // IndexToken public indexToken;
    // MockApiOracle public oracle;
    // LinkToken link;

    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant QUOTER = 0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6;
    // address public constant SwapRouterV3 = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    // address public constant FactoryV3 = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    // address public constant SwapRouterV2 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    // address public constant FactoryV2 = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    
    // address feeReceiver = vm.addr(1);
    // address newFeeReceiver = vm.addr(2);
    // address minter = vm.addr(3);
    // address newMinter = vm.addr(4);
    // address methodologist = vm.addr(5);


    event FeeReceiverSet(address indexed feeReceiver);
    event FeeRateSet(uint256 indexed feeRatePerDayScaled);
    event MethodologistSet(address indexed methodologist);
    event MethodologySet(string methodology);
    event MinterSet(address indexed minter);
    event SupplyCeilingSet(uint256 supplyCeiling);
    event MintFeeToReceiver(address feeReceiver, uint256 timestamp, uint256 totalSupply, uint256 amount);
    event ToggledRestricted(address indexed account, bool isRestricted);

    
    

    function setUp() public {
        // ContractDeployer deployer = new ContractDeployer();
        // (link, oracle, indexToken) = deployer.deployContracts();
        deployAllContracts(1000000e18);
        // (link, oracle, indexToken,,,) = deployContracts();
        indexToken.setMinter(minter, true);
        /**
        LinkToken link = new LinkToken();
        oracle = new MockApiOracle(address(link));

        indexToken = new IndexToken();
        indexToken.initialize(
            "Anti Inflation",
            "ANFI",
            1e18,
            feeReceiver,
            1000000e18,
            //swap addresses
            WETH9,
            QUOTER,
            SwapRouterV3,
            FactoryV3,
            SwapRouterV2,
            FactoryV2
        );
        indexToken.setMinter(minter, true);
        */
    }

    function testInitialized() public {
        // counter.increment();
        assertEq(indexToken.owner(), address(this));
        assertEq(indexToken.feeRatePerDayScaled(), 1e18);
        assertEq(indexToken.feeTimestamp(), block.timestamp);
        assertEq(indexToken.feeReceiver(), feeReceiver);
        assertEq(indexToken.methodology(), "");
        assertEq(indexToken.supplyCeiling(), 1000000e18);
        assertEq(indexToken.isMinter(minter), true);
    }

    function testMintOnlyMinter() public {
        vm.expectRevert("IndexToken: caller is not the minter");
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 0);
    }

    function testMintWhenNotPaused() public {
        indexToken.pause();
        vm.startPrank(minter);
        vm.expectRevert("Pausable: paused");
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 0);
        vm.stopPrank();

        indexToken.unpause();
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);

    }

    function testMintExceedSupply() public {
        vm.startPrank(minter);
        vm.expectRevert("will exceed supply ceiling");
        indexToken.mint(address(this), 1000000e18 +1);
        assertEq(indexToken.balanceOf(address(this)), 0);
        indexToken.mint(address(this), 1000000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000000e18);
    }

    function testMintToRestricted() public {
        indexToken.toggleRestriction(address(this));
        vm.startPrank(minter);
        vm.expectRevert("to is restricted");
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 0);
    }

    function testMintMsgRestricted() public {
        indexToken.toggleRestriction(minter);
        vm.startPrank(minter);
        vm.expectRevert("msg.sender is restricted");
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 0);
    }

    function testMint() public {
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        assertEq(indexToken.totalSupply(), 1000e18);
    }

    function testBurnOnlyMinter() public {
        vm.expectRevert("IndexToken: caller is not the minter");
        indexToken.burn(address(this), 1000e18);
    }

    function testBurnWhenNotPaused() public {
        indexToken.pause();
        vm.startPrank(minter);
        vm.expectRevert("Pausable: paused");
        indexToken.burn(address(this), 1000e18);
    }

    function testBurnFromIsRestricted() public {
        indexToken.toggleRestriction(address(this));
        vm.startPrank(minter);
        vm.expectRevert("from is restricted");
        indexToken.burn(address(this), 1000e18);
    }

    function testBurnMsgIsRestricted() public {
        indexToken.toggleRestriction(minter);
        vm.startPrank(minter);
        vm.expectRevert("msg.sender is restricted");
        indexToken.burn(address(this), 1000e18);
    }


    function testBurn() public {
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        indexToken.burn(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 0);
    }


    function testMintForFeeReceiver() public {
        //mint 1000 index token        
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        assertEq(indexToken.totalSupply(), 1000e18);
        //move time for 1 day      
        uint newTime = block.timestamp + 1 days;
        vm.warp(newTime);
        //calcualte fee amount
        uint feePerDay = indexToken.feeRatePerDayScaled();
        uint totalSupply = indexToken.totalSupply();
        uint expectedFeeAmount = ((feePerDay*totalSupply)/1e20);
        vm.stopPrank();
        //call mintForFeeReceiver and check fee
        indexToken.mintToFeeReceiver();
        assertEq(indexToken.balanceOf(feeReceiver), expectedFeeAmount);
        assertEq(indexToken.totalSupply(), 1000e18 + expectedFeeAmount);
    }


    function testMintForFeeReceiverOneDay() public {
        //mint 1000 index token        
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        assertEq(indexToken.totalSupply(), 1000e18);
        //move time for 1 day      
        uint newTime = block.timestamp + 1 days;
        vm.warp(newTime);
        //calcualte fee amount
        uint feePerDay = indexToken.feeRatePerDayScaled();
        uint totalSupply = indexToken.totalSupply();
        uint expectedFeeAmount = ((feePerDay*totalSupply)/1e20);
        //mint another 1000 token and check fee
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 2000e18);
        assertEq(indexToken.balanceOf(feeReceiver), expectedFeeAmount);
        assertEq(indexToken.totalSupply(), 2000e18 + expectedFeeAmount);
    }


    function testMintForFeeReceiverTenDays() public {
        //mint 1000 index token        
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        assertEq(indexToken.totalSupply(), 1000e18);
        //move time for 1 day      
        uint newTime = block.timestamp + 10 days;
        vm.warp(newTime);
        //calcualte fee amount
        uint256 _days = (block.timestamp - indexToken.feeTimestamp()) / 1 days;
        uint feePerDay = indexToken.feeRatePerDayScaled();
        uint totalSupply = indexToken.totalSupply();
        uint supply = totalSupply;
        // for (uint256 i; i < _days; ) {
        //         supply += ((supply * feePerDay) / SCALAR);
        //         unchecked {
        //             ++i;
        //         }
        // }
         // Use a logarithmic approximation for compounding
        uint256 compoundedFeeRate = SCALAR + (feePerDay * _days);
        // Calculate the compounded supply
        supply = (supply * compoundedFeeRate) / SCALAR;
        
        uint expectedFeeAmount = supply - totalSupply;
        //mint another 1000 token and check fee
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 2000e18);
        assertEq(indexToken.balanceOf(feeReceiver), expectedFeeAmount);
        assertEq(indexToken.totalSupply(), 2000e18 + expectedFeeAmount);
    }


    function testSetMethodologist() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit MethodologistSet(methodologist);
        //set data
        assertEq(indexToken.methodologist(), address(0));
        indexToken.setMethodologist(methodologist);
        assertEq(indexToken.methodologist(), methodologist);
    }

    function testSetMethodology() public {
        //set metodologist
        indexToken.setMethodologist(methodologist);
        assertEq(indexToken.methodologist(), methodologist);

        vm.expectRevert("IndexToken: caller is not the methodologist");
        indexToken.setMethodology("Test");

        vm.startPrank(methodologist);
        // check event
        vm.expectEmit(true, true, true, true);
        emit MethodologySet("Test");
        //set data
        assertEq(indexToken.methodology(), "");
        indexToken.setMethodology("Test");
        assertEq(indexToken.methodology(), "Test");
    }

    function testSetFeeRate() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit FeeRateSet(2e18);
        //set data
        assertEq(indexToken.feeRatePerDayScaled(), 1e18);
        indexToken.setFeeRate(2e18);
        assertEq(indexToken.feeRatePerDayScaled(), 2e18);
    }

    function testSetFeeReceiver() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit FeeReceiverSet(newFeeReceiver);
        //set data
        assertEq(indexToken.feeReceiver(), feeReceiver);
        indexToken.setFeeReceiver(newFeeReceiver);
        assertEq(indexToken.feeReceiver(), newFeeReceiver);
    }

    function testSetMinter() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit MinterSet(newMinter);
        //set data
        assertEq(indexToken.isMinter(minter), true);
        indexToken.setMinter(newMinter, true);
        assertEq(indexToken.isMinter(newMinter), true);
    }

    function testSetSupplyCeiling() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit SupplyCeilingSet(2000000e18);
        //set data
        assertEq(indexToken.supplyCeiling(), 1000000e18);
        indexToken.setSupplyCeiling(2000000e18);
        assertEq(indexToken.supplyCeiling(), 2000000e18);
    }


    function testToggleRestriction() public {
        // check event
        vm.expectEmit(true, true, true, true);
        emit ToggledRestricted(minter, true);
        //enable restrict
        assertEq(indexToken.isRestricted(minter), false);
        indexToken.toggleRestriction(minter);
        assertEq(indexToken.isRestricted(minter), true);
        // check event
        vm.expectEmit(true, true, true, true);
        emit ToggledRestricted(minter, false);
        //disable restrict
        indexToken.toggleRestriction(minter);
        assertEq(indexToken.isRestricted(minter), false);  
    }

    function testTransferWhenNotPaused() public {
        // mint tokens
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        vm.stopPrank();
        //pause
        indexToken.pause();
        vm.expectRevert("Pausable: paused");
        indexToken.transfer(minter, 100e18);
        //unpause
        indexToken.unpause();
        indexToken.transfer(minter, 100e18);
        assertEq(indexToken.balanceOf(address(this)), 900e18);
        assertEq(indexToken.balanceOf(minter), 100e18);
    }

    function testTransferWhenToIsRestricted() public {
        //mint tokens
        vm.startPrank(minter);
        indexToken.mint(address(this), 1000e18);
        assertEq(indexToken.balanceOf(address(this)), 1000e18);
        vm.stopPrank();
        //restrict user
        indexToken.toggleRestriction(minter);
        vm.expectRevert("to is restricted");
        indexToken.transfer(minter, 100e18);
        //unrestrict user
        indexToken.toggleRestriction(minter);
        indexToken.transfer(minter, 100e18);
        assertEq(indexToken.balanceOf(address(this)), 900e18);
        assertEq(indexToken.balanceOf(minter), 100e18);
    }

    function testTransferWhenMsgIsRestricted() public {
        //mint tokens
        vm.startPrank(minter);
        indexToken.mint(minter, 1000e18);
        assertEq(indexToken.balanceOf(minter), 1000e18);
        vm.stopPrank();
        //restrict user
        indexToken.toggleRestriction(minter);
        vm.startPrank(minter);
        vm.expectRevert("msg.sender is restricted");
        indexToken.transfer(address(this), 100e18);
        vm.stopPrank();
        //unrestrict user
        indexToken.toggleRestriction(minter);
        vm.startPrank(minter);
        indexToken.transfer(address(this), 100e18);
        assertEq(indexToken.balanceOf(address(this)), 100e18);
        assertEq(indexToken.balanceOf(minter), 900e18);
    }

    function testTransferFromWhenNotPaused() public {
        // mint tokens
        vm.startPrank(minter);
        indexToken.mint(minter, 1000e18);
        assertEq(indexToken.balanceOf(minter), 1000e18);
        //approve
        indexToken.approve(address(this), 100e18);
        vm.stopPrank();
        //pause
        indexToken.pause();
        vm.expectRevert("Pausable: paused");
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        //unpause
        indexToken.unpause();
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        assertEq(indexToken.balanceOf(feeReceiver), 100e18);
        assertEq(indexToken.balanceOf(minter), 900e18);
    }

    function testTransferFromWhenFromIsRestricted() public {
        // mint tokens
        vm.startPrank(minter);
        indexToken.mint(minter, 1000e18);
        assertEq(indexToken.balanceOf(minter), 1000e18);
        //approve
        indexToken.approve(address(this), 100e18);
        vm.stopPrank();
        //restrict
        indexToken.toggleRestriction(minter);
        vm.expectRevert("from is restricted");
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        //unrestrict
        indexToken.toggleRestriction(minter);
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        assertEq(indexToken.balanceOf(feeReceiver), 100e18);
        assertEq(indexToken.balanceOf(minter), 900e18);
    }

    function testTransferFromWhenToIsRestricted() public {
        // mint tokens
        vm.startPrank(minter);
        indexToken.mint(minter, 1000e18);
        assertEq(indexToken.balanceOf(minter), 1000e18);
        //approve
        indexToken.approve(address(this), 100e18);
        vm.stopPrank();
        //restrict
        indexToken.toggleRestriction(feeReceiver);
        vm.expectRevert("to is restricted");
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        //unrestrict
        indexToken.toggleRestriction(feeReceiver);
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        assertEq(indexToken.balanceOf(feeReceiver), 100e18);
        assertEq(indexToken.balanceOf(minter), 900e18);
    }

    function testTransferFromWhenMsgIsRestricted() public {
        // mint tokens
        vm.startPrank(minter);
        indexToken.mint(minter, 1000e18);
        assertEq(indexToken.balanceOf(minter), 1000e18);
        //approve
        indexToken.approve(address(this), 100e18);
        vm.stopPrank();
        //restrict
        indexToken.toggleRestriction(address(this));
        vm.expectRevert("msg.sender is restricted");
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        //unrestrict
        indexToken.toggleRestriction(address(this));
        indexToken.transferFrom(minter, feeReceiver, 100e18);
        assertEq(indexToken.balanceOf(feeReceiver), 100e18);
        assertEq(indexToken.balanceOf(minter), 900e18);
    }

    
}