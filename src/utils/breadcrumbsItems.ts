import { GoStack } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { PiHouseBold } from "react-icons/pi";
import { RiExchange2Line } from "react-icons/ri";
import { LuSquarePercent } from "react-icons/lu";
import { MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { GoSearch } from "react-icons/go";


interface BreadcrumbItem {
    icon?: IconType;
    label: string;
    link: string;
    available: boolean
}

const breadcrumbItems: BreadcrumbItem[] = [
    { icon: PiHouseBold, label: "Home", link: "/", available: true },
    { icon: GoStack, label: "Catalogue", link: "/catalogue", available: true },
    { icon: RiExchange2Line, label: "Swap", link: "/swap", available: false },
    { icon: RiExchange2Line, label: "Trade", link: "/trade", available: false },
    { icon: LuSquarePercent, label: "Stake", link: "/stake", available: false },
    { icon: MdOutlineIndeterminateCheckBox, label: "Portfolio", link: "/portfolio", available: true },
    { icon: GoSearch, label: "Search", link: "/search", available: false },
]

export { type BreadcrumbItem, breadcrumbItems };