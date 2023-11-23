import { gql } from '@apollo/client';

export const GET_HISTORICAL_PRICES = gql`
  query GetHistoricalPrices($poolAddress: String!, $startingDate: Int!) {
    poolDayDatas(first: 100, orderBy: date, where: {
            pool: $poolAddress,
            date_gt: $startingDate
           } ) {
        date
        token0Price
        token1Price
      }
  }
`;
// export const GET_HISTORICAL_PRICE = gql`
//   {
//     poolDayDatas(first: 100, orderBy: date, where: {
//         pool: "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801",
//         date_gt: 1697981778
//       } ) {
//         date
//         token0Price
//         token1Price
//       }
//   }
// `;
