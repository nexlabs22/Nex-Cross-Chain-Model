import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'

import {
    abi as IndexToken_ABI,
    bytecode as IndexToken_BYTECODE,
  } from '../../artifacts/contracts/token/IndexToken.sol/IndexToken.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiCR5CrossChainFactory, mumbaiChainSelector, mumbaiTestRippleAddress, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaCR5IndexToken, sepoliaChainSelector, sepoliaCrossChainTokenAddress, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
import { CR5IndexFactoryAddresses, CR5IndexFactoryBalancerAddresses, CR5IndexTokenAddresses } from "../../contractAddresses";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        CR5IndexTokenAddresses['sepolia'] as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        IndexToken_ABI,
        provider
    )
    // await wallet.connect(provider);
    // console.log("sending data...")

    console.log("setting factory as minter...")
    const result1 = await cotract.connect(deployer).setMinter(
        CR5IndexFactoryAddresses['sepolia'] as string,
        true
    )
    const receipt1 = await result1.wait();
    console.log("setting balancer as minter...")
    const result2 = await cotract.connect(deployer).setMinter(
        CR5IndexFactoryBalancerAddresses['sepolia'] as string,
        true
    )
    const receipt2 = await result2.wait();
    console.log('Ended')
    
}

main()