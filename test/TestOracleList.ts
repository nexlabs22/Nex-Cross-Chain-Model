
import { ContractReceipt, ContractTransaction, Signer, constants } from "ethers";
import { ethers } from "hardhat";
import { BasicMessageReceiver, BasicTokenSender, INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH, IndexFactory, IndexToken, LinkToken, MockApiOracle, MockRouter, MockV3Aggregator, Token, IndexFactoryStorage } from "../typechain-types";
import { UniswapV3Deployer } from "./uniswap/UniswapV3Deployer";
import { expect } from 'chai';
import { BasicMessageSender } from "../typechain-types/contracts/ccip";
import { encodePriceSqrt } from "./uniswap/utils/encodePriceSqrt.ts";
import { getMaxTick, getMinTick } from "./uniswap/utils/ticks";
import { FeeAmount, TICK_SPACINGS } from "./uniswap/utils/constants";
import { deployment, updateOracleList } from "./Deployer";
// import { IndexFactoryStorage } from "../typechain-types/artifacts/contracts/factory/IndexFactoryStorage.sol";
  
  describe("TEST ORACLE LIST", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    let mockRouter: MockRouter
    let linkToken : LinkToken
    let basicMessageSender :BasicMessageSender
    let basicTokenSender : BasicTokenSender
    let basicMessageReceiver : BasicMessageReceiver
    let owner : any
    let otherAccount : any
    let token0 : Token
    let token1 : Token
    let weth9: IWETH
    let v3Factory: IUniswapV3Factory
    let v3Router: ISwapRouter
    let nft: INonfungiblePositionManager
    let indexToken : IndexToken
    let indexFactoryStorage : IndexFactoryStorage
    let indexFactory : IndexFactory
    let oracle : MockApiOracle
    let ethPriceOracle: MockV3Aggregator

    beforeEach(async function () {
      const deploymentObject = await deployment();

      mockRouter = deploymentObject.mockRouter,
      linkToken = deploymentObject.linkToken,
      basicMessageSender = deploymentObject.basicMessageSender,
      basicTokenSender = deploymentObject.basicTokenSender,
      basicMessageReceiver = deploymentObject.basicMessageReceiver,
      owner = deploymentObject.owner,
      otherAccount = deploymentObject.otherAccount,
      token0 = deploymentObject.token0,
      token1 = deploymentObject.token1,
      // token2 = deploymentObject.token2,
      // token3 = deploymentObject.token3,
      // token4 = deploymentObject.token4,
      // crossChainToken = deploymentObject.crossChainToken,
      weth9 = deploymentObject.weth9,
      v3Factory = deploymentObject.v3Factory,
      v3Router = deploymentObject.v3Router,
      nft = deploymentObject.nft,
      indexToken = deploymentObject.indexToken,
      indexFactoryStorage = deploymentObject.indexFactoryStorage,
      indexFactory = deploymentObject.indexFactory,
      // crossChainVault = deploymentObject.crossChainVault,
      // crossChainIndexFactory = deploymentObject.crossChainIndexFactory,
      oracle = deploymentObject.oracle,
      ethPriceOracle = deploymentObject.ethPriceOracle
    })
    
    async function addLiquidityEth(token: Token, ethAmount: string, tokenAmount: string){
      let tokens = [];
      tokens[0] = token.address < weth9.address ? token.address : weth9.address
      tokens[1] = token.address > weth9.address ? token.address : weth9.address
      const amount0 = tokens[0] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)
      const amount1 = tokens[1] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)

      await nft.createAndInitializePoolIfNecessary(
        // weth9.address,
        tokens[0],
        // token0.address,
        tokens[1],
        "3000",
        encodePriceSqrt(1, 1)
      )
      // return
      await token.approve(nft.address, ethers.utils.parseEther(tokenAmount));
      await weth9.deposit({value:ethers.utils.parseEther(ethAmount)});
      await weth9.approve(nft.address, ethers.utils.parseEther(ethAmount));
      
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;
      // return;
      // const block = new Block()
      const liquidityParams = {
      token0: tokens[0],
      token1: tokens[1],
      fee: "3000",
      tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
      recipient: owner.address,
      // amount0Desired: amount0,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: 0,
      amount1Min: 0,
      deadline: unlockTime,
      }
      
      await nft.mint(liquidityParams)


    }

    
  
    describe("Deployment", function () {
      it("Test oracle list", async function () {
        //adding liquidity
        await addLiquidityEth(token0, "1", "1000")
        //update oracle list
        const assetList = [
          token0.address,
          token1.address
        ]
        const percentages = ["70000000000000000000", "30000000000000000000"]
        const swapVersions = ["3", "3"]
        const chainSelectors = ["1", "2"]
        await updateOracleList(linkToken, indexFactoryStorage, oracle, assetList, percentages, swapVersions, chainSelectors)
        //check oracle list
        expect(await indexFactory.oracleList("0")).to.be.equal(token0.address)
        expect(ethers.utils.formatEther(await indexFactory.tokenOracleMarketShare(token0.address))).to.be.equal("70.0")
        expect((await indexFactory.tokenChainSelector(token0.address))).to.be.equal("1")
      });

      it("Test manual swap", async function () {
        //adding liquidity
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

        await addLiquidityEth(token0, "1", "1000")
        const params1 = {
          tokenIn: weth9.address,
          tokenOut: token0.address,
          fee: FeeAmount.MEDIUM,
          recipient: await owner.getAddress(),
          deadline: unlockTime,
          amountIn: ethers.utils.parseEther("0.1"),
          amountOutMinimum:0,
          sqrtPriceLimitX96: 0
        }
        const ownerAddress = owner.address
        console.log("token0 before swap:", ethers.utils.formatEther(await token0.balanceOf(ownerAddress)))
        // await deploymentObj.token0.approve(deploymentObj.v3Router.target, ethers.parseEther("10"));
        // await deploymentObj.v3Router.exactInputSingle(params1);
        await weth9.deposit({value:ethers.utils.parseEther("0.1")});
        await weth9.approve(v3Router.address, ethers.utils.parseEther("0.1"));
        console.log("weth before swap:", ethers.utils.formatEther(await weth9.balanceOf(ownerAddress)))

        console.log("expected token before swap:", ethers.utils.formatEther(await indexFactory.estimateAmountOut(weth9.address, token0.address, ethers.utils.parseEther("0.1"), "1")))

        await v3Router.exactInputSingle(params1);
        console.log("token0 after swap:", ethers.utils.formatEther(await token0.balanceOf(ownerAddress)))
        console.log("weth after swap:", ethers.utils.formatEther(await weth9.balanceOf(ownerAddress)))
      });

      
      
      
    });
  });
  