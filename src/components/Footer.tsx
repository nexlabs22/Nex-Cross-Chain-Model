import Link from "next/link";

import { FiArrowDownRight } from "react-icons/fi";
import { BsTwitter, BsLinkedin, BsInstagram, BsDiscord, BsGithub } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <section className="flex h-[50vh] w-screen flex-col items-center justify-end">
      <div className="h-[1px] w-full bg-gray-300/50"></div>
      <div className="flex h-fit w-full flex-row items-center justify-start gap-3 pt-16 pb-20">
        <div className="h-full w-1/4 px-10">
          <div className="flex w-fit flex-row items-center justify-between">
            <div className=" mr-2 h-10 w-10 rounded-full bg-colorOne-500"></div>
            <h5 className="ARPDisplay-150 text-lg text-blackText-500">
              Nex Labs
            </h5>
          </div>
          <h5 className="ARPDisplay-80 mb-8 mt-3 w-4/5 text-sm text-blackText-500">
            The first DeFi Broker providing decentralized indices of any price
            feeds you can imagine.
          </h5>
          <div className="flex w-9/12 flex-row items-center justify-between">
            <BsTwitter size={20} color="#2A2A2A" />
            <BsLinkedin size={20} color="#2A2A2A" />
            <BsInstagram size={20} color="#2A2A2A" />
            <BsDiscord size={20} color="#2A2A2A" />
            <BsGithub size={20} color="#2A2A2A" />
            <FaTelegramPlane size={20} color="#2A2A2A" />
          </div>
        </div>
        <div className="h-full w-1/4 px-10">
          <h5 className="ARPDisplay-150 mb-6 text-base text-blackText-500">
            Nex Labs
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Home
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Dashboard
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            About
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Learn
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Contact
          </h5>
        </div>
        <div className="h-full w-1/4 px-10">
          <h5 className="ARPDisplay-150 mb-6 text-base text-blackText-500">
            Ressources
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Spot - Indices
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Protocol structure
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Token & smart contract details
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Roadmap
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Faq
          </h5>
        </div>
        <div className="h-full w-1/4 px-10">
        <h5 className="ARPDisplay-150 mb-6 text-base text-blackText-500">
            Company
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            About
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Team
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Partners
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Carrers
          </h5>
          <h5 className="ARPDisplay-80 mb-5 text-sm text-blackText-500">
            Blog
          </h5>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300/50"></div>
      <div className="flex h-fit w-full flex-row items-center justify-center px-20 py-3">
        <div className="flex flex-row items-center justify-between">
          <div className=" mr-2 h-5 w-5 rounded-full bg-colorOne-500"></div>
          <h5 className="ARPDisplay-80 text-[8px] text-blackText-500">
            Nex Labs
          </h5>
        </div>
        <h5 className="ARPDisplay-80 text-[8px] text-blackText-500 mx-5">
            -
          </h5>
        <h5 className="ARPDisplay-40 text-[8px] text-blackText-500">
          © Copyright Nex Labs 2023 - All rights reserved
        </h5>
      </div>
    </section>
  );
};

export default Footer;
