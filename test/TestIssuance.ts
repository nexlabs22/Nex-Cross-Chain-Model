
import { ContractReceipt, ContractTransaction, constants } from "ethers";
import { ethers } from "hardhat";
import { INonfungiblePositionManager, ISwapRouter, IUniswapV3Factory, IWETH } from "../typechain-types";
import { UniswapV3Deployer } from "./uniswap/UniswapV3Deployer";
import { expect } from 'chai';
  
  describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
      
  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await ethers.getSigners();
  
      const MockRouter = await ethers.getContractFactory("MockRouter");
      const mockRouter = await MockRouter.deploy();

      const LinkToken = await ethers.getContractFactory("LinkToken");
      const linkToken = await LinkToken.deploy();

      const Token = await ethers.getContractFactory("Token");
      const token0 = await Token.deploy(ethers.utils.parseEther("1000000"));
      const token1 = await Token.deploy(ethers.utils.parseEther("100000"));

      const BasicMessageSender = await ethers.getContractFactory("BasicMessageSender");
      const basicMessageSender = await BasicMessageSender.deploy(mockRouter.address, linkToken.address);

      const BasicTokenSender = await ethers.getContractFactory("BasicTokenSender");
      const basicTokenSender = await BasicTokenSender.deploy(mockRouter.address, linkToken.address);

      const BasicMessageReceiver = await ethers.getContractFactory("BasicMessageReceiver");
      const basicMessageReceiver = await BasicMessageReceiver.deploy(mockRouter.address);
      
      const res = await UniswapV3Deployer.deploy(owner);
      // return
      const weth9 = res["weth9"] as IWETH
      const v3Fctory = res["factory"] as IUniswapV3Factory
      const v3Router = res["router"] as ISwapRouter
      const nft = res["positionManager"] as INonfungiblePositionManager
      //deploy api oracle
      const Oracle = await ethers.getContractFactory("MockApiOracle");
      const oracle = await Oracle.deploy(linkToken.address);
      //deploy eth price oracle
      const EthPriceOracle = await ethers.getContractFactory("MockV3Aggregator");
      const ethPriceOracle = await EthPriceOracle.deploy('18', ethers.utils.parseEther("2000"));
      //deploy index token
      const IndexToken = await ethers.getContractFactory("IndexToken");
      
      const indexToken = await IndexToken.deploy()
      await indexToken.initialize(
            "Anti Inflation",
            "ANFI",
            (1e18).toString(),
            owner.address,
            ethers.utils.parseEther("1000000").toString(),
            //swap addresses
            weth9.address,
            weth9.address,//quoter
            v3Router.address,
            v3Fctory.address,
            v3Router.address, //router v2
            v3Fctory.address //factory v2
      )
      
      const jobId = ethers.utils.toUtf8Bytes("29fa9aa13bf1468788b7cc4a500a45b8"); //test job id
      const fee = "100000000000000000" // fee = 0.1 linkToken

      const IndexFactory = await ethers.getContractFactory("IndexFactory");
      const indexFactory = await IndexFactory.deploy()

      await indexFactory.initialize(
            indexToken.address,
            linkToken.address,
            oracle.address,
            jobId,
            ethPriceOracle.address,
            //swap addresses
            weth9.address,
            weth9.address, //quoter
            v3Router.address,
            v3Fctory.address,
            v3Router.address, //v2
            v3Fctory.address //v2
      )
      return {mockRouter, linkToken, basicMessageSender, basicTokenSender, basicMessageReceiver , owner, otherAccount, token0, token1, indexToken, indexFactory, oracle };
    }
  
    describe("Deployment", function () {
      it("Test transfer message", async function () {
        // const { mockRouter } = await loadFixture(deployOneYearLockFixture);
        const deployObject = await deployOneYearLockFixture();
        //create lists
        const assetList = [
            deployObject.token0.address,
            deployObject.token1.address
        ]
        const percentages = ["70000000000000000000", "30000000000000000000"]
        const swapVersions = ["3", "3"]
        //update oracle list
        await deployObject.linkToken.transfer(deployObject.indexFactory.address, 1e17.toString());
        const transaction: ContractTransaction = await deployObject.indexFactory.requestAssetsData();
        const transactionReceipt:any = await transaction.wait(1);
        const requestId: string = transactionReceipt?.events[0]?.topics[1];
        await deployObject.oracle.fulfillOracleFundingRateRequest(requestId, assetList, percentages, swapVersions);
        //check oracle list
        expect(await deployObject.indexFactory.oracleList("0")).to.be.equal(deployObject.token0.address)
        expect(ethers.utils.formatEther(await deployObject.indexFactory.tokenOracleMarketShare(deployObject.token0.address))).to.be.equal("70.0")
      });


      
    });
  });
  