/* eslint-disable no-param-reassign */
import DataSet from '@antv/data-set';
import { Row } from 'antd';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import _ from 'lodash';
import { connect } from 'dva';
import React, { memo, useEffect, useRef, useState } from 'react';

import { Loading } from '@/containers';
import PosCenter from '@/containers/PosCenter';

const BoxFigure = props => {
  const [meta, setMeta] = useState(null);
  const [max, setMax] = useState(0);
  const { loading, dispatch } = props;

  const setLoading = data => {
    dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        loading: data,
      },
    });
  };

  const fetch = async data => {
    const newData = _.slice(_.reverse(_.sortBy(data, 'notionalAmount'), 0, 9));

    const dvData = newData.map((item, index) => ({
      key: index,
      x: item.legalEntityName,
      low: item.minVol,
      high: item.maxVol,
      outliers: [item.meanVol],
      median: item.medianVol,
      q1: item.oneQuaterVol,
      q3: item.threeQuaterVol,
    }));
    const dv = new DataSet.View().source(dvData);

    dv.transform({
      type: 'map',
      callback: obj => {
        obj.range = [obj.low, obj.q1, obj.median, obj.q3, obj.high];
        return obj;
      },
    });

    setMax(_.max(data.map(item => item.maxVol)));
    setLoading(false);
    setMeta({
      dv,
      data: dvData,
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
    fetch(props.volReport);
  }, [props.volReport]);

  return (
    <>
      <Row type="flex" justify="start" style={{ margin: 0 }} gutter={12}>
        {meta ? (
          <Chart
            data={meta.dv}
            scale={{
              range: {
                min: 0,
                max,
              },
              outliers: {
                min: 0,
                max,
              },
            }}
            width={1480}
            height={466}
            padding={[50, 60, 95, 40]}
            forceFit
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
            <Axis visible={false} grid={false} name="outliers" label={false} />
            <Tooltip
              shared={false}
              crosshairs={{
                type: 'rect',
                style: {
                  stroke: '#00BAFF',
                },
              }}
              itemTpl='
              <li data-index={index} style="margin-bottom:4px;">
                <span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/>
                <span style="padding-left: 16px">最大值：{high}</span><br/>
                <span style="padding-left: 16px">上四分位数：{q3}</span><br/>
                <span style="padding-left: 16px">中位数：{median}</span><br/>
                <span style="padding-left: 16px">平均数：{outlier}</span><br/>
                <span style="padding-left: 16px">下四分位数：{q1}</span><br/>
                <span style="padding-left: 16px">最小值：{low}</span><br/>
              </li>'
            />
            <Geom
              type="schema"
              position="x*range"
              shape="box"
              opacity={0.9}
              color={['key', key => getColor(key)]}
              tooltip={[
                'x*low*q1*median*outliers*q3*high',
                (x, low, q1, median, outliers, q3, high) => ({
                  name: x,
                  low,
                  q1,
                  median,
                  outlier: outliers[0],
                  q3,
                  high,
                }),
              ]}
              style={[
                'key',
                {
                  stroke: key => getColor(key),
                  fill: key => getColor(key),
                  fillOpacity: () => 1,
                },
              ]}
            />
            <Geom
              type="point"
              position="x*outliers"
              shape="circle"
              size={3}
              color="#00e8e8"
              tooltip={false}
              active={false}
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
    volReport: state.centerUnderlying.volReport,
    loading: state.centerUnderlying.loading,
  }))(BoxFigure),
);
