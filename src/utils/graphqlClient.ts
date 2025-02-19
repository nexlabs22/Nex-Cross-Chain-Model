
import { Networks } from '@/types/indexTypes';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink_sepolia = createHttpLink({
  uri: `https://api.studio.thegraph.com/query/82654/${'nexlabs-subgraphs'}/version/latest`, 
});
const httpLink_arbitrum = createHttpLink({
  uri: `https://api.studio.thegraph.com/query/82654/nexlabs-subgraphs-arbitrum-one/version/latest`, 
});

const httpLink_staking = createHttpLink({
  uri: 'https://api.studio.thegraph.com/query/82654/nexlabs-subgraph-staking/version/latest', 
});

const apolloIndexClient = (network: Networks) => {
  return new ApolloClient({
    link: network === 'Sepolia' ? httpLink_sepolia: httpLink_arbitrum,
    cache: new InMemoryCache(),
  });
};

const apolloStakingClient = new ApolloClient({
  link: httpLink_staking,
  cache: new InMemoryCache(),
});

export { apolloStakingClient, apolloIndexClient };
