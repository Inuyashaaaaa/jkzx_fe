import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import _ from 'lodash';
import { Col, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import ThemeTabs from '@/containers/ThemeTabs';
import { Form2 } from '@/containers';
import MarketSize from './MarketSize';
import MarketStructure from './MarketStructure/index';
import MarketConcentration from './MarketConcentration';
import Linkage from './Linkage/index';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { refTradeDateByOffsetGet } from '@/services/volatility';

const ThemeFormItemWrap = styled.div`
  label {
    font-size: 16px;
  }
`;

const { TabPane } = ThemeTabs;

const BigTitle = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const CenterOperationQuality = props => {
  const { dates, dispatch } = props;
  const [formData, setFormData] = useState(
    Form2.createFields({
      date: dates,
    }),
  );
  const $form = useRef<Form2>(null);

  const onFormChange = (propsData, changedFields, allFields) => {
    if (changedFields.date) {
      dispatch({
        type: 'centerDate/save',
        payload: {
          dates: _.get(changedFields, 'date.value'),
        },
      });
    }
    setFormData({
      ...formData,
      ...changedFields,
    });
  };

  useEffect(() => {
    if (Form2.getFieldValue(formData.date) === props.dates) return;
    setFormData(
      Form2.createFields({
        date: props.dates,
      }),
    );
  }, [props.dates]);

  return (
    <>
      <Row type="flex" justify="start" gutter={14} style={{ marginBottom: 30 }}>
        <Col>
          <BigTitle>市场运行质量</BigTitle>
        </Col>
        <Col>
          <Form2
            hideRequiredMark
            ref={node => {
              $form.current = node;
            }}
            dataSource={formData}
            onFieldsChange={onFormChange}
            columns={[
              {
                dataIndex: 'date',
                render: (val, record, index, { form }) => (
                  <ThemeFormItemWrap>
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [{ required: true, message: '日期范围必填' }],
                      })(
                        <ThemeDatePickerRanger
                          allowClear={false}
                          disabledDate={current => current && current > moment()}
                        ></ThemeDatePickerRanger>,
                      )}
                    </FormItem>
                  </ThemeFormItemWrap>
                ),
              },
            ]}
            layout="inline"
            footer={false}
            submitText="查询"
            resetable={false}
          ></Form2>
        </Col>
      </Row>
      <ThemeTabs defaultActiveKey="1" type="card" animated={false}>
        <TabPane tab="市场规模" key="1">
          <MarketSize formData={formData} />
        </TabPane>
        <TabPane tab="市场结构" key="2">
          <MarketStructure formData={formData} />
        </TabPane>
        <TabPane tab="市场集中度" key="3">
          <MarketConcentration formData={formData} />
        </TabPane>
        <TabPane tab="场内外联动" key="4">
          <Linkage formData={formData} />
        </TabPane>
      </ThemeTabs>
    </>
  );
};

export default memo(
  connect(state => ({
    dates: state.centerDate.dates,
  }))(CenterOperationQuality),
);
