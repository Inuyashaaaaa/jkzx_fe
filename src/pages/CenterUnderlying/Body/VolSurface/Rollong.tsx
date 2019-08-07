/* eslint-disable no-param-reassign */
import DataSet from '@antv/data-set';
import { Row } from 'antd';
import { Axis, Chart, Geom, Tooltip, View, Legend } from 'bizcharts';
import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';

const Rollong = props => {
  const { instrumentId } = props;
  const chartRef = useRef(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([moment().subtract(30, 'd'), moment()]);
  const [window, setWindow] = useState('22');

  const fetch = async () => {
    setLoading(true);
    // const rsp = await getInstrumentRollingVol({
    //   instrumentId,
    //   startDate: dates[0].format('YYYY-MM-DD'),
    //   endDate: dates[1].format('YYYY-MM-DD'),
    //   window: _.toNumber(window),
    // });
    // if (rsp.error) {
    //   setLoading(false);
    //   return;
    // }

    // const fdata = rsp.data.map(item => ({
    //   time: item.tradeDate,
    //   value: item.vol,
    // }));
    const fdata = [
      {
        x: '职业 A',
        low: 20,
        q1: 26,
        median: 27,
        q3: 32,
        high: 38,
        outliers: [50, 52],
      },
      {
        x: '职业 B',
        low: 40,
        q1: 49,
        median: 62,
        q3: 73,
        high: 88,
        outliers: [32, 29, 106],
      },
      {
        x: '职业 C',
        low: 52,
        q1: 59,
        median: 65,
        q3: 74,
        high: 83,
        outliers: [91],
      },
      {
        x: '职业 D',
        low: 58,
        q1: 96,
        median: 130,
        q3: 70,
        high: 100,
        outliers: [42, 210, 215],
      },
      {
        x: '职业 E',
        low: 24,
        q1: 28,
        median: 32,
        q3: 38,
        high: 42,
        outliers: [48],
      },
      {
        x: '职业 F',
        low: 47,
        q1: 56,
        median: 69,
        q3: 85,
        high: 100,
        outliers: [67, 99, 32],
      },
      {
        x: '职业 G',
        low: 64,
        q1: 74,
        median: 83,
        q3: 93,
        high: 100,
        outliers: [11],
      },
      {
        x: '职业 H',
        low: 67,
        q1: 72,
        median: 84,
        q3: 95,
        high: 110,
        outliers: [57, 54],
      },
      {
        x: '职业 I',
        low: 23,
        q1: 72,
        median: 55,
        q3: 45,
        high: 90,
        outliers: [96, 54],
      },
      {
        x: '职业 J',
        low: 67,
        q1: 72,
        median: 84,
        q3: 95,
        high: 110,
        outliers: [57, 54],
      },
    ];

    const sortData = fdata.map((item, index) => ({
      ...item,
      key: index,
    }));

    const dv = new DataSet.View().source(sortData);

    dv.transform({
      type: 'map',
      callback: obj => {
        obj.range = [obj.low, obj.q1, obj.median, obj.q3, obj.high];
        return obj;
      },
    });

    setLoading(false);
    setMeta({
      dv,
      data: sortData,
    });
  };

  const getColor = key => {
    const range = [
      '#5C255C ',
      '#792A62',
      '#AF4D85',
      '#A84075',
      '#BB5081',
      '#CA6290',
      '#D676A1',
      '#DE8CB4',
      '#E2A2CA',
      '#E1BAE1',
    ];
    return range[_.floor((key / _.get(meta, 'data.length')) * 10)];
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Row type="flex" justify="start" style={{ paddingBottom: 17, margin: 0 }} gutter={12}>
        {meta ? (
          <Chart
            data={meta.dv}
            scale={{
              range: {
                min: 0,
                max: 100,
              },
              outliers: {
                min: 0,
                max: 100,
              },
            }}
            width={1480}
            height={466}
            padding={[50, 60, 95, 100]}
            forceFit
            background={{
              stroke: '#00E8E8',
            }}
          >
            <Axis
              name="x"
              label={{
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                  textBaseline: 'top',
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
              name="range"
              label={{
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
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
              crosshairs={{
                type: 'rect',
                style: {
                  stroke: '#00BAFF',
                },
              }}
              itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/><span style="padding-left: 16px">最大值：{high}</span><br/><span style="padding-left: 16px">上四分位数：{q3}</span><br/><span style="padding-left: 16px">中位数：{median}</span><br/><span style="padding-left: 16px">下四分位数：{q1}</span><br/><span style="padding-left: 16px">最小值：{low}</span><br/></li>'
            />

            <Geom
              type="schema"
              position="x*range"
              shape="box"
              opacity={0.65}
              color={['key', key => getColor(key)]}
              tooltip={[
                'x*low*q1*median*q3*high',
                (x, low, q1, median, q3, high) => ({
                  name: x,
                  low,
                  q1,
                  median,
                  q3,
                  high,
                }),
              ]}
              style={[
                'key',
                {
                  stroke: key => getColor(key),
                  fill: key => getColor(key),
                  fillOpacity: () => 0.9,
                },
              ]}
            />
            <View data={meta.data}>
              <Geom
                type="point"
                position="x*outliers"
                shape="circle"
                size={3}
                color={['key', key => getColor(key)]}
                active={false}
              />
            </View>
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
