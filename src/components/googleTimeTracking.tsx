import { useAddress } from '@thirdweb-dev/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ReactGA from 'react-ga4' // Import from 'react-ga4' instead of 'react-ga'

const initializeReactGA = () => {
	ReactGA.initialize('G-NS20Y9N6S5') // Replace 'YOUR_MEASUREMENT_ID' with your actual GA4 Measurement ID
}



const TimeTracker: React.FC = () => {

	const address = useAddress()

	const router = useRouter()
	const location = router.pathname
	
	const recordUserTime = () => {
		const startTime = new Date().getTime()
		console.log("startTime", startTime)
		
		const recordUserDuration = () => {
			const duration = Math.round((new Date().getTime() - startTime) / 1000) // Calculate duration in seconds

			console.log("duration", {location, duration})
			localStorage.setItem("Time", JSON.stringify({location, duration}))

		// ReactGA.send({
		//   hitType: 'event',
		//   eventCategory: 'User',
		//   eventAction: 'Time Spent',
		//   eventValue: duration
		// });
	
		ReactGA.event({
			category: "User",
			action: "TimeSpent",
			label: address, // optional
			value: duration, // optional, must be a number
			// nonInteraction: true, // optional, true/false
			// transport: "xhr", // optional, beacon/xhr/image
		  });
		}
	
		window.addEventListener('beforeunload', recordUserDuration) // Record time spent when user leaves the page
	}

	useEffect(() => {
		initializeReactGA()
		recordUserTime()

		return () => {
			window.removeEventListener('beforeunload', recordUserTime)
		}
	}, [])

	return null // This component doesn't render anything visible
}

export default TimeTracker
