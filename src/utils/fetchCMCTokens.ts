export async function fetchCoinMarketCapTokens() {

    try {
      const response = await fetch('/api/getCMCTokens');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error in fetchCoinMarketCapTokens:', error);
      throw error;
    }
  }