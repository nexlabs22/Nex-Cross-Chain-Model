
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
  
  export async function deployment(): Promise<any> {
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
    let usdc : Token
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

    

    // async function deployContracts() {
      [owner, otherAccount] = await ethers.getSigners();
  

      const LinkToken = await ethers.getContractFactory("LinkToken");
      linkToken = await LinkToken.deploy();

      const MockRouter = await ethers.getContractFactory("MockRouter");
      mockRouter = await MockRouter.deploy(linkToken.address);

      const Token = await ethers.getContractFactory("Token");
      usdc = await Token.deploy(ethers.utils.parseEther("1000000"));
      token0 = await Token.deploy(ethers.utils.parseEther("1000000"));
      token1 = await Token.deploy(ethers.utils.parseEther("100000"));
      token2 = await Token.deploy(ethers.utils.parseEther("100000"));
      token3 = await Token.deploy(ethers.utils.parseEther("100000"));
      token4 = await Token.deploy(ethers.utils.parseEther("100000"));
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
            "Crypto5",
            "CR5",
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
            mockRouter.address,
            //swap addresses
            weth9.address,
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


      const IndexFactoryBalancer = await ethers.getContractFactory("IndexFactoryBalancer");
      indexFactoryBalancer = await IndexFactoryBalancer.deploy()
      // return;
      await indexFactoryBalancer.initialize(
            "1",
            indexToken.address,
            indexFactoryStorage.address,
            linkToken.address,
            // ccip
            mockRouter.address,
            //swap addresses
            weth9.address
      )
      
      
      //set minter
      await indexToken.setMinter(indexFactory.address)
      await indexFactoryStorage.setCrossChainToken("2", crossChainToken.address)
      await indexFactoryStorage.setCrossChainFactory(crossChainIndexFactory.address, "2");
      await indexFactory.setIndexFactoryStorage(indexFactoryStorage.address)
      await crossChainIndexFactory.setCrossChainToken("1", crossChainToken.address)
      await crossChainVault.setFactory(crossChainIndexFactory.address);
      
      //router mock
      await mockRouter.setFactoryChainSelector("1", indexFactory.address)
      await mockRouter.setFactoryChainSelector("2", crossChainIndexFactory.address)
      await indexFactoryStorage.setIndexFactory(indexFactory.address);
      //return vaiables
      return {
        mockRouter,
        linkToken,
        basicMessageSender,
        basicTokenSender,
        basicMessageReceiver,
        owner,
        otherAccount,
        usdc,
        token0,
        token1,
        token2,
        token3,
        token4,
        crossChainToken,
        weth9,
        v3Factory,
        v3Router,
        nft,
        indexToken,
        indexFactoryStorage,
        indexFactory,
        crossChainVault,
        crossChainIndexFactory,
        oracle,
        ethPriceOracle
        }
    
  
    
  };
  


  export async function addLiquidityEth(
    owner: any,
    weth9: IWETH,
    _nft: INonfungiblePositionManager, 
    token: Token | LinkToken, 
    ethAmount: string, 
    tokenAmount: string
    ){
    let tokens = [];
    tokens[0] = token.address < weth9.address ? token.address : weth9.address
    tokens[1] = token.address > weth9.address ? token.address : weth9.address
    const amount0 = tokens[0] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)
    const amount1 = tokens[1] == weth9.address ? ethers.utils.parseEther(ethAmount) : ethers.utils.parseEther(tokenAmount)

    await _nft.createAndInitializePoolIfNecessary(
      // weth9.address,
      tokens[0],
      // token0.address,
      tokens[1],
      "3000",
      encodePriceSqrt(1, 1)
    )
    // return
    await token.approve(_nft.address, ethers.utils.parseEther(tokenAmount));
    await weth9.deposit({value:ethers.utils.parseEther(ethAmount)});
    await weth9.approve(_nft.address, ethers.utils.parseEther(ethAmount));
    
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
    
    await _nft.mint(liquidityParams)

  }


  export async function updateOracleList(
    _linkToken: LinkToken,
    _indexFactoryStorage: IndexFactoryStorage,
    _oracle: MockApiOracle,
    assetList: string[], 
    percentages: string[], 
    swapVersions: string[], 
    chainSelectors: string[]
    ){

  //update oracle list
  await _linkToken.transfer(_indexFactoryStorage.address, 1e17.toString());
  const transaction: ContractTransaction = await _indexFactoryStorage.requestAssetsData();
  const transactionReceipt:any = await transaction.wait(1);
  const requestId: string = transactionReceipt?.events[0]?.topics[1];
  await _oracle.fulfillOracleFundingRateRequest(requestId, assetList, percentages, swapVersions, chainSelectors);
}