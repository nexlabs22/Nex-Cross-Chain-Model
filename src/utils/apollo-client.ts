
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3', 
  // uri: 'https://api.thegraph.com/subgraphs/name/liqwiz/uniswap-v3-goerli', 
  uri: 'https://api.studio.thegraph.com/query/82654/nexlabs-subgraphs/version/latest', 
  // uri: 'https://api.thegraph.com/subgraphs/name/0xtarc/mock-uniswap-v3-sepolia', 
});
const httpLink_staking = createHttpLink({
  uri: 'https://api.studio.thegraph.com/query/82654/nexlabs-subgraph-staking/version/latest', 
});

const apolloIndexClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const apolloStakingClient = new ApolloClient({
  link: httpLink_staking,
  cache: new InMemoryCache(),
});

export default apolloIndexClient;

export { apolloStakingClient };
