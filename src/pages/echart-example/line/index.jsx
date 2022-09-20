import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

function func(x) {
  x /= 10;
  return Math.sin(x * 2 +  5) * Math.cos(x) * Math.sin(x) * 50;
}
function generateData() {
  let data = [];
  for (let i = -10; i <= 10; i += 0.1) {
    data.push([i, func(i)]);
  }
  return data;
}

const BarLineChart = ({
  data = { title: '', xAxis: [], yAxis: [] },
}) => {
  // console.log('data', data);
  console.log('data.xAxis[0]', data.xAxis[0]);
  console.log('data.xAxis[max]', data.xAxis[data.xAxis.length - 1]);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    title: {
      left: 'center',
      text: '常態分佈圖',
      textStyle: {
        color: '#fff',
        fontSize: '14px',
      },
      top: 25,
    },
    grid: {
      height: 120,
      left: '5%',
      right: '5%',
      containLabel: true,
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
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: data.xAxis,
        splitLine: {
          show: false
        },
        axisLine: {
          onZero: false,
        },
        // max: data.xAxis[data.xAxis.length - 1],
        // axisTick: {
        //   alignWithLabel: true
        // },
        // axisPointer: {
        //   type: 'shadow'
        // }
      },
    ],
    yAxis: [
      {
        type: "value",
        name: 'y',
        boundaryGap: false,
        splitLine: {
          show: false
        },
        axisLine: {
          onZero: false,
        },
      }
    ],
    // dataZoom: [
    //   {
    //     show: true,
    //     type: 'inside',
    //     filterMode: 'none',
    //     xAxisIndex: [0],
    //     startValue: data.xAxis[0],
    //     endValue: data.xAxis[10000],
    //   },
    // ],
    series: [
      {
        type: 'line',
        showSymbol: true,
        smooth: true,
        data: data.yAxis,
        markLine: {
          symbol: 'none',
          itemStyle: {
            normal: { lineStyle: { type: 'dotted', color:'#fff' } }
          },
          data: [
            [
              {
                  name: '99%',
                  coord: [-0.0028175683283942848, 0]
              },
              {
                  coord: [-0.0028175683283942848, 350]
              }
            ],
            [
              {
                  name: '95%',
                  coord: [50, 0]
              },
              {
                  coord: [50, 350]
              }
            ],
            [
              {
                  name: '90%',
                  coord: [100, 0]
              },
              {
                  coord: [100, 350]
              }
            ],
            // {
            //   name: '99%',
            //   xAxis: 10,
            // },
            // {
            //   name: '95%',
            //   xAxis: 50,
            // },
            // {
            //   name: '90%',
            //   xAxis: 100,
            // },
          ]
        }
      },
    ],
  };

  return (
    <>
      <ReactECharts option={options} />
    </>
  );
};

export default BarLineChart;
