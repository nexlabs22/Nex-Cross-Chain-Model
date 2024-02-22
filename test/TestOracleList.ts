
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
    
    
    
  
    describe("Deployment", function () {
      it("Test oracle list", async function () {
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
        expect(await indexFactory.oracleList("1")).to.be.equal(token1.address)
        expect(await indexFactory.currentList("0")).to.be.equal(token0.address)
        expect(await indexFactory.currentList("1")).to.be.equal(token1.address)
        expect(ethers.utils.formatEther(await indexFactory.tokenOracleMarketShare(token0.address))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await indexFactory.tokenOracleMarketShare(token1.address))).to.be.equal("30.0")
        expect(ethers.utils.formatEther(await indexFactory.tokenCurrentMarketShare(token0.address))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await indexFactory.tokenCurrentMarketShare(token1.address))).to.be.equal("30.0")
        expect(await indexFactory.tokenSwapVersion(token0.address)).to.be.equal("3")
        expect(await indexFactory.tokenSwapVersion(token1.address)).to.be.equal("3")
        expect(await indexFactory.tokenChainSelector(token0.address)).to.be.equal("1")
        expect(await indexFactory.tokenChainSelector(token1.address)).to.be.equal("2")
        //chainselotor stors
        expect(await indexFactory.oracleChainSelectorsCount()).to.be.equal("2")
        expect(await indexFactory.currentChainSelectorsCount()).to.be.equal("2")
        expect(await indexFactory.oracleChainSelectores("0")).to.be.equal("1")
        expect(await indexFactory.oracleChainSelectores("1")).to.be.equal("2")
        expect(await indexFactory.currentChainSelectores("0")).to.be.equal("1")
        expect(await indexFactory.currentChainSelectores("1")).to.be.equal("2")
        expect(await indexFactory.oracleChainSelecotrTokensCount("1")).to.be.equal("1")
        expect(await indexFactory.oracleChainSelecotrTokensCount("2")).to.be.equal("1")
        expect(await indexFactory.currentChainSelecotrTokensCount("1")).to.be.equal("1")
        expect(await indexFactory.currentChainSelecotrTokensCount("2")).to.be.equal("1")
        expect(await indexFactory.oracleChainSelecotrTokens("1", "0")).to.be.equal(token0.address)
        expect(await indexFactory.oracleChainSelecotrTokens("2", "0")).to.be.equal(token1.address)
        expect(await indexFactory.currentChainSelecotrTokens("1", "0")).to.be.equal(token0.address)
        expect(await indexFactory.currentChainSelecotrTokens("2", "0")).to.be.equal(token1.address)
        // expect(await indexFactory.currentChainSelectores("1")).to.be.equal("2")
        // expect(await indexFactory.currentChainSelectorsCount()).to.be.equal("2")

      });

      

      
      
      
    });
  });
  