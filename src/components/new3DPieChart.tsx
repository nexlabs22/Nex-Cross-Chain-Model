import usePortfolioPageStore from '@/store/portfolioStore';
import { Chart } from 'react-google-charts'
import { usePWA } from '@/providers/PWAProvider';
import { useEffect } from 'react';
import { FormatToViewNumber } from '@/hooks/math';
import { useMediaQuery } from '@mui/material';


interface PieChart3DProps {
  data: (string | number)[][]
}

const New3DPieChart: React.FC<PieChart3DProps> = ({ data }) => {

  const { isStandalone } = usePWA()
  const { setIndexSelectedInPie } = usePortfolioPageStore();
  const isLandscape = useMediaQuery('(orientation: landscape)'); 

  const handleSliceClick = (slice: any) => {
    const index = slice.value && slice.value[slice.row + 1] ? slice.value[slice.row + 1][0] : 'ANFI'
    setIndexSelectedInPie(index)
  };


  const options = {
    title: '',
    legend: { position: 'none' },
    is3D: true,
    backgroundColor: 'transparent',
    colors: ['#91AC9A', '#B7D1D3', '#5E869B', '#A6C3CE', '#86afbf'],
  }
  return (
    <div className='w-full h-fit flex flex-col relative'>
      <div className={`w-full h-fit min-h-[400px] p-0 flex xl:-mb-16 flex-row items-center justify-center ${isLandscape ? "mt-[60vh]" : "mt-auto xl:-mt-16"}`} id="3DPieChartBox">
        <Chart
          chartType="PieChart"
          className="flex flex-row items-center justify-center p-0 h-fit"
          data={data}
          options={options}
          width={"100%"}
          height={"800px"}
          chartEvents={[
            {
              eventName: 'select',
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                const selectedItem = selection && selection[0];
                if (selectedItem) {
                  const { row, column } = selectedItem;
                  handleSliceClick({
                    row,
                    value: data,
                  });
                }
              },
            },
          ]}
        // chartEvents={chartEvents}
        />

        {/* <Chart chartType="ScatterChart" data={data} options={options} graphID="ScatterChart" width="100%" height="400px" chartEvents={()=>{cb}} /> */}
      </div>
      {
        isStandalone ? (
          <>
            <div className={`w-full h-10 absolute ${isLandscape ? "bottom-[8%]" : "bottom-[27%]"} z-50 flex flex-row items-center justify-center gap-4`}>
              <div className='w-fit h-fit flex flex-row items-center justify-start gap-1'>
                <div className='w-4 aspect-square border border-slate-900 bg-[#91AC9A] '></div>
                <span className=' text-black'>
                  {
                    data[1][0]
                  }
                </span>
                <span className=' text-black'>
                  (
                  {
                    Number(data[1][1]).toFixed(2)
                  }%
                  )
                </span>


              </div>
              <div className='w-fit h-fit flex flex-row items-center justify-start gap-1'>
                <div className='w-4 aspect-square border border-slate-900 bg-[#B7D1D3] '></div>
                <span className=' text-black'>
                  {
                    data[2][0]
                  }
                </span>
                <span className=' text-black'>
                  (
                  {
                    Number(data[2][1]).toFixed(2)
                  }%
                  )
                </span>


              </div>
            </div>
          </>
        ) :
          (
            <></>
          )
      }
    </div>
  )
}

export default New3DPieChart
