import { PiHouseBold } from "react-icons/pi";
import { GoStack, GoSearch } from "react-icons/go";
import { RiExchange2Line } from "react-icons/ri";
import { LuSquarePercent } from "react-icons/lu";
import { HiOutlineCog } from "react-icons/hi";
import { MdHelpOutline, MdOutlineIndeterminateCheckBox } from "react-icons/md";
import { IconType } from "react-icons/lib";

interface NavItem {
    icon: IconType;
    label: string;
    link: string;
    available: boolean
}

const navItems: NavItem[] = [
    { icon: PiHouseBold, label: "Dashboard", link: "/", available: true },
    { icon: GoStack, label: "Catalogue", link: "/catalogue", available: true },
    { icon: RiExchange2Line, label: "Swap", link: "/swap", available: false },
    { icon: LuSquarePercent, label: "Stake", link: "/stake", available: false },
    { icon: MdOutlineIndeterminateCheckBox, label: "Portfolio", link: "/portfolio", available: true },
    { icon: GoSearch, label: "Search", link: "/search", available: false },
];

const settingItems: NavItem[] = [
    { icon: MdHelpOutline, label: "Help", link: "/help-center", available: false },
    { icon: HiOutlineCog, label: "Settings", link: "/settings", available: true },
];

export { navItems, settingItems, type NavItem };
