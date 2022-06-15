import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const BarLineChart = ({
  data = { title: '', xAxis: [], yAxis: [], max: 100, min: 0 },
}) => {
  console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    dataset: [
      {
        source: [
          [1, 4862.4],
          [2, 5294.7],
          [3, 5934.5],
          [4, 7171.0],
          [5, 8964.4],
          [6, 10202.2],
          [7, 11962.5],
          [8, 14928.3],
          [9, 16909.2],
          [10, 18547.9],
          [11, 21617.8],
          [12, 26638.1],
          [13, 34634.4],
          [14, 46759.4],
          [15, 58478.1],
          [16, 67884.6],
          [17, 74462.6],
          [18, 79395.7]
        ]
      },
      // {
      //   transform: {
      //     // type: 'ecStat:regression',
      //     config: {
      //       method: 'exponential'
      //       // 'end' by default
      //       // formulaOn: 'start'
      //     }
      //   }
      // }
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      containLabel: true,
    },
    legend: {
      data: ["成交量"],
    },
    // backgroundColor: "black",
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        // data: data.xAxis,
        axisLabel: {
          interval: 100,
          align: 'center',
          formatter: (value, index) => {
            return Number(value).toFixed(1);
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          interval: 100,
          inside: true,
        }
      },
    ],
    yAxis: [
      {
        type: "value",
        // name: (data.title) ? data.title : 'title',
        // nameLocation: "middle",
        // nameGap: 10,
        
        // scale: true,
        // name: "成交價",
        // max: Math.max(data.max, Math.max(...data.yAxis)) + 10,
        // min: Math.min(data.min, Math.min(...data.yAxis)) - 10,
      },
    ],
    // dataZoom: [
    //   {
    //     show: true,
    //     realtime: true,
    //     startValue: dataZoom ? data.xAxis.length - dataZoom : 0,
    //     endValue: data.xAxis.length - 1,
    //     onChange: (val) => {
    //       console.log(val);
    //     },
    //   },
    // ],
    series: [
      {
        name: 'scatter',
        type: 'scatter',
        datasetIndex: 0
      },
      {
        name: 'line',
        type: 'line',
        smooth: true,
        datasetIndex: 1,
        symbolSize: 0.1,
        symbol: 'circle',
        label: { show: true, fontSize: 16 },
        labelLayout: { dx: -20 },
        encode: { label: 2, tooltip: 1 }
      },

      // {
      //   name: "成交價",
      //   type: "line",
      //   data: data.yAxis,
      //   endLabel: {
      //     show: true,
      //     borderColor: 'red',
      //     borderWidth: '3px',
      //     width: '3px',
      //     height: '3px',
      //     backgroundColor: 'red',
      //   },
      //   markPoint: {
      //     animation: false,
      //     symbol: 'circle',
      //     data: [
      //       { 
      //         xAxis: (data.yAxis.length > 0) ? data.yAxis.length-1 : 0,
      //         yAxis: (data.yAxis.length > 0) ? data.yAxis[data.yAxis.length-1] : 0,
      //         symbolSize: 6,
      //         itemStyle: {
      //           opacity: 1,
      //           color: '#ff4d4f',
      //         },
      //       }
      //     ]
      //   },
      //   // itemStyle: {
      //   //   color: "black",
      //   // },
      // },
    ],
  };

  return (
    <>
      <ReactECharts className="border" option={options} />
    </>
  );
};

export default BarLineChart;
