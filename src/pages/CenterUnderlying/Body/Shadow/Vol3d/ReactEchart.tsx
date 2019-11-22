import React, { memo, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import echarts from 'echarts/lib/echarts';
import { STRIKE_TYPE_ENUM } from '@/constants/global';
import { formatNumber } from '@/tools';

const Echarts3D = props => {
  const { strikeType } = props;
  const [chart, setChart] = useState();

  useEffect(() => {
    setChart(echarts.init(document.getElementById('main')));
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.clear();
    chart.setOption({
      tooltip: {
        formatter: params => {
          const { data: pData } = params;
          const [x, y, z] = pData;
          return `${strikeType === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)' : '行权价(%)'}: ${
            strikeType === STRIKE_TYPE_ENUM.STRIKE ? formatNumber(x, 2) : formatNumber(x * 100, 2)
          }<br/>期限(天): ${y}<br/>波动率(%): ${formatNumber(z * 100, 2)}`;
        },
      },
      visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
          color: ['#dbdcd7', '#C66E8F', '#AF2961', '#3E083F', '#26083c'],
        },
      },
      xAxis3D: {
        type: 'value',
        name: `${strikeType === STRIKE_TYPE_ENUM.STRIKE ? '行权价(￥)' : '行权价(%)'}`,
        nameTextStyle: {
          fontSize: 14,
          lineHeight: 40,
        },
        axisLabel: {
          formatter: param => {
            if (strikeType === STRIKE_TYPE_ENUM.STRIKE) {
              return param;
            }
            return formatNumber(param * 100, 0);
          },
          fontSize: 14,
        },
        axisPointer: {
          label: {
            formatter: param => {
              if (strikeType === STRIKE_TYPE_ENUM.STRIKE) {
                return formatNumber(_.toNumber(_.replace(param, ',', '')), 2);
              }
              return formatNumber(param * 100, 2);
            },
          },
        },
      },
      yAxis3D: {
        type: 'value',
        name: '期限(天)',
        nameTextStyle: {
          fontSize: 14,
          lineHeight: 40,
        },
        axisPointer: {
          label: {
            formatter: param => formatNumber(_.toNumber(param), 2),
          },
        },
        axisLabel: {
          fontSize: 14,
        },
      },
      zAxis3D: {
        type: 'value',
        name: '波动率(%)',
        nameTextStyle: {
          fontSize: 14,
          lineHeight: 40,
        },
        axisLabel: {
          formatter: param => formatNumber(param * 100, 0),
          fontSize: 14,
        },
        axisPointer: {
          label: {
            formatter: param => formatNumber(param * 100, 2),
          },
        },
      },
      grid3D: {
        axisPointer: {
          lineStyle: {
            color: '#1692CD',
          },
        },
        axisTick: {
          length: 2,
        },
        axisLine: {
          lineStyle: {
            color: '#1692CD',
          },
        },
        splitLine: {
          show: false,
        },
        viewControl: {
          // projection: 'orthographic',
          distance: 250,
        },
        boxHeight: 100,
        boxWidth: 100,
        boxDepth: 100,
      },
      series: [
        {
          type: 'surface',
          wireframe: {
            show: false,
          },
          data: props.optionData,
        },
      ],
    });
  }, [props.optionData, props.strikeType, chart]);

  return <div id="main" style={{ width: '100%', height: 400 }}></div>;
};

export default Echarts3D;
