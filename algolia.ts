import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string, 
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY as string)

export default searchClient
