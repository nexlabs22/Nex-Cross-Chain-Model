import getIndexData from "@/utils/indexCalculation";

export default async function getChartData(){
    try{

        const inputData = await fetch("/api/spotDatabase?indexName=OurIndex&tableName=histcomp").then(res=> res.json()).catch(error => console.log(error))
        if (inputData) {
            const cr5IndexPrices = getIndexData('CRYPTO5', inputData.data, inputData?.top5Cryptos);
            const anfiIndexPrices = getIndexData('ANFI', inputData.data, inputData?.top5Cryptos);
            return { data: {cr5IndexPrices,anfiIndexPrices}}
        }
        
    }catch(err){
        console.log(err)
    }
}