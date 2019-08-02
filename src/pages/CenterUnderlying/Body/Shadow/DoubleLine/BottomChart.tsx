import DataSet from '@antv/data-set';
import { Col, Row, Select } from 'antd';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import { getInstrumentRollingVol } from '@/services/terminal';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import ThemeSelect from '@/containers/ThemeSelect';

const BottomChart = props => {
  const { instrumentId } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30, 'd'), moment()]);
  const [window, setWindow] = useState('22');

  const generateGradualColorStr = fdv => {
    const { rows } = fdv;
    const values = rows.map(item => item.value);
    const min = _.min<number>(values);
    const max = _.max<number>(values);
    const color = scaleLinear<string, number>()
      .domain([min, (max - min) / 2 + min, max])
      .range(['#dbdcd7', '#bc4876', '#a81e59', '#630842', '#26083c'])
      .clamp(true);
    const colorStrs = rows
      .map((item, index) => `${item.value / max}:${color(item.value)}`)
      .join(' ');
    return `l(270) ${colorStrs}`;
  };

  const fetch = async () => {
    setLoading(true);
    const rsp = await getInstrumentRollingVol({
      instrumentId,
      startDate: dates[0].format('YYYY-MM-DD'),
      endDate: dates[1].format('YYYY-MM-DD'),
      window: _.toNumber(window),
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
    fetch();
  }, []);

  return (
    <>
      <Row type="flex" justify="end" style={{ padding: 17, paddingBottom: 0 }} gutter={12}>
        <Col>
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
        </Col>
      </Row>
      <Row type="flex" justify="start" style={{ padding: 17, paddingTop: 0 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={315}
            padding={[40, 20, 40, 40]}
            width={750}
            data={meta.dv}
            scale={{
              time: {
                type: 'timeCat',
                tickCount: 5,
                alias: '日期',
                mask: 'YYYY/MM/DD',
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
              shared={false}
              position="value"
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
              color="l(0) 0:#dbdcd740 0.3:#bc487640 0.5:#a81e5940 0.8:#63084240 1:26083c40"
              opacity={0.65}
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
            <Geom
              size={4}
              type="line"
              position="time*value"
              color={meta.gradualColorStr}
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
  }))(BottomChart),
);
