import { Chart } from "react-google-charts";

const New3DPieChart = () => {

    const data = [
        ["Asset", "Percentage"],
        ["ANFI", 11],
        ["CRYPTO5", 2],
        ["ETH", 2],
        ["BTC", 2],
        ["MATIC", 7],
    ];

    const options = {
        title: "",
        legend : { position:"none"},
        is3D: true,
        backgroundColor: "transparent",
        colors: ["#91AC9A", "#B7D1D3", "#5E869B", "#A6C3CE", "#86afbf"],
    };
    return (
        <div className="w-full h-fit min-h-[400px] p-0 flx flex-row items-center justify-center" id="3DPieChartBox">
            <Chart
                chartType="PieChart"
                className="flex flex-row items-center justify-center p-0 h-fit"
                data={data}
                options={options}
                width={"100%"}
                height={"800px"}
            />
        </div>
    )
}

export default New3DPieChart;