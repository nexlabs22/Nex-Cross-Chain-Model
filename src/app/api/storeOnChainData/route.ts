import { nexTokensArray } from "@/constants/indices";
import { Address, AssetCategory, IndexCryptoAsset } from "@/types/indexTypes";
import { DailyAsset } from "@/types/mongoDb";
import { DailyAssetsClient } from "@/utils/MongoDbClient";
import { client } from "@/utils/thirdWebClient";
import { Collection, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getContract, readContract } from "thirdweb";
import { arbitrum } from "thirdweb/chains";

const getDate = () => {
    return new Date().toISOString().split("T")[0];
};

const getTimestamp = () => Math.floor(Date.now() / 1000);

async function getDocument(collection: Collection<DailyAsset>, token: IndexCryptoAsset) {
    const today = getDate();
    let doc = await collection.findOne({ date: today, ticker: token.symbol });

    if (!doc) {
        const newDoc: DailyAsset & { _id: ObjectId } = {
            _id: new ObjectId(),
            date: today,
            ticker: token.symbol,
            name: token.name,
            address: token.tokenAddresses?.Arbitrum?.Mainnet?.token?.address,
            type: AssetCategory.Index,
            timestamp: getTimestamp(),
            chain: "Arbitrum",
            network: "Mainnet",
            onChain: [],
        };

        const result = await collection.insertOne(newDoc);
        doc = { ...newDoc, _id: result.insertedId };
    }

    return doc;
}

// Function to calculate OHLC from on-chain data
function calculateOHLC(prices: number[]) {
    if (prices.length === 0) return null;
    
    return {
        open: prices[0], // First recorded price of the day
        high: Math.max(...prices), // Highest price of the day
        low: Math.min(...prices), // Lowest price of the day
        close: prices[prices.length - 1], // Last recorded price of the day
    };
}

export async function GET() {
    try {
        const { collection } = await DailyAssetsClient();
        const time = getTimestamp();
        const updates = [];

        for (const token of nexTokensArray.filter((token) => token.symbol === "ARBEI")) {
            const todayDoc = await getDocument(collection, token);
            const storageContract = getContract({
                address: token?.tokenAddresses?.Arbitrum?.Mainnet?.storage?.address as Address,
                chain: arbitrum,
                client: client,
            });
            const indexContract = getContract({
                address: token?.tokenAddresses?.Arbitrum?.Mainnet?.token?.address as Address,
                chain: arbitrum,
                client: client,
            });

            const price = await readContract({
                contract: storageContract,
                method: "function getIndexTokenPrice() returns(uint256)",
                params: [],
            });
            const totalSupply = await readContract({
                contract: indexContract,
                method: "function totalSupply() returns(uint256)",
                params: [],
            });

            const entry = {
                timestamp: time,
                time: new Date().toLocaleTimeString(),
                price: Number(price),
                totalSupply: Number(totalSupply),
            };

            updates.push({
                updateOne: {
                    filter: { _id: todayDoc._id },
                    update: { $push: { onChain: entry } },
                },
            });

            // Fetch updated document to calculate OHLC
            const updatedDoc = await collection.findOne({ _id: todayDoc._id });
            const prices = updatedDoc?.onChain?.map((entry) => entry.price) || [];
            const ohlc = calculateOHLC(prices);

            // Update the document with OHLC values
            if (ohlc) {
                const {open, high, low, close} = ohlc
                await collection.updateOne(
                    { _id: todayDoc._id },
                    { $set: { open, high, low, close } }
                );
            }else{
                await collection.updateOne(
                    { _id: todayDoc._id },
                    { $set: { 
                        open: Number(price), 
                        high: Number(price), 
                        low: Number(price), 
                        close: Number(price) 
                    } }
                );

            }
        }

        if (updates.length > 0) {
            await collection.bulkWrite(updates);
            console.log("On-chain data updated.");
        }

        // Fetch and return the latest document with OHLC included
        const responseDocs = await collection.find({ date: getDate(), chain: 'Arbitrum' }).toArray();

        return NextResponse.json({ data: responseDocs });

    } catch (err) {
        console.error("Error updating data:", err);
        return NextResponse.json({
            error: "Failed to update data",
            status: 500,
        });
    }
}
