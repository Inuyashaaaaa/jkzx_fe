import DataSet from '@antv/data-set';
import { Col, Row, Select } from 'antd';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import { getInstrumentRollingVol } from '@/services/terminal';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';
import ThemeSelect from '@/containers/ThemeSelect';
import { STRIKE_TYPE_ENUM } from '@/constants/global';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const TopChart = props => {
  const { instrumentId, loading, data, fetchStrikeType } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [window, setWindow] = useState();
  const [options, setOptions] = useState([]);

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

  const fetchMeta = async () => {
    if (_.isEmpty(data)) return;
    const { modelInfo = {} } = data;
    const { instruments = [] } = modelInfo;
    const tenors = _.map(instruments, item => item.tenor);

    const allData = _.flatten(
      instruments.map(item => {
        const { vols = [], tenor } = item;
        return vols.map(iitem => {
          const { strike, percent, quote } = iitem;
          return {
            value: quote,
            time: Number(tenor.replace('D', '')),
            strike,
            percent,
          };
        });
      }),
    );

    const fdata = _.filter(allData, item => {
      const field = fetchStrikeType === STRIKE_TYPE_ENUM.STRIKE ? 'strike' : 'percent';
      return window === item[field];
    });

    const dv = new DataSet.View().source(fdata);

    const gradualColorStr = generateGradualColorStr(dv);

    setMeta({
      gradualColorStr,
      dv,
      tenors,
    });
  };

  const fetchOption = () => {
    const { modelInfo = {} } = data;
    const { instruments = [] } = modelInfo;

    const allData = _.flatten(
      instruments.map(item => {
        const { vols = [], tenor } = item;
        return vols.map(iitem => {
          const { strike, percent, quote } = iitem;
          return {
            value: quote,
            time: Number(tenor.replace('D', '')),
            strike,
            percent,
          };
        });
      }),
    );

    const pOptions = _.union(
      allData.map(item => {
        const field = fetchStrikeType === STRIKE_TYPE_ENUM.STRIKE ? 'strike' : 'percent';
        return item[field];
      }),
    );

    setOptions(pOptions);
  };

  const fetchWindow = () => {
    setWindow(_.first(options));
  };

  useEffect(() => {
    fetchOption();
  }, [data]);

  useEffect(() => {
    fetchWindow();
  }, [options]);

  useEffect(() => {
    fetchMeta();
  }, [data, window]);

  return (
    <>
      <Row type="flex" justify="end" style={{ padding: 17, paddingBottom: 0 }} gutter={12}>
        <Col>
          <FormItemWrapper>
            <FormItem
              label={fetchStrikeType === STRIKE_TYPE_ENUM.STRIKE ? 'strike' : 'strike_percentage'}
              style={{ display: 'flex' }}
            >
              <ThemeSelect
                value={window}
                onChange={val => {
                  setWindow(val);
                }}
                placeholder="strike"
                style={{ minWidth: 200 }}
              >
                {options.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </ThemeSelect>
            </FormItem>
          </FormItemWrapper>
        </Col>
      </Row>
      <Row type="flex" justify="start" style={{ padding: 17, paddingTop: 0 }} gutter={12}>
        {meta ? (
          <Chart
            animate
            forceFit
            height={315}
            padding={[40, 20, 40, 40]}
            width={800}
            data={meta.dv}
            scale={{
              time: {
                alias: '期限',
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
          <PosCenter height={315}>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </>
  );
};

export default memo(
  connect(state => ({
    loading: state.centerUnderlying.loading,
    data: state.centerUnderlying.data,
    fetchStrikeType: state.centerUnderlying.fetchStrikeType,
  }))(TopChart),
);
