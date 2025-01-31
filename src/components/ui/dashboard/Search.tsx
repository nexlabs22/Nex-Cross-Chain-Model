'use client'

import React, { useState } from 'react'
import { SearchBox, InstantSearch, Hits } from 'react-instantsearch'
// import { useRouter } from 'next/router'
import algoliaSearchClient from '@/utils/algolia'

const Hit = ({ hit }: { hit: {index: string, pageTitle: string, description: string} }) => {
	// const router = useRouter()	
	// const handleClick = () => {
	// 	setSearchModal(false)
	// 	if (hit.pageTitle === 'Dashboard') {
	// 		changeDefaultIndex(hit.index)
	// 	}
	// 	router.push(hit.page)
	// }

	return (
		<div className="w-[520px] border border-white cursor-pointer" onClick={()=>{}}>
			{/* <Highlight attribute={hit.index} hit={hit} /> */}
			<strong>{hit.pageTitle}</strong>
			<p>{hit.description}</p>
			{/* <p>{hit.index}</p> */}
		</div>
	)
}

const Search: React.FC = () => {
	const [query, setQuery] = useState('')

	const handleSearchStateChange = (searchState: {uiState: {test_search: {query: string}}}) => {
		if (searchState && searchState.uiState.test_search.query as string) {
			setQuery(searchState.uiState.test_search.query as string )
		} else {
			setQuery('')
		}
	}

	return (

		<>
			<InstantSearch
				indexName="test_search"
				searchClient={algoliaSearchClient}
				onStateChange={handleSearchStateChange}
				future={{
					preserveSharedStateOnUnmount: true,
				}}
			>
				<SearchBox className="w-full p-10 rounded-t-xl" searchAsYouType={true} placeholder="Search by index name or address..." />
				{query && <Hits className='max-h-[400px] overflow-y-scroll' hitComponent={Hit} />}
			</InstantSearch>
			{/* <PoweredBy className="w-[160px] h-[160px] ml-auto m-5" theme="light" /> */}
		</>

	)
}
export default Search
