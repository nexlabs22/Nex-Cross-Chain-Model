import { ethers, upgrades } from "hardhat";
import { goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiWmaticAddress, seploliaWethAddress, sepoliaCR5IndexToken, sepoliaChainSelector, sepoliaEthUsdPriceFeed, sepoliaFactoryV3Address, sepoliaLinkTokenAddress, sepoliaRouterV3Address } from "../../network";
import { ApiOracleAddresses, ChainSelectors, CR5IndexTokenAddresses, EthUsdPriceFeeds, ExternalJobIdBytes32Addresses, FactoryV2Addresses, FactoryV3Addresses, LINKAddresses, RouterV2Addresses, RouterV3Addresses, WethAddresses } from "../../contractAddresses";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const IndexFactoryStorage = await ethers.getContractFactory("IndexFactoryStorage");
  console.log('Deploying IndexFactoryStorage...');

  const indexFactoryStorage = await upgrades.deployProxy(IndexFactoryStorage, [
      ChainSelectors['sepolia'],
      CR5IndexTokenAddresses['sepolia'],
      LINKAddresses['sepolia'],
      ApiOracleAddresses['goerli'],
      ExternalJobIdBytes32Addresses['goerli'],
      EthUsdPriceFeeds['sepolia'],
      WethAddresses['sepolia'],
      RouterV3Addresses['sepolia'],
      FactoryV3Addresses['sepolia'],
      RouterV2Addresses['goerli'],
      FactoryV2Addresses['goerli']
      // sepoliaChainSelector,
      // sepoliaCR5IndexToken,
      // sepoliaLinkTokenAddress,
      // goerliOracleAdress,
      // goerliExternalJobIdBytes32,
      // sepoliaEthUsdPriceFeed,
      // seploliaWethAddress,
      // sepoliaRouterV3Address,
      // sepoliaFactoryV3Address,
      // goerliRouterV2Address,
      // goerliFactoryV2Address
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