import Link from "next/link";
import Image from "next/image";

import { useLandingPageStore } from "@/store/store";

import { FiArrowDownRight } from "react-icons/fi";
import {
  BsTwitter,
  BsLinkedin,
  BsInstagram,
  BsDiscord,
  BsGithub,
  BsMedium,
} from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import tradingViewDark from '@assets/images/tradingview-dark.png'
import tradingViewLight from '@assets/images/tradingview-light.png'

import logo1 from "@assets/images/logo1.png";
import logo2 from "@assets/images/logo2.png";

import xlogo from "@assets/images/xlogo_s.png";
import useTradePageStore from "@/store/tradeStore";

interface FooterProps {
	tradeFooter?: boolean
}

const Footer: React.FC<FooterProps> = ({ tradeFooter }) => {
    const { mode, changeMode } = useLandingPageStore();
  const { openMobileMenu, setOpenMobileMenu, selectedTradingCategory } = useTradePageStore()

  return(
    <section className={`flex h-fit w-screen flex-col items-center justify-end rounded-tl-[30px] rounded-tr-[30px] ${ mode == "dark" ? 'bg-[#070707]' : tradeFooter && selectedTradingCategory == "cefi" ? "shadow shadow-[#71D5E1] bg-gradient-to-bl from-[#71D5E1] to-[#4992E2]" : 'bg-gradient-to-br from-colorSeven-500 to-colorFour-500'} xl:h-fit`} style={{
      boxShadow: mode == "dark" ? tradeFooter && selectedTradingCategory == "cefi" ? "0px -2px 6px 1px rgb(73, 146, 226)" : "0px -2px 6px 1px #5E869B" : ""
    }}>
        <div className="flex h-fit w-full flex-col items-start justify-center gap-3 pb-6 pt-6 xl:flex-row xl:justify-start xl:pb-10 xl:pt-10">
          <div className="flex h-full w-full flex-col items-start justify-start px-10 xl:w-1/3 xl:items-start">
            <div className="flex w-fit flex-row items-center justify-between">
              <div className=" mr-2 h-fit w-fit">
                <Link href={"https://www.nexlabs.io/"}>
                <Image
                  src={xlogo}
                  alt="nex labs logo"
                  className={`w-14 brightness-0 ${mode == "dark" ? "invert" : ""}`}
                ></Image>
                </Link>
                
              </div>
            </div>
            <h5 className={`interBlack mb-10 mt-5 w-4/5 text-2xl ${mode != "dark" ? " text-blackText-500" : " text-whiteBackground-500"}`}>
              Index your trades, your investment, your future.
            </h5>
            <div className="flex w-6/12 flex-row items-center justify-between">
              <Link href={"https://www.linkedin.com/company/nex-labs/"}>
                {
                  mode == "dark" ? <BsLinkedin size={25} color="#F2F2F2" /> : <BsLinkedin size={25} color="#252525" />
                }
                
              </Link>
              <Link href={"https://twitter.com/NEX_Protocol"}>
                {
                  mode == "dark" ? <BsTwitter size={25} color="#F2F2F2" /> : <BsTwitter size={25} color="#252525" />
                }
                
              </Link>
              <Link href={"https://nexlabs.medium.com/"}>
                {
                  mode == "dark" ? <BsMedium size={25} color="#F2F2F2" /> : <BsMedium size={25} color="#252525" />
                }
                
              </Link>
              <Link href={"https://github.com/nexlabs22"}>
                {
                  mode == "dark" ? <BsGithub size={25} color="#F2F2F2" /> : <BsGithub size={25} color="#252525" />
                }
                
              </Link>
            </div>
          </div>
          <div className="mt-8 flex h-full flex-col items-center justify-start px-2 xl:mt-0 xl:w-1/3 xl:items-start xl:px-10">
            <h5 className={`interBlack mb-6 text-2xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
              Nex Labs
            </h5>
            <Link href={"https://www.nexlabs.io/"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>Home</h5>
            </Link>
            <Link href={"https://app.nexlabs.io/"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>Dapp</h5>
            </Link>
            <Link href={"https://github.com/nexlabs22/…ices-Model-Contracts"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Public Repository
              </h5>
            </Link>
            <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Whitepaper
              </h5>
            </Link>
            <Link href={"/licence"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Licence
              </h5>
            </Link>
          </div>
          <div className="mt-8 flex h-full flex-col items-center justify-start px-2 xl:mt-0 xl:w-1/3 xl:items-start xl:px-10">
            <h5 className={`interBlack mb-6 text-2xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
              Whitepaper Pieces
            </h5>
            <Link
              href={
                "https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model"
              }
            >
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Spot - Indices
              </h5>
            </Link>
            <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Protocol structure
              </h5>
            </Link>
            <Link
              href={
                "https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker"
              }
            >
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Token & smart contract details
              </h5>
            </Link>
            <Link
              href={
                "https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap"
              }
            >
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
                Roadmap
              </h5>
            </Link>
            <Link
              href={
                "https://nex-labs.gitbook.io/nex-dex/additional-information/faq"
              }
            >
              <h5 className={`interBold mb-5 text-xl ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>FAQ</h5>
            </Link>
          </div>
        </div>
        <div className="flex h-fit w-full flex-col items-center justify-center px-20 py-3 xl:flex-row">
          <h5 className={`interMedium my-0 text-center text-base ${mode == "dark" ? "text-whiteText-500" : " text-blackText-500"}`}>
            © Copyright Nex Labs B.V. 2024 - All rights reserved
          </h5>
        </div>
      </section>
  )
}

export default Footer