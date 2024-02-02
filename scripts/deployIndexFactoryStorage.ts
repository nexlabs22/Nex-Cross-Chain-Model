import { ethers, upgrades } from "hardhat";
import { goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiWmaticAddress, seploliaWethAddress, sepoliaCR5IndexToken, sepoliaChainSelector, sepoliaLinkTokenAddress } from "../network";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const IndexFactoryStorage = await ethers.getContractFactory("IndexFactoryStorage");
  console.log('Deploying IndexFactoryStorage...');

  const indexFactoryStorage = await upgrades.deployProxy(IndexFactoryStorage, [
      sepoliaChainSelector,
      sepoliaCR5IndexToken,
      sepoliaLinkTokenAddress,
      goerliOracleAdress,
      goerliExternalJobIdBytes32,
      goerliEthUsdPriceFeed,
      seploliaWethAddress,
      goerliRouterV3Address,
      goerliFactoryV3Address,
      goerliRouterV2Address,
      goerliFactoryV2Address
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

  await indexFactoryStorage.deployed()

  console.log(
    `indexFactoryStorage deployed: ${ await indexFactoryStorage.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployIndexToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});