import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
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
import { Goerli, Ethereum, Sepolia } from '@thirdweb-dev/chains'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useLandingPageStore } from '@/store/store'
import { Theme, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '@/utils/apollo-client'
import { useEffect } from 'react'
import useTradePageStore from '@/store/tradeStore'
import { useChartDataStore } from '@/store/store'
import TimeTracker from '@/components/googleTimeTracking'
import { PWAProvider } from '@/providers/PWAProvider'
import { PortfolioProvider } from '@/providers/PortfolioProvider'
import { DashboardProvider } from '@/providers/DashboardProvider'
import { DeFiSwapProvider } from '@/providers/DefiSwapProvider'
import { HistoryProvider } from '@/providers/HistoryProvider'

export default function App({ Component, pageProps }: AppProps) {
	const { setEthPriceInUsd } = useTradePageStore()
	// const { setANFIWeightage } = useChartDataStore()
	const { theme } = useLandingPageStore()

	useEffect(() => {
		setEthPriceInUsd()
		// setANFIWeightage()
	}, [setEthPriceInUsd])
	return (
		<>
			<ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick theme={'light'} rtl={false} pauseOnFocusLoss draggable pauseOnHover />
			<TimeTracker />
			<ThirdwebProvider
				activeChain={Sepolia}
				autoConnect={true}
				autoConnectTimeout={30000}
				supportedChains={[Sepolia]}
				clientId="5c5689ef3a7061d2ddbfeeff63b4e8e5"
				supportedWallets={[
					metamaskWallet({ recommended: true }),
					coinbaseWallet(),
					walletConnect(),
					safeWallet({
						personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnect()],
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
					<ThemeProvider theme={theme}>
						<PWAProvider>
							<DashboardProvider>
								<PortfolioProvider>
									<DeFiSwapProvider>
										<HistoryProvider>
											<Component {...pageProps} />
											<Analytics />
										</HistoryProvider>
									</DeFiSwapProvider>
								</PortfolioProvider>
							</DashboardProvider>
						</PWAProvider>
					</ThemeProvider>
				</ApolloProvider>
			</ThirdwebProvider>
		</>
	)
}
