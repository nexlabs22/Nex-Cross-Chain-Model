import { ethers, upgrades } from "hardhat";
import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, mumbaiWmaticAddress } from "../network";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const CrossChainVault = await ethers.getContractFactory("CrossChainVault");
  console.log('Deploying CrossChainVault...');

  const crossChainVault = await upgrades.deployProxy(CrossChainVault, [
      ethers.constants.AddressZero,
      mumbaiWmaticAddress,
      goerliQouterAddress,
      goerliRouterV3Address,
      goerliFactoryV3Address,
      goerliRouterV2Address,
      goerliFactoryV2Address
      /**
      "Crypto5",
      "CR5",
      '1000000000000000000', // 1e18
      deployer.address,
      '1000000000000000000000000', // 1000000e18
      goerliWethAddress,
      goerliQouterAddress,
      goerliRouterV3Address,
      goerliFactoryV3Address,
      goerliRouterV2Address,
      goerliFactoryV2Address
      */
  ], { initializer: 'initialize' });

  await crossChainVault.deployed()

  console.log(
    `CrossChainVault deployed: ${ await crossChainVault.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployIndexToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});