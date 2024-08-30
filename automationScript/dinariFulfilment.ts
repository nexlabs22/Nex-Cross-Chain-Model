import { createWalletClient, webSocket, publicActions } from 'viem'
import { sepolia } from 'viem/chains'
require("dotenv").config()

import { privateKeyToAccount } from 'viem/accounts'
import { dinariOrderProcessorAbi, stockFactoryProcessorAbi } from '@/constants/abi'
import { IndexFactoryProcessorAddresses, OrderProcessorAddresses } from '@/constants/contractAddresses'

// Create account from private key
const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY}` as `0x${string}`)

const wsTransport = webSocket(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_WS_URL);

function createClient() {
    return createWalletClient({
        account,
        chain: sepolia,
        transport: wsTransport,
    }).extend(publicActions);
}

let client = createClient();


async function multical(logs: any) {
    try {
        const id = logs[0]?.args?.id;
        console.log('Checking ID:', id);
        const isFilled = await client.readContract({
            address: IndexFactoryProcessorAddresses[`sepolia`] as `0x${string}`,
            abi: stockFactoryProcessorAbi,
            args: [id],
            functionName: 'checkMultical',
        });

        console.log('Status is:', isFilled);

        if (isFilled) {
            console.log('Completing...');
            const { request } = await client.simulateContract({
                account,
                address: IndexFactoryProcessorAddresses[`sepolia`] as `0x${string}`,
                abi: stockFactoryProcessorAbi,
                functionName: 'multical',
                args: [id],
            });
            const hash = await client.writeContract(request);
            console.log('Completed!');
        }
    } catch (error) {
        console.error('Multical error:', error);
    }
}

export function startEventListening() {
    try {
        const unwatch = client.watchContractEvent({
            address: OrderProcessorAddresses[`sepolia`] as `0x${string}`,
            abi: dinariOrderProcessorAbi,
            eventName: 'OrderFulfilled',
            onLogs: logs => multical(logs),
        });

        console.log('Started listening to events.');

    } catch (error) {
        console.error('Failed to set up event listener:', error);
        setTimeout(startEventListening, 5000); // Retry after 5 seconds
    }
}

