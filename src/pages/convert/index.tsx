'use client'

import DappNavbar from '@/components/DappNavbar'
import { LifiWidget } from '@components/LifiWidget'
import Footer from '@/components/Footer'

export default function Convert() {
	return (
		<main className="min-h-screen overflow-x-hidden h-screen bg-whiteBackground-500">
			<DappNavbar />
			<section className="w-screen h-full flex flex-row items-center justify-start pt-10">
				<div className="w-2/3 h-full flex flex-col items-start justify-start p-8">
					<h5 className="montrealBold text-blackText-500 text-4xl mb-6">Convert Nex Tokens</h5>
					<p className="pangramCompact text-xl text-blackText-500 w-11/12">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
						cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
					<p className="pangramCompact text-xl text-blackText-500 w-11/12">
					At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
					</p>
				</div>
				<div className="w-1/3 h-fit flex flex-col items-center justify-center">
					{/*<LifiWidget></LifiWidget>*/}
				</div>
			</section>
			<Footer />
		</main>
	)
}
