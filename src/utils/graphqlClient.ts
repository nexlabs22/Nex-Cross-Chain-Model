
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://api.studio.thegraph.com/query/82654/nexlabs-subgraphs/version/latest', 
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
