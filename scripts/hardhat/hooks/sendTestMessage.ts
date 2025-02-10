import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/vault/CrossChainFactory.sol/CrossChainIndexFactory.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiCR5CrossChainFactory, mumbaiChainSelector, mumbaiTestRippleAddress, sepoliaBasicMessageReceiver, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
import { PayFeesIn } from "../../tasks/constants";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

const text = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000"
async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        // sepoliaCR5IndexFactory as string, //factory goerli
        mumbaiCR5CrossChainFactory as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        Factory_ABI,
        provider
    )
    // await wallet.connect(provider);
    console.log("sending data...")
    const result = await cotract.connect(deployer).testSend(
        // ethers.utils.parseEther("0.001"),
        // "0",
        sepoliaChainSelector,
        sepoliaBasicMessageReceiver,
        {gasLimit: 2000000}
    )
    // const result = await cotract.connect(deployer).sendMessage(
    //     sepoliaChainSelector,
    //     sepoliaBasicMessageReceiver,
    //     text,
    //     PayFeesIn.LINK,
    //     {gasLimit: 2000000}
    // )
    console.log("waiting for results...")
    const receipt = await result.wait();
    if(receipt.status ==1 ){
        console.log("success =>", receipt)
    }else{
        console.log("failed =>", receipt)
    }
}

main()