import React, { useState, createRef, useEffect } from "react";
import BarLineChart from "../../pages/echart-example/bar-line";
import GaugeChart from "../../pages/echart-example/gauge";
import PriceChart from "../../pages/echart-example/price";
import { Input, Button, Select, Table } from 'antd';
import { useCSVReader } from "react-papaparse";
import { api, defaultAxios } from "../../environment/api";
import bgImg from "../../imgs/istockphoto-1269592684-612x612.jpg";
import bgImg2 from "../../imgs/istockphoto-1130281605-612x612.jpg"
import bgImg3 from "../../imgs/istockphoto-1170113435-612x612.jpg";


var optimjs = require('optimization-js');
// import CSVReader from "./read-file";
// const { Option } = Select;

// const buttonRef = createRef();
// import "./math";
// import { opt } from "scipy-optimize";
// var opt = require('scipy-optimize').opt;
// var cp = require('scipy-optimize');
// var opt = cp.spawn('opt');


const ReplayChart = () => {
  const { CSVReader } = useCSVReader();
  const [StockPriceChart, setStockPriceChart] = useState({
    xAxis: [],
    yAxis: [],
    max: 150,
    min: 0,
  });
  const [chartData, setChartData] = useState({
    blueData: [],
    greenData: [],
  });
  let [CSVData, setCSVData] = useState([]);
  let [dfs, setDfs] = useState([]);
  let [dfsNew, setDfsNew] = useState([]);

  // Step 1: 取得原始資料及資料處理
  // 讀檔
  const readCSVFile = (results) => {
    console.log('readCSVFile')
    let data = [];
    results.forEach(function (obj, index) {
      if (index > 0 && obj[0] != "") {
        data.push({
          date: obj[0],
          daily_ret: Number(obj[2]),
        });
      }
    });
    setCSVData(data);
    CSVData = data;
    console.log('CSVData', data);

    console.log('log_likelihood_MLE', log_likelihood_MLE([3, 3, 3]));
    console.log('log_likelihood_MLE 2', log_likelihood_MLE([
      2.9164583714446053, -1.497529563726857, 2.9999952560756356
    ]));

    
    calcVariance(data);


    var minimize = mle_model(log_likelihood_MLE, [3, 3, 3]);
    console.log('minimize_Powell', minimize);

    // var example = mle_model(objective, [3, 3, 3]);
    // console.log('minimize_Powell for example', example);
  }

  const objective = (x) => {
    return (x[0]-1.0)*(x[0]-1.0) + (x[1]+0.5)*(x[1]+0.5) + (x[2]+2.0)*(x[2]+2.0)
  }

  // Step 2: 模型參數估計
  // GARCH(1,1)
  // 用MLE算參數
  const log_likelihood_MLE = (params) => {
    // let [alpha, beta, gamma] = params;
    let alpha = params[0];   // #alpha, beta, omega = params[0], params[1], params[2]
    let beta = params[1];   // #alpha, beta, omega = params[0], params[1], params[2]
    let gamma = params[2];   // #alpha, beta, omega = params[0], params[1], params[2]
    let data = [];
    let window = 250;   // 估計參數所使用之樣本數
    let var_long =  0.0003;   // 假設的
    let df = CSVData;

    df.forEach(function (obj, i) {
      let daily_ret = obj.daily_ret;
      let variance = daily_ret;
      if (i === 0) {
        variance = 0;
      } else if (i === 1) {
        variance = Math.pow(daily_ret, 2);
      } else if (i > 1) {
        variance = gamma * var_long + beta * (data[i-1].variance) + alpha * Math.pow(data[i-1].daily_ret, 2);
      }
      let stdev = Math.sqrt(variance);
      let loglikelihood = -Math.log(variance) - Math.pow(daily_ret, 2) / variance;   // loglikelihood
      console.log(i, loglikelihood, variance, daily_ret);
      data.push({
        ...obj,
        variance: variance,
        stdev: stdev,
        loglikelihood: loglikelihood,
      });
    });
    // setCSVData(data);
    // CSVData = data;
    // console.log('df', CSVData);
    
    let sums = 0;
    for (let i = 1; i < window; i++) {
      sums += data[i].loglikelihood;
    }
    return -sums;
  }

  // 規劃求解
  const mle_model = (fuc, x0) => {
    return minimize_Powell(fuc, x0);
  }
  // bounds = Bounds([0.0, 0.0, 0.0], [1.00, 1.00, 1.00])         #  0 < alpha, beta, gamma < 1
  // let cons = {
  //   'type': 'eq',
  //   'fun': ((params) => params[0] + params[1] + params[2] - 1)       // alpha + beta + gamma = 1
  // };  
  // #cons = {'type': 'ineq', 'fun': lambda params: -params[0] - params[1] - params[2] + 1}   # alpta + beta  <  1 (另一種)
  // let mle_model = minimize(log_likelihood_MLE, np.array([3, 3, 3]), method='SLSQP', bounds = bounds, constraints = cons)

  // mle_model
  // #mle_model.x[0]      #alpha
  // #mle_model.x[1]      #beta
  // #mle_model.x[2]      #gamma

  function shuffleIndiciesOf (array) {
    var idx = [];
    for (var i = 0; i < array.length; i++) {
        idx.push(i);
    }
    for (var i = 0; i < array.length; i++) {
        var j = Math.floor(Math.random() * i);
        var tmp = idx[i];
        idx[i] = idx[j];
        idx[j] = tmp;
    }
    return idx;
  };

  const minimize_Powell = (fnc, x0) => {
    console.log("==================start==================")
    var eps = 1e-2;
    var convergence = false;
    var x = x0.slice(); // make copy of initialization
    var alpha = 0.001; // scaling factor
    var pfx = Math.exp(10);
    var fx = fnc(x);
    var pidx = 1;
    console.log('fx', fx, x);    
    while (!convergence) {
        var indicies = shuffleIndiciesOf(x);
        console.log('indicies', indicies);
        convergence = true;
        // Perform update over all of the variables in random order
        for (var i = 0; i < indicies.length; i++) {
            x[indicies[i]] += 1e-6;
            console.log('fxi-start', x);
            var fxi = fnc(x);
            console.log('fxi-end', fxi, x);
            x[indicies[i]] -= 1e-6;
            var dx = (fxi - fx) / 1e-6;
            if (Math.abs(dx) > eps) {
                convergence = false;
            }
            x[indicies[i]] = x[indicies[i]] - alpha * dx;
            console.log('fx 2-start', x);
            fx = fnc(x);
            console.log('fx 2', fx, x);
        }
        // a simple step size selection rule. Near x function acts linear 
        // (this is assumed at least) and thus very small values of alpha
        // should lead to (small) improvement. Increasing alpha would
        // yield better improvement up to certain alpha size.
        
        alpha = pfx > fx ? alpha * 1.1 : alpha * 0.7;
        pfx = fx;
        pidx--;
        if (pidx === 0) {
            pidx = 1;
        }
    }
    var solution = {};
    solution.argument = x;
    solution.fncvalue = fx;
    console.log("==================end==================")
    return solution;
  }
  ////////////////////////////////////////////////////////////////

  // Step 3: 計算變異數及風險值

  const calcVariance = (csvData) => {
    console.log('calcVariance');
    let data = [];
    let window = 250      // #實際回測使樣本數 ( = 總樣本數 - 估計參數使用之樣本數)
    let var_long =  0.0003

    csvData.forEach((obj, i) => {
      data.push({
        ...obj,
        stdev: obj.daily_ret,
      })
    })
    data[window-1].stdev = 0;
    data[window].stdev = Math.abs(data[window - 1].daily_ret);

    console.log('df', data);

    
    for (let i = window; i < csvData.length; i++) {
      // #####   計算變異數
      // data[i].variance = mle_model.x[2] * var_long + mle_model.x[1] * (data[i-1].variance) + mle_model.x[0]  * Math.pow(data[i-1].daily_ret, 2)
      data[i].variance = Math.random();
      data[i].stdev = Math.sqrt(data[i].variance);
      // #####   計算風險值
      data[i]['99% VaR'] = -2.33 * data[i].stdev;  // #Normal Distribution (99% VaR)
      // #df['99% VaR']= -3.365 * df['stdev']    // #Student-t Distribution df=5 (99% VaR)
      
      // #df['95% VaR']= -1.645 *df['stdev']  // #Normal Distribution (95% VaR)
      // #df['95% VaR']= -2.015 * df['stdev']    // #Student-t Distribution df=5 (95% VaR)
      
      data[i].difference = data[i].daily_ret - data[i]['99% VaR'];
      // #df['difference']=df['daily_ret'] - df['95% VaR']
    }
              
    for (let i = 0; i < csvData.length; i++) {
      data[i].stdev = Math.sqrt(data[i].variance);
      data[i].stdev_year = data[i].stdev * Math.sqrt(252);  // #  年化標準差
      // #dfs[:200]
    }

    let newData = [];
    for (let i = window; i < csvData.length; i++) {
      newData.push(data[i]);
    }
    setDfsNew(newData);
    dfsNew = newData;
    exceedance();
    return newData;
  }

  // exceedance (穿透次數)
  const exceedance = () => {
    let count = 0;
    let g = 0;
    for (let i = 0; i < dfsNew.length; i++) {
      g += 1;
      if (dfsNew[i].difference < 0) {
        count += 1;
      }
      console.log("樣本數 =", g, "  " ,"穿透次數 =", count)
    }
    runPlot();
  }

  // 繪圖
  const runPlot = () => {
    let xAxis = [];
    let blueData = [];
    let greenData = [];
    let redData = [];
    for (let i = 0; i < dfsNew.length; i++) {
      xAxis.push(dfsNew[i].date);
      if (dfsNew[i].difference < 0) {
        blueData.push([dfsNew[i].date, dfsNew[i].daily_ret]);
      } else {
        greenData.push([dfsNew[i].date, dfsNew[i].daily_ret]);
      }
      redData.push([dfsNew[i].date, dfsNew[i]['99% VaR']]);
    }
    console.log('blueData', blueData);
    console.log('greenData', greenData);
    setChartData({
      xAxis: xAxis,
      blueData: blueData,
      greenData: greenData,
      redData: redData,
    })

    // plt.plot(df_new['date'], df_new['99% VaR'], c= "red")

    // plt.show()
  }

  // Unconditional Coverage Test
  // Kupiec_POF(df_new, 0.01)
  const Kupiec_POF = () => {
    // exception = 0
    // length = len(df)         
    // for i in range(length):
    //     if df['difference'][i] < 0:   #首筆資料沒有difference，所以從第二筆開始
    //         exception += 1
    // LR_UC = -2* math.log( ((1-p)**(length-exception)) * (p**exception) ) + 2 * math.log(  ((1 - exception/length)**(length-exception)) *( (exception/length)**exception ))
    // print('Length = ', length)
    // print('Exception = ', exception)
    // print("LR_UC statistics =",  LR_UC)
    // print("p-value = ", chi2.sf( LR_UC, 1) )
    // if chi2.sf( LR_UC, 1) < 0.05:   #95%信心水準
    //     print("Reject null hypothesis.")
    // else:
    //     print("Do not reject null hypothesis.")
  }

  // Independence Test
  // Christoffersen_test(df_new, 0.01)
  const Christoffersen_test = () => {
    // exception = 0
    // length = len(df)         
    // for i in range(length):
    //     if df['difference'][i] < 0:   #首筆資料沒有difference，所以從第二筆開始
    //         exception += 1
    // LR_UC = -2* math.log( ((1-p)**(length-exception)) * (p**exception) ) + 2 * math.log(  ((1 - exception/length)**(length-exception)) * (exception/length)**exception )

    // a00 = 0
    // a01 = 0
    // a10 = 0
    // a11 = 0
    // a02 = 0
    // for i in range(length-1):
    //     if df['difference'][i] > 0 and df['difference'][i+1] > 0:
    //         a00 += 1
    //     elif df['difference'][i] > 0 and df['difference'][i+1] < 0:
    //         a01 += 1
    //     elif df['difference'][i] < 0 and df['difference'][i+1] > 0:
    //         a10 += 1
    //     elif df['difference'][i] < 0 and df['difference'][i+1] < 0:
    //         a11 += 1
    //     else:
    //         a02 += 1
    // q0 = a00 / (a00 + a01)
    // q1 = a10 / (a10 + a11)
    // q = (a00 + a10) / (a00 + a01 + a10 + a11)
    // LR_IND = -2* math.log( ( (1-q)**(a01+a11) )* (q**(a00+a10)) / (( (1-q0)**a01 ) * (q0** a00) * ( (1-q1)**a11 ) * (q1**a10) ))

    // LR_CC = LR_UC + LR_IND

    // #Summary
    // print("LR_UC statistics =",  LR_UC)
    // print("p-value = ", chi2.sf( LR_UC, 1) )
    // print("LR_IND statistics =",  LR_IND)
    // print("p-value = ", chi2.sf( LR_IND, 1) )
    // print("LR_CC statistics =",  LR_CC)
    // print("p-value = ", chi2.sf( LR_CC, 2) )
    // if chi2.sf( LR_CC, 2) < 0.05:
    //     print("Reject null hypothesis.")
    // else:
    //     print("Do not reject null hypothesis.")

  }

  
  const fetchData = () => {
    let apiType = 'chart';
    let symbolId = '2330';
    let apiToken = '4af7c90c0eac7cd5ee3d289f00045bbb';
    let jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDQ1IiwiaWF0IjoxNjQ4MDIzNTE4LCJpc3MiOiJFMDhPb3VKeElXYnJlOW0yWXh6R2d4ZGhZWWJXU1cyMiJ9.0O7ZQSn6YaLJmiXLxdp1SARybxHKs18sqbdXcH3dQ-o';

    defaultAxios({
      url: api.realtime.url + `/${apiType}?symbolId=${symbolId}&apiToken=${apiToken}&limit=500&oddLot=true&jwt=${jwt}`,
      method: api.realtime.method,
    })
      .then((res) => {
        console.log(res.data.data);

        let data = [];
        res.data.data.chart.c.forEach(function (obj, index) {
          if (index > 0) {
            data.push({
              date: res.data.data.chart.t[index],
              daily_ret: obj,
            });
          }
        });
        setCSVData(data);
        CSVData = data;
        console.log('CSVData', data);

        // console.log('log_likelihood_MLE', log_likelihood_MLE([3, 3, 3]));
        // console.log('log_likelihood_MLE 2', log_likelihood_MLE([
        //   2.9164583714446053, -1.497529563726857, 2.9999952560756356
        // ]));
    
        
        calcVariance(data);
        
      })
      .catch((err) => {
        console.log('資料有誤');
        console.log(err);
      })
    }

    useEffect(() => {
      // fetchData();
    }, [])

    
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    let responseData = [];
    data.forEach(function (obj, index) {
      if (index > 0 && obj.data[0] != "") {
        console.log(index, obj.data);

        responseData.push({
          date: obj.data[0],
          daily_ret: Number(obj.data[2]),
        });
      }
    });
    console.log('data', responseData);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log(data);
  };

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const handleOnClick = () => {
    console.log('handleOnClick');
  }

  const styles = {
    csvReader: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 10,
    },
    browseFile: {
      borderRadius: 0,
      marginLeft: 0,
      marginRight: 0,
      width: "35%",
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: 'steelblue',
    },
    acceptedFile: {
      border: '1px solid #ccc',
      height: 45,
      lineHeight: 2.5,
      paddingLeft: 10,
      width: '50%',
    },
    remove: {
      borderRadius: 0,
      padding: '0 20px',
      backgroundColor: 'indianred',
      width: '15%',
    },
    progressBarBackgroundColor: {
      backgroundColor: 'red',
    },
  };
  
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
        <div className="text-white py-0">
          <CSVReader
            onUploadAccepted={(results) => {
              console.log('---------------------------');
              readCSVFile(results.data);
              console.log('---------------------------');
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
            }) => (
              <>
                <div style={styles.csvReader}>
                  <button type='button' {...getRootProps()} style={styles.browseFile}>
                    Browse file
                  </button>
                  <div style={styles.acceptedFile}>
                    {acceptedFile && acceptedFile.name}
                  </div>
                  <button {...getRemoveFileProps()} style={styles.remove}>
                    Remove
                  </button>
                </div>
                <ProgressBar style={styles.progressBarBackgroundColor} />
              </>
            )}
          </CSVReader>
        </div>
        {/* 圖表 */}
        <div className="flex w-full px-10">
          <div className="w-1/6 ml-5">
            <GaugeChart
              data={{
                title: '99%的風險值',
                value: 0.7,
              }}
            />
          </div>
          <div className="w-1/6">
            <GaugeChart
              data={{
                title: '95%的風險值',
                value: 0.2,
              }}
            />
          </div>
          <div className="w-1/6">
            <GaugeChart
              data={{
                title: '90%的風險值',
                value: 0.55,
              }}
            />
          </div>
          <div className="w-4/6" style={{ marginTop: '-30px' }}>
            <PriceChart
              data={chartData}
            />
          </div>
        </div>
        <div className="flex w-full px-10" style={{ marginTop: '-60px' }}>
          <div className="w-5/6">
            <BarLineChart
              data={chartData}
            />
          </div>
          <div className="w-1/6 text-white">
            <h2 className="text-white">統計數據：</h2>
            描述性統計量<br />
            報酬平均數<br />
            標準差<br />
            變異數<br />
            峰態<br />
            偏態<br />
            風險值
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayChart;
