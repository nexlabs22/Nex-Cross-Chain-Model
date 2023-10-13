import { useEffect, useState } from "react";
import Image from "next/image";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronCompactRight, BsCheckCircleFill, BsChevronCompactLeft } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import dynamic from 'next/dynamic'
import { useChartDataStore, useLandingPageStore } from '@/store/store'
import { comparisonIndices } from '@/constants/comparisionIndices'
const Chart = dynamic(() => import('@components/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })
// const Chart = dynamic(() => import('@components/dashboard/chart'), { loading: () => <p>Loading ...</p>, ssr: false })

const DashboardChartBox = () => {

	const { defaultIndex } = useLandingPageStore()
	const [selectedIndices, setSelectedIndices] = useState<string[]>([])

	const {chartData,IndexData ,fetchIndexData, removeIndex} =  useChartDataStore()
	useEffect(()=>{
		fetchIndexData({tableName:'histcomp', index:defaultIndex})	
	},[defaultIndex,fetchIndexData])

  const PrevArrow = ({ onClick }: { onClick: () => void }) => (
    <div
      className="absolute top-[30%] left-0 z-50 flex aspect-square h-fit w-fit flex-row items-center justify-center rounded-full bg-slate-100 p-5 opacity-0 shadow shadow-gray-400 hover:opacity-100"
      onClick={onClick}
    >
      <BsChevronCompactLeft size={20} color="#2A2A2A" />
    </div>
  );

  const NextArrow = ({ onClick }: { onClick: () => void }) => (
    <div
      className="absolute top-[30%] right-3 z-50 flex aspect-square h-fit w-fit flex-row items-center justify-center rounded-full bg-slate-100 p-5 opacity-0 shadow shadow-gray-400 hover:opacity-100"
      onClick={onClick}
    >
      <BsChevronCompactRight size={20} color="#2A2A2A" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    centerMode: false,
    arrows: true,
    prevArrow: (
      <PrevArrow
        onClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    ), // Use custom Left Arrow component
    nextArrow: (
      <NextArrow
        onClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    ), // Use custom Right Arrow component
  };

  return (
    <div className="h-full w-full p-3">
      <div className="h-fit w-full p-2 overflow-hidden" id="comparisonBox">
        <Slider {...settings}>
          {comparisonIndices.map((item, index) => {
            return (
              <div key={index} className="indexContainer">
                <div
                  className="mx-2 flex h-[90%] w-full cursor-pointer flex-row items-center justify-between rounded-3xl px-3 py-[10px] hover:bg-gray-200/50"
                  style={{
                    backgroundColor: selectedIndices.includes(item.columnName) ? '#A9C3B6BB' : '#F2F2F2'
                  }}
                  id="comparisonItem"
                  onClick={() => {
					if (!selectedIndices.includes(item.columnName)) {
						fetchIndexData({tableName: 'histcomp', index: item.columnName})
						setSelectedIndices((prevState) => [...prevState, item.columnName])
					} else {
						removeIndex(item.columnName)
						setSelectedIndices((prevState) =>
							prevState.filter((i) => {
								return i != item.columnName
							})
						)
					}
				}}
                >
                  <div className="flex w-9/12 flex-row items-center py-4 justify-start">
                    <Image
                      src={item.logo}
                      width={50}
                      height={50}
                      alt="zef"
                      className="mr-6 ml-3 rounded-full"
                    ></Image>
                    <div className="indexDataContainer flex h-fit w-3/5 flex-col items-start justify-center">
                      <h5 className="montrealBold mb-3 text-xl text-blackText-500">
                        {item.name}
                      </h5>
                      <div className="flex w-full flex-row items-center justify-start">
                        <h5 className="pangramCompact mr-5 text-base text-blackText-500">
                          {item.price} USD
                        </h5>
                        <h5 className="pangramCompact text-base text-nexLightRed-500">
                          {item.change}%
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-3/12 flex-row items-center justify-end pr-5">
                    {
                        selectedIndices.includes(item.columnName) ? (<BsCheckCircleFill color="#91AC9A" size={25} />) : (<IoIosCheckmarkCircleOutline color="#CCCCCC" size={25} />)
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
		<Chart data={IndexData} />
    </div>
  );
};

export default DashboardChartBox;
