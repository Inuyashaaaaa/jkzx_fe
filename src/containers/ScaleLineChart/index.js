import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import FormPlus from '@/components/_FormPlus';
import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';

class ScaleLineChart extends PureComponent {
  state = {
    formData: {
      type: 'linear',
    },
  };

  getExtraFields = type => {
    if (type === 'linear') {
      return [];
    }
    if (type === 'pow') {
      return {
        dataIndex: 'exponent',
        label: '指数',
        ...INPUT_NUMBER_DIGITAL_CONFIG,
      };
    }
    if (type === 'log') {
      return {
        dataIndex: 'base',
        label: '底数',
        ...INPUT_NUMBER_DIGITAL_CONFIG,
      };
    }
  };

  render() {
    const { tableDataSource } = this.props;
    const { formData } = this.state;
    const cols = {
      quote: {
        type: formData.type,
        exponent: formData.exponent,
        base: formData.base,
      },
    };

    return (
      <>
        <FormPlus
          {...{
            style: { marginBottom: 20 },
            cellNumberOneRow: 1,
            footer: false,
            dataSource: formData,
            onChange: ({ values }) =>
              this.setState({
                formData: values,
              }),
            items: [
              {
                dataIndex: 'type',
                label: '插值类型',
                type: 'select',
                options: [
                  {
                    name: 'log',
                    value: 'log',
                  },
                  {
                    name: 'pow',
                    value: 'pow',
                  },
                  {
                    name: 'linear',
                    value: 'linear',
                  },
                ],
              },
            ].concat(this.getExtraFields(formData.type)),
          }}
        />
        <Chart height={400} scale={cols} data={tableDataSource} forceFit>
          <Axis name="tenor" />
          <Axis name="quote" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="tenor*quote" size={2} />
          <Geom
            type="point"
            position="tenor*quote"
            size={4}
            shape="circle"
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
        </Chart>
      </>
    );
  }
}

export default ScaleLineChart;
