import React, { useState } from 'react'
// import { Hits, Highlight, InfiniteHits, PoweredBy } from 'react-instantsearch-dom'
import { SearchBox, InstantSearch, Hits, PoweredBy } from 'react-instantsearch'
import algoliaSearchClient from '../../algolia'
import { useRouter } from 'next/router'
import { useLandingPageStore } from '@/store/store'

const Hit = ({ hit }: { hit: any }) => {
	const router = useRouter()
	const { defaultIndex, changeDefaultIndex, setSearchModal } = useLandingPageStore()
	const handleClick = () => {
		setSearchModal(false)
		if (hit.pageTitle === 'Dashboard') {
			changeDefaultIndex(hit.index)
		}
		router.push(hit.page)
	}

	return (
		<div className="w-[520px] border border-white cursor-pointer" onClick={handleClick}>
			{/* <Highlight attribute={hit.index} hit={hit} /> */}
			<strong>{hit.pageTitle}</strong>
			<p>{hit.description}</p>
			{/* <p>{hit.index}</p> */}
		</div>
	)
}

const Search: React.FC = () => {
	const [query, setQuery] = useState('')

	const handleSearchStateChange = (searchState: any) => {
		if (searchState && searchState.uiState.test_search.query) {
			setQuery(searchState.uiState.test_search.query)
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
				<SearchBox className="w-full p-10 rounded-t-xl" searchAsYouType={true} placeholder="Search for Index..." />
				{query && <Hits className='max-h-[400px] overflow-y-scroll' hitComponent={Hit} />}
			</InstantSearch>
			<PoweredBy className="w-[160px] h-[160px] ml-auto m-5" theme="light" />
		</>

	)
}
export default Search
