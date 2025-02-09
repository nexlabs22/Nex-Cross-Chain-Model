import { ethers } from "hardhat";
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiChainSelector, seploliaWethAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, testSepoliaCR5IndexFactory } from "../../network";
import { CR5CrossChainFactoryAddresses, CR5IndexFactoryAddresses, WethAddresses } from "../../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        CR5IndexFactoryAddresses['sepolia'] as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        Factory_ABI,
        provider
    )
    // await wallet.connect(provider);
    console.log("sending data...")
    const result = await cotract.connect(deployer).redemption(
        ethers.utils.parseEther("0.01"),
        "0",
        WethAddresses['sepolia'],
        "3",
        {gasLimit: 2000000}
    )
    console.log("waiting for results...")
    const receipt = await result.wait();
    if(receipt.status ==1 ){
        console.log("success =>", receipt)
    }else{
        console.log("failed =>", receipt)
    }
}

main()