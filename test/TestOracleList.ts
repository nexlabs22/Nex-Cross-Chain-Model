
import { ContractReceipt, ContractTransaction, Signer, constants } from "ethers";
import { ethers } from "hardhat";
import { BasicMessageReceiver, BasicTokenSender, INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH, IndexFactory, IndexToken, LinkToken, MockApiOracle, MockRouter, MockV3Aggregator, Token, IndexFactoryStorage, IndexFactoryBalancer } from "../typechain-types";
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
    let token2 : Token
    let weth9: IWETH
    let v3Factory: IUniswapV3Factory
    let v3Router: ISwapRouter
    let nft: INonfungiblePositionManager
    let indexToken : IndexToken
    let indexFactoryStorage : IndexFactoryStorage
    let indexFactory : IndexFactory
    let indexFactoryBalancer : IndexFactoryBalancer
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
      token2 = deploymentObject.token2,
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
      indexFactoryBalancer = deploymentObject.indexFactoryBalancer,
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
        expect(await functionsOracle.oracleList("0")).to.be.equal(token0.address)
        expect(await functionsOracle.oracleList("1")).to.be.equal(token1.address)
        expect(await functionsOracle.currentList("0")).to.be.equal(token0.address)
        expect(await functionsOracle.currentList("1")).to.be.equal(token1.address)
        expect(ethers.utils.formatEther(await functionsOracle.tokenOracleMarketShare(token0.address))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenOracleMarketShare(token1.address))).to.be.equal("30.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenCurrentMarketShare(token0.address))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenCurrentMarketShare(token1.address))).to.be.equal("30.0")
        expect(await indexFactoryStorage.tokenSwapVersion(token0.address)).to.be.equal("3")
        expect(await indexFactoryStorage.tokenSwapVersion(token1.address)).to.be.equal("3")
        expect(await functionsOracle.tokenChainSelector(token0.address)).to.be.equal("1")
        expect(await functionsOracle.tokenChainSelector(token1.address)).to.be.equal("2")
        //chainselotor stors
        expect(await indexFactoryStorage.oracleChainSelectorsCount()).to.be.equal("2")
        expect(await indexFactoryStorage.currentChainSelectorsCount()).to.be.equal("2")
        expect(await indexFactoryStorage.oracleChainSelectors("1", "0")).to.be.equal("1")
        expect(await indexFactoryStorage.oracleChainSelectors("1", "1")).to.be.equal("2")
        expect(await indexFactoryStorage.currentChainSelectors("1", "0")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectors("1", "1")).to.be.equal("2")
        expect(await indexFactoryStorage.oracleChainSelectorTokensCount("1")).to.be.equal("1")
        expect(await indexFactoryStorage.oracleChainSelectorTokensCount("2")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectorTokensCount("1")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectorTokensCount("2")).to.be.equal("1")
        expect(await indexFactoryStorage.oracleChainSelectorTokens("1", "1", "0")).to.be.equal(token0.address)
        expect(await indexFactoryStorage.oracleChainSelectorTokens("1", "2", "0")).to.be.equal(token1.address)
        expect(await indexFactoryStorage.currentChainSelectorTokens("1", "1", "0")).to.be.equal(token0.address)
        expect(await indexFactoryStorage.currentChainSelectorTokens("1", "2", "0")).to.be.equal(token1.address)
        expect(ethers.utils.formatEther(await indexFactoryStorage.currentChainSelectorTotalShares("1", "1"))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await indexFactoryStorage.currentChainSelectorTotalShares("1", "2"))).to.be.equal("30.0")
        
        //check oracle update

        const newAssetList = [
            token0.address,
            token2.address
        ]
        const newPercentages = ["60000000000000000000", "40000000000000000000"]
        const newChainSelectors = ["1", "1"]

        await updateOracleList(linkToken, indexFactoryStorage, oracle, newAssetList, newPercentages, swapVersions, newChainSelectors)

        //check oracle list
        expect(await functionsOracle.oracleList("0")).to.be.equal(token0.address)
        expect(await functionsOracle.oracleList("1")).to.be.equal(token2.address)
        expect(await functionsOracle.currentList("0")).to.be.equal(token0.address)
        expect(await functionsOracle.currentList("1")).to.be.equal(token1.address)
        expect(ethers.utils.formatEther(await functionsOracle.tokenOracleMarketShare(token0.address))).to.be.equal("60.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenOracleMarketShare(token2.address))).to.be.equal("40.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenCurrentMarketShare(token0.address))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenCurrentMarketShare(token1.address))).to.be.equal("30.0")
        expect(ethers.utils.formatEther(await functionsOracle.tokenCurrentMarketShare(token2.address))).to.be.equal("0.0")
        expect(await indexFactoryStorage.tokenSwapVersion(token0.address)).to.be.equal("3")
        expect(await indexFactoryStorage.tokenSwapVersion(token1.address)).to.be.equal("3")
        expect(await functionsOracle.tokenChainSelector(token0.address)).to.be.equal("1")
        expect(await functionsOracle.tokenChainSelector(token1.address)).to.be.equal("2")
        expect(await functionsOracle.tokenChainSelector(token2.address)).to.be.equal("1")
        //chainselotor stors
        expect(await indexFactoryStorage.oracleChainSelectorsCount()).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectorsCount()).to.be.equal("2")
        expect(await indexFactoryStorage.oracleChainSelectors("2", "0")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectors("1", "0")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectors("1", "1")).to.be.equal("2")
        expect(await indexFactoryStorage.oracleChainSelectorTokensCount("1")).to.be.equal("2")
        expect(await indexFactoryStorage.oracleChainSelectorTokensCount("2")).to.be.equal("0")
        expect(await indexFactoryStorage.currentChainSelectorTokensCount("1")).to.be.equal("1")
        expect(await indexFactoryStorage.currentChainSelectorTokensCount("2")).to.be.equal("1")
        expect(await indexFactoryStorage.oracleChainSelectorTokens("2", "1", "0")).to.be.equal(token0.address)
        expect(await indexFactoryStorage.oracleChainSelectorTokens("2", "1", "1")).to.be.equal(token2.address)
        expect(await indexFactoryStorage.currentChainSelectorTokens("1", "1", "0")).to.be.equal(token0.address)
        expect(await indexFactoryStorage.currentChainSelectorTokens("1", "2", "0")).to.be.equal(token1.address)
        expect(ethers.utils.formatEther(await indexFactoryStorage.currentChainSelectorTotalShares("1", "1"))).to.be.equal("70.0")
        expect(ethers.utils.formatEther(await indexFactoryStorage.currentChainSelectorTotalShares("1", "2"))).to.be.equal("30.0")
      });

      

      
      
      
    });
  });
  