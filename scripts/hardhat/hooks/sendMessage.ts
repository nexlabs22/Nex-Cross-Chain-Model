import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/ccip/BasicMessageSender.sol/BasicMessageSender.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiBasicMessageReceiver, mumbaiBasicMessageSender, mumbaiCR5CrossChainFactory, mumbaiChainSelector, mumbaiTestRippleAddress, sepoliaBasicMessageReceiver, sepoliaBasicMessageSender, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
import { PayFeesIn } from "../../tasks/constants";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        // sepoliaCR5IndexFactory as string, //factory goerli
        // mumbaiCR5CrossChainFactory as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        // sepoliaBasicMessageSender,
        mumbaiBasicMessageSender,
        Factory_ABI,
        provider
    )
    // await wallet.connect(provider);
    console.log("sending data...")
    const result = await cotract.connect(deployer).send(
        // mumbaiChainSelector,
        sepoliaChainSelector,
        sepoliaBasicMessageReceiver,
        "Hello",
        PayFeesIn.LINK,
        {gasLimit: 1000000}
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