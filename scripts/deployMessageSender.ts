import { ethers } from "hardhat";
import { mumbaiLinkTokenAddress, mumbaiRouterAddress, sepoliaLinkTokenAddress, sepoliaRouterAddress } from "../network";

async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.parseEther("0.001");
  const BasicMessageSender = await ethers.getContractFactory("BasicMessageSender");
  console.log('Deploying IndexToken...');
  const basicMessageSender = await BasicMessageSender.deploy(
    // mumbaiRouterAddress, 
    // mumbaiLinkTokenAddress
    sepoliaRouterAddress, 
    sepoliaLinkTokenAddress
    )
  await basicMessageSender.deployed()


  console.log(
    `basicMessageSender deployed to ${basicMessageSender}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
