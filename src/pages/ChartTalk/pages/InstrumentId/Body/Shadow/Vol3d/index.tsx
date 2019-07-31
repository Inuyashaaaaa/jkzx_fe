import DataSet from '@antv/data-set';
import { Button, Col, DatePicker, Row, Select, Radio } from 'antd';
import { Axis, Chart, Geom, Tooltip, Legend } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import moment from 'moment';
import ChartTitle from '../../../containers/ChartTitle';
import ThemeDatePicker from '../../../containers/ThemeDatePicker';
import ThemeButton from '../../../containers/ThemeButton';
import { Loading } from '@/containers';
import PosCenter from '../../../containers/PosCenter';
import { delay } from '@/tools';
import { getInstrumentVolCone, getInstrumentRealizedVol } from '@/services/terminal';
import ThemeRadio from '../../../containers/ThemeRadio';

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

const STATUS = {
  CHART: 'chart',
  TABLE: 'table',
};

const Vol = props => {
  const { instrumentId } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30, 'd'), moment()]);
  const [status, setStatus] = useState(STATUS.CHART);

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
        instrumentId,
        start_date: dates[0].format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
        windows,
        percentiles: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
      }),
      getInstrumentRealizedVol({
        instrumentId,
        tradeDate: dates[1].format('YYYY-MM-DD'),
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
      <Row type="flex" justify="space-between" align="middle" style={{ padding: 17 }} gutter={12}>
        <Col>
          <ThemeRadio.Group
            size="small"
            value={status}
            onChange={event => {
              setStatus(event.target.value);
            }}
          >
            <ThemeRadio.Button value={STATUS.CHART}>
              <img
                style={{ width: 12 }}
                src={
                  status === STATUS.CHART
                    ? // eslint-disable-next-line
                      require('../../../assets/chart.png')
                    : // eslint-disable-next-line
                      require('../../../assets/chart2.png')
                }
                alt=""
              />
            </ThemeRadio.Button>
            <ThemeRadio.Button value={STATUS.TABLE}>
              <img
                style={{ width: 12 }}
                src={
                  status === STATUS.TABLE
                    ? // eslint-disable-next-line
                      require('../../../assets/table.png')
                    : // eslint-disable-next-line
                      require('../../../assets/table2.png')
                }
                alt=""
              />
            </ThemeRadio.Button>
          </ThemeRadio.Group>
        </Col>
        <Col>
          <Row type="flex" justify="space-between" align="middle" gutter={12}>
            <Col>
              <ThemeDatePicker
                onChange={pDates => setDates(pDates)}
                // value={dates}
                allowClear={false}
              ></ThemeDatePicker>
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
        </Col>
      </Row>
      <ChartTitle>波动率锥</ChartTitle>
      <Row type="flex" justify="start" style={{ padding: 17 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={630}
            padding={[40, 20, 40, 40]}
            width={750}
            data={meta.dv}
            scale={{
              window: {
                ticks: windows.map(item => _.toString(item)),
                alias: '窗口',
                type: 'cat',
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
              name="window"
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
                  fontSize: '12',
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
                  fontSize: '12',
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
                  value,
                }),
              ]}
              size={3}
              type="line"
              position="window*value"
              color={['percentile', percentile => colorMap[percentile]]}
              opacity={0.85}
              shape="smooth"
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
            />
          </Chart>
        ) : (
          <PosCenter>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
};

export default memo(
  connect(state => ({
    instrumentId: state.chartTalkModel.instrumentId,
  }))(Vol),
);
