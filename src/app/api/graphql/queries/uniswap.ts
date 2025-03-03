import { gql } from 'urql'
import { contractTypeToEntities, fields, formatEntityName } from './query-generator-helper';

export const GET_HISTORICAL_PRICES_QL = gql`
	query GetHistoricalPrices($poolAddress: String!, $startingDate: Int!, $limit: Int!, $direction: String!) {
		poolDayDatas(first: $limit, orderBy: date, orderDirection: $direction, where: { pool: $poolAddress, date_gt: $startingDate }) {
			date
			token0Price
			token1Price
		}
	}
`

export const generateGraphQLQuery = (index: string, contractType: string) => {
	if (!contractType) {
	  throw new Error(`Invalid index name: ${index}`);
	}
  
	const allowedEntities = contractTypeToEntities[contractType];
  
	const queryParts = allowedEntities.map((entity) => {
	  const formattedEntity = formatEntityName(index, entity);
  
	  const selectedFields = fields
		.filter((f) => f.smartContractTypes.includes(contractType))
		.map((f) => f.field);
  
	  if (entity.toLowerCase().includes("issuance")) {
		selectedFields.push("inputToken");
	  } else if (entity.toLowerCase().includes("redemption")) {
		selectedFields.push("outputToken");
	  }
  
	  return `
		${formattedEntity}(orderBy: time, orderDirection: desc) {
		  ${selectedFields.join("\n")}
		}
	  `;
	});
  
	return gql`
	  query {
		${queryParts.join("\n")}
	  }
	`;
  };

export const GET_STAKING_EVENT_LOGS = gql`
	query GetHistoricalEventLogs {
		stakeds {
  			user
  			tokenAddress
  			amount
  			totalStakedAmount
  			poolSize
  			vault
  			sharesMinted
  			timestamp
  			blockNumber
  			blockTimestamp
  			transactionHash
		}
		unstakeds {
  			user
  			tokenAddress
  			amount
  			totalStakedAmount
  			poolSize
  			vault
  			sharesBurned
  			timestamp
  			blockNumber
  			blockTimestamp
  			transactionHash
		}
	}
`

