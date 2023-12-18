import UseAnimations from 'react-useanimations'

// Animated Icons :
import alertCircle from 'react-useanimations/lib/alertCircle'
import alertTriangle from 'react-useanimations/lib/alertTriangle'
import checkmark from 'react-useanimations/lib/checkmark'
import help from 'react-useanimations/lib/help'
import loading from 'react-useanimations/lib/loading'

import { BiErrorCircle, BiLoader } from 'react-icons/bi'
import { BsCheckCircleFill } from 'react-icons/bs'
import { AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

interface ToastProps {
	type: ToastType
	message: string
}

export const GenericToast = ({ type, message }: ToastProps) => {
	switch (type) {
		case 'success':
			toast.success(message, {
				bodyStyle: { backgroundColor: '#2A2A2A' },
				style: { color: '#F2F2F2', fontWeight: '900' },
				icon: <UseAnimations animation={checkmark} wrapperStyle={{
          width: 'fit-content',
        }} strokeColor="#5E869B" size={40} />,
			})
			break
		case 'info':
			toast.info(message, {
				bodyStyle: { backgroundColor: '#2A2A2A' },
				style: { color: '#F2F2F2', fontWeight: '900' },
				icon: <UseAnimations animation={help} wrapperStyle={{
          width: 'fit-content',
        }} strokeColor="#5E869B" size={40} />,
			})
			break
		case 'warning':
			toast.warning(message, {
				bodyStyle: { backgroundColor: '#2A2A2A' },
				style: { color: '#F2F2F2', fontWeight: '900' },
				icon: <UseAnimations animation={alertTriangle} wrapperStyle={{
          width: 'fit-content',
        }} strokeColor="#5E869B" size={40} />,
			})
			break
		case 'error':
			toast.error(message, {
				bodyStyle: { backgroundColor: '#2A2A2A' },
				style: { color: '#F2F2F2', fontWeight: '900' },
				icon: <UseAnimations animation={alertCircle} wrapperStyle={{
          width: 'fit-content',
        }} strokeColor="#5E869B" size={40} />,
			})
			break
		case 'loading':
			toast.loading(message, {
				bodyStyle: { backgroundColor: '#2A2A2A' },
				style: { color: '#F2F2F2', fontWeight: '900' },
				icon: (
					<UseAnimations
						animation={loading}
						wrapperStyle={{
							width: 'fit-content',
						}}
						strokeColor="#5E869B"
						size={30}
					/>
				),
			})
			break
		default:
			toast(message, { bodyStyle: { backgroundColor: '#2A2A2A' }, style: { color: '#F2F2F2', fontWeight: '900' }, progressClassName: 'custom-toast-progress' })
	}
}
