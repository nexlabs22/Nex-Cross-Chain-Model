import { Client } from "pg"

const connectToSpotDb = async () => {
  const client = new Client()
  try {
    await client.connect()
  } catch (error) {
    console.log(error)
    throw new Error("Cannot connect to DB")
  }
  return client
}

export default connectToSpotDb
