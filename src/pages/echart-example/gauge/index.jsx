import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const GaugeChart = ({
  data = { title: '', value: 0 },
}) => {
  // console.log('data', data);
  const [dataZoom, setDataZoom] = useState(1001);
  const options = {
    title: {
      left: 'center',
      text: data.title,
      textStyle: {
        color: '#fff',
        fontSize: '14px',
      },
      top: 60,
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
            width: 2,
            color: [
              [0.33, '#7CFFB2'],
              [0.66, '#FDDD60'],
              [1, '#FF6E76'],
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '40%',
          width: 15,
          offsetCenter: [0, '-30%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 1,
          lineStyle: {
            color: 'auto',
            width: 1
          }
        },
        splitLine: {
          length: 3,
          lineStyle: {
            color: 'auto',
            width: 3
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 10,
          distance: -30,
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
          fontSize: 20
        },
        detail: {
          fontSize: 20,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return '';
            return Math.round(value * 100) + '分';
          },
          color: 'auto'
        },
        data: [
          {
            value: data.value,
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
