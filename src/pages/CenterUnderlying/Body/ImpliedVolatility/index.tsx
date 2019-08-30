/*eslint-disable */
import { Col, Row, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useRef, useState } from 'react';
import Mock from 'mockjs';
import useLifecycles from 'react-use/lib/useLifecycles';
import moment from 'moment';
import { connect } from 'dva';
import { Chart, G2, Geom, Axis, Tooltip, Coord } from 'bizcharts';
import DataSet from '@antv/data-set';
import styled from 'styled-components';
import { IFormColDef } from '@/components/type';
import { Form2, Loading } from '@/containers';
import ThemeButton from '@/containers/ThemeButton';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import ThemeSelect from '@/containers/ThemeSelect';
import { delay, getMoment } from '@/tools';
import PosCenter from '@/containers/PosCenter';
import { getHistoricalAndNeutralVolList } from '@/services/terminal';
import { formatNumber } from '@/tools';

const FormItemWrapper = styled.div`
  .ant-form-item-label label {
    color: #f5faff;
  }
  .ant-row.ant-form-item {
    margin-bottom: 0;
  }
`;

const ImpliedVolatility = props => {
  const formRef = useRef<Form2>(null);
  const [formData, setFormData] = useState(
    Form2.createFields({
      valuationDate: [moment().subtract(2, 'years'), moment()],
      window: 22,
    }),
  );
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(false);

  const { instrumentIds } = props;

  const newData = dataSource.map(item => ({
    ...item,
    min: [item.minVol, item.neutralVol],
    max: [item.neutralVol, item.maxVol],
    middle: [item.neutralVol, item.neutralVol],
  }));

  const dv = new DataSet.View().source(newData);
  dv.transform({
    type: 'fold',
    fields: ['max', 'min'],
    key: 'name',
    value: 'vol',
  });

  const formatDate = data => ({
    startDate: getMoment(data.valuationDate[0]).format('YYYY-MM-DD'),
    endDate: getMoment(data.valuationDate[1]).format('YYYY-MM-DD'),
    window: data.window,
  });

  const onSearch = async () => {
    const rsp = await formRef.current.validate();
    if (rsp.error) return;
    const formatFormData = formatDate(Form2.getFieldsValue(formData));
    setLoading(true);

    const { data, error } = await getHistoricalAndNeutralVolList({
      instrumentIds,
      isPrimary: true,
      ...formatFormData,
    });
    setLoading(false);
    if (error) return;
    setDataSource(data.data);
    data.diagnostics.forEach(item => {
      if (item.type === 'ERROR') {
        message.error(item.message);
      }
    });
  };

  const onFormChange = (text, changedFields, allFields) => {
    setFormData({
      ...formData,
      ...changedFields,
    });
  };

  const FORM_CONTROLS: IFormColDef[] = [
    {
      title: '观察日期',
      dataIndex: 'valuationDate',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '观察日期是必填项',
              },
            ],
          })(<ThemeDatePickerRanger allowClear={false}></ThemeDatePickerRanger>)}
        </FormItem>
      ),
    },
    {
      title: '窗口',
      dataIndex: 'window',
      render: (val, record, index, { form }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '窗口是必填项',
              },
            ],
          })(
            <ThemeSelect
              style={{ minWidth: 200 }}
              options={[1, 3, 5, 10, 22, 44, 66, 132].map(item => ({
                label: item,
                value: item,
              }))}
            ></ThemeSelect>,
          )}
        </FormItem>
      ),
    },
  ];

  useLifecycles(() => {
    onSearch();
  });

  useEffect(() => {
    onSearch();
  }, [props.instrumentId]);

  return (
    <div style={{ border: '1px solid #05507b', padding: '15px 15px' }}>
      <Row type="flex" gutter={18}>
        <Col>
          <FormItemWrapper>
            <Form2
              hideRequiredMark
              ref={node => {
                formRef.current = node;
              }}
              dataSource={formData}
              onFieldsChange={onFormChange}
              columns={FORM_CONTROLS}
              layout="inline"
              footer={false}
            ></Form2>
          </FormItemWrapper>
        </Col>
        <Col>
          <ThemeButton
            onClick={() => {
              setMeta(true);
              onSearch();
            }}
            type="primary"
            style={{ marginTop: '4px' }}
            loading={meta && loading}
          >
            确定
          </ThemeButton>
        </Col>
      </Row>
      <Row style={{ margin: 0 }} gutter={12}>
        {dataSource.length ? (
          <Chart
            width={1450}
            height={600}
            padding={[50, 60, 95, 90]}
            forceFit
            data={dv}
            scale={{
              instrumentId: {
                alias: '标的物品种',
                type: 'cat',
                ...(dataSource.length < 10 ? { range: [0.08, dataSource.length * 0.1] } : {}),
              },
              vol: {
                alias: '波动率(%)',
                min: 0,
                max: 2,
                tickCount: 5,
                formatter: val => formatNumber(_.toNumber(val) * 100, 0),
              },
              middle: { min: 0, max: 2 },
            }}
          >
            <Axis
              name="instrumentId"
              title={{
                position: 'end',
                offset: 0,
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
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
              tickLine={null}
              line={{
                stroke: '#00BAFF',
                lineWidth: 1,
                lineDash: [0],
                opacity: '0.1',
              }}
            ></Axis>
            <Axis
              name="vol"
              label={{
                textStyle: {
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                },
                offset: 10,
              }}
              title={{
                offset: -20,
                textStyle: {
                  rotate: 0,
                  fontSize: '12',
                  fontWeight: '400',
                  opacity: '0.6',
                  fill: '#F6FAFF',
                },
                position: 'end',
              }}
              grid={{
                type: 'line',
                lineStyle: {
                  stroke: '#00baff1a',
                  lineWidth: 1,
                  lineDash: [0],
                },
              }}
            ></Axis>
            <Axis name="middle" grid={null} label={false}></Axis>
            <Tooltip
              useHtml
              crosshairs={{
                type: 'rect',
                style: {
                  stroke: '#00BAFF',
                },
              }}
              shared={false}
              itemTpl={
                '<li data-index={index} style="margin-bottom:4px;"><span style="padding-left: 16px">最大值：{maxVol}</span><br/><span style="padding-left: 16px">最小值：{minVol}</span><br/><span style="padding-left: 16px">公允波动率点：{neutralVol}</span></li>'
              }
            ></Tooltip>
            <Geom
              type="interval"
              size={[
                'instrumentId',
                instrumentId => {
                  if (dataSource.length < 10) {
                    return 80;
                  }
                  return;
                },
              ]}
              position="instrumentId*vol"
              tooltip={[
                'min*max*minVol*maxVol*neutralVol',
                (min, max, minVol, maxVol, neutralVol) => ({
                  min: formatNumber(min * 100, 2),
                  max: formatNumber(max * 100, 2),
                  minVol: formatNumber(minVol * 100, 2),
                  maxVol: formatNumber(maxVol * 100, 2),
                  neutralVol: formatNumber(neutralVol * 100, 2),
                }),
              ]}
              color={['name', val => (val === 'max' ? '#F15345' : '#7070D3')]}
            ></Geom>
            <Geom
              type="interval"
              size={[
                'instrumentId',
                instrumentId => {
                  if (dataSource.length < 10) {
                    return 80;
                  }
                  return;
                },
              ]}
              position="instrumentId*middle"
              tooltip={false}
              style={{
                lineWidth: 2,
                stroke: '#E7B677',
              }}
            ></Geom>
          </Chart>
        ) : (
          <PosCenter height={500}>
            <Loading loading={loading}></Loading>
          </PosCenter>
        )}
      </Row>
    </div>
  );
};

export default memo(
  connect(({ centerUnderlying }) => ({
    instrumentIds: centerUnderlying.instrumentIds,
  }))(ImpliedVolatility),
);
