import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/factory/IndexFactoryStorage.sol/IndexFactoryStorage.json'
import { ISwapRouter, IndexFactory } from "../../typechain-types";
import { mumbaiChainSelector, mumbaiFactoryV3Address, mumbaiWmaticAddress, seploliaWethAddress, sepoliaBitcoinAddress, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaFactoryV3Address, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress } from "../../network";
import { UniswapV3Deployer } from "../../test/uniswap/UniswapV3Deployer";
import { FactoryV3Addresses, WethAddresses } from "../../contractAddresses";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [owner] = await ethers.getSigners();
    
    const deployer = new UniswapV3Deployer(owner);
    // const router = await deployer.deployRouter(sepoliaFactoryV3Address as string, seploliaWethAddress as string) as ISwapRouter;
    const router = await deployer.deployRouter(FactoryV3Addresses['arbitrumSepolia'] as string, WethAddresses[`arbitrumSepolia`] as string) as ISwapRouter;

    console.log("router", router)

}

main()