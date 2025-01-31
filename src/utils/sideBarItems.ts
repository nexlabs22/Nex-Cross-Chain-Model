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
}

const navItems: NavItem[] = [
    { icon: PiHouseBold, label: "Dashboard", link: "/" },
    { icon: GoStack, label: "Catalogue", link: "/catalogue" },
    { icon: RiExchange2Line, label: "Convert", link: "/" },
    { icon: LuSquarePercent, label: "Stake", link: "/stake" },
    { icon: MdOutlineIndeterminateCheckBox, label: "Portfolio", link: "/portfolio" },
    { icon: GoSearch, label: "Search", link: "/" },
];

const settingItems: NavItem[] = [
    { icon: MdHelpOutline, label: "Help", link: "/help-center" },
    { icon: HiOutlineCog, label: "Settings", link: "/settings" },
];

export { navItems, settingItems, type NavItem };
