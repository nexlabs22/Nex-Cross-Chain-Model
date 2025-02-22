
import { TiWarningOutline } from "react-icons/ti";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RiLoader2Line } from 'react-icons/ri'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { VscError } from "react-icons/vsc";
import { GoInfo } from 'react-icons/go'
import theme from "@/theme/theme"

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

interface ToastProps {
	type: ToastType
	message: string
}

export const GenericToast = ({ type, message }: ToastProps) => {
	switch (type) {
		case 'success':
			toast.success(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				icon: <IoIosCheckmarkCircleOutline size={20} color={theme.palette.success.main} />,
			})
			break
		case 'info':
			toast.info(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				icon: <GoInfo size={20} color={theme.palette.info.main} />,
			})
			break
		case 'warning':
			toast.warning(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				icon: <TiWarningOutline size={20} color={theme.palette.warning.main} />,
			})
			break
		case 'error':
			toast.error(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				icon: <VscError size={20} color={theme.palette.error.main} />,
			})
			break
		case 'loading':
			toast.loading(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				icon: <RiLoader2Line size={20} color={theme.palette.info.main} />,
			})
			break
		default:
			toast(message, {
				style: { color: theme.palette.text.primary, fontWeight: '600', fontFamily: 'Satoshi-Variable' },
				progressClassName: 'custom-toast-progress'
			})
	}
}
