import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const BarLineChart = ({
  data = { title: '', xAxis: [], blueData: [], greenData: [], redData: [], max: 100, min: 0 },
}) => {
  // console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    title: {
      left: 'center',
      text: '散佈圖+風險線',
      textStyle: {
        color: '#fff',
      },
    },
    dataset: [
      // {
      //   source: data.blueData,
      // },
      // {
      //   source: data.greenData,
      // },
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
    // legend: {
    //   data: ["成交量"],
    // },
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        data: data.xAxis,
        textStyle: {
          color: '#fff',
        },
        splitLine: {
          show: false
        },
          // axisLabel: {
        //   interval: 100,
        //   align: 'center',
        //   formatter: (value, index) => {
        //     return Number(value).toFixed(1);
        //   },
        // },
        // axisTick: {
        //   show: true,
        //   alignWithLabel: true,
        //   interval: 100,
        //   inside: true,
        // }
      },
    ],
    yAxis: [
      {
        type: "value",
        textStyle: {
          color: '#fff',
        },
        splitLine: {
          show: false
        },
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
        name: 'daily_ret 2',
        type: 'scatter',
        data: data.blueData,
        datasetIndex: 0,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: "steelblue",
        },
      },
      {
        name: 'daily_ret 1',
        type: 'scatter',
        data: data.greenData,
        datasetIndex: 0,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: "seagreen",
        },
      },
      {
        name: '99% VaR',
        type: 'line',
        data: data.redData,
        datasetIndex: 1,
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: "red",
        },
        // symbolSize: 0.1,
        // symbol: 'circle',
        // label: { show: true, fontSize: 16 },
        // labelLayout: { dx: -20 },
        // encode: { label: 2, tooltip: 1 }
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
      <ReactECharts option={options} />
    </>
  );
};

export default BarLineChart;
