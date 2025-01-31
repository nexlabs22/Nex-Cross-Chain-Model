import { TiWarningOutline } from "react-icons/ti"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RiLoader2Line } from "react-icons/ri"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { VscError } from "react-icons/vsc"
import { GoInfo } from "react-icons/go"

type ToastType = "success" | "info" | "warning" | "error" | "loading"

interface ToastProps {
  type: ToastType
  message: string
}

export const StyledToast = ({ type, message }: ToastProps) => {
  switch (type) {
    case "success":
      toast.success(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        icon: <IoIosCheckmarkCircleOutline size={20} color="#5E869B" />,
      })
      break
    case "info":
      toast.info(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        icon: <GoInfo size={20} color="#5E869B" />,
      })
      break
    case "warning":
      toast.warning(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        icon: <TiWarningOutline size={20} color="#5E869B" />,
      })
      break
    case "error":
      toast.error(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        icon: <VscError size={20} color="#5E869B" />,
      })
      break
    case "loading":
      toast.loading(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        icon: <RiLoader2Line size={20} color="#5E869B" />,
      })
      break
    default:
      toast(message, {
        bodyStyle: { backgroundColor: "#2A2A2A" },
        style: { color: "#F2F2F2", fontWeight: "900" },
        progressClassName: "custom-toast-progress",
      })
  }
}
