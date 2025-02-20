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
    const now = new Date();
    return now.toISOString().split("T")[0];
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
        chain: 'Arbitrum',
        network: 'Mainnet',
        onChain: [],
      };
  
      const result = await collection.insertOne(newDoc);
      doc = { ...newDoc, _id: result.insertedId }
    }
  
    return doc;
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
                client: client
            })
            const indexContract = getContract({
                address: token?.tokenAddresses?.Arbitrum?.Mainnet?.token?.address as Address,
                chain: arbitrum,
                client: client
            })

            const price = await readContract({
                contract: storageContract,
                method: 'function getIndexTokenPrice() returns(uint256)',
                params: []
            })
            const totalSupply = await readContract({
                contract: indexContract,
                method: 'function totalSupply() returns(uint256)',
                params: []
            })

            const entry = {
                timestamp: time,          
                time: new Date().toLocaleTimeString(),
                price: Number(price),
                totalSupply: Number(totalSupply)                
            };

            updates.push({
                updateOne: {
                    filter: { _id: todayDoc._id },
                    update: { $push: { onChain: entry } },
                },
            });
        }

        if (updates.length > 0) {
            const data = await collection.bulkWrite(updates);
            console.log("On-chain data updated.");
            return NextResponse.json({ data })
        }

        return NextResponse.json({ message: 'Completed without updating' })

    } catch (err) {
        console.error("Error updating data:", err);
        return NextResponse.json({
          error: "Failed to update data",
          status: 500,
        })
      }

}