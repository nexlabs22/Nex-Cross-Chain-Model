
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
  
  describe("TEST REWEIGHT", function () {
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
      
      /**
      const LinkToken = await ethers.getContractFactory("LinkToken");
      linkToken = await LinkToken.deploy();

      const MockRouter = await ethers.getContractFactory("MockRouter");
      mockRouter = await MockRouter.deploy(linkToken.address);

      const Token = await ethers.getContractFactory("Token");
      token0 = await Token.deploy(ethers.utils.parseEther("1000000"));
      token1 = await Token.deploy(ethers.utils.parseEther("100000"));
      crossChainToken = await Token.deploy(ethers.utils.parseEther("100000"));

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
      
      const CrossChainVault = await ethers.getContractFactory("CrossChainVault");
      crossChainVault = await CrossChainVault.deploy()
      await crossChainVault.initialize(
            ethers.constants.AddressZero,
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
      

      const CrossChainIndexFactory = await ethers.getContractFactory("CrossChainIndexFactory");
      crossChainIndexFactory = await CrossChainIndexFactory.deploy()

      await crossChainIndexFactory.initialize(
            "1",
            crossChainVault.address,
            linkToken.address,
            oracle.address,
            jobId,
            ethPriceOracle.address,
            //ccip
            mockRouter.address,
            //swap addresses
            weth9.address,
            // v3Router.address, //quoter
            v3Router.address,
            v3Factory.address,
            v3Router.address, //v2
            v3Factory.address //v2
      )
      

      const IndexFactoryStorage = await ethers.getContractFactory("IndexFactoryStorage");
      indexFactoryStorage = await IndexFactoryStorage.deploy()
      // return;
      await indexFactoryStorage.initialize(
        "1",
        indexToken.address,
        linkToken.address,
        oracle.address,
        jobId,
        ethPriceOracle.address,
        //swap addresses
        weth9.address,
        // v3Router.address, //quoter
        v3Router.address,
        v3Factory.address,
        v3Router.address, //v2
        v3Factory.address //v2
      )


      const IndexFactory = await ethers.getContractFactory("IndexFactory");
      indexFactory = await IndexFactory.deploy()
      // return;
      await indexFactory.initialize(
            "1",
            indexToken.address,
            linkToken.address,
            //ccip
            mockRouter.address,
            //swap addresses
            weth9.address
      )
      
      
      //set minter
      await indexToken.setMinter(indexFactory.address)
      await indexFactory.setCrossChainToken("2", crossChainToken.address)
      await indexFactory.setIndexFactoryStorage(indexFactoryStorage.address)
      await indexFactoryStorage.setIndexFactory(indexFactory.address)
      await crossChainIndexFactory.setCrossChainToken("1", crossChainToken.address)
      await indexFactory.setCrossChainFactory(crossChainIndexFactory.address, "2");
      await crossChainVault.setFactory(crossChainIndexFactory.address);
      */
    })
    
    // async function addLiquidityEth(token: Token | LinkToken, ethAmount: string, tokenAmount: string){
    //   let tokens = [];
    //   tokens[0] = token.address < weth9.address ? token.address : weth9.address
    //   tokens[1] = token.address > weth9.address ? token.address : weth9.address
    //   const amount0 = tokens[0] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)
    //   const amount1 = tokens[1] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)

    //   await nft.createAndInitializePoolIfNecessary(
    //     // weth9.address,
    //     tokens[0],
    //     // token0.address,
    //     tokens[1],
    //     "3000",
    //     encodePriceSqrt(1, 1)
    //   )
    //   // return
    //   await token.approve(nft.address, ethers.utils.parseEther(tokenAmount));
    //   await weth9.deposit({value:ethers.utils.parseEther(ethAmount)});
    //   await weth9.approve(nft.address, ethers.utils.parseEther(ethAmount));
      
    //   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    //   const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;
    //   // return;
    //   // const block = new Block()
    //   const liquidityParams = {
    //   token0: tokens[0],
    //   token1: tokens[1],
    //   fee: "3000",
    //   tickLower: getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //   tickUpper: getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
    //   recipient: owner.address,
    //   // amount0Desired: amount0,
    //   amount0Desired: amount0,
    //   amount1Desired: amount1,
    //   amount0Min: 0,
    //   amount1Min: 0,
    //   deadline: unlockTime,
    //   }
      
    //   await nft.mint(liquidityParams)


    // }

    // async function updateOracleList(_percentages: string[]){
    //   const assetList = [
    //     token0.address,
    //     token1.address
    // ]
    // // const percentages = ["70000000000000000000", "30000000000000000000"]
    // const percentages = _percentages
    // const swapVersions = ["3", "3"]
    // const chainSelectors = ["1", "2"]
    // //update oracle list
    // await linkToken.transfer(indexFactoryStorage.address, 1e17.toString());
    // const transaction: ContractTransaction = await indexFactoryStorage.requestAssetsData();
    // const transactionReceipt:any = await transaction.wait(1);
    // const requestId: string = transactionReceipt?.events[0]?.topics[1];
    // await oracle.fulfillOracleFundingRateRequest(requestId, assetList, percentages, swapVersions, chainSelectors);
    // }
  
    describe("Deployment", function () {
      

      it("Test manual swap", async function () {
        
      });

      it("Test factory single swap", async function () {
        //update oracle list
        const assetList = [
          token0.address,
          token1.address
        ]
        const percentages = ["70000000000000000000", "30000000000000000000"]
        const swapVersions = ["3", "3"]
        const chainSelectors = ["1", "2"]
        await updateOracleList(linkToken, indexFactoryStorage, oracle, assetList, percentages, swapVersions, chainSelectors)
        //adding liquidity
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const unlockTime = (Date.now()) + ONE_YEAR_IN_SECS;

        await addLiquidityEth(owner, weth9, nft, token0, "1", "1000")
        await addLiquidityEth(owner, weth9, nft, token1, "1", "1000")
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
        console.log("token1 after swap:", ethers.utils.formatEther(await token1.balanceOf(crossChainVault.address)))
        await network.provider.send("evm_mine");
        console.log("chain 1 portfolio after swap:", ethers.utils.formatEther(await indexFactory.getPortfolioBalance()))
        
        console.log("Asking values..");
        await indexFactoryBalancer.askValues();
        console.log("token values count:", Number(await indexFactoryBalancer.updatedTokensValueCount(1)))
        console.log("portfolio values count:", ethers.utils.formatEther(await indexFactoryBalancer.portfolioTotalValueByNonce(1)))
        console.log("first token1 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token0.address)))
        console.log("first token2 value:", ethers.utils.formatEther(await indexFactoryBalancer.tokenValueByNonce(1, token1.address)))
        console.log("first chainValueByNonce:", ethers.utils.formatEther(await indexFactoryBalancer.chainValueByNonce(1, 1)))
        console.log("second chainValueByNonce:", ethers.utils.formatEther(await indexFactoryBalancer.chainValueByNonce(1, 2)))
        //
        const newPercentages = ["60000000000000000000", "40000000000000000000"]
        await updateOracleList(linkToken, indexFactoryStorage, oracle, assetList, newPercentages, swapVersions, chainSelectors)
        //
        console.log("first reweighting action...");
        await indexFactoryBalancer.firstReweightAction()
        console.log("Reweight Weth Value By Nonce:", ethers.utils.formatEther(await indexFactoryBalancer.extraWethByNonce(1)))
        return;
        // await indexFactory.secondReweightAction()
        // console.log("Reweight Weth Value By Nonce:", ethers.utils.formatEther(await indexFactory.reweightWethValueByNonce(1)))
        // await indexFactory.askValues();
        console.log("second token1 value:", ethers.utils.formatEther(await indexFactory.tokenValueByNonce(2, token0.address)))
        console.log("second token2 value:", ethers.utils.formatEther(await indexFactory.tokenValueByNonce(2, token1.address)))
      });
      
    });
  });
  