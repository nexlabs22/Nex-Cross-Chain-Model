import { ethers } from "hardhat";

async function main() {

  const TokenFacuet = await ethers.getContractFactory("TokenFaucet");
  console.log('Deploying TokenFacuet...');
  const tokenFacuet = await TokenFacuet.deploy()
  await tokenFacuet.deployed()


  console.log(
    `tokenFacuet deployed to ${tokenFacuet.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
