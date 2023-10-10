import type { AppProps } from 'next/app'
import '../styles/globals.css'
import  {ThirdwebProvider}  from '@components/ThirdwebProvider'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
        <ThirdwebProvider>
			<Component {...pageProps} />
        </ThirdwebProvider>
		</>
	)
}
