import DataSet from '@antv/data-set';
import { Button, Col, DatePicker, Row, Select } from 'antd';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'dva';
import FormItem from 'antd/lib/form/FormItem';
import ChartTitle from '@/containers/ChartTitle';
import ThemeSelect from '@/containers/ThemeSelect';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import ThemeButton from '@/containers/ThemeButton';
import { Loading } from '@/containers';
import { delay, formatNumber } from '@/tools';
import PosCenter from '@/containers/PosCenter';
import { getInstrumentRollingVol } from '@/services/terminal';
import FormItemWrapper from '@/containers/FormItemWrapper';

const Rollong = props => {
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30 * 6, 'd'), moment()]);
  const [window, setWindow] = useState('22');

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
    const rsp = await getInstrumentRollingVol({
      instrumentId: props.instrumentId,
      startDate: dates[0].format('YYYY-MM-DD'),
      endDate: dates[1].format('YYYY-MM-DD'),
      window: _.toNumber(window),
      isPrimary: true,
    });
    if (rsp.error) {
      setLoading(false);
      return;
    }

    const fdata = rsp.data.map(item => ({
      time: item.tradeDate,
      value: item.vol,
    }));

    const dv = new DataSet.View().source(fdata);

    // dv.transform({
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
    if (props.instrumentId) {
      fetch();
    }
  }, [props.instrumentId]);

  return (
    <>
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        <Col style={{ borderRight: '1px solid #05507b' }}>
          <FormItemWrapper>
            <FormItem label="日期" style={{ fontSize: 16 }}>
              <ThemeDatePickerRanger
                onChange={pDates => setDates(pDates)}
                value={dates}
                allowClear={false}
              ></ThemeDatePickerRanger>
            </FormItem>
          </FormItemWrapper>
        </Col>
        <Col>
          <FormItemWrapper>
            <FormItem label="窗口" style={{ fontSize: 16 }}>
              <ThemeSelect
                value={window}
                onChange={val => setWindow(val)}
                placeholder="窗口"
                style={{ minWidth: 200 }}
              >
                {[1, 3, 5, 10, 22, 44, 66, 132].map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </ThemeSelect>
            </FormItem>
          </FormItemWrapper>
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
      <ChartTitle>历史波动率时间序列</ChartTitle>
      <Row style={{ padding: 17 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={630}
            padding={[40, 20, 60, 40]}
            width={800}
            data={meta.dv}
            scale={{
              time: {
                type: 'timeCat',
                tickCount: 5,
                alias: '日期',
                mask: 'YYYY/MM/DD',
                range: [0, 0.95],
                fontSize: 16,
              },
              value: {
                alias: '波动率(%)',
                formatter: param => formatNumber(param * 100, 0),
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
                  fontSize: '14',
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
                offset: -30,
                position: 'end',
                textStyle: {
                  fontSize: '14',
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
              crosshairs={{
                type: 'y',
                style: {
                  stroke: '#00BAFF',
                },
              }}
            />
            <Geom
              type="area"
              position="time*value"
              color="l(100) 0:#FF0B194F 0.8:#0d2960 1:#0d2960"
              opacity={0.65}
              animate={{
                enter: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
                appear: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
                leave: {
                  animation: 'lineWidthOut', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 300, // 动画执行时间
                  delay: 100,
                },
                update: {
                  animation: 'fadeIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
              }}
              tooltip={[
                'value*time',
                (value, time) => ({
                  time,
                  value: formatNumber(value * 100, 2),
                }),
              ]}
            />
            <Geom
              size={4}
              type="line"
              position="time*value"
              color={meta.gradualColorStr}
              opacity={0.85}
              animate={{
                enter: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
                appear: {
                  animation: 'clipIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
                leave: {
                  animation: 'lineWidthOut', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 300, // 动画执行时间
                  delay: 100,
                },
                update: {
                  animation: 'fadeIn', // 动画名称
                  easing: 'easeQuadIn', // 动画缓动效果
                  duration: 450, // 动画执行时间
                  delay: 100,
                },
              }}
              tooltip={[
                'value*time',
                (value, time) => ({
                  time,
                  value: formatNumber(value * 100, 2),
                }),
              ]}
            />
          </Chart>
        ) : (
          <PosCenter height={500}>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.centerUnderlying.instrumentId,
  }))(Rollong),
);
