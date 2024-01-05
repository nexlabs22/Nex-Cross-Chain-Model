// import {
//     time,
//     loadFixture,
//   } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH } from "../typechain-types";
import { UniswapV3Deployer } from "./uniswap/UniswapV3Deployer";
  // import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  // import { expect } from "chai";
  import {ethers} from "hardhat";
import { getMaxTick, getMinTick } from "./uniswap/utils/ticks";
import { FeeAmount, TICK_SPACINGS } from "./uniswap/utils/constants";
import { encodePriceSqrt } from "./uniswap/utils/encodePriceSqrt.ts";
  
  describe("Swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
      const res = await UniswapV3Deployer.deploy(owner);
      const weth9 = res["weth9"] as IWETH
      const v3Fctory = res["factory"] as IUniswapV3Factory
      const v3Router = res["router"] as ISwapRouter
      const nft = res["positionManager"] as INonfungiblePositionManager

      //token
      const Token = await ethers.getContractFactory("Token");
      const token0 = await Token.deploy(ethers.utils.parseEther("100000"));
      // const token0Address = await token0.getAddress()
      const token1 = await Token.deploy(ethers.utils.parseEther("100000"));
      // const token1Address = await token1.getAddress()

      //flash swap
      const FlashSwap = await ethers.getContractFactory("SwapExamples");
      const flashSwap = await FlashSwap.deploy(v3Router.address, weth9.address);
        
      return {owner, otherAccount, v3Fctory, v3Router, nft, token0, token1, weth9, flashSwap };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();
        console.log(
          deploymentObj.token0.address,
          deploymentObj.token1.address,
        )
        let tokens = [];
        tokens[0] = deploymentObj.token0.address < deploymentObj.token1.address ? deploymentObj.token0.address : deploymentObj.token1.address
        tokens[1] = deploymentObj.token0.address > deploymentObj.token1.address ? deploymentObj.token0.address : deploymentObj.token1.address
        await deploymentObj.nft.createAndInitializePoolIfNecessary(
          tokens[0],
          tokens[1],
          "3000",
          encodePriceSqrt(1, 1)
        )
      await deploymentObj.token0.approve(deploymentObj.nft.address, ethers.utils.parseEther("1000"));
      await deploymentObj.token1.approve(deploymentObj.nft.address, ethers.utils.parseEther("1000"));

      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

      // const block = new Block()
      const liquidityParams = {
      token0: tokens[0],
      token1: tokens[1],
      fee: "3000",
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: await deploymentObj.owner.getAddress(),
      amount0Desired: ethers.utils.parseEther("1000"),
      amount1Desired: ethers.utils.parseEther("1000"),
      amount0Min: 0,
      amount1Min: 0,
      deadline: unlockTime,
      }
      
      await deploymentObj.nft.mint(liquidityParams)

      const params1 = {
        tokenIn: deploymentObj.token0.address,
        tokenOut: deploymentObj.token1.address,
        fee: FeeAmount.MEDIUM,
        recipient: await deploymentObj.owner.getAddress(),
        deadline: unlockTime,
        // amountIn: ethers.parseEther("1"),
        amountIn: ethers.utils.parseEther("10"),
        amountOutMinimum:0,
        sqrtPriceLimitX96: 0
      }
      const ownerAddress = deploymentObj.owner.getAddress()
      console.log("token0 before swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
      console.log("token1 before swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
      await deploymentObj.token0.approve(deploymentObj.v3Router.address, ethers.utils.parseEther("10"));
      await deploymentObj.v3Router.exactInputSingle(params1);
      console.log("token0 after swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
      console.log("token1 after swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
      });


      it("swap with flash swap contract", async function () {
        // const deploymentObj = await loadFixture(deployContracts);
        const deploymentObj = await deployContracts();
        console.log(
          deploymentObj.token0.address,
          deploymentObj.token1.address,
        )
        let tokens = [];
        tokens[0] = deploymentObj.token0.address < deploymentObj.weth9.address ? deploymentObj.token0.address : deploymentObj.weth9.address
        tokens[1] = deploymentObj.token0.address > deploymentObj.weth9.address ? deploymentObj.token0.address : deploymentObj.weth9.address
        await deploymentObj.nft.createAndInitializePoolIfNecessary(
          deploymentObj.weth9.address,
          // tokens[0],
          deploymentObj.token0.address,
          // tokens[1],
          "3000",
          encodePriceSqrt(1, 1)
        )
      await deploymentObj.token0.approve(deploymentObj.nft.address, ethers.utils.parseEther("1000"));
      await deploymentObj.weth9.deposit({value:ethers.utils.parseEther("1")});
      await deploymentObj.weth9.approve(deploymentObj.nft.address, ethers.utils.parseEther("1"));
      
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
      
      // const block = new Block()
      const liquidityParams = {
      token0: deploymentObj.weth9.address,
      token1: deploymentObj.token0.address,
      fee: "3000",
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: await deploymentObj.owner.getAddress(),
      // amount0Desired: amount0,
      amount0Desired: ethers.utils.parseEther("1"),
      amount1Desired: ethers.utils.parseEther("1000"),
      amount0Min: 0,
      amount1Min: 0,
      deadline: unlockTime,
      }
      
      await deploymentObj.nft.mint(liquidityParams)

      const params1 = {
        tokenIn: deploymentObj.token0.address,
        tokenOut: deploymentObj.weth9.address,
        fee: FeeAmount.MEDIUM,
        recipient: await deploymentObj.owner.getAddress(),
        deadline: unlockTime,
        // amountIn: ethers.parseEther("1"),
        amountIn: ethers.utils.parseEther("10"),
        amountOutMinimum:0,
        sqrtPriceLimitX96: 0
      }
      const ownerAddress = deploymentObj.owner.getAddress()
      console.log("token0 before swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
      // await deploymentObj.token0.approve(deploymentObj.v3Router.target, ethers.parseEther("10"));
      // await deploymentObj.v3Router.exactInputSingle(params1);
      await deploymentObj.weth9.deposit({value:ethers.utils.parseEther("0.1")});
      await deploymentObj.weth9.approve(deploymentObj.flashSwap.target, ethers.utils.parseEther("0.1"));
      console.log("weth before swap:", ethers.utils.formatEther(await deploymentObj.weth9.balanceOf(ownerAddress)))
      
      await deploymentObj.flashSwap.swapExactInputSingle(ethers.utils.parseEther("0.1"), deploymentObj.token0.target);
      console.log("token0 after swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
      console.log("weth after swap:", ethers.utils.formatEther(await deploymentObj.weth9.balanceOf(ownerAddress)))
      });
      });  
    
  });
  