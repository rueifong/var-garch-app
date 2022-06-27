import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

const PriceChart = ({
  data = { title: '', xAxis: [], blueData: [], greenData: [], redData: [], max: 100, min: 0 },
}) => {
  // console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);

  let base = +new Date(1988, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let fakedata = [[base, Math.random() * 300]];
  for (let i = 1; i < 20; i++) {
    let now = new Date((base += oneDay));
    fakedata.push([+now, Math.round((Math.random() - 0.5) * 20 + fakedata[i - 1][1])]);
  }
  const options = {
    title: {
      left: 'center',
      text: '商品價格的走勢圖',
      textStyle: {
        color: '#fff',
      },
    },
    // legend: {
    //   top: 'bottom',
    //   data: ['Intention']
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
    // toolbox: {
    //   left: 'center',
    //   itemSize: 25,
    //   top: 55,
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: 'none'
    //     },
    //     restore: {}
    //   }
    // },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisTick: {
        inside: true
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        inside: true,
        formatter: '{value}\n'
      },
      z: 10
    },
    // grid: {
    //   top: 110,
    //   left: 15,
    //   right: 15,
    //   height: 160
    // },
    // dataZoom: [
    //   {
    //     type: 'inside',
    //     throttle: 50
    //   }
    // ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        // smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: {
          color: '#0770FF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58,77,233,0.8)'
            },
            {
              offset: 1,
              color: 'rgba(58,77,233,0.3)'
            }
          ])
        },
        data: fakedata,
      },
    ]
  };

  return (
    <>
      <ReactECharts option={options} />
    </>
  );
};

export default PriceChart;
