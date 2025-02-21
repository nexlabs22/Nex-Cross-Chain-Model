import { nexTokensArray } from "@/constants/indices";
import { Address, AssetCategory, IndexCryptoAsset } from "@/types/indexTypes";
import { DailyAsset } from "@/types/mongoDb";
import { uploadToDailyAssets } from "@/utils/convertToMongo/parse";
import { DailyAssetsClient } from "@/utils/MongoDbClient";
import { client } from "@/utils/thirdWebClient";
import { Collection } from "mongodb";
import { NextResponse } from "next/server";
import { getContract, readContract } from "thirdweb";
import { arbitrum } from "thirdweb/chains";

const getDate = () => new Date().toISOString().split("T")[0];
const getTimestamp = () => Math.floor(Date.now() / 1000);

async function getDocument(collection: Collection<DailyAsset>, token: IndexCryptoAsset) {
    const today = getDate();
    let doc = await collection.findOne({ date: today, ticker: token.symbol });

    if (!doc) {
        const newDoc: DailyAsset = {            
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

function calculateOHLC(prices: number[]) {
    if (prices.length === 0) return null;

    return {
        open: prices[0], 
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices[prices.length - 1],
    };
}

export async function GET() {
    try {
        const { collection } = await DailyAssetsClient();
        const time = getTimestamp();
        const dataToUpload: DailyAsset[] = [];

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

            todayDoc.onChain?.push(entry);

            // Compute OHLC values
            const prices = todayDoc.onChain?.map((entry) => entry.price);
            const ohlc = calculateOHLC(prices as number[]);

            // Prepare document for upload
            const updatedDoc = {
                ...todayDoc,
                open: ohlc?.open ?? Number(price),
                high: ohlc?.high ?? Number(price),
                low: ohlc?.low ?? Number(price),
                close: ohlc?.close ?? Number(price),
            };

            dataToUpload.push(updatedDoc);
        }

        if (dataToUpload.length > 0) {
            await uploadToDailyAssets(dataToUpload, collection);
            console.log("On-chain data updated.");
        }

        // Fetch and return the latest document with OHLC included
        const responseDocs = await collection.find({ date: getDate(), chain: "Arbitrum" }).toArray();

        return NextResponse.json({ data: responseDocs });

    } catch (err) {
        console.error("Error updating data:", err);
        return NextResponse.json({
            error: "Failed to update data",
            status: 500,
        });
    }
}
