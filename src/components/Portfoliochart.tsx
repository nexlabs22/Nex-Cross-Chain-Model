import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useEffect, useLayoutEffect } from 'react';



am4core.useTheme(am4themes_animated);

const PortfolioChart= () => {
    useEffect(() => {
        let chart = am4core.create('chartdiv', am4charts.PieChart3D)
		chart.hiddenState.properties.opacity = 0 // this creates initial fade-in

		chart.legend = new am4charts.Legend()
        chart.data = [
			{
				label: 'ANFI',
				amount: '37%',
				litres: 133,
				color: am4core.color('#86afbfe6'),
			},
			{
				label: 'CRYPTO 5',
				amount: '63%',
				litres: 227,
				color: am4core.color('#5E869B'),
			},
		]

		let series = chart.series.push(new am4charts.PieSeries3D())
		series.dataFields.value = 'litres'
		series.dataFields.category = 'label'

		series.labels.template.properties.fontFamily = 'interBold'
		series.labels.template.properties.fontSize = 20
		//series.labels.template.fill = "#fff"
        series.labels.template.text = '{category}\n[#5E869B]{amount}'

		series.hiddenInLegend = true
		series.slices.template.propertyFields.fill = 'color'

		series.ticks.template.strokeWidth = 2
		//series.ticks.template.stroke = "#000"
		series.ticks.template.strokeOpacity = 0.7
		//series.ticks.template.margin = am4core.Sprite;
        let fillModifier = new am4core.LinearGradientModifier()
		fillModifier.opacities = [1, 0.9]
		fillModifier.offsets = [0.5, 0.8]
		//fillModifier.gradient.rotation = 90;

		series.slices.template.fillModifier = fillModifier
    
      return () => {
        chart.dispose();
      };
    }, [])
    return(
        <div id="chartdiv" style={{ width: '100%', height: '500px', marginBottom: '10%' }}></div>
    )
}

export default PortfolioChart;