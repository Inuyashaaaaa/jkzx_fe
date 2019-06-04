import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { operation, symbol, RETURN_NUMBER } from './constants';
import { Button, Card, Tag, Col, Modal, message } from 'antd';
import { wkIndexList } from '@/services/approvalProcessConfiguration';
import uuidv4 from 'uuid/v4';
import GroupSelcet from './GroupSelcet';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE, TRIGGERTYPE } from '../constants';

const TriggerCard = memo<any>(props => {
  const { insertData } = props;

  let $form = useRef<Form2>(null);

  const [targetVisible, setTargetVisible] = useState(false);

  const showTargetModel = () => {
    setTargetVisible(true);
  };

  const handleTargetOk = () => {
    setTargetVisible(false);
  };

  const handleTargetCancel = () => {
    setTargetVisible(false);
  };

  const onFormChange = (props, changedFields, allFields, rowIndex) => {};

  return (
    <>
      <Card
        title="流程触发"
        style={{ marginTop: '10px' }}
        bordered={false}
        // extra={<a onClick={e => showTargetModel(e, _.get(insertData, '[0].taskId'))}>修改</a>}
        extra={<a onClick={showTargetModel}>修改</a>}
      >
        {(_.get(process, 'triggers') || []).map(item => {
          return (
            <Tag style={{ margin: 5 }} key={item.approveGroupId}>
              {item.triggerName}
            </Tag>
          );
        })}
      </Card>
      <Modal
        visible={targetVisible}
        width={520}
        title="选择触发器"
        onOk={handleTargetOk}
        onCancel={handleTargetCancel}
      >
        <Form2
          ref={node => ($form = node)}
          layout="horizontal"
          footer={false}
          dataSource={[]}
          wrapperCol={{ span: 16 }}
          labelCol={{ span: 8 }}
          onFieldsChange={onFormChange}
          columns={[
            {
              title: '触发方式',
              dataIndex: 'triggerType',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '选择触发器',
              dataIndex: 'triggerName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '组合方式',
              dataIndex: 'operation',
              render: (value, record, index, { form, editing }) => {
                return value;
              },
            },
            {
              title: '条件列表',
              dataIndex: 'conditions',
              render: (value, record, index, { form, editing }) => {
                return value;
              },
            },
          ]}
        />
      </Modal>
    </>
  );
});

export default TriggerCard;
