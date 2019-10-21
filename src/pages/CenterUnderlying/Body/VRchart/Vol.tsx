import DataSet from '@antv/data-set';
import { Button, Col, DatePicker, Row, Select } from 'antd';
import { Axis, Chart, Geom, Tooltip, Legend } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import moment from 'moment';
import FormItem from 'antd/lib/form/FormItem';
import ChartTitle from '@/containers/ChartTitle';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import ThemeButton from '@/containers/ThemeButton';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import { delay, formatNumber } from '@/tools';
import { getInstrumentVolCone, getInstrumentRealizedVol } from '@/services/terminal';

import FormItemWrapper from '@/containers/FormItemWrapper';

const LATEST_PER = 'latest';

const colorMap = {
  0: 'l(100) 0:#0FB299 0.2:#52D0CC 1:#52D0CC',
  10: 'l(100) 0:#0F14CA 0.2:#494DE8 1:#494DE8',
  25: 'l(100) 0:#7715C3 0.2:#AD5AEE 1:#AD5AEE',
  50: 'l(100) 0:#9D60E2 0.2:#BE8AF9 1:#BE8AF9',
  75: 'l(100) 0:#8E1F7B 0.2:#C516B3 1:#C516B3',
  90: 'l(100) 0:#AC1212 0.2:#D33C3C 1:#D33C3C',
  100: 'l(100) 0:#FF4200 0.2:#FFC000 1:#FFC000',
  [LATEST_PER]: 'l(100) 0:#BFBFBF 0.2:#EFEFEF 1:#EFEFEF',
};

const lengedMap = {
  0: 'Min',
  10: '10分位',
  25: '25分位',
  50: '50分位',
  75: '75分位',
  90: '90分位',
  100: 'Max',
  [LATEST_PER]: 'Latest Vol',
};

const windows = [1, 3, 5, 10, 22, 44, 66, 132];

const Vol = props => {
  const { instrumentId } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30 * 6, 'd'), moment()]);

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
    const [rsp, realRsp] = await Promise.all([
      getInstrumentVolCone({
        instrumentId: props.instrumentId,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
        windows,
        percentiles: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
        isPrimary: true,
      }),
      getInstrumentRealizedVol({
        instrumentId: props.instrumentId,
        tradeDate: dates[1].format('YYYY-MM-DD'),
        isPrimary: true,
      }),
    ]);
    if (rsp.error) {
      setLoading(false);
      return;
    }

    let fdata = _.flatten(
      rsp.data.map(item =>
        item.vols.map(iitem => ({
          percentile: _.toString(iitem.percentile),
          window: _.toString(item.window),
          value: iitem.vol,
          pname: lengedMap[iitem.percentile],
        })),
      ),
    );

    if (!realRsp.error) {
      fdata = fdata.concat(
        realRsp.data.map(item => ({
          percentile: LATEST_PER,
          window: _.toString(item.window),
          value: item.vol,
          pname: lengedMap[LATEST_PER],
        })),
      );
    }

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
    if (props.instrumentId) {
      fetch();
    }
  }, [props.instrumentId]);

  return (
    <>
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        <Col>
          <FormItemWrapper>
            <FormItem label="日期" style={{ display: 'flex', fontSize: 16 }}>
              <ThemeDatePickerRanger
                onChange={pDates => setDates(pDates)}
                value={dates}
                allowClear={false}
                disabledDate={current => current && current > moment().endOf('day')}
              ></ThemeDatePickerRanger>
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
      <ChartTitle>波动率锥</ChartTitle>
      <Row style={{ padding: 17 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={610}
            // padding={[40, 20, 60, 40]}
            padding={[80, 20, 40, 40]}
            width={800}
            data={meta.dv}
            scale={{
              window: {
                ticks: _.chain(meta.dv.origin)
                  .map(item => Number(item.window))
                  .union()
                  .sort((a, b) => a - b)
                  .map(item => String(item))
                  .value(),
                alias: '窗口',
                type: 'cat',
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
              name="window"
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
              tooltip={[
                'pname*value',
                (name, value) => ({
                  name,
                  value: formatNumber(value * 100, 2),
                }),
              ]}
              size={3}
              type="line"
              position="window*value"
              color={['percentile', percentile => colorMap[percentile]]}
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
            />
            <Legend
              position="top-left"
              offsetY={-12}
              offsetX={-3}
              itemFormatter={val => lengedMap[val]}
              clickable={false}
              textStyle={{
                fontSize: '14',
              }}
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
  }))(Vol),
);
