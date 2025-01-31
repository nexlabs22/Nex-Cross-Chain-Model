import { createClient } from "urql"
import { cacheExchange, fetchExchange } from "@urql/core"

const client = createClient({
  url: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_QL_KEY}/subgraphs/id/B4QeFHkfWXjKCDzNn3BJtDRDfG6VeHzGXgkf4Jt3fRn5`,
  exchanges: [cacheExchange, fetchExchange],
})

const indexesClient = createClient({
  url: `https://api.studio.thegraph.com/query/82654/nexlabs-subgraphs/version/latest`,
  exchanges: [cacheExchange, fetchExchange],
})

export default client
export { indexesClient }
