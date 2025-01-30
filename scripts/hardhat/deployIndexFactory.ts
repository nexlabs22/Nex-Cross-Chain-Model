import { ethers, upgrades } from "hardhat";
import { goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiWmaticAddress, seploliaWethAddress, sepoliaCR5IndexToken, sepoliaChainSelector, sepoliaLinkTokenAddress, sepoliaRouterAddress } from "../../network";
import { ccipRouterAddresses, ChainSelectors, CR5IndexTokenAddresses, LINKAddresses, WethAddresses } from "../../contractAddresses";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const IndexFactory = await ethers.getContractFactory("IndexFactory");
  console.log('Deploying IndexFactory...');

  const indexFactory = await upgrades.deployProxy(IndexFactory, [
      ChainSelectors['sepolia'],
      CR5IndexTokenAddresses['sepolia'],
      LINKAddresses['sepolia'],
      ccipRouterAddresses['sepolia'],
      WethAddresses['sepolia']
      // sepoliaChainSelector,
      // sepoliaCR5IndexToken,
      // sepoliaLinkTokenAddress,
      // sepoliaRouterAddress,
      // seploliaWethAddress
      /**
      ethers.constants.AddressZero,
      mumbaiWmaticAddress,
      goerliQouterAddress,
      goerliRouterV3Address,
      goerliFactoryV3Address,
      goerliRouterV2Address,
      goerliFactoryV2Address
      */
  ], { initializer: 'initialize' });

  await indexFactory.deployed()

  console.log(
    `indexFactory deployed: ${ await indexFactory.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployIndexToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});