import './App.css';
import axios from "axios";
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './style.css';

const App = () => {
  const [product, setProduct] = useState([]);
  const inputRef = useRef(null);
  const [symbol, setSymbol] = useState('IBM');
  const getProductData = async () => {
    try {
      const data = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=demo`
      );
      setProduct(data.data);
      const timeSeriesDaily = data.data['Time Series (5min)'];
      let date = Object.keys(timeSeriesDaily);
      let values = Object.values(timeSeriesDaily);
      var newRowData = values.map((e, index) => {
        return {
          open: e["1. open"],
          high: e["2. high"],
          low: e["3. low"],
          close: e["4. close"],
          volume: e["5. volume"],
          date: date[index]
        }
    })
      gridRef.current.api.setRowData(newRowData)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '90rem', height: '90rem' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    function formatter(params) {
      var res = Number.parseFloat(params.data.open);
    
      if (isNaN(res)) {
        return undefined;
      }
    
      return res;
    };
    function hformatter(params) {
      var res = Number.parseFloat(params.data.high);
    
      if (isNaN(res)) {
        return undefined;
      }
    
      return res;
    }
    function lformatter(params) {
      var res = Number.parseFloat(params.data.low);
    
      if (isNaN(res)) {
        return undefined;
      }
    
      return res;
    }
    function cformatter(params) {
      var res = Number.parseFloat(params.data.close);
    
      if (isNaN(res)) {
        return undefined;
      }
    
      return res;
    }
    function vformatter(params) {
      var res = Number.parseFloat(params.data.volume);
    
      if (isNaN(res)) {
        return undefined;
      }
    
      return res;
    };

    const [columnDefs, setColumnDefs] = useState([
      {
        field: 'date',
        chartDataType: 'category',
      },
      { field: 'open', chartDataType: 'series', valueGetter: formatter},
      { field: 'high', chartDataType: 'series', valueGetter: hformatter,},
      { field: 'low', chartDataType: 'series', valueGetter: lformatter},
      { field: 'close', chartDataType: 'series', valueGetter: cformatter},
      { field: 'volume', chartDataType: 'series', valueGetter:  vformatter},
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 100,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
      };
    }, []);
    const chartThemes = useMemo(() => {
      return ['ag-pastel', 'ag-vivid'];
    }, []);
    const popupParent = useMemo(() => {
      return document.body;
    }, []);
    const chartThemeOverrides = useMemo(() => {
      return {
        common: {
          padding: {
            right: 40,
          },
          legend: {
            position: 'bottom',
          },
          axes: {
            number: {
              title: {
                enabled: true,
              },
            },
          },
        },
        column: {
          series: {
            strokeWidth: 2,
            fillOpacity: 0.8,
          },
        },
        line: {
          series: {
            strokeWidth: 5,
            strokeOpacity: 0.8,
          },
        },
        bar: {
          series: {
            fillOpacity: 0.8,
            strokeOpacity: 0.8,
            strokeWidth: 2,
            shadow: {
              enabled: true,
              color: 'rgba(0, 0, 0, 0.3)',
              xOffset: 10,
              yOffset: 5,
              blur: 8,
            },
            label: {
              enabled: true,
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: 15,
              fontFamily: 'Arial, sans-serif',
              color: 'green',
              formatter: function (params) {
                return '<' + params.value + '>';
              },
            },
            highlightStyle: {
              item: {
                fill: 'red',
                stroke: 'yellow',
              },
            },
          },
        },
      };
    }, []);
  
    const onFirstDataRendered = useCallback((params) => {
      gridRef.current.api.createRangeChart({
        chartType: 'customCombo',
        cellRange: {
          columns: ['date', 'open', 'high', 'low', 'close', 'volume'],
        },
        seriesChartTypes: [
          { colId: 'open', chartType: 'groupedColumn', secondaryAxis: false },
          { colId: 'high', chartType: 'groupedColumn', secondaryAxis: false },
          { colId: 'low', chartType: 'groupedColumn', secondaryAxis: false },
          { colId: 'close', chartType: 'groupedColumn', secondaryAxis: false},
          { colId: 'volume', chartType: 'line', secondaryAxis: true },
        ],
        aggFunc: 'sum',
        suppressChartRanges: true,
        chartContainer: document.querySelector('#myChart'),
      });
    }, []);
    const handleChange = event => {
      setSymbol(event.target.value);
    };
    const handleClick = event => {
      event.preventDefault();
  
      // 👇️ value of input field
      console.log('old value: ', symbol);
  
      // 👇️ set value of input field
      setSymbol(inputRef.current.value);
      getProductData();
    };
  return (
    <>
    <div style={containerStyle}>
      <div className="wrapper">
      <input
          ref={inputRef}
          style={{display: 'inline',
            width: '200px',
            padding: '5px 5px 5px 5px',
            margin: '10px 10px'}}
            type="text"
            id="symbol"
            name="symbol"
            onChange={handleChange}
            value={symbol}
      />
      <button style={{display: 'inline',
            width: '100px',
            padding: '2px 2px 2px 2px',
            margin: '15px 15px'}} onClick={handleClick}>
              Search Stock
      </button>
      <h2 style={{display: 'inline',
            width: '400px',
            padding: '5px 5px 5px 5px',
            margin: '10px 10px'}}>
              Stock Symbol: {symbol}
      </h2>

        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            enableRangeSelection={true}
            chartThemes={chartThemes}
            enableCharts={true}
            popupParent={popupParent}
            chartThemeOverrides={chartThemeOverrides}
            onFirstDataRendered={onFirstDataRendered}
            pagination
          ></AgGridReact>
        </div>
        <div id="myChart" className="ag-theme-alpine"></div>
      </div>
    </div>
    </>
  );
};

export default App;
