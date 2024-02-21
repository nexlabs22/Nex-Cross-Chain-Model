
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
  // uri: 'https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli', 
  uri: 'https://api.thegraph.com/subgraphs/name/0xtarc/mock-uniswap-v3-sepolia', 
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
