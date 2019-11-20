import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
import ThemeTabs from '@/containers/ThemeTabs';
import { Form2 } from '@/containers';
import InfectionRisk from './InfectionRisk';
import ControlRisk from './ControlRisk';
import PositionProportion from './PositionProportion';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { refTradeDateByOffsetGet } from '@/services/volatility';

const { TabPane } = ThemeTabs;

const ThemeFormItemWrap = styled.div`
  label {
    font-size: 16px;
  }
`;

const BigTitle = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;
const CenterRiskMonitoring = props => {
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
          <BigTitle>风险监测 </BigTitle>
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
        <TabPane tab="操纵风险" key="1">
          <ControlRisk formData={formData} />
        </TabPane>
        <TabPane tab="子公司传染风险" key="2">
          <InfectionRisk formData={formData} />
        </TabPane>
        <TabPane tab="对手方场内外合并持仓占比" key="3">
          <PositionProportion formData={formData} />
        </TabPane>
      </ThemeTabs>
    </>
  );
};

export default memo(
  connect(state => ({
    dates: state.centerDate.dates,
  }))(CenterRiskMonitoring),
);
