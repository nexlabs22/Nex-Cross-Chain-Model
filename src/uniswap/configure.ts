// import { WETH9, Token } from '@uniswap/sdk-core'
// import { FeeAmount } from '@uniswap/v3-sdk'

// // Sets if the example should run locally or on chain
// // export enum Environment {
// //   MAINNET,
// //   GOERLI
// // }

// // Inputs that configure this example to run
// export interface ExampleConfig {
//   // env: Environment
//   // rpc: {
//   //   mainnet: string
//   // }
//   pool: {
//     tokenA: Token
//     tokenB: Token
//     fee: FeeAmount
//   }
//   // chart: {
//   //   numSurroundingTicks: number
//   // }
// }

// // Example Configuration
// const WBTC_TOKEN = new Token(
//     1,
//     // '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
//     '0x514910771AF9Ca656af840dff83E8264EcF986CA',
//     // '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//     8,
//     'WBTC',
//     'Wrapped BTC'
//   )
// const WETH_TOKEN = new Token(
//     1,
//     '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//     18,
//     'WETH',
//     'Wrapped ETH'
//   )
  


// export const CurrentConfig: ExampleConfig = {
//   env: Environment.GOERLI,
//   rpc: {
//     // mainnet: 'https://mainnet.infura.io/v3/e26bc19346bb442290e1408cb78fdb4f',
//     mainnet: 'https://goerli.infura.io/v3/e26bc19346bb442290e1408cb78fdb4f',
//   },
//   pool: {
//     tokenA: WBTC_TOKEN,
//     // tokenB: WETH9[1],
//     tokenB: WETH_TOKEN,
//     fee: FeeAmount.MEDIUM,
//   },
//   chart: {
//     numSurroundingTicks: 100,
//   },
// }