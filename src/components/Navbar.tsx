import Link from "next/link";

import { BiMenuAltRight } from "react-icons/bi";
import { CiMenuFries } from "react-icons/ci";

const Navbar = () => {
  return (
    <section className="flex h-fit w-screen flex-row items-center justify-between px-6 py-6">
      <Link href={"/"}>
        <div className="flex flex-row items-center justify-between">
          <div className=" mr-2 h-12 w-12 rounded-full bg-colorOne-500"></div>
          <h5 className="montreal text-xl text-blackText-500">
            Nex Labs
          </h5>
        </div>
      </Link>
      <div className="h-fit w-fit md:hidden">
        <CiMenuFries color="#2A2A2A" size="30" />
      </div>
      <div className="hidden flex-row items-center justify-start md:visible md:flex">
        <div className="flex flex-row items-center justify-between">
          <Link href={"/"}>
            <h5 className="montreal text-xl mr-8 text-blackText-500">
              Dashboard
            </h5>
          </Link>
          <h5 className="montreal mr-8 text-xl text-blackText-500">
            Swap
          </h5>
          <h5 className="montreal mr-8 text-xl text-blackText-500">
            Convert
          </h5>
          <h5 className="montreal mr-8 text-xl text-blackText-500">
            Portfolio
          </h5>
        </div>
        
      </div>
    </section>
  );
};

export default Navbar;
