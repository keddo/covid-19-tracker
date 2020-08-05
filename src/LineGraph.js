import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral';
const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRation: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales: {
        xAxis: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxis: [
            {
                gridLines: {display: false},
                ticks: {
                    callbacks: {
                        label: function(value, index, values){
                            return numeral(value).format("0a")
                        }
                    }
                }
            }
        ]
    }
}
function LineGraph() {
    const url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=120'
    const [data, setData] = useState({});
    

    const buildChartData = (data, casesType = 'cases') => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]) {
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: date[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
          lastDataPoint = data[casesType][date];
        }
      return chartData;

    }

    useEffect(() => {
        fetch(url)
        .then(res => res.json())
        .then(data => {
            const chartData = buildChartData(data);
            setData(chartData);
        })
    }, []);

    
    return (
        <div>
            <Line
            options = {options}
            data = {{
                datasets: [
                    { backgroundColor: "rgba(204, 16, 52, 0.7)", borderColor: "#CC1034", data: data}
                ]
            }}
            />
        </div>
    )
}

export default LineGraph
