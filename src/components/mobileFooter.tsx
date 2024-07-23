import Image from 'next/image'
import Link from 'next/link'

import xLogo from '@assets/images/xlogo_s.png'
import arrow2 from '@assets/images/arrow2.svg'

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css'
import { useLandingPageStore } from '@/store/store'

interface FooterProps {
  tradeFooter?: boolean
}

const MobileFooterSection = () => {
  const { mode } = useLandingPageStore()
  return (
    <section className="px-2 pb-4">
      <div className={`h-fit w-full rounded-[30px] ${mode == "dark" ? "bg-[#101010]" : "bg-colorSeven-500"
        } px-6 py-8 md:p-10`} style={{
          boxShadow:
            mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
        }}>
        <Link href={"https://www.nexlabs.io/"}>
          <Image
            src={xLogo}
            alt="nex logo"
            className="w-12 brightness-0 drop-shadow-sm invert md:mb-14 md:ml-6 md:mt-6 md:scale-[2]"
          />
        </Link>
        <h5 className="interBold my-4 text-2xl text-white md:mb-12 md:w-1/2 md:text-3xl">
          Index your trades, your investment, your future
        </h5>
        <Accordion allowZeroExpanded>
          <AccordionItem className="w-full border-none bg-transparent px-0 shadow-none">
            <AccordionItemHeading className="w-full border-none bg-transparent px-0 shadow-none">
              <AccordionItemButton className="w-full border-none bg-transparent px-0 shadow-none">
                <div className="my-6 flex h-fit w-full flex-row items-end justify-between border-b-[1.5px] border-b-white pb-5">
                  <h5 className="interBold text-2xl text-white md:text-3xl">
                    Nex Labs
                  </h5>
                  <svg
                    width="35"
                    height="21"
                    viewBox="0 0 25 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-rotate-45 md:scale-[1.1] "
                  >
                    <path
                      d="M16.5563 0.556335C16.5563 1.29834 17.2893 2.40634 18.0313 3.33634C18.9853 4.53634 20.1253 5.58334 21.4323 6.38234C22.4123 6.98134 23.6003 7.55634 24.5563 7.55634M24.5563 7.55634C23.6003 7.55634 22.4113 8.13134 21.4323 8.73034C20.1253 9.53034 18.9853 10.5773 18.0313 11.7753C17.2893 12.7063 16.5563 13.8163 16.5563 14.5563M24.5563 7.55634L0.556335 7.55634"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="w-full px-2 py-2">
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link href={"https://www.nexlabs.io/"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Home
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link href={"/"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Dapp
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  target="_blank"
                  href={"https://github.com/nexlabs22/…ices-Model-Contracts"}
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Public reposiroty
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link target="_blank" href={"https://nex-labs.gitbook.io/nex-dex/"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Whitepaper
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link href={"/license"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    License
                  </h5>
                </Link>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="w-full border-none bg-transparent px-0 shadow-none">
            <AccordionItemHeading className="w-full border-none bg-transparent px-0 shadow-none">
              <AccordionItemButton className="w-full border-none bg-transparent px-0 shadow-none">
                <div className="my-6 flex h-fit w-full flex-row items-end justify-between border-b-[1.5px] border-b-white pb-5">
                  <h5 className="interBold text-2xl text-white md:text-3xl">
                    Whitepaper Pieces
                  </h5>
                  <svg
                    width="35"
                    height="21"
                    viewBox="0 0 25 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-rotate-45 md:scale-[1.1] "
                  >
                    <path
                      d="M16.5563 0.556335C16.5563 1.29834 17.2893 2.40634 18.0313 3.33634C18.9853 4.53634 20.1253 5.58334 21.4323 6.38234C22.4123 6.98134 23.6003 7.55634 24.5563 7.55634M24.5563 7.55634C23.6003 7.55634 22.4113 8.13134 21.4323 8.73034C20.1253 9.53034 18.9853 10.5773 18.0313 11.7753C17.2893 12.7063 16.5563 13.8163 16.5563 14.5563M24.5563 7.55634L0.556335 7.55634"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="w-full px-2 py-2">
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Spot - Indices
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link target="_blank" href={"https://nex-labs.gitbook.io/nex-dex/"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Protocol structure
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Token & smart contract details
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Roadmap
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "https://nex-labs.gitbook.io/nex-dex/additional-information/faq"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    FAQ
                  </h5>
                </Link>

              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className="w-full border-none bg-transparent px-0 shadow-none">
            <AccordionItemHeading className="w-full border-none bg-transparent px-0 shadow-none">
              <AccordionItemButton className="w-full border-none bg-transparent px-0 shadow-none">
                <div className="my-6 flex h-fit w-full flex-row items-end justify-between border-b-[1.5px] border-b-white pb-5">
                  <h5 className="interBold text-2xl text-white md:text-3xl">
                    Terms & Conditions
                  </h5>
                  <svg
                    width="35"
                    height="21"
                    viewBox="0 0 25 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-rotate-45 md:scale-[1.1] "
                  >
                    <path
                      d="M16.5563 0.556335C16.5563 1.29834 17.2893 2.40634 18.0313 3.33634C18.9853 4.53634 20.1253 5.58334 21.4323 6.38234C22.4123 6.98134 23.6003 7.55634 24.5563 7.55634M24.5563 7.55634C23.6003 7.55634 22.4113 8.13134 21.4323 8.73034C20.1253 9.53034 18.9853 10.5773 18.0313 11.7753C17.2893 12.7063 16.5563 13.8163 16.5563 14.5563M24.5563 7.55634L0.556335 7.55634"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="w-full px-2 py-2">
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "/terms_and_conditions"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Terms & Conditions
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link target="_blank" href={"/privacy_policy"}>
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    Privacy Policy
                  </h5>
                </Link>
              </div>
              <div className="mb-4 flex h-fit w-full flex-row items-center justify-start gap-2 md:mb-6">
                <div className=" h-2 w-2 rounded-full bg-white md:h-3 md:w-3"></div>
                <Link
                  href={
                    "/us_disclaimer"
                  }
                  target="_blank"
                >
                  <h5 className="interBold text-xl text-white md:text-3xl">
                    US Disclaimer
                  </h5>
                </Link>
              </div>
              
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>

        <h5 className="interMedium mb-4 mt-20 text-lg text-white text-center md:text-2xl">
          © Copyright Nex Labs B.V. 2024. All rights reserved
        </h5>
      </div>
    </section>
  )
}

export default MobileFooterSection
