// import { goerliAnfiIndexToken, goerliUsdtAddress, goerliAnfiFactory, goerliAnfiNFT } from "../network";
// import { goerliAnfiFactoryAddress, goerliAnfiIndexTokenAddress, goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliLinkAddress, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
import { goerliFactoryV2Address, goerliRouterV2Address, mumbaiCR5CrossChainFactory, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiFactoryV3Address, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiRouterV3Address, mumbaiWmaticAddress } from "../network";

// import { ethers, upgrades } from "hardhat";
const { ethers, upgrades, network, hre } = require('hardhat');

async function deployFactory() {
  
  const [deployer] = await ethers.getSigners();

  const CrossChainIndexFactory = await ethers.getContractFactory("CrossChainIndexFactory");
  console.log('Upgrading...');
  
  const crossChainIndexFactory = await upgrades.upgradeProxy(mumbaiCR5CrossChainFactory, CrossChainIndexFactory, [
    mumbaiChainSelector,
    mumbaiCR5CrossChainVault,
    mumbaiLinkTokenAddress,
    mumbaiRouterAddress,
    mumbaiWmaticAddress,
    mumbaiRouterV3Address,
    mumbaiFactoryV3Address,
    goerliRouterV2Address,
    goerliFactoryV2Address
  ], { initializer: 'initialize' });

  console.log('box upgraed.', crossChainIndexFactory.address)
//   await indexFactory.waitForDeployment()

//   console.log(
//     `IndexFactory proxy upgraded by:${ await indexFactory.getAddress()}`
//   );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployFactory().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});