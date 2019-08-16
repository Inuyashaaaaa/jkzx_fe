/*eslint-disable */
import React, { memo, useState } from 'react';
import { Row } from 'antd';
import { Chart, G2, Geom, Axis, Tooltip, Coord } from 'bizcharts';
import DataSet from '@antv/data-set';

const VolSurfaceCompare = memo(props => {
  const data1 = [
    {
      name: 'max',
      '000300.SH': [0.5, 0.8],
      'AU9999.SGE': [0.5, 0.7],
      '000905.SH': [0.5, 0.6],
      '510050.SH': [0.4, 0.5],
      '000001.SH': [0.5, 0.8],
      'A2001.DCE': [0.5, 0.6],
      'AU999.SGE': [0.5, 0.7],
      '000915.SH': [0.5, 0.9],
    },
    {
      name: 'min',
      '000300.SH': [0.2, 0.5],
      'AU9999.SGE': [0.4, 0.5],
      '000905.SH': [0.1, 0.5],
      '510050.SH': [0.2, 0.5],
      '000001.SH': [0.4, 0.5],
      'A2001.DCE': [0.1, 0.5],
      'AU999.SGE': [0.3, 0.5],
      '000915.SH': [0.2, 0.5],
    },
  ];

  const dv1 = new DataSet.View().source(data1);
  dv1.transform({
    type: 'fold',
    key: 'underlyer',
    value: 'vol',
    fields: [
      '000300.SH',
      'AU9999.SGE',
      '000905.SH',
      '510050.SH',
      '000001.SH',
      'A2001.DCE',
      'AU999.SGE',
      '000915.SH',
    ],
  });

  return (
    <>
      <Row type="flex" justify="start" style={{ margin: 0 }} gutter={12}>
        <Chart
          width={1450}
          height={600}
          forceFit
          data={dv1}
          scale={{ underlyer: { alias: '标的物品种' }, vol: { alias: '波动率' } }}
        >
          <Axis
            name="underlyer"
            title={{
              position: 'end',
              offset: 0,
              textStyle: {
                paddingLeft: 20,
              },
            }}
            grid={null}
            label={{
              textStyle: {
                fontSize: '14',
                fill: 'white',
                lineHeight: '32px',
                fontWeight: '400',
              },
            }}
            tickLine={null}
          ></Axis>
          <Axis
            name="vol"
            grid={null}
            label={false}
            title={{
              position: 'end',
              offset: 0,
              autoRotate: false,
            }}
          ></Axis>
          <Tooltip></Tooltip>
          <Geom
            type="intervalStack"
            position="underlyer*vol"
            color={[
              'name',
              val => {
                if (val === 'max') {
                  return '#F15345';
                }
                if (val === 'min') {
                  return '#7070D3';
                }
                return;
              },
            ]}
          ></Geom>
        </Chart>
      </Row>
    </>
  );
});

export default VolSurfaceCompare;
