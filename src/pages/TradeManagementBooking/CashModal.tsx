import { RULES_REQUIRED } from '@/constants/common';
import { Form2, Input, Select } from '@/design/components';
import { Tabs } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useRef, useState } from 'react';

const CashModal = memo<any>(props => {
  const { record, current } = props;

  const [activeKey, setActiveKey] = useState('our');
  const ourFormEl = useRef<Form2>(null);
  const toOurFormEl = useRef<Form2>(null);

  const [ourFormData, setOurFormData] = useState(
    Form2.createFields({
      legalName: record.legalName,
      tradeId: record.tradeId,
      cashFlow: record.cashFlow,
    })
  );

  const [toOutFormData, setToOutFormData] = useState(
    Form2.createFields({
      legalName: record.legalName,
      tradeId: record.tradeId,
      counterPartyFundChange: record.cashFlow,
      counterPartyCreditBalanceChange: 0,
      counterPartyCreditChange: 0,
      counterPartyMarginChange: 0,
    })
  );

  current.ourFormEl = ourFormEl;
  current.toOurFormEl = toOurFormEl;
  current.ourFormData = ourFormData;
  current.toOutFormData = toOutFormData;
  current.activeKey = activeKey;

  return (
    <Tabs activeKey={activeKey} onChange={activeKey => setActiveKey(activeKey)}>
      <Tabs.TabPane tab="客户资金变动" key="our">
        <Form2
          ref={node => (ourFormEl.current = node)}
          dataSource={ourFormData}
          columns={[
            {
              title: '客户名称',
              dataIndex: 'legalName',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '资金类型',
              dataIndex: 'cashType',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: RULES_REQUIRED,
                    })(
                      <Select
                        {...{
                          options: [
                            {
                              label: '期权费扣除',
                              value: '期权费扣除',
                            },
                            {
                              label: '期权费收入',
                              value: '期权费收入',
                            },
                            {
                              label: '授信扣除',
                              value: '授信扣除',
                            },
                            {
                              label: '授信恢复',
                              value: '授信恢复',
                            },
                            {
                              label: '保证金冻结',
                              value: '保证金冻结',
                            },
                            {
                              label: '保证金释放',
                              value: '保证金释放',
                            },
                          ],
                        }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
            {
              title: '交易ID',
              dataIndex: 'tradeId',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '金额',
              dataIndex: 'cashFlow',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
          ]}
          onFieldsChange={(props, changedFields, allFields) => {
            setOurFormData(allFields);
          }}
          columnNumberOneRow={1}
          footer={false}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="我方资金变动" key="toOur">
        <Form2
          ref={node => (toOurFormEl.current = node)}
          dataSource={toOutFormData}
          columns={[
            {
              title: '客户名称',
              dataIndex: 'legalName',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易ID',
              dataIndex: 'tradeId',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '可用资金变化',
              dataIndex: 'counterPartyFundChange',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '剩余授信总额变化',
              dataIndex: 'counterPartyCreditBalanceChange',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '授信总额变化',
              dataIndex: 'counterPartyCreditChange',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
            {
              title: '冻结保证金变化',
              dataIndex: 'counterPartyMarginChange',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}
                  </FormItem>
                );
              },
            },
          ]}
          onFieldsChange={(props, changedFields, allFields) => {
            setToOutFormData(allFields);
          }}
          columnNumberOneRow={1}
          footer={false}
        />
      </Tabs.TabPane>
    </Tabs>
  );
});

export default CashModal;
