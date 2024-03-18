
import { ContractReceipt, ContractTransaction, Signer, constants } from "ethers";
import { ethers, network } from "hardhat";
import { BasicMessageReceiver, BasicTokenSender, CrossChainIndexFactory, INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH, IndexFactory, IndexFactoryBalancer, IndexFactoryStorage, IndexToken, LinkToken, MockApiOracle, MockRouter, MockV3Aggregator, Token } from "../typechain-types";
import { UniswapV3Deployer } from "./uniswap/UniswapV3Deployer";
import { expect } from 'chai';
import { BasicMessageSender } from "../typechain-types/contracts/ccip";
import { encodePriceSqrt } from "./uniswap/utils/encodePriceSqrt.ts";
import { getMaxTick, getMinTick } from "./uniswap/utils/ticks";
import { FeeAmount, TICK_SPACINGS } from "./uniswap/utils/constants";
import { CrossChainVault } from "../typechain-types/artifacts/contracts/vault/CrossChainVault";
import { addLiquidityEth, deployment, updateOracleList } from "./Deployer";
  
  describe("TEST REWEIGHT New Token", function () {
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
    let token2 : Token
    let token3 : Token
    let token4 : Token
    let token5 : Token
    let crossChainToken : Token
    let weth9: IWETH
    let v3Factory: IUniswapV3Factory
    let v3Router: ISwapRouter
    let nft: INonfungiblePositionManager
    let indexToken : IndexToken
    let indexFactoryStorage : IndexFactoryStorage
    let indexFactory : IndexFactory
    let indexFactoryBalancer : IndexFactoryBalancer
    let crossChainVault : CrossChainVault
    let crossChainIndexFactory : CrossChainIndexFactory
    let oracle : MockApiOracle
    let ethPriceOracle: MockV3Aggregator

    beforeEach(async function () {
      [owner, otherAccount] = await ethers.getSigners();
  
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
      token2 = deploymentObject.token2,
      token3 = deploymentObject.token3,
      token4 = deploymentObject.token4,
      token5 = deploymentObject.token5,
      crossChainToken = deploymentObject.crossChainToken,
      weth9 = deploymentObject.weth9,
      v3Factory = deploymentObject.v3Factory,
      v3Router = deploymentObject.v3Router,
      nft = deploymentObject.nft,
      indexToken = deploymentObject.indexToken,
      indexFactoryStorage = deploymentObject.indexFactoryStorage,
      indexFactory = deploymentObject.indexFactory,
      indexFactoryBalancer = deploymentObject.indexFactoryBalancer,
      crossChainVault = deploymentObject.crossChainVault,
      crossChainIndexFactory = deploymentObject.crossChainIndexFactory,
      oracle = deploymentObject.oracle,
      ethPriceOracle = deploymentObject.ethPriceOracle
      
      
    })
    
    
  
    describe("Deployment", function () {
      it("Test manual swap", async function () {
        
      });

      it("Test factory single swap", async function () {
        const assetList = [
          token0.address,
          token1.address,
          token2.address,
          token3.address,
          token4.address
        ]
        const percentages = [
            "30000000000000000000", 
            "20000000000000000000",
            "10000000000000000000",
            "10000000000000000000",
            "30000000000000000000",
        ]
        const swapVersions = ["3", "3", "3", "3", "3"]
        const chainSelectors = ["1", "1", "1", "2", "2"]

        await updateOracleList(linkToken, indexFactoryStorage, oracle, assetList, percentages, swapVersions, chainSelectors)
        //adding liquidity
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

        await addLiquidityEth(owner, weth9, nft, token0, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token1, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token2, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token3, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token4, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token5, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, crossChainToken, "1", "2000")
        await addLiquidityEth(owner, weth9, nft, linkToken, "10", "10000")
        await linkToken.transfer(crossChainIndexFactory.address, ethers.utils.parseEther("10"))
        await linkToken.transfer(indexFactory.address, ethers.utils.parseEther("10"))
        await linkToken.transfer(indexFactoryBalancer.address, ethers.utils.parseEther("10"))
        
        console.log("ccVault balance before swap:", ethers.utils.formatEther(await token1.balanceOf(crossChainVault.address)))
        console.log("index token balance before swap:", ethers.utils.formatEther(await indexToken.balanceOf(owner.address)))
        await indexFactory.issuanceIndexTokensWithEth(ethers.utils.parseEther("0.1"), ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1.1001")})
        console.log("==>");
        console.log("ccVault balance after swap:", ethers.utils.formatEther(await token1.balanceOf(crossChainVault.address)))
        console.log("index token balance after swap:", ethers.utils.formatEther(await indexToken.balanceOf(owner.address)))
        console.log("token0 after swap:", ethers.utils.formatEther(await token0.balanceOf(indexToken.address)))
        console.log("token1 after swap:", ethers.utils.formatEther(await token1.balanceOf(indexToken.address)))
        console.log("token2 after swap:", ethers.utils.formatEther(await token2.balanceOf(indexToken.address)))
        console.log("token3 after swap:", ethers.utils.formatEther(await token3.balanceOf(crossChainVault.address)))
        console.log("token4 after swap:", ethers.utils.formatEther(await token4.balanceOf(crossChainVault.address)))
        console.log("token5 after swap:", ethers.utils.formatEther(await token5.balanceOf(crossChainVault.address)))
        await network.provider.send("evm_mine");
        console.log("chain 1 portfolio after swap:", ethers.utils.formatEther(await indexFactory.getPortfolioBalance()))
        
        console.log("Asking values..");
        await indexFactoryBalancer.askValues();
        console.log("token values count:", Number(await indexFactoryBalancer.updatedTokensValueCount(1)))
        console.log("portfolio values count:", ethers.utils.formatEther(await indexFactoryBalancer.portfolioTotalValueByNonce(1)))
        console.log("first token0 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token0.address)))
        console.log("first token1 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token1.address)))
        console.log("first token2 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token2.address)))
        console.log("first token3 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token3.address)))
        console.log("first‌ ‌token4 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token4.address)))
        console.log("first‌ ‌token5 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token5.address)))
        console.log("first chainValueByNonce:", ethers.utils.formatEther(await indexFactoryBalancer.chainValueByNonce(1, 1)))
        console.log("second chainValueByNonce:", ethers.utils.formatEther(await indexFactoryBalancer.chainValueByNonce(1, 2)))

        const newAssetList = [
            token0.address,
            token1.address,
            token5.address,
            token3.address,
            token4.address
          ]

        const newChainSelectors = ["1", "1", "2", "2", "2"]
        //
        const newPercentages = [
          "20000000000000000000", 
          "20000000000000000000",
          "10000000000000000000",
          "20000000000000000000",
          "30000000000000000000"
        ]
        await updateOracleList(linkToken, indexFactoryStorage, oracle, newAssetList, newPercentages, swapVersions, newChainSelectors)
        //
        console.log("first reweighting action...");
        await indexFactoryBalancer.firstReweightAction()
        console.log("Reweight Weth Value By Nonce:", ethers.utils.formatEther(await indexFactoryBalancer.extraWethByNonce(1)))
        console.log("balancer weth balance:", ethers.utils.formatEther(await weth9.balanceOf(indexToken.address)))
        console.log("reweightExtraPercentage:", ethers.utils.formatEther(await indexFactoryBalancer.reweightExtraPercentage(1)))
        // console.log("Test:", ethers.utils.formatEther(await indexFactoryBalancer.test()))
        console.log("second reweighting action...");
        await indexFactoryBalancer.secondReweightAction()
        console.log("Reweight Weth Value By Nonce:", ethers.utils.formatEther(await indexFactoryBalancer.reweightWethValueByNonce(1)))
        await indexFactoryBalancer.askValues();
        console.log("second token0 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token0.address)))
        console.log("second token1 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token1.address)))
        console.log("second token2 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token2.address)))
        console.log("second token3 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token3.address)))
        console.log("second token4 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token4.address)))
        console.log("second token5 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(2, token5.address)))
        console.log("balancer weth balance:", ethers.utils.formatEther(await weth9.balanceOf(indexToken.address)))

        console.log("token0 after swap:", ethers.utils.formatEther(await token0.balanceOf(indexToken.address)))
        console.log("token1 after swap:", ethers.utils.formatEther(await token1.balanceOf(indexToken.address)))
        console.log("token2 after swap:", ethers.utils.formatEther(await token2.balanceOf(indexToken.address)))
        console.log("token3 after swap:", ethers.utils.formatEther(await token3.balanceOf(crossChainVault.address)))
        console.log("token4 after swap:", ethers.utils.formatEther(await token4.balanceOf(crossChainVault.address)))
        console.log("token5 after swap:", ethers.utils.formatEther(await token5.balanceOf(crossChainVault.address)))
        return;
      });
      
    });
  });
  