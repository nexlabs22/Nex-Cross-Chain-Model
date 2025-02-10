import axios from "axios";
import { IndexCryptoAsset } from "@/types/indexTypes";

export const getWeights = async (index: IndexCryptoAsset) => {
  try {
    const response = await axios.get(`/api/getWeights?index=${index.symbol}`);
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error("Error in getWeights:", error);
    return null;
  }
};
