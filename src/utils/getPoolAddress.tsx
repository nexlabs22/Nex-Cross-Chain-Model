
// Import necessary libraries
import { Token, Fetcher} from '@uniswap/sdk';

// Function to fetch the pool address
const getPoolAddress = async (tokenAddress1: string, tokenAddress2: string, token1Decimal: number, token2Decimal: number): Promise<string | undefined> => {
  try {

    console.log(tokenAddress1, token1Decimal, tokenAddress2, token2Decimal)

    // Create token instances for the two tokens
    const token1 = new Token(1, tokenAddress1, token1Decimal, 'Token1', 'T1');
    const token2 = new Token(1, tokenAddress2, token2Decimal, 'Token2', 'T2');

    // Fetch the pair using the Uniswap SDK
    const pair = await Fetcher.fetchPairData(token1, token2);

    // Return the pool address
    return pair?.liquidityToken.address;
  } catch (error) {
    console.error('Error fetching pool address:', error);
    return undefined;
  }
};

export default getPoolAddress;
