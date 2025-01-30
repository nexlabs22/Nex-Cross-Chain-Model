// import { goerliAnfiIndexToken, goerliUsdtAddress, goerliAnfiFactory, goerliAnfiNFT } from "../network";
// import { goerliAnfiFactoryAddress, goerliAnfiIndexTokenAddress, goerliEthUsdPriceFeed, goerliExternalJobIdBytes32, goerliFactoryV2Address, goerliFactoryV3Address, goerliLinkAddress, goerliOracleAdress, goerliQouterAddress, goerliRouterV2Address, goerliRouterV3Address, goerliWethAddress } from "../contractAddresses";
import { CR5CrossChainFactoryAddresses } from "../../contractAddresses";
import { goerliFactoryV2Address, goerliRouterV2Address, mumbaiCR5CrossChainFactory, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiFactoryV3Address, mumbaiLinkTokenAddress, mumbaiRouterAddress, mumbaiRouterV3Address, mumbaiWmaticAddress } from "../../network";
import {
  ChainSelectors,
  CR5CrossChainVaultAddresses,
  LINKAddresses,
  ccipRouterAddresses,
  WethAddresses,
  RouterV3Addresses,
  FactoryV3Addresses,
  RouterV2Addresses,
  FactoryV2Addresses,
  EthUsdPriceFeeds
} from "../../contractAddresses";
// import { ethers, upgrades } from "hardhat";
const { ethers, upgrades, network, hre } = require('hardhat');

async function deployFactory() {
  
  const [deployer] = await ethers.getSigners();

  const CrossChainIndexFactory = await ethers.getContractFactory("CrossChainIndexFactory");
  console.log('Upgrading...');
  


  const crossChainIndexFactory = await upgrades.upgradeProxy(
    CR5CrossChainFactoryAddresses["arbitrumSepolia"],
    CrossChainIndexFactory,
    [
      ChainSelectors["arbitrumSepolia"],
      CR5CrossChainVaultAddresses["arbitrumSepolia"],
      LINKAddresses["arbitrumSepolia"],
      ccipRouterAddresses["arbitrumSepolia"],
      WethAddresses["arbitrumSepolia"],
      RouterV3Addresses["arbitrumSepolia"],
      FactoryV3Addresses["arbitrumSepolia"],
      RouterV2Addresses["goerli"],
      FactoryV2Addresses["goerli"],
      EthUsdPriceFeeds["arbitrumSepolia"],
    ],
    { initializer: "initialize" }
  );

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