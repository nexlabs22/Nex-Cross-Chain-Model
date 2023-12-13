
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
  uri: 'https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli', 
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
