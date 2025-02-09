// import { goerliAnfiIndexToken, goerliUsdtAddress, goerliAnfiFactory, goerliAnfiNFT } from "../network";
// import { goerliAnfiFactoryAddress, goerliAnfiIndexTokenAddress, goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliLinkAddress, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
import { ccipRouterAddresses, ChainSelectors, CR5IndexFactoryAddresses, CR5IndexTokenAddresses, LINKAddresses, WethAddresses } from "../../contractAddresses";
import { goerliFactoryV2Address, goerliRouterV2Address, mumbaiCR5CrossChainFactory, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiFactoryV3Address, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiRouterV3Address, mumbaiWmaticAddress, seploliaWethAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexToken, sepoliaChainSelector, sepoliaLinkTokenAddress, sepoliaRouterAddress } from "../../network";

// import { ethers, upgrades } from "hardhat";
const { ethers, upgrades, network, hre } = require('hardhat');

async function deployFactory() {
  
  const [deployer] = await ethers.getSigners();

  const IndexFactory = await ethers.getContractFactory("IndexFactory");
  console.log('Upgrading...');
  
  const indexFactory = await upgrades.upgradeProxy(CR5IndexFactoryAddresses["sepolia"], IndexFactory, [
    ChainSelectors['sepolia'],
    CR5IndexTokenAddresses['sepolia'],
    LINKAddresses['sepolia'],
    ccipRouterAddresses['sepolia'],
    WethAddresses['sepolia']
  ], { initializer: 'initialize' });

  console.log('indexFactory upgraed.', indexFactory.address)
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