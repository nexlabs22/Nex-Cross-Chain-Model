import { indexFactoryV2Abi } from "@/constants/abi";
import { sepoliaCrypto5V2Factory } from "@/constants/contractAddresses";
import { ethers } from "ethers";

// Connect to the network
let sepoliaProvider = new ethers.providers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`);


// Create a new contract instance
let contract = new ethers.Contract(sepoliaCrypto5V2Factory, indexFactoryV2Abi, sepoliaProvider);

export async function getTransactionReceipt(txHash:string) {
    // Get the transaction receipt
    let receipt = await sepoliaProvider.getTransactionReceipt(txHash);
    
    // Filter for a specific event
    const eventTopic = contract.interface.getEventTopic("MessageSent"); // Get the event topic from the contract interface

    // Filter the logs based on the event topic
    const filteredLogs = receipt.logs.filter(log => log.topics[0] === eventTopic);
    // console.log("parsedLogs", filteredLogs[0].data)
    return filteredLogs[0].data;
}

