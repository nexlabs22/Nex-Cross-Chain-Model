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
	query GetHistoricalEventLogs($accountAddress: String!) {
		anfiissuanceds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
			time
			user
			transactionHash
			inputToken
			inputAmount
			outputAmount
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

export const GET_ISSUANCED_CR5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		cr5Issuanceds(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
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
export const GET_REQ_ISSUANCED_CR5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		cr5RequestIssuances(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
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

export const GET_REQ_REDEMPTION_CR5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		cr5RequestRedemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
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
export const GET_REDEMPTION_CR5_EVENT_LOGS = gql`
	query GetHistoricalEventLogs($accountAddress: String!) {
		cr5Redemptions(orderBy: time, orderDirection: desc, where: { user: $accountAddress }) {
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
