import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as FactoryStorage_ABI,
    bytecode as FactoryStorage_BYTECODE,
  } from '../../artifacts/contracts/factory/IndexFactoryStorage.sol/IndexFactoryStorage.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiCR5CrossChainFactory, mumbaiChainSelector, mumbaiTestRippleAddress, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaCrossChainTokenAddress, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
import { ChainSelectors, CR5CrossChainFactoryAddresses, CR5IndexFactoryAddresses, CR5IndexFactoryBalancerAddresses, CR5IndexFactoryStorageAddresses, CrossChainTokenAddresses } from "../../contractAddresses";
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
        // testSepoliaCR5IndexFactory as string, //factory goerli
        FactoryStorage_ABI,
        provider
    )
    // await wallet.connect(provider);
    // console.log("sending data...")

    console.log("setting cross chain tokens...")
    const result1 = await cotract.connect(deployer).setCrossChainToken(
        ChainSelectors['arbitrumSepolia'],
        CrossChainTokenAddresses['sepolia'],
        "3"
    )
    const receipt1 = await result1.wait();

    console.log("setting cross chain index factory...")
    const result2 = await cotract.connect(deployer).setCrossChainFactory(
        CR5CrossChainFactoryAddresses['arbitrumSepolia'],
        ChainSelectors['arbitrumSepolia']
    )
    const receipt2 = await result2.wait();

    console.log("setting factory...")
    const result3 = await cotract.connect(deployer).setIndexFactory(
        CR5IndexFactoryAddresses['sepolia']
    )
    const receipt3 = await result3.wait();

    console.log("setting balancer...")
    const result4 = await cotract.connect(deployer).setIndexFactoryBalancer(
        CR5IndexFactoryBalancerAddresses['sepolia']
    )
    const receipt4 = await result4.wait();

    console.log('Ended')
    
}

main()