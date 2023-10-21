import { BiErrorCircle, BiLoader } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiOutlineWarning, AiOutlineInfoCircle } from 'react-icons/ai'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading';

interface ToastProps {
  type: ToastType;
  message: string;
}

export const GenericToast = ({ type, message }: ToastProps) => {
    switch (type) {
        case 'success':
            toast.success(message, {
				icon: <BsCheckCircleFill size={20} color={'#089981'} />,
			})
          break;
        case 'info':
            toast.info(message,{
				icon: <AiOutlineInfoCircle size={20} color={'#A6C3CE'} />,
			})
          break;
        case 'warning':
            toast.warning(message, {
				icon: <AiOutlineWarning size={20} color={'#ED9733'} />,
			})
          break;
        case 'error':
            toast.error(message, {
				icon: <BiErrorCircle size={20} color={'#F23645'} />,
			})
          break;
        case 'loading':
            toast.loading(message,{
				icon: <BiLoader size={20} color={'#A6C3CE'} />,
			})
          break;
        default:
          toast(message, { bodyStyle: { backgroundColor: 'transparent' }, progressClassName: 'custom-toast-progress' });
      }
};
