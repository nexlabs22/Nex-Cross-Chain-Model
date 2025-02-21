import convertArbitrumDataTable from "@/utils/convertToMongo/convertArbitrumDataTable"
import convertHistCompDataTable from "@/utils/convertToMongo/convertHistComp"
import convertMagSeven from "@/utils/convertToMongo/convertMagSeven"
import convertNexlabsIndex from "@/utils/convertToMongo/convertNexlabsIndex"
import convertProtocolsData from "@/utils/convertToMongo/convertProtocolsData"
import { convertStocksData } from "@/utils/convertToMongo/convertStocksData"
import { convertTopFiveCrypto } from "@/utils/convertToMongo/convertTopFiveCrypto"
import { convertTopStocksByMarketCap } from "@/utils/convertToMongo/convertTopStocksByMarketCap"


export {
    convertArbitrumDataTable,
    convertHistCompDataTable,
    convertMagSeven,
    convertNexlabsIndex,
    convertProtocolsData,
    convertStocksData,
    convertTopFiveCrypto,
    convertTopStocksByMarketCap
}