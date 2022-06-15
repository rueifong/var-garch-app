import React, { useState, createRef } from "react";
import BarLineChart from "../../pages/echart-example/bar-line";
import { Input, Button, Select, Table } from 'antd';
import { useCSVReader } from "react-papaparse";
// import CSVReader from "./read-file";
// const { Option } = Select;

// const buttonRef = createRef();

const ReplayChart = () => {
  const { CSVReader } = useCSVReader();
  const [StockPriceChart, setStockPriceChart] = useState({
    xAxis: [],
    yAxis: [],
    max: 150,
    min: 0,
  });
  let [tableData, setTableData] = useState([]);
  let [CSVData, setCSVData] = useState([]);
  const [dfs, setDfs] = useState([]);
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
  }

  // Step 2: 模型參數估計
  // GARCH(1,1)
  // 用MLE算參數
  const log_likelihood_MLE = (params) => {
    let [alpha, beta, gamma] = params;   // #alpha, beta, omega = params[0], params[1], params[2]
    let data = [];
    let window = 250;   // 估計參數所使用之樣本數
    let var_long =  0.0003;   // 假設的

    CSVData.forEach(function (obj, i) {
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
      let loglikelihood = -Math.log(variance) - (Math.pow(daily_ret, 2)) / variance;   // loglikelihood
      // #df['stdev'] = df['daily_ret'].rolling(window=2, center=False).std(ddof=0)

      data.push({
        ...obj,
        variance: variance,
        stdev: stdev,
        loglikelihood: loglikelihood,
      });
    });
    setDfs(data);
    console.log('df', data);
    
    let sums = 0;
    for(let i = 1; i <= window; i++) {
      sums += data[i].loglikelihood;
    }

    return -sums;
  }

  // 規劃求解
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

  // Step 3: 計算變異數及風險值

  // exceedance (穿透次數)

  // 繪圖
  const runPlot = () => {

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
      backgroundColor: 'lightblue',
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
      backgroundColor: 'lightpink',
      width: '15%',
    },
    progressBarBackgroundColor: {
      backgroundColor: 'red',
    },
  };
  
  return (
    <>
      <div style={{ backgroundColor: '#628ea5', padding: '0.5rem' }}>
        <h1 className="text-center mb-0" style={{ fontFamily: 'Microsoft Yahei', fontWeight: 500, fontSize: '1.5rem', color: '#fff' }}>
        風險APP
        </h1>
        <p className="text-center mb-0" style={{ fontFamily: 'Microsoft Yahei', fontSize: '2.4vmin', color: '#fff' }}>TaiwanTech Derivatives Lab</p>
      </div>
      <div className="my-3">
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
      <div className="flex">
        {/* 設定 */}
        {/* <div className="w-1/5">
          <div className="border p-5">
            <h6>Stock Properties</h6>
            <div className="flex items-center mb-2">
              <span className="w-2/3">Interest rate (%)</span>
              <Input disabled={isSet} type="number" className="w-30" value={interestRate} onChange={InterestRateValueChanged} />
            </div>
            <div className="flex items-center mb-2">
              <span className="w-2/3">Volatility (%)</span>
              <Input disabled={isSet} type="number" className="w-30" value={volatility} onChange={VolatilityValueChanged} />
            </div>
            <Button disabled={isSet} onClick={() => generateGBM()} className="w-full">Set</Button>
          </div>

          <div className="flex p-5">
            <Button disabled={!isSet} onClick={() => ResetButtonPushed()} className="w-1/2" type="danger">Reset</Button>
            <Button disabled={!isSet || currentStatus == 3} onClick={() => StartButtonPushed()} className="w-1/2" type="primary">{buttonText}</Button>
          </div>

          <div className="border p-5">
            <h6>Place Order</h6>
            <Radio.Group disabled={!isStockPanel} className="mb-2" onChange={LongShortSelectionChanged} value={longShort}>
              <Radio value={1}>Long</Radio>
              <Radio value={-1}>Short</Radio>
            </Radio.Group>
            <Button disabled={!isStockPanel} type={type == 1 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(1)} className="w-full mb-2">Stock</Button>
            <Button disabled={!isStockPanel} type={type == 2 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(2)} className="w-full mb-2">Futures</Button>
            <div className="flex mb-2">
              <Button disabled={!isStockPanel} type={type == 3 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(3)} className="w-1/2">Vanilla Call</Button>
              <Button disabled={!isStockPanel} type={type == 4 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(4)} className="w-1/2">Vanilla Put</Button>
            </div>
            <div className="flex mb-2">
              <Button disabled={!isStockPanel} type={type == 5 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(5)} className="w-1/2">Binary Call</Button>
              <Button disabled={!isStockPanel} type={type == 6 ? 'primary' : 'default'} onClick={() => TypeSelectionChanged(6)} className="w-1/2">Binary Put</Button>
            </div>
            <div className="flex items-center">
              <span className="w-1/3">Volume</span>
              <Input disabled={!isStockPanel} type="number" className="w-2/3" value={volume} onChange={VolumeValueChanged} />
            </div>
            <div className="flex items-center" style={{ opacity: (type == 1) ? 0 : 1 }}>
              <span className="w-1/3">Strike</span>
              <Input disabled={type == 1 || type == 2 || !isStockPanel} type="number" className="w-2/3" value={strike} onChange={StrikeValueChanged} />
            </div>
            <div className="flex items-center" style={{ opacity: (type == 1) ? 0 : 1 }}>
              <span className="w-1/3">Maturity</span>
              <Select disabled={type == 1 || !isStockPanel} className="w-2/3" defaultValue="1" onChange={MaturityValueChanged}>
                <Option disabled={t[it] >= 0.2} value="0.2">0.2</Option>
                <Option disabled={t[it] >= 0.4} value="0.4">0.4</Option>
                <Option disabled={t[it] >= 0.6} value="0.6">0.6</Option>
                <Option disabled={t[it] >= 0.8} value="0.8">0.8</Option>
                <Option value="1">1</Option>
              </Select>
            </div>
            <div className="flex items-center">
              <span className="w-1/3">Cash Flow</span>
              <Input disabled={true} type="number" className="w-2/3" value={cashFlow} />
            </div>
            <Button disabled={!isStockPanel} className="w-full mt-3" type="primary" onClick={() => PlaceOrderPushed()}>Place Order</Button>
          </div>
        </div> */}

        {/* 圖表 */}
        <div className="w-full">
          <BarLineChart
            data={StockPriceChart}
          />
          {/* <BarLineChart
            data={ProfitChart}
          /> */}

          <div className="flex">
            <div className="w-3/4">
              <Table
                className="border"
                rowKey="id"
                size="small"
                columns={[
                  {
                    title: "ID",
                    dataIndex: "id",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "Time",
                    dataIndex: "time",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "Type",
                    dataIndex: "type",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "T",
                    dataIndex: "t",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "K",
                    dataIndex: "k",
                    key: Math.random(),
                    width: 50,
                  },              {
                    title: "Vol.",
                    dataIndex: "vol",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "Cost",
                    dataIndex: "cost",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "MarketValue",
                    dataIndex: "marketValue",
                    key: Math.random(),
                    width: 80,
                  },
                  {
                    title: "Profit",
                    dataIndex: "profit",
                    key: Math.random(),
                    width: 50,
                  },
                  {
                    title: "Expire",
                    dataIndex: "expire",
                    key: Math.random(),
                    width: 50,
                  },
                ]}
                pagination={false}
                dataSource={
                  tableData
                  // orders.length && [{ ...orders[currentIndex], key: Math.random() }]
                }
                sticky
              />
            </div>
            <div className="w-1/4 p-5 border py-8">
              <div className="flex items-center mb-2">
                <span className="w-1/3">Cash</span>
                <Input disabled={true} type="number" className="w-2/3" value="" />
              </div>
              <div className="flex items-center mb-2">
                <span className="w-1/3">Profit</span>
                <Input disabled={true} type="number" className="w-2/3" value="" />
              </div>
              <div className="flex items-center">
                <span className="w-1/3">Time</span>
                <Input disabled={true} type="number" className="w-2/3" value="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReplayChart;
