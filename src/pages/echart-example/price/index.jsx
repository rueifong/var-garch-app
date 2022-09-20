import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from 'echarts';

const PriceChart = ({
  data = { title: '', xAxis: [], price: [], priceArr: [], quantity: [], quantityArr: [], },
}) => {
  // console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    title: {
      left: 'center',
      text: '商品價格的走勢圖',
      textStyle: {
        color: '#fff',
        fontSize: '14px',
      },
      top: 35,
    },
    grid: {
      height: 120,
      // width: '100%',
      // left: '5%',
      // right: '5%',
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
    xAxis: {
      type: 'time',
      boundaryGap: true,
      data: data.xAxis,
      splitLine: {
        show: false
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '價',
        nameTextStyle: {
          align: 'right',
        },
        splitLine: {
          show: false
        },
        min: Math.min(...data.priceArr) - 1,
        max: Math.max(...data.priceArr) + 1,
        position: 'left',
      },
      {
        type: 'value',
        name: '量',
        nameTextStyle: {
          align: 'left',
        },
        splitLine: {
          show: false
        },
        min: 0,
        max: Math.max(...data.quantityArr) + 5,
        position: 'right',
      }
    ],
    series: [
      {
        name: 'Price',
        type: 'line',
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 1,
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
        data: data.price,
      },
      {
        name: 'Quantity',
        type: 'bar',
        yAxisIndex: 1,
        // smooth: true,
        // symbol: 'circle',
        // symbolSize: 1,
        itemStyle: {
          color: '#989870'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(158,177,33,0.8)'
            },
            {
              offset: 1,
              color: 'rgba(158,177,33,0.3)'
            }
          ])
        },
        data: data.quantity,
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
