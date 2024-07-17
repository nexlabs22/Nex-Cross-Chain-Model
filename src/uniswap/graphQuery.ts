import { gql } from 'urql';

export const GET_HISTORICAL_PRICES_QL = gql`
  query GetHistoricalPrices($poolAddress: String!, $startingDate: Int!, $limit: Int!, $direction: String!) {
    poolDayDatas(first: $limit, orderBy: date, orderDirection:$direction,  where: {
            pool: $poolAddress,
            date_gt: $startingDate
           } ) {
        date
        token0Price
        token1Price
      }
  }
`;