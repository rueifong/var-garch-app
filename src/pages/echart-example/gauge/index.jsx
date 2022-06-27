import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const GaugeChart = ({
  data = { title: '', xAxis: [], blueData: [], greenData: [], redData: [], max: 100, min: 0 },
}) => {
  // console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    title: {
      left: 'center',
      text: data.title,
      textStyle: {
        color: '#fff',
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.33, '#7CFFB2'],
              [0.66, '#FDDD60'],
              [1, '#FF6E76'],
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-50%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 20,
          distance: -60,
          formatter: function (value) {
            if (value === 0.75) {
              return '高';
            } else if (value === 0.5) {
              return '中';
            } else if (value === 0.25) {
              return '低';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 30
        },
        detail: {
          fontSize: 40,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '分';
          },
          color: 'auto'
        },
        data: [
          {
            value: 0.7,
          }
        ]
      }
    ]
  };

  return (
    <>
      <ReactECharts option={options} />
    </>
  );
};

export default GaugeChart;
