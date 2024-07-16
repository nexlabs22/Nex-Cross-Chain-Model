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
import { mumbaiCrossChainTokenAddress, mumbaiFactoryV3Address, mumbaiRouterV3Address, mumbaiWmaticAddress, seploliaWethAddress, sepoliaCrossChainTokenAddress, sepoliaFactoryV3Address, sepoliaRouterV3Address } from "../network";
// import { WETH9 } from "@uniswap/sdk-core";
import WETH9 from "./uniswap/utils/WETH9.json";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"
import NonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"
import { arbitrumSepoliaTestRippleAddress, CrossChainTokenAddresses, FactoryV3Addresses, NonfungiblePositionManagers, RouterV3Addresses, WethAddresses } from "../contractAddresses";
  
  const sepoliaARBIndexTokenAddress = "0x2F8B660e8E2CF66889862d4Ab1569cDe98d67748";
  const sepoliaMAG7IndexTokenAddress = "0x955b3F0091414E7DBbe7bdf2c39d73695CDcDd95";
  
  const token0 = WethAddresses[`sepolia`]
  const token1 = sepoliaARBIndexTokenAddress

  describe("Swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
    //   const res = await UniswapV3Deployer.deploy(owner);
      // return
    // const provider = ethers.getDefaultProvider()
    const weth9 = new ethers.Contract(WethAddresses[`sepolia`], WETH9.abi) as IWETH
    const v3Factory = new ethers.Contract(FactoryV3Addresses['sepolia'], UniswapV3Factory.abi) as IUniswapV3Factory
    const v3Router = new ethers.Contract(RouterV3Addresses['sepolia'], SwapRouter.abi) as ISwapRouter
    const nft = new ethers.Contract(NonfungiblePositionManagers['sepolia'], NonfungiblePositionManager.abi) as INonfungiblePositionManager
    const token = new ethers.Contract(token1, WETH9.abi) as IWETH
    //   const weth9 = res["weth9"] as IWETH
    //   const v3Factory = res["factory"] as IUniswapV3Factory
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
        
      return {owner, otherAccount, v3Factory, v3Router, weth9, nft, token };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();
        // console.log(
        //   deploymentObj.token0.address,
        //   deploymentObj.token1.address,
        // )
        const signer = deploymentObj.owner;

        let tokens = [];
        tokens[0] = deploymentObj.token.address < deploymentObj.weth9.address ? deploymentObj.token.address : deploymentObj.weth9.address
        tokens[1] = deploymentObj.token.address > deploymentObj.weth9.address ? deploymentObj.token.address : deploymentObj.weth9.address

        let amounts = []
        amounts[0] = tokens[0] == deploymentObj.token.address ? ethers.utils.parseEther("1000") : ethers.utils.parseEther("0.2")
        amounts[1] = tokens[1] == deploymentObj.token.address ? ethers.utils.parseEther("1000") : ethers.utils.parseEther("0.2")
        const price0 = tokens[0] == deploymentObj.token.address ? 2 : 100000
        const price1 = tokens[1] == deploymentObj.token.address ? 2 : 100000
    //     console.log("createAndInitializePoolIfNecessary..")
    //     await deploymentObj.nft.connect(signer).createAndInitializePoolIfNecessary(
    //       tokens[0],
    //       tokens[1],
    //       "3000",
    //       encodePriceSqrt(price0, price1)
    //     )
    //   console.log("approve token ...")
    //   await deploymentObj.token.connect(signer).approve(deploymentObj.nft.address, ethers.utils.parseEther("10000"));
    //   console.log("deposit weth ...")
    //   await deploymentObj.weth9.connect(signer).deposit({value:ethers.utils.parseEther("0.2")});
    //   console.log("approve weth ...")
    //   await deploymentObj.weth9.connect(signer).approve(deploymentObj.nft.address, ethers.utils.parseEther("0.2"));
      
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

      // const block = new Block()
      const liquidityParams = {
      token0: tokens[0],
      token1: tokens[1],
      fee: "3000",
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: await deploymentObj.owner.getAddress(),
      amount0Desired: amounts[0],
      amount1Desired: amounts[1],
      amount0Min: 0,
      amount1Min: 0,
      deadline: unlockTime,
      }
      console.log("adding liquidity ...")
      const res = await deploymentObj.nft.connect(signer).mint(liquidityParams, {gasLimit: 3000000})
      const receipt = await res.wait()
      if(receipt.status == 1){
        console.log("Success")
      }else {
        console.log("Failed")
      }
      /**
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    //   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

      const params1 = {
        tokenIn: deploymentObj.weth9.address,
        tokenOut: deploymentObj.token.address,
        fee: FeeAmount.MEDIUM,
        recipient: await deploymentObj.owner.getAddress(),
        deadline: unlockTime,
        // amountIn: ethers.parseEther("1"),
        amountIn: ethers.utils.parseEther("0.0001"),
        amountOutMinimum:0,
        sqrtPriceLimitX96: 0
      }
      const ownerAddress = deploymentObj.owner.getAddress()
    //   console.log("token0 before swap:", ethers.utils.formatEther(await deploymentObj.token0.balanceOf(ownerAddress)))
    //   console.log("token1 before swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
      const depositRes = await deploymentObj.weth9.connect(deploymentObj.owner).deposit({value: ethers.utils.parseEther("0.0001")})
    //   await depositRes.wait()
      const approveRes = await deploymentObj.weth9.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther("0.0001"));
    //   await approveRes.wait()
    //   await deploymentObj.token.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther("0.0001"));
      const res = await deploymentObj.v3Router.connect(deploymentObj.owner).exactInputSingle(params1, {gasLimit: 1000000});
      const receipt = await res.wait()
      if(receipt.status == 1){
        console.log("Success")
      }else {
        console.log("Failed")
      }
    //   console.log("token0 after swap:", ethers.utils.formatEther(await .balanceOf(ownerAddress)))
    //   console.log("token1 after swap:", ethers.utils.formatEther(await deploymentObj.token1.balanceOf(ownerAddress)))
     */
      });

      
      });  
    
  });
  