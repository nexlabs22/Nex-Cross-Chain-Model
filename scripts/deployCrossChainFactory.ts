import { ethers, upgrades } from "hardhat";
import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiWmaticAddress } from "../network";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const CrossChainIndexFactory = await ethers.getContractFactory("CrossChainIndexFactory");
  console.log('Deploying CrossChainIndexFactory...');

  const crossChainIndexFactory = await upgrades.deployProxy(CrossChainIndexFactory, [
      mumbaiChainSelector,
      mumbaiCR5CrossChainVault,
      mumbaiLinkTokenAddress,
      mumbaiRouterAddress,
      mumbaiWmaticAddress,
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