import { ethers, upgrades } from "hardhat";
import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiFactoryV3Address, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiRouterV3Address, mumbaiWmaticAddress } from "../network";
import { ccipRouterAddresses, ChainSelectors, CR5CrossChainVaultAddresses, EthUsdPriceFeeds, FactoryV2Addresses, FactoryV3Addresses, LINKAddresses, RouterV2Addresses, RouterV3Addresses, WethAddresses } from "../contractAddresses";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const CrossChainIndexFactory = await ethers.getContractFactory("CrossChainIndexFactory");
  console.log('Deploying CrossChainIndexFactory...');

  const crossChainIndexFactory = await upgrades.deployProxy(CrossChainIndexFactory, [
      ChainSelectors['polygonMumbai'],
      CR5CrossChainVaultAddresses['polygonMumbai'],
      LINKAddresses['polygonMumbai'],
      ccipRouterAddresses['polygonMumbai'],
      WethAddresses['polygonMumbai'],
      RouterV3Addresses['polygonMumbai'],
      FactoryV3Addresses['polygonMumbai'],
      RouterV2Addresses['goerli'],
      FactoryV2Addresses['goerli'],
      EthUsdPriceFeeds['polygonMumbai']
      // mumbaiChainSelector,
      // mumbaiCR5CrossChainVault,
      // mumbaiLinkTokenAddress,
      // mumbaiRouterAddress,
      // mumbaiWmaticAddress,
      // mumbaiRouterV3Address,
      // mumbaiFactoryV3Address,
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

  await crossChainIndexFactory.deployed()

  console.log(
    `crossChainIndexFactory deployed: ${ await crossChainIndexFactory.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployIndexToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});