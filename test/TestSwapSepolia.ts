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
import { seploliaWethAddress, sepoliaCrossChainTokenAddress, sepoliaFactoryV3Address, sepoliaRouterV3Address } from "../network";
// import { WETH9 } from "@uniswap/sdk-core";
import WETH9 from "./uniswap/utils/WETH9.json";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"
import { WethAddresses } from "../contractAddresses";
  
const sepoliaARBIndexTokenAddress = "0x2F8B660e8E2CF66889862d4Ab1569cDe98d67748";
const sepoliaMAG7IndexTokenAddress = "0x955b3F0091414E7DBbe7bdf2c39d73695CDcDd95";

const token1 = sepoliaARBIndexTokenAddress
const fromETH = false;
const amountIn = "0.1";


  describe("Swap", function () {
    this.timeout(100000); // 100 seconds
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
    //   const res = await UniswapV3Deployer.deploy(owner);
      // return
    // const provider = ethers.getDefaultProvider()
    const weth9 = new ethers.Contract(seploliaWethAddress, WETH9.abi) as IWETH
    const v3Fctory = new ethers.Contract(sepoliaFactoryV3Address, UniswapV3Factory.abi) as IUniswapV3Factory
    const v3Router = new ethers.Contract(sepoliaRouterV3Address, SwapRouter.abi) as ISwapRouter
    const token = new ethers.Contract(token1, WETH9.abi) as IWETH
    
      return {owner, otherAccount, v3Fctory, v3Router, weth9, token };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();
        
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

      const params1 = {
        tokenIn: fromETH ? deploymentObj.weth9.address :deploymentObj.token.address,
        tokenOut: fromETH ? deploymentObj.token.address :deploymentObj.weth9.address,
        fee: FeeAmount.MEDIUM,
        recipient: await deploymentObj.owner.getAddress(),
        deadline: unlockTime,
        // amountIn: fromETH ? ethers.utils.parseEther("0.001") :ethers.utils.parseEther("1"),
        amountIn: ethers.utils.parseEther(amountIn),
        amountOutMinimum:0,
        sqrtPriceLimitX96: 0
      }
      const ownerAddress = deploymentObj.owner.getAddress()
      if(fromETH){
      console.log("depositing weth...")
      const depositRes = await deploymentObj.weth9.connect(deploymentObj.owner).deposit({value: ethers.utils.parseEther(amountIn)})
      await depositRes.wait()
      console.log("approving weth...")
      const approveRes = await deploymentObj.weth9.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther(amountIn));
      await approveRes.wait()
      } else {
      console.log("approving token...")
      const approveRes = await deploymentObj.token.connect(deploymentObj.owner).approve(deploymentObj.v3Router.address, ethers.utils.parseEther(amountIn));
      await approveRes.wait()
      }
      console.log("swap...")
      const res = await deploymentObj.v3Router.connect(deploymentObj.owner).exactInputSingle(params1, {gasLimit: 1000000});
      const receipt = await res.wait()
      if(receipt.status == 1){
        console.log("Success")
      }else {
        console.log("Failed")
      }
       });

      
      });  
    
  });
  