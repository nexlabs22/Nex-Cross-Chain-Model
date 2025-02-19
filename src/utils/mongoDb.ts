import { MongoClient } from "mongodb"

const url = process.env.MONGO_PUBLIC_URL

if (!url) {
  throw new Error("MONGODB_URI is not defined in environment variables")
}

const client = new MongoClient(url, {
  monitorCommands: true,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 0,
})

try {
  await client.connect()
  console.log("Connected successfully to MongoDB client check")
} catch (error) {
  console.error("Cannot connect to MongoDB", error)
  throw new Error("Cannot connect to MongoDB")
}

export default client
