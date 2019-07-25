import DataSet from '@antv/data-set';
import { Button, Col, DatePicker, Row, Select } from 'antd';
import { Axis, Chart, Geom, Tooltip, Legend } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ChartTitle from '../containers/ChartTitle';
import ThemeDatePickerRanger from '../containers/ThemeDatePickerRanger';
import ThemeButton from '../containers/ThemeButton';
import { Loading } from '@/containers';
import PosCenter from '../containers/PosCenter';
import { delay } from '@/tools';

const colorMap = {
  London: 'l(100) 0:#FF4200 0.2:#FFC000 1:#FFC000',
  Sini: 'l(100) 0:#AC1212 0.2:#D33C3C 1:#D33C3C',
  Wka: 'l(100) 0:#7715C3 0.2:#AD5AEE 1:#AD5AEE',
};

// #9D60E2, #BE8AF9
// #0F14CA, #494DE8
// #0FB299, #52D0CC

const Rollong = memo(props => {
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateGradualColorStr = fdv => {
    const { rows } = fdv;
    const values = rows.map(item => item.value);
    const min = _.min<number>(values);
    const max = _.max<number>(values);
    const color = scaleLinear<string, number>()
      .domain([min, (max - min) / 2 + min, max])
      .range(['#77A786', '#FF4200', '#FFC000'])
      .clamp(true);
    const colorStrs = rows
      .map((item, index) => `${item.value / max}:${color(item.value)}`)
      .join(' ');
    return `l(270) ${colorStrs}`;
  };

  const fetch = async () => {
    setLoading(true);
    await delay(2000);
    const fdata = [
      {
        time: '2009/1/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/3/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/4/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/5/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/6/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/7/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/8/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/9/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/10/12',
        value: _.round(Math.random() * 10, 0),
        type: 'London',
      },
      {
        time: '2009/1/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/3/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/4/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/5/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/6/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/7/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/8/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/9/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/10/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Sini',
      },
      {
        time: '2009/1/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/3/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/4/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/5/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/6/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/7/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/8/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/9/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
      {
        time: '2009/10/12',
        value: _.round(Math.random() * 10, 0),
        type: 'Wka',
      },
    ];

    const dv = new DataSet.View().source(fdata);

    // fdv.transform({
    //   type: 'sort',
    //   callback(a, b) {
    //     const time1 = new Date(a.time).getTime();
    //     const time2 = new Date(b.time).getTime();
    //     return time2 - time1;
    //   },
    // });

    const gradualColorStr = generateGradualColorStr(dv);
    setLoading(false);
    setMeta({
      gradualColorStr,
      dv,
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        <Col>
          <ThemeDatePickerRanger allowClear={false}></ThemeDatePickerRanger>
        </Col>
        <Col>
          <ThemeButton
            loading={meta && loading}
            onClick={() => {
              fetch();
            }}
            type="primary"
          >
            绘制
          </ThemeButton>
        </Col>
      </Row>
      <ChartTitle>波动率锥</ChartTitle>
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={610}
            padding={[40, 20, 40, 40]}
            width={750}
            data={meta.dv}
            scale={{
              time: {
                type: 'timeCat',
                tickCount: 8,
                alias: '日期',
              },
              value: {
                alias: '波动率',
              },
            }}
            onGetG2Instance={g2Chart => {
              // g2Chart.animate(false);
              chartRef.current = g2Chart;
            }}
          >
            <Axis
              name="time"
              title={{
                offset: 0,
                position: 'end',
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                  rotate: 0, // 文本旋转角度，以角度为单位，仅当 autoRotate 为 false 时生效
                },
              }}
              label={{
                textStyle: {
                  fontSize: '14',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                },
              }}
              line={{
                stroke: '#00BAFF',
                lineWidth: 1,
                lineDash: [0],
                opacity: '0.1',
              }}
              tickLine={null}
            />
            <Axis
              name="value"
              line={null}
              label={{
                textStyle: {
                  fontSize: '14',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                },
              }}
              title={{
                offset: -20,
                position: 'end',
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                  rotate: 0, // 文本旋转角度，以角度为单位，仅当 autoRotate 为 false 时生效
                },
              }}
              grid={{
                type: 'line',
                lineStyle: {
                  stroke: '#00baff1a',
                  lineWidth: 1,
                  lineDash: [0],
                },
              }}
            />
            <Tooltip
              position="value"
              crosshairs={{
                type: 'y',
                style: {
                  stroke: '#00BAFF',
                  opacity: '0.1',
                },
              }}
            />
            <Geom
              size={3}
              type="line"
              position="time*value"
              color={['type', type => colorMap[type]]}
              opacity={0.85}
              shape="smooth"
              animate={{
                enter: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                },
                appear: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                },
                leave: {
                  animation: 'lineWidthOut', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 300, // 动画执行时间
                },
                update: {
                  animation: 'fadeIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                },
              }}
            />
            <Legend position="top-left" offsetY={-12} offsetX={-3} />
          </Chart>
        ) : (
          <PosCenter>
            <Loading></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
});

export default Rollong;
