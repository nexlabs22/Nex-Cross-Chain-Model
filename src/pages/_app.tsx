import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { ThirdwebProvider } from '@components/ThirdwebProvider'
import {
	ConnectWallet,
	metamaskWallet,
	coinbaseWallet,
	walletConnect,
	safeWallet,
	localWallet,
	embeddedWallet,
	trustWallet,
	zerionWallet,
	bloctoWallet,
	frameWallet,
	rainbowWallet,
	phantomWallet,
} from '@thirdweb-dev/react'
import { Goerli, Ethereum } from '@thirdweb-dev/chains'
import { Theme, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/utils/apollo-client';
// import { mainnet } from 'viem/chains'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				theme={'light'}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<ThirdwebProvider
				activeChain={Goerli}
				// activeChain={Ethereum}
				clientId="5c5689ef3a7061d2ddbfeeff63b4e8e5"
				supportedWallets={[
					metamaskWallet({ recommended: true }),
					coinbaseWallet(),
					walletConnect(),
					safeWallet({
						personalWallets: [
							metamaskWallet(),
							coinbaseWallet(),
							walletConnect(),
						],
					}),
					localWallet(),
					embeddedWallet(),
					trustWallet(),
					zerionWallet(),
					bloctoWallet(),
					frameWallet(),
					rainbowWallet(),
					phantomWallet(),
				]}
			>
				<ApolloProvider client={apolloClient}>
					<Component {...pageProps} />
				</ApolloProvider>
			</ThirdwebProvider>
		</>
	)
}
