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

import xlogo from "@assets/images/xlogo_s.png";

const Footer = () => {
  return (
    <section className="flex h-fit w-screen flex-col items-center justify-end rounded-tl-[30px] rounded-tr-[30px] bg-gradient-to-br from-colorSeven-500 to-colorFour-500 xl:h-fit">
      <div className="flex h-fit w-full flex-col items-center justify-center gap-3 pb-6 pt-6 xl:flex-row xl:justify-start xl:pb-10 xl:pt-10">
        <div className="flex h-full w-full flex-col items-start justify-start px-10 xl:w-1/3 xl:items-start">
          <div className="flex w-fit flex-row items-center justify-between">
            <div className=" mr-2 h-fit w-fit">
              <Image
                src={xlogo}
                alt="nex labs logo"
                className="w-14 brightness-0 invert"
              ></Image>
            </div>
          </div>
          <h5 className="interBlack mb-10 mt-5 w-4/5 text-xl text-whiteText-500">
            Index your trades, your investment, your future.
          </h5>
          <div className="flex w-6/12 flex-row items-center justify-between">
            <Link href={"https://www.linkedin.com/company/nex-labs/"}>
              <BsLinkedin size={25} color="#F2F2F2" />
            </Link>
            <Link href={"https://twitter.com/NEX_Protocol"}>
              <BsTwitter size={25} color="#F2F2F2" />
            </Link>
            <Link href={"https://nexlabs.medium.com/"}>
              <BsMedium size={25} color="#F2F2F2" />
            </Link>
            <Link href={"https://github.com/nexlabs22"}>
              <BsGithub size={25} color="#F2F2F2" />
            </Link>
          </div>
        </div>
        <div className="mt-8 flex h-full flex-col items-center justify-start px-2 xl:mt-0 xl:w-1/3 xl:items-start xl:px-10">
          <h5 className="interBlack mb-6 text-2xl text-whiteText-500">
            Nex Labs
          </h5>
          <Link href={"/"}>
            <h5 className="interBold mb-5 text-lg text-whiteText-500">Home</h5>
          </Link>
          <Link href={"https://app.nexlabs.io/"}>
            <h5 className="interBold mb-5 text-lg text-whiteText-500">Dapp</h5>
          </Link>
          <Link href={"https://github.com/nexlabs22/…ices-Model-Contracts"}>
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Public Repository
            </h5>
          </Link>
          <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Whitepaper
            </h5>
          </Link>
          <h5 className="interBold mb-5 text-lg text-whiteText-500 opacity-0">
            Whitepaper
          </h5>
        </div>
        <div className="mt-8 flex h-full flex-col items-center justify-start px-2 xl:mt-0 xl:w-1/3 xl:items-start xl:px-10">
          <h5 className="interBlack mb-6 text-xl text-whiteText-500">
            Whitepaper Pieces
          </h5>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model"
            }
          >
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Spot - Indices
            </h5>
          </Link>
          <Link href={"https://nex-labs.gitbook.io/nex-dex/"}>
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Protocol structure
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker"
            }
          >
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Token & smart contract details
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap"
            }
          >
            <h5 className="interBold mb-5 text-lg text-whiteText-500">
              Roadmap
            </h5>
          </Link>
          <Link
            href={
              "https://nex-labs.gitbook.io/nex-dex/additional-information/faq"
            }
          >
            <h5 className="interBold mb-5 text-lg text-whiteText-500">FAQ</h5>
          </Link>
        </div>
      </div>
      <div className="flex h-fit w-full flex-col items-center justify-center px-20 py-3 xl:flex-row">
        <h5 className="interMedium my-0 text-center text-sm text-whiteText-500 xl:text-left">
          © Copyright Nex Labs B.V. 2023 - All rights reserved
        </h5>
      </div>
    </section>
  );
};

export default Footer;
