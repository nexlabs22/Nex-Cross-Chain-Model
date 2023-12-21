import Image from "next/image";

import bg2 from "@assets/images/bg-2.png";
import { GoArrowRight } from "react-icons/go";

const AccountRebalancingSection = () => {
  return (
    <section className="flex h-fit w-screen flex-col items-center justify-center pb-0 mt-20">
      <div className=" relative h-fit w-full rounded-3xl xl:rounded-[30px] bg-gradient-to-r from-colorSeven-500 to-colorFour-500 px-6 py-6">
        <div className="absolute right-0 top-0 z-10 flex h-full w-full flex-row items-center justify-normal overflow-hidden">
          <div className="h-full w-1/2"></div>
          <div
            className="cefiCsDefiAnimated h-full w-1/2 bg-no-repeat mr-10"
            style={{
              backgroundImage: `url('${bg2.src}')`,
            }}
          ></div>
        </div>
        <div className="relative left-0 top-0 z-40 bg-transparent py-10 pl-4">
          <h5 className="interBold titleShadow mb-12 text-5xl text-whiteText-500">
            Cefi vs Defi
          </h5>
          <p className="interMedium mb-4 w-1/2 text-xl text-whiteText-500">
            Embark on a journey through CeFi and DeFi landscapes, understanding
            the centralized powerhouses and the decentralized disruptors. Start
            exploring the two faces of finance!
          </p>
          <button className="interBold flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-2xl bg-gradient-to-tr from-white to-[#E7E7E7] active:translate-y-[1px] active:shadow-black px-4 py-1 text-base text-blackText-500 shadow">
            <span>Learn More</span>
            <GoArrowRight color="#6F97AB" size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountRebalancingSection;
