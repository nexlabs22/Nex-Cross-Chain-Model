export async function fetchCoinMarketCapTokens() {
  console.log("fetching")
    try {
      const response = await fetch('/api/getCMCTokens');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error in fetchCoinMarketCapTokens:', error);
      throw error;
    }
  }