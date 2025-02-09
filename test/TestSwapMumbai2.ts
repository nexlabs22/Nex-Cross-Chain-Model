import { INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH } from "../typechain-types";

  import {ethers} from "hardhat";
import { getMaxTick, getMinTick } from "./uniswap/utils/ticks";
import { FeeAmount, TICK_SPACINGS } from "./uniswap/utils/constants";
import { encodePriceSqrt } from "./uniswap/utils/encodePriceSqrt.ts";
import { mumbaiCrossChainTokenAddress, mumbaiFactoryV3Address, mumbaiRouterV3Address, mumbaiTestRippleAddress, mumbaiWmaticAddress, seploliaWethAddress, sepoliaBitcoinAddress, sepoliaCrossChainTokenAddress, sepoliaFactoryV3Address, sepoliaRouterV3Address } from "../network";
// import { WETH9 } from "@uniswap/sdk-core";
import WETH9 from "./uniswap/utils/WETH9.json";
import UniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import SwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"

  describe("Swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
      const [owner, otherAccount] = await ethers.getSigners();
    //   const res = await UniswapV3Deployer.deploy(owner);
      // return
    // const provider = ethers.getDefaultProvider()
    const weth9 = new ethers.Contract(mumbaiWmaticAddress, WETH9.abi) as IWETH
    const v3Fctory = new ethers.Contract(mumbaiFactoryV3Address, UniswapV3Factory.abi) as IUniswapV3Factory
    const v3Router = new ethers.Contract(mumbaiRouterV3Address, SwapRouter.abi) as ISwapRouter
    const token = new ethers.Contract(mumbaiCrossChainTokenAddress, WETH9.abi) as IWETH
    
      return {owner, otherAccount, v3Fctory, v3Router, weth9, token };
    }
  
    describe("Deployment", function () {
      it("Should set the right unlockTime", async function () {
        const deploymentObj = await deployContracts();
        
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
      });

      
      });  
    
  });
  