import JSBI from 'jsbi'
import { indexTokenV2Abi, uniswapV3PoolContractAbi } from '@/constants/abi'
import { FullMath, TickMath } from '@uniswap/v3-sdk'
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default async function getPriceHistory(poolAddress: string, seconds: number) {
    
    // console.log('function called', poolAddress, seconds)
    // console.log(process.env.WALLET_PRIVATE_KEY)
    // console.log(process.env.FMP_KEY)
    // const apiKey = process.env.FMP_KEY;
    // console.log('API KEY:', apiKey)
    try{
        const secondsAgo = [seconds, 0]
        const thirdWeb = ThirdwebSDK.fromPrivateKey('5a93bd4174abc15dfc155da3ce77550c26c84e36ff29e4d22c26f1e024feced6', "sepolia");
        const poolContract = await thirdWeb.getContract(poolAddress, uniswapV3PoolContractAbi)
        const observeData = await poolContract.call('observe', [secondsAgo])

        const tickCumulatives = observeData.tickCumulatives.map((v:any)=>Number(v))
        const tickCumulativeDelta = tickCumulatives[1] - tickCumulatives[0]

        const arithimaticMeanTick = (tickCumulativeDelta/secondsAgo[0]).toFixed(0)
        const arithimaticMeanTickInt = parseInt(arithimaticMeanTick)

        const sqrtRatioX96 = TickMath.getSqrtRatioAtTick(arithimaticMeanTickInt)

        const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96)

        const baseToken = await poolContract.call('token0')
        const baseTokenContract = await thirdWeb.getContract(baseToken, indexTokenV2Abi)
        const baseTokenDecimal = await baseTokenContract.call('decimals')

        const quoteToken = await poolContract.call('token1')
        const quoteTokenContract = await thirdWeb.getContract(quoteToken, indexTokenV2Abi)
        const quoteTokenDecimal = await quoteTokenContract.call('decimals')

        const baseAmount = JSBI.BigInt( 1 * (10**baseTokenDecimal))
        const shift = JSBI.leftShift( JSBI.BigInt(1), JSBI.BigInt(192))
        let quoteAmount:any = 0

        if(baseToken < quoteToken){
            quoteAmount = FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift)
        }else{
            quoteAmount = FullMath.mulDivRoundingUp(shift, baseAmount, ratioX192)

        }
        const finalAmount = quoteAmount.toString()/10**quoteTokenDecimal
        console.log("quoteAmount: ", finalAmount)
        return finalAmount
        // console.log("quoteAmount: ", quoteAmount.toString()/10**quoteTokenDecimal)
        // console.log("quoteAmount: ", (FullMath.mulDivRoundingUp(ratioX192, baseAmount, shift) as any).toString()/10**18)
        // console.log("quoteAmount: ", (FullMath.mulDivRoundingUp(shift, baseAmount, ratioX192) as any).toString()/10**18)


    }catch(err){
        console.log(err)
        return err;
    }
}
