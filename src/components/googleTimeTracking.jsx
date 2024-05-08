import { analytic } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const TimeTracker = () => {

	const router = useRouter()
	const location = router.pathname

	const recordUserTime = () => {
		const startTime = new Date().getTime()
		console.log('startTime', startTime)

		const recordUserDuration = () => {
			const duration = Math.round((new Date().getTime() - startTime) / 1000) // Calculate duration in seconds

			console.log('duration', { location, duration })
			localStorage.setItem('Time', JSON.stringify({ location, duration }))

			logEvent(analytic, `time_duration: ${duration}`);

		}

		window.addEventListener('beforeunload', recordUserDuration) // Record time spent when user leaves the page
	}

	useEffect(() => {
		recordUserTime()

		return () => {
			window.removeEventListener('beforeunload', recordUserTime)
		}
	}, [])

	return null 
}

export default TimeTracker
