import { ethers } from "hardhat";
// import {
//     abi as Factory_ABI,
//     bytecode as Factory_BYTECODE,
//   } from '../artifacts/contracts/factory/IndexFactory.sol/IndexFactory.json'
import {
    abi as Factory_ABI,
    bytecode as Factory_BYTECODE,
  } from '../../artifacts/contracts/vault/CrossChainFactory.sol/CrossChainIndexFactory.json'
import {
    abi as Vault_ABI,
    bytecode as Vault_BYTECODE,
  } from '../../artifacts/contracts/vault/CrossChainVault.sol/CrossChainVault.json'
import { IndexFactory } from "../../typechain-types";
import { mumbaiCR5CrossChainFactory, mumbaiCR5CrossChainVault, mumbaiChainSelector, mumbaiCrossChainTokenAddress, mumbaiTestRippleAddress, sepoliaBitcoinAddress, sepoliaCR5IndexFactory, sepoliaCR5IndexFactoryStorage, sepoliaChainSelector, sepoliaCrossChainTokenAddress, sepoliaTestBinanceAddress, sepoliaTestEthereumAddress, sepoliaTestSolanaAddress, testSepoliaCR5IndexFactory } from "../../network";
import { ChainSelectors, CR5CrossChainFactoryAddresses, CR5CrossChainVaultAddresses, CrossChainTokenAddresses } from "../../contractAddresses";
// import { goerliAnfiFactoryAddress } from "../contractAddresses";
require("dotenv").config()

async function main() {
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const [deployer] = await ethers.getSigners();
    // const signer = await ethers.getSigner(wallet)
    // const provider = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL)
    const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_SEPOLIA_RPC_URL)
    const factoryCotract:any = new ethers.Contract(
        CR5CrossChainFactoryAddresses['arbitrumSepolia'] as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        Factory_ABI,
        provider
    )
    const vaultCotract:any = new ethers.Contract(
        CR5CrossChainVaultAddresses['arbitrumSepolia'] as string, //factory goerli
        // testSepoliaCR5IndexFactory as string, //factory goerli
        Vault_ABI,
        provider
    )
    // await wallet.connect(provider);
    // console.log("sending data...")

    console.log("setting cross chain index token in the cross chain factory contract ...")
    const result1 = await factoryCotract.connect(deployer).setCrossChainToken(
        ChainSelectors['sepolia'],
        CrossChainTokenAddresses['arbitrumSepolia'],
        "3"
    )
    const receipt1 = await result1.wait();


    console.log("setting cross chain index factory in the cross chain vault...")
    const result2 = await vaultCotract.connect(deployer).setFactory(
        CR5CrossChainFactoryAddresses['arbitrumSepolia'],
    )
    const receipt2 = await result2.wait();

    

    console.log('Ended')
    
}

main()