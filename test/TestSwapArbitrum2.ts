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
import { seploliaWethAddress, sepoliaCrossChainTokenAddress, sepoliaFactoryV3Address, sepoliaRouterV3Address, sepoliaRouterV3Address2 } from "../network";
// import { WETH9 } from "@uniswap/sdk-core";
import WETH9 from "./uniswap/utils/WETH9.json";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"
import { arbitrumSepoliaTestRippleAddress, CrossChainTokenAddresses, FactoryV3Addresses, RouterV3Addresses, WethAddresses } from "../contractAddresses";

    
  describe("Swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
    //   const res = await UniswapV3Deployer.deploy(owner);
      // return
    // const provider = ethers.getDefaultProvider()
    const weth9 = new ethers.Contract(WethAddresses[`arbitrumSepolia`], WETH9.abi) as IWETH
    const v3Fctory = new ethers.Contract(FactoryV3Addresses['arbitrumSepolia'], UniswapV3Factory.abi) as IUniswapV3Factory
    const v3Router = new ethers.Contract(RouterV3Addresses['arbitrumSepolia'], SwapRouter.abi) as ISwapRouter
    const token = new ethers.Contract(CrossChainTokenAddresses['arbitrumSepolia'], WETH9.abi) as IWETH
    //   const weth9 = res["weth9"] as IWETH
    //   const v3Fctory = res["factory"] as IUniswapV3Factory
    //   const v3Router = res["router"] as ISwapRouter
    //   const nft = res["positionManager"] as INonfungiblePositionManager
      //token
    // const Token = await ethers.getContractFactory("Token");
    // const token0 = await Token.deploy(ethers.utils.parseEther("100000"));
    // const token1 = await Token.deploy(ethers.utils.parseEther("100000"));
      // const token0Address = await token0.getAddress()
      // const token1Address = await token1.getAddress()

      //flash swap
      // const FlashSwap = await ethers.getContractFactory("SwapExamples");
      // const flashSwap = await FlashSwap.deploy(v3Router.address, weth9.address);
        
      return {owner, otherAccount, v3Fctory, v3Router, weth9, token };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();

        const amountIn = "0.4"
        
        // console.log(
        //   deploymentObj.token0.address,
        //   deploymentObj.token1.address,
        // )
        /**
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
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

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
      */
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

      const params1 = {
        tokenIn: deploymentObj.token.address,
        tokenOut: deploymentObj.weth9.address,
        fee: FeeAmount.MEDIUM,
        recipient: await deploymentObj.owner.getAddress(),
        deadline: unlockTime,
        // amountIn: ethers.parseEther("1"),
        amountIn: ethers.utils.parseEther(amountIn),
        amountOutMinimum:0,
        sqrtPriceLimitX96: 0
      }
      const ownerAddress = deploymentObj.owner.getAddress()
    //   console.log("token0 before swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
    //   console.log("token1 before swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
    //   await deploymentObj.weth9.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther("0.001"));
    //   await deploymentObj.weth9.connect(deploymentObj.owner).deposit({value: ethers.utils.parseEther(amountIn)})
    //   await deploymentObj.weth9.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther(amountIn));
      await deploymentObj.token.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther(amountIn));
      const res = await deploymentObj.v3Router.connect(deploymentObj.owner).exactInputSingle(params1, {gasLimit: 1000000});
      const receipt = await res.wait()
      if(receipt.status == 1){
        console.log("Success")
      }else {
        console.log("Failed")
      }
    //   console.log("token0 after swap:", ethers.utils.formatEther(await .balanceOf(ownerAddress)))
    //   console.log("token1 after swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
      });

      
      });  
    
  });
  