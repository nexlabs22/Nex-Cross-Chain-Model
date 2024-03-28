import {
	// InverseClient,
	// LinearClient,
	// // InverseFuturesClient,
	// SpotClientV3,
	// UnifiedMarginClient,
	// USDCOptionClient,
	// USDCPerpetualClient,
	// AccountAssetClient,
	// CopyTradingClient,
	RestClientV5,
} from 'bybit-api'
import { NextResponse } from 'next/server'

//   const restClientOptions = {
// 	/** Your API key. Optional, if you plan on making private api calls */
// 	key?: string;

// 	/** Your API secret. Optional, if you plan on making private api calls */
// 	secret?: string;

// 	/** Set to `true` to connect to testnet. Uses the live environment by default. */
// 	testnet?: boolean;

// 	/** Override the max size of the request window (in ms) */
// 	recv_window?: number;

// 	/** Default: false. If true, we'll throw errors if any params are undefined */
// 	strict_param_validation?: boolean;

// 	/**
// 	 * Optionally override API protocol + domain
// 	 * e.g baseUrl: 'https://api.bytick.com'
// 	 **/
// 	baseUrl?: string;

// 	/** Default: true. whether to try and post-process request exceptions. */
// 	parse_exceptions?: boolean;

// 	/** Default: false. Enable to parse/include per-API/endpoint rate limits in responses. */
// 	parseAPIRateLimits?: boolean;

// 	/** Default: false. Enable to throw error if rate limit parser fails */
// 	throwOnFailedRateLimitParse?: boolean;
//   };
export async function GET() {
	const API_KEY = process.env.BYBIT_API_KEY
	const API_SECRET = process.env.BYBIT_SECRETE_KEY
	const useTestnet = false

	const client = new RestClientV5(
		{
			key: API_KEY,
			secret: API_SECRET,
			testnet: useTestnet,
			// Optional: enable to try parsing rate limit values from responses
			// parseAPIRateLimits: true
		}
		// requestLibraryOptions
	)

	// For public-only API calls, simply don't provide a key & secret or set them to undefined
	// const client = new RestClientV5({});

	const response = await client
		.getWalletBalance({
			accountType: 'UNIFIED',
			// coin: 'BTC',
		})
		// .getWalletBalance({
		// 	accountType: 'UNIFIED',
		// 	coin: 'BTC',
		// })
		.then((response) => {
			return response
		})
		.catch((error) => {
			console.error(error)
			return error
		})
		
		return NextResponse.json({ response }, { status: 200 })
}
