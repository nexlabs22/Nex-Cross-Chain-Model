import { ethers } from "hardhat";
import { mumbaiRouterAddress, sepoliaRouterAddress } from "../../network";

async function main() {

  const BasicMessageReceiver = await ethers.getContractFactory("BasicMessageReceiver");
  console.log('Deploying BasicMessageReceiver...');
  const basicMessageReceiver = await BasicMessageReceiver.deploy(
    // sepoliaRouterAddress
    mumbaiRouterAddress
    )
  await basicMessageReceiver.deployed()
    

  console.log(
    `basicMessageReceiver deployed to ${basicMessageReceiver.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
