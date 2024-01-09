
import { ContractReceipt, ContractTransaction, Signer, constants } from "ethers";
import { ethers } from "hardhat";
import { BasicMessageReceiver, BasicTokenSender, INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH, IndexFactory, IndexToken, LinkToken, MockApiOracle, MockRouter, MockV3Aggregator, Token } from "../typechain-types";
import { UniswapV3Deployer } from "./uniswap/UniswapV3Deployer";
import { expect } from 'chai';
import { BasicMessageSender } from "../typechain-types/contracts/ccip";
import { encodePriceSqrt } from "./uniswap/utils/encodePriceSqrt.ts";
import { getMaxTick, getMinTick } from "./uniswap/utils/ticks";
import { FeeAmount, TICK_SPACINGS } from "./uniswap/utils/constants";
  
  describe("Lock", function () {
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
    let indexFactory : IndexFactory
    let oracle : MockApiOracle
    let ethPriceOracle: MockV3Aggregator

    beforeEach(async function () {
      [owner, otherAccount] = await ethers.getSigners();
  
      
      const MockRouter = await ethers.getContractFactory("MockRouter");
      mockRouter = await MockRouter.deploy();

      const LinkToken = await ethers.getContractFactory("LinkToken");
      linkToken = await LinkToken.deploy();

      const Token = await ethers.getContractFactory("Token");
      token0 = await Token.deploy(ethers.utils.parseEther("1000000"));
      token1 = await Token.deploy(ethers.utils.parseEther("100000"));

      const BasicMessageSender = await ethers.getContractFactory("BasicMessageSender");
      basicMessageSender = await BasicMessageSender.deploy(mockRouter.address, linkToken.address);

      const BasicTokenSender = await ethers.getContractFactory("BasicTokenSender");
      basicTokenSender = await BasicTokenSender.deploy(mockRouter.address, linkToken.address);

      const BasicMessageReceiver = await ethers.getContractFactory("BasicMessageReceiver");
      basicMessageReceiver = await BasicMessageReceiver.deploy(mockRouter.address);
      
      const res = await UniswapV3Deployer.deploy(owner);
      // return
      weth9 = res["weth9"] as IWETH
      v3Factory = res["factory"] as IUniswapV3Factory
      v3Router = res["router"] as ISwapRouter
      nft = res["positionManager"] as INonfungiblePositionManager
      //deploy api oracle
      const Oracle = await ethers.getContractFactory("MockApiOracle");
      oracle = await Oracle.deploy(linkToken.address);
      //deploy eth price oracle
      const EthPriceOracle = await ethers.getContractFactory("MockV3Aggregator");
      ethPriceOracle = await EthPriceOracle.deploy('18', ethers.utils.parseEther("2000"));
      //deploy index token
      const IndexToken = await ethers.getContractFactory("IndexToken");
      
      indexToken = await IndexToken.deploy()
      await indexToken.initialize(
            "Anti Inflation",
            "ANFI",
            (1e18).toString(),
            owner.address,
            ethers.utils.parseEther("1000000").toString(),
            //swap addresses
            weth9.address,
            v3Router.address,//quoter
            v3Router.address,
            v3Factory.address,
            v3Router.address, //router v2
            v3Factory.address //factory v2
      )
      
      const jobId = ethers.utils.toUtf8Bytes("29fa9aa13bf1468788b7cc4a500a45b8"); //test job id
      const fee = "100000000000000000" // fee = 0.1 linkToken

      const IndexFactory = await ethers.getContractFactory("IndexFactory");
      indexFactory = await IndexFactory.deploy()

      await indexFactory.initialize(
            indexToken.address,
            linkToken.address,
            oracle.address,
            jobId,
            ethPriceOracle.address,
            //swap addresses
            weth9.address,
            v3Router.address, //quoter
            v3Router.address,
            v3Factory.address,
            v3Router.address, //v2
            v3Factory.address //v2
      )
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

    async function updateOracleList(){
      const assetList = [
        token0.address,
        token1.address
    ]
    const percentages = ["70000000000000000000", "30000000000000000000"]
    const swapVersions = ["3", "3"]
    //update oracle list
    await linkToken.transfer(indexFactory.address, 1e17.toString());
    const transaction: ContractTransaction = await indexFactory.requestAssetsData();
    const transactionReceipt:any = await transaction.wait(1);
    const requestId: string = transactionReceipt?.events[0]?.topics[1];
    await oracle.fulfillOracleFundingRateRequest(requestId, assetList, percentages, swapVersions);
    }
  
    describe("Deployment", function () {
      it("Test oracle list", async function () {
        //adding liquidity
        await addLiquidityEth(token0, "1", "1000")
        //update oracle list
        await updateOracleList()
        //check oracle list
        expect(await indexFactory.oracleList("0")).to.be.equal(token0.address)
        expect(ethers.utils.formatEther(await indexFactory.tokenOracleMarketShare(token0.address))).to.be.equal("70.0")
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

      /*
      it("Test factory single swap", async function () {
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
        await weth9.approve(indexFactory.address, ethers.utils.parseEther("0.1"));
        console.log("weth before swap:", ethers.utils.formatEther(await weth9.balanceOf(ownerAddress)))
        // await v3Router.exactInputSingle(params1);
        await indexFactory.swap(weth9.address, token0.address, ethers.utils.parseEther("0.1"), indexFactory.address, "3");
        console.log("token0 after swap:", ethers.utils.formatEther(await token0.balanceOf(ownerAddress)))
        console.log("weth after swap:", ethers.utils.formatEther(await weth9.balanceOf(ownerAddress)))
      });
      **/
      
      
    });
  });
  