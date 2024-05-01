import usePortfolioPageStore from '@/store/portfolioStore';
import { Chart } from 'react-google-charts'


interface PieChart3DProps {
	data: (string | number)[][]
}

const PWA3DPieChart: React.FC<PieChart3DProps> = ({ data }) => {

    const {setIndexSelectedInPie} = usePortfolioPageStore();

    const handleSliceClick = (slice: any) => {
        const index = slice.value[slice.row+1][0]
        setIndexSelectedInPie(index)
      };



	const options = {
		title: '',
		legend: { position: 'none' },
		is3D: true,
		backgroundColor: 'transparent',
		colors: ['#91AC9A', '#B7D1D3', '#878787', '#A6C3CE', '#86afbf'],
	}
	return (
		<div className="w-full h-fit p-0 m-0 flex flex-row items-center justify-center " id='PWA3DPieChartBox'>
			<Chart
                chartType="PieChart"
                className="flex flex-row items-center justify-center p-0 w-full m-0 h-fit relative z-[99]"
                data={data}
                options={options}
                width={"100%"}
                height={"500px"}
            />
			{/* <Chart chartType="ScatterChart" data={data} options={options} graphID="ScatterChart" width="100%" height="400px" chartEvents={()=>{cb}} /> */}
		</div>
	)
}

export default PWA3DPieChart
