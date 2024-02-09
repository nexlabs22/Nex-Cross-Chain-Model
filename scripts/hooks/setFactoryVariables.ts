import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiCR5CrossChainFactory, mumbaiChainSelector, mumbaiTestRippleAddress, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaCrossChainTokenAddress, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        sepoliaCR5IndexFactory as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        Factory_ABI,
        provider
    )
    // await wallet.connect(provider);
    // console.log("sending data...")

    console.log("setting index factory storage...")
    const result1 = await cotract.connect(deployer).setIndexFactoryStorage(
        sepoliaCR5IndexFactoryStorage
    )
    const receipt1 = await result1.wait();

    console.log("setting cross chain index factory...")
    const result2 = await cotract.connect(deployer).setCrossChainFactory(
        mumbaiCR5CrossChainFactory,
        mumbaiChainSelector
    )
    const receipt2 = await result2.wait();

    console.log("setting cross chain token...")
    const result3 = await cotract.connect(deployer).setCrossChainToken(
        sepoliaCrossChainTokenAddress
    )
    const receipt3 = await result3.wait();

    console.log('Ended')
    
}

main()