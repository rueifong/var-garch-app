import React, { useState, createRef, useEffect } from "react";
import LineChart from "../../pages/echart-example/line";
import BarLineChart from "../../pages/echart-example/bar-line";
import GaugeChart from "../../pages/echart-example/gauge";
import PriceChart from "../../pages/echart-example/price";
import { Input, Button, Select, Table, Radio, Checkbox } from 'antd';
import { useCSVReader } from "react-papaparse";
import { api, defaultAxios } from "../../environment/api";
import bgImg from "../../imgs/istockphoto-1130281605-612x612.jpg"
import bgImg2 from "../../imgs/istockphoto-1269592684-612x612.jpg";
import bgImg3 from "../../imgs/istockphoto-1170113435-612x612.jpg";

var optimjs = require('optimization-js');

const { Option } = Select;


// const onSearch = (value) => {
//   console.log('search:', value);
// };

// import CSVReader from "./read-file";
// const { Option } = Select;

// const buttonRef = createRef();
// import "./math";
// import { opt } from "scipy-optimize";
// var opt = require('scipy-optimize').opt;
// var cp = require('scipy-optimize');
// var opt = cp.spawn('opt');


const ReplayChart = () => {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(0);
  const [data_var, setVar] = useState(0);
  const [kurtosis, setKurtosis] = useState(0);
  const [skewness, setSkewness] = useState(0);
  const [stock, setStock] = useState(null);
  const [model, setModel] = useState('G');
  const [page, setPage] = useState('1');
  const [test, setTest] = useState('1');
  const [timer, setTimer] = useState(null);
  const [model1, setModel1] = useState({});
  const [model2, setModel2] = useState({});
  const [model3, setModel3] = useState({});
  const [normalChartData, setNormalChartData] = useState({
    xAxis: [],
    yAxis: [],
    line99: 0,
    line95: 0,
    line90: 0,
});
  const [priceChartData, setPriceChartData] = useState({
    xAxis: [],
    price: [],
    priceArr: [],
    quantity: [],
    quantityArr: [],
  });
  const [barLineChartData, setBarLineChartData] = useState({
    xAxis: [],
    blueData: [],
    greenData: [],
    redData: [],
  });


  ////////////////////////////////////////////////////////////////
  const fetchStock = (stockId, model) => {
    if (stockId === null) return null;

    defaultAxios({
      url: `http://localhost:8080/stock/${stockId}/${model}`,
      method: 'GET',
    })
      .then((res) => {
        const data = res.data[0];
        console.log('stock data', data);
        const df_new = data.df_new;

        setMean(data.descriptive_statistics.daily_ret.mean);
        setStd(data.descriptive_statistics.daily_ret.std);
        setVar(data.descriptive_statistics.daily_ret.var);
        setKurtosis(data.descriptive_statistics.daily_ret.kurtosis);
        setSkewness(data.descriptive_statistics.daily_ret.skewness);

        setModel1(data.model_1);
        setModel2(data.model_2);
        setModel3(data.model_3);

        // 常態分佈圖
        setNormalChartData({
          xAxis: data.normal_graph.x,
          yAxis: data.normal_graph.y,
          line99: data.normal_graph.line99,
          line95: data.normal_graph.line95,
          line90: data.normal_graph.line90,
        })

        console.log(data.normal_graph.line99,
          data.normal_graph.line95,
          data.normal_graph.line90);

        let xAxis = [];
        let blueData = [];
        let greenData = [];
        let data99 = [];
        let data95 = [];
        let data90 = [];
        let price = [];
        let priceArr = [];
        let quantity = [];
        let quantityArr = [];
        for (let i = 0; i < data.data_length; i++) {
          // let date = new Date(df_new.date[i]).getTime();
          let date = Number(df_new.date[i]);
          xAxis.push(date);
          if (df_new.difference[i] < 0) {
            blueData.push([date, df_new.daily_ret[i]]);
          } else {
            greenData.push([date, df_new.daily_ret[i]]);
          }
          data99.push([date, df_new['99% VaR'][i]]);
          data95.push([date, df_new['95% VaR'][i]]);
          data90.push([date, df_new['90% VaR'][i]]);
          price.push([date, df_new['price'][i]]);
          priceArr.push(df_new['price'][i]);
          quantity.push([date, df_new['quantity'][i]]);
          quantityArr.push(df_new['quantity'][i]);
        }
        console.log('blueData', blueData);
        console.log('greenData', greenData);
        console.log('data99', data99);
        console.log('data95', data95);
        console.log('data90', data90);
        // 商品價格走勢圖
        setPriceChartData({
          xAxis: xAxis,
          price: price,
          priceArr: priceArr,
          quantity: quantity,
          quantityArr: quantityArr,
        });
        // 散佈圖+風險線
        setBarLineChartData({
          xAxis: xAxis,
          blueData: blueData,
          greenData: greenData,
          data99: data99,
          data95: data95,
          data90: data90,
        });
      })
      .catch((err) => {
        console.log('資料有誤');
        console.log(err);
      })
  }

  const onChange = (value) => {
    console.log(`selected ${value}`);
    setStock(value);
    fetchStock(value, model);

    clearInterval(timer);
    setTimer(setInterval(() => {
      fetchStock(value, model);
    }, 30000));
  };

  useEffect(() => {
    // fetchData();
    // fetchStock('2412');
  }, [])
  
  return (
    <div className="relative">
      <div className="absolute" style={{ zIndex: 10, height: '100vh', width: '100%', background: 'url('+bgImg+')', backgroundSize: '100% 100%', filter: 'brightness(0.5)' }} ></div>
      <div className="absolute w-full" style={{ zIndex: 11 }}>
        <div className="" style={{ padding: '0.5rem' }}>
          <h1 className="text-center mb-0" style={{ fontFamily: 'Microsoft Yahei', fontWeight: 500, fontSize: '1.5rem', color: '#fff' }}>
          風險監控平台
          </h1>
          <p className="text-center mb-0" style={{ fontFamily: 'Microsoft Yahei', fontSize: '2.4vmin', color: '#fff' }}>TaiwanTech Derivatives Lab</p>
        </div>

        {/* 讀檔 */}
        <div className="flex w-full justify-center px-5 pb-5 relative z-10">
          <Select
            className="w-1/2 mr-4"
            showSearch
            placeholder="請選擇股票代碼"
            optionFilterProp="children"
            onChange={onChange}
            value={stock}
            // onSearch={onSearch}
          >
            <Option value="1760">1760</Option>
            <Option value="1795">1795</Option>
            <Option value="2308">2308</Option>
            <Option value="2317">2317</Option>
            <Option value="2330">2330</Option>
            <Option value="2412">2412</Option>
            <Option value="2454">2454</Option>
            <Option value="2603">2603</Option>
            <Option value="2608">2608</Option>
            <Option value="2609">2609</Option>
            <Option value="2615">2615</Option>
            <Option value="2618">2618</Option>
            <Option value="2801">2801</Option>
            <Option value="2884">2884</Option>
            <Option value="2886">2886</Option>
            <Option value="2891">2891</Option>
            <Option value="2892">2892</Option>
            <Option value="4142">4142</Option>
            <Option value="6446">6446</Option>
            <Option value="6472">6472</Option>
          </Select>
          <Radio.Group
            className="w-1/2"
            options={[
              { label: 'GARCH', value: 'G' },
              { label: 'EWMA', value: 'E' },
            ]}
            onChange={(e) => {
              setModel(e.target.value)
              fetchStock(stock, e.target.value);

              clearInterval(timer);
              setTimer(setInterval(() => {
                fetchStock(stock, e.target.value);
              }, 30000));
            }}
            value={model}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        {/* 圖表 */}
        <div style={{ 'display': (page == '1') ? 'block': 'none'}}>
          <div className="flex w-full px-5 -mt-16">
            <div className="w-1/3">
              <GaugeChart
                data={{
                  title: '99%的風險值',
                  value: 0.7,
                }}
              />
            </div>
            <div className="w-1/3">
              <GaugeChart
                data={{
                  title: '95%的風險值',
                  value: 0.5,
                }}
              />
            </div>
            <div className="w-1/3">
              <GaugeChart
                data={{
                  title: '90%的風險值',
                  value: 0.3,
                }}
              />
            </div>
          </div>
          <div className="flex w-full px-5 -mt-28">
            <div className="w-full" style={{ marginTop: '-28px' }}>
              <LineChart
                data={normalChartData}
              />
            </div>
          </div>
          <div className="flex w-full px-5 -mt-24">
            <div className="w-full" style={{ marginTop: '-28px' }}>
              <PriceChart
                data={priceChartData}
              />
            </div>
          </div>
          <div className="flex w-full px-10 -mt-20">
            <div className="w-full text-white">
              <h2 className="text-white text-xl font-bold mb-2">描述性統計量</h2>
              <div className="flex">
                <div className="mr-4">
                  報酬平均數: {mean}<br />
                  標準差: {std}<br />
                  變異數: {data_var}<br />
                </div>
                <div>
                  峰態: {kurtosis}<br />
                  偏態: {skewness}<br />
                  {/* 風險值: ?.?? */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ 'display': (page == '2') ? 'block': 'none'}}>
          <div className="flex w-full px-5">
            <div className="w-full" style={{ marginTop: '-20px' }}>
              <BarLineChart
                data={barLineChartData}
              />
            </div>
          </div>
          {/* <div className="flex w-full justify-center -mt-20">
            <Checkbox.Group
              defaultValue={['1']}
              options={[
                { label: '比例檢定', value: '1' },
                { label: 'Kupiec POF Test', value: '2' },
                { label: 'Christoffersen Test', value: '3' },
              ]}
              onChange={e => setTest(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            />
          </div> */}
          <div className="flex w-full px-8 -mt-20 mb-2">
            <div className="w-full text-white">
              <h2 className="text-white text-xl font-bold mb-1">模型檢定1：比例檢定結果</h2>
              <div className="mr-4">
                回測筆數: {model1.length}, 穿透次數: {model1.exception}<br />
                實際穿透比例: {model1.exceedRatio}<br />
                p-value: {model1['p-value']}<br />
                {model1.is_ok}
              </div>
            </div>
          </div>
          <div className="flex w-full px-8 mb-2">
            <div className="w-full text-white">
              <h2 className="text-white text-xl font-bold mb-1">模型檢定2：Kupiec Unconditional Coverage Test</h2>
              <div className="mr-4">
                回測筆數: {model2.length}, 穿透次數: {model2.exception}<br />
                實際穿透比例: {model2.exceedRatio}<br />
                p-value: {model2['p-value']}<br />
                {model2.is_ok}
              </div>
            </div>
          </div>
          <div className="flex w-full px-8 mb-2">
            <div className="w-full text-white">
              <h2 className="text-white text-xl font-bold mb-1">模型檢定3：Christoffersen Test</h2>
              <div className="mr-4">
                回測筆數: {model3.length}, 穿透次數: {model3.exception}<br />
                實際穿透比例: {model3.exceedRatio}<br />
                p-value: {model3['p-value']}<br />
                {model3.is_ok}
              </div>
            </div>
          </div>
          <div class="traffic-light-wrap">
            <div class="traffic-light red"></div>
          </div>
          <div class="traffic-light-wrap">
            <div class="traffic-light green"></div>
          </div>
        </div>

        <div className="flex w-full justify-center px-5 mt-6">
          <Radio.Group
            options={[
              { label: 'Page 1', value: '1' },
              { label: 'Page 2', value: '2' },
            ]}
            onChange={e => setPage(e.target.value)}
            value={page}
            optionType="button"
            buttonStyle="solid"
          />
          {/* <Radio.Group value={page} >
            <Radio.Button value="1">Page 1</Radio.Button>
            <Radio.Button value="2">Page 2</Radio.Button>
          </Radio.Group> */}
        </div>
      </div>
    </div>
  );
};

export default ReplayChart;
