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

  describe("Swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
    //   const res = await UniswapV3Deployer.deploy(owner);
      // return
    // const provider = ethers.getDefaultProvider()
    // console.log(await provider.getBlockNumber())
    const provider: any = owner.provider;
    const weth9 = new ethers.Contract(WethAddresses[`arbitrumSepolia`], WETH9.abi, provider) as IWETH
    const v3Factory = new ethers.Contract(FactoryV3Addresses['arbitrumSepolia'], UniswapV3Factory.abi, provider) as IUniswapV3Factory
    const v3Router = new ethers.Contract(RouterV3Addresses['arbitrumSepolia'], SwapRouter.abi, provider) as ISwapRouter
    const nft = new ethers.Contract(NonfungiblePositionManagers['arbitrumSepolia'], NonfungiblePositionManager.abi, provider) as INonfungiblePositionManager
    const token = new ethers.Contract(CrossChainTokenAddresses['arbitrumSepolia'], WETH9.abi, provider) as IWETH
    
        
      return {owner, otherAccount, v3Factory, v3Router, weth9, nft, token };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();
        
        const signer = deploymentObj.owner;

        let tokens = [];
        tokens[0] = deploymentObj.token.address < deploymentObj.weth9.address ? deploymentObj.token.address : deploymentObj.weth9.address
        tokens[1] = deploymentObj.token.address > deploymentObj.weth9.address ? deploymentObj.token.address : deploymentObj.weth9.address

        let amounts = []
        amounts[0] = tokens[0] == deploymentObj.token.address ? ethers.utils.parseEther("10000") : ethers.utils.parseEther("0.2")
        amounts[1] = tokens[1] == deploymentObj.token.address ? ethers.utils.parseEther("10000") : ethers.utils.parseEther("0.2")

        const poolAddress = await deploymentObj.v3Factory.getPool(tokens[0], tokens[1], "3000");
        console.log("pool address:", poolAddress)
        console.log("weth balance:", ethers.utils.formatEther(await deploymentObj.weth9.balanceOf(poolAddress)))
        console.log("token balancer:", ethers.utils.formatEther(await deploymentObj.token.balanceOf(poolAddress)))
       
      });

      
      });  
    
  });
  