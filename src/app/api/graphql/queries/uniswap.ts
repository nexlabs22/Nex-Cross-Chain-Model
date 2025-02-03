import { gql } from 'urql'

export const GET_HISTORICAL_PRICES_QL = gql`
	query GetHistoricalPrices($poolAddress: String!, $startingDate: Int!, $limit: Int!, $direction: String!) {
		poolDayDatas(first: $limit, orderBy: date, orderDirection: $direction, where: { pool: $poolAddress, date_gt: $startingDate }) {
			date
			token0Price
			token1Price
		}
	}
`
export const GET_ISSUANCED_ANFI_EVENT_LOGS = gql`
	query {
		anfiissuanceds(orderBy: time, orderDirection: desc) {
			time
			user
			transactionHash
			inputToken
			inputAmount
			outputAmount
		},
		anfiredemptions(orderBy: time, orderDirection: desc) {
			time
			user
			transactionHash
			outputToken
			inputAmount
			outputAmount
		},
		arbeiissuanceds(orderBy: time, orderDirection: desc) {
			time
			user
			transactionHash
			inputToken
			inputAmount
			outputAmount
		},
		arbeiredemptions(orderBy: time, orderDirection: desc) {
			time
			user
			transactionHash
			outputToken
			inputAmount
			outputAmount
		},
		crypto5Issuanceds(orderBy: time, orderDirection: desc) {
			time
			user
			nonce
			transactionHash
			inputToken
			inputAmount
			outputAmount
			messageId
		},
		crypto5RequestIssuances(orderBy: time, orderDirection: desc) {
			time
			user
			nonce
			transactionHash
			inputToken
			inputAmount
			outputAmount
			messageId
		},
		crypto5RequestRedemptions(orderBy: time, orderDirection: desc) {
			time
			user
			nonce
			transactionHash
			outputToken
			inputAmount
			outputAmount
			messageId
		},
		crypto5Redemptions(orderBy: time, orderDirection: desc) {
			time
			user
			nonce
			transactionHash
			outputToken
			inputAmount
			outputAmount
			messageId
		},
		mag7Issuanceds(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7IssuanceCancelleds(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7RequestIssuances(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7RequestCancelIssuances(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7Redemptions(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7RedemptionCancelleds(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7RequestRedemptions(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		},
		mag7RequestCancelRedemptions(orderBy: time, orderDirection: desc) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}


	}
`
export const GET_REDEMPTION_ANFI_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		anfiredemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			transactionHash
			outputToken
			inputAmount
			outputAmount
		}
	}
`
export const GET_ISSUANCED_ARBEI_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		arbeiissuanceds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			transactionHash
			inputToken
			inputAmount
			outputAmount
		}
	}
`
export const GET_REDEMPTION_ARBEI_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		arbeiredemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			transactionHash
			outputToken
			inputAmount
			outputAmount
		}
	}
`
export const GET_ISSUANCED_crypto5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		crypto5Issuanceds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			nonce
			transactionHash
			inputToken
			inputAmount
			outputAmount
			messageId
		}
	}
`
export const GET_REQ_ISSUANCED_crypto5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		crypto5RequestIssuances(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			nonce
			transactionHash
			inputToken
			inputAmount
			outputAmount
			messageId
		}
	}
`
export const GET_REQ_REDEMPTION_crypto5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		crypto5RequestRedemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			nonce
			transactionHash
			outputToken
			inputAmount
			outputAmount
			messageId
		}
	}
`
export const GET_REDEMPTION_crypto5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		crypto5Redemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			nonce
			transactionHash
			outputToken
			inputAmount
			outputAmount
			messageId
		}
	}
`
export const GET_MAG7_ISSUANCED_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7Issuanceds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_CANCELLED_ISSUANCED_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7IssuanceCancelleds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_REQ_ISSUANCED_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7RequestIssuances(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_REQ_CANCEL_ISSUANCED_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7RequestCancelIssuances(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			inputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_REDEMPTION_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7Redemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_CANCELLED_REDEMPTION_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7RedemptionCancelleds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_REQ_REDEMPTION_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7RequestRedemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
export const GET_MAG7_REQ_CANCEL_REDEMPTION_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		mag7RequestCancelRedemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			user
			time
			nonce
			outputToken
			inputAmount
			outputAmount
			blockTimestamp
			transactionHash
		}
	}
`
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

