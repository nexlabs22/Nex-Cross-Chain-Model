import { ethers, upgrades } from "hardhat";
import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress, seploliaWethAddress, sepoliaFactoryV3Address, sepoliaRouterV3Address } from "../../network";
import { FactoryV2Addresses, FactoryV3Addresses, QouterAddresses, RouterV2Addresses, RouterV3Addresses, WethAddresses } from "../../contractAddresses";
// import { goerliFactoryV2Address, goerliFactoryV3Address, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
// const { ethers, upgrades, network, hre } = require('hardhat');

async function deployIndexToken() {
  
  const [deployer] = await ethers.getSigners();

  const IndexToken = await ethers.getContractFactory("IndexToken");
  console.log('Deploying IndexToken...');

  const indexToken = await upgrades.deployProxy(IndexToken, [
      "Crypto5",
      "CR5",
      '1000000000000000000', // 1e18
      deployer.address,
      '1000000000000000000000000', // 1000000e18
      WethAddresses['sepolia'],
      QouterAddresses['goerli'],
      RouterV3Addresses['sepolia'],
      FactoryV3Addresses['sepolia'],
      RouterV2Addresses['goerli'],
      FactoryV2Addresses['goerli']
  ], { initializer: 'initialize' });

  await indexToken.deployed()

  console.log(
    `IndexToken deployed: ${ await indexToken.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployIndexToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});