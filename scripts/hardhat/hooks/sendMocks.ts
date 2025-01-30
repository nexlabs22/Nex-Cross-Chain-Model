import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/factory/IndexFactoryStorage.sol/IndexFactoryStorage.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiChainSelector, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector } from "../../network";
import { arbitrumSepoliaTestRippleAddress, ChainSelectors, CR5IndexFactoryStorageAddresses, sepoliaBitcoinAddress, sepoliaTestBinanceAddress, sepoliaTestSolanaAddress, WethAddresses } from "../../contractAddresses";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const cotract:any = new ethers.Contract(
        CR5IndexFactoryStorageAddresses['sepolia'] as string, //factory goerli
        Factory_ABI,
        provider
    )
    // await wallet.connect(provider);
    console.log("sending data...")
    const result = await cotract.connect(deployer).mockFillAssetsList(
        [
        sepoliaBitcoinAddress,
        WethAddresses['sepolia'],
        sepoliaTestBinanceAddress,
        sepoliaTestSolanaAddress,
        arbitrumSepoliaTestRippleAddress
        ],
        [
        "20000000000000000000", 
        "20000000000000000000",
        "20000000000000000000",
        "20000000000000000000",
        "20000000000000000000"
        ],
        [
        "3",
        "3",
        "3",
        "3",
        "3"
        ],
        [
        sepoliaChainSelector,
        sepoliaChainSelector,
        sepoliaChainSelector,
        sepoliaChainSelector,
        ChainSelectors[`arbitrumSepolia`]
        ]
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