import Link from "next/link";
import Image from "next/image";

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

import logo1 from "@assets/images/logo1.png";
import logo2 from "@assets/images/logo2.png";
import xlogo from '@assets/images/xlogo_s.png'

const Footer = () => {
  return (
    <section className="flex h-fit xl:h-[50vh] w-screen flex-col items-center justify-end">
      <div className="h-[1px] w-full bg-gray-300/50"></div>
      <div className="flex h-fit w-full flex-col xl:flex-row items-center justify-center xl:justify-start gap-3 pb-6 xl:pb-20 pt-6 xl:pt-16">
        <div className="h-full flex flex-col items-center justify-start xl:items-start w-full xl:w-1/3 px-10">
          <div className="flex w-fit flex-row items-center justify-between">
            <div className=" mr-2 h-fit w-fit">
              <Image src={xlogo} alt="nex labs logo" className="w-20 xl:w-14 brightness-[0.65] drop-shadow-sm"></Image>
            </div>
          </div>
          <h5 className="interBlack text-center xl:text-left mb-10 mt-5 w-4/5 text-2xl text-blackText-500">
            Index your trades, your investment, your future.
          </h5>
          <div className="flex w-6/12 flex-row items-center justify-between">
            <Link href={"https://www.linkedin.com/company/nex-labs/"}>
              <BsLinkedin size={25} color="#2A2A2A" />
            </Link>
            <Link href={"https://twitter.com/NEX_Protocol"}>
              <BsTwitter size={25} color="#2A2A2A" />
            </Link>
            <Link href={"https://nexlabs.medium.com/"}>
              <BsMedium size={25} color="#2A2A2A" />
            </Link>
            <Link href={"https://github.com/nexlabs22"}>
              <BsGithub size={25} color="#2A2A2A" />
            </Link>
          </div>
        </div>
        <div className="h-full flex flex-col items-center justify-start xl:items-start xl:w-1/3 px-2 xl:px-10 mt-8 xl:mt-0">
          <h5 className="interBlack mb-6 text-2xl text-blackText-500">
            Nex Labs
          </h5>
          <Link href={"/"}>
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Home
            </h5>
          </Link>
          <Link href={"https://dapp-spot-index.vercel.app/"}>
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Dapp
            </h5>
          </Link>
          <Link href={"https://github.com/nexlabs22/…ices-Model-Contracts"}>
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Public Repository
            </h5>
          </Link>
          <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Whitepaper
            </h5>
          </Link>
        </div>
        <div className="h-full flex flex-col items-center justify-start xl:items-start xl:w-1/3 px-2 xl:px-10 mt-8 xl:mt-0">
          <h5 className="interBlack text-2xl mb-6 text-blackText-500">
            Whitepaper Pieces
          </h5>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model"
            }
          >
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Spot - Indices
            </h5>
          </Link>
          <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Protocol structure
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker"
            }
          >
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Token & smart contract details
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap"
            }
          >
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              Roadmap
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/additional-information/faq"
            }
          >
            <h5 className="interBold text-xl mb-5 text-blackText-500">
              FAQ
            </h5>
          </Link>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300/50"></div>
      <div className="flex h-fit w-full flex-col xl:flex-row items-center justify-center px-20 py-3">
        <div className="flex flex-row items-center justify-between">
          <div className=" mr-2 h-fit w-fit">
          <Image src={xlogo} alt="nex labs logo" className="w-10 brightness-[0.65] drop-shadow-sm"></Image>
          </div>
        </div>
        <h5 className="interMedium mx-5 text-sm text-blackText-500">-</h5>
        <h5 className="interMedium my-0 text-center xl:text-left text-base text-blackText-500">
          © Copyright Nex Labs B.V. 2023 - All rights reserved
        </h5>
      </div>
    </section>
  );
};

export default Footer;
