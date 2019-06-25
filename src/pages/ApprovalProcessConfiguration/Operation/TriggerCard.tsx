import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import { notification, Card, Tag, Col, Modal, message } from 'antd';
import uuidv4 from 'uuid/v4';
import { Table2, Select, Form2, Input } from '@/containers';
import {
  wkProcessTriggerList,
  wkProcessTriggerBind,
  wkProcessTriggerUnbind,
  wkIndexList,
  wkProcessTriggerBusinessCreate,
  wkProcessTriggerBusinessModify,
  authCan,
} from '@/services/approvalProcessConfiguration';
import { TRIGGERTYPE, OPERATION_MAP, operation, SYMBOL_MAP } from '../constants';
import GroupList from './GroupList';
import PopconfirmCard from '../../ApprocalTriggerManagement/PopconfirmCard';

const TriggerCard = memo<any>(props => {
  const { processName, fetchData, trigger } = props;
  const isCreate = !trigger;

  const $formModel = useRef<Form2>(null);
  const $form = useRef<Form2>(null);

  const columns1 = [
    {
      title: '当前流程',
      dataIndex: 'processName',
      render: (value, record, index, { form, editing }) => (
        <FormItem>
          {form.getFieldDecorator({})(<Input style={{ width: 250 }} editing={false} />)}
        </FormItem>
      ),
    },
    {
      title: '组合方式',
      dataIndex: 'operation',
      render: (value, record, index, { form, editing }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '组合方式为必填项' }],
          })(<Select style={{ width: 250 }} options={_.concat(TRIGGERTYPE, operation)} />)}
        </FormItem>
      ),
    },
  ];

  const columns2 = [
    {
      title: '当前流程',
      dataIndex: 'processName',
      render: (value, record, index, { form, editing }) => (
        <FormItem>
          {form.getFieldDecorator({})(<Input style={{ width: 250 }} editing={false} />)}
        </FormItem>
      ),
    },
    {
      title: '组合方式',
      dataIndex: 'operation',
      render: (value, record, index, { form, editing }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '组合方式为必填项' }],
          })(<Select style={{ width: 250 }} options={_.concat(TRIGGERTYPE, operation)} />)}
        </FormItem>
      ),
    },
    {
      title: '条件列表',
      dataIndex: 'conditions',
      render: (value, record, index, { form, editing }) => (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '条件列表为必填项' }],
          })(
            <GroupList
              getCurrent={node => ($formModel.current = node)}
              {...{ record, index, form, editing }}
            />,
          )}
        </FormItem>
      ),
    },
  ];

  const [targetVisible, setTargetVisible] = useState(false);
  const [targetData, setTargetData] = useState({
    ...Form2.createFields({ processName }),
  });
  const [loading, setLoading] = useState(false);

  const handleData = useCallback(() => {
    if (!trigger) {
      setColumns(columns1);
      return setTargetData({
        ...Form2.createFields({ operation: 'all', processName }),
      });
    }
    setColumns(columns2);
    let conditions = _.cloneDeep(trigger.conditions);
    conditions = conditions.map(item => {
      item.leftIndex = _.get(item, 'leftIndex.indexClass');
      item.rightIndex = _.get(item, 'rightIndex.indexClass');
      const number = _.get(item, 'rightValue.number');
      item.rightValue = number && _.isNumber(number) ? _.get(item, 'rightValue.number') : '';
      return {
        ...Form2.createFields(item),
        conditionId: item.conditionId,
      };
    });
    setTargetData({
      ...Form2.createFields({
        operation: trigger.operation,
        conditions,
        processName,
      }),
    });
  });

  useEffect(() => {
    handleData();
  }, [handleData, trigger]);

  const [columns, setColumns] = useState(columns1);

  const findName = (data, filed, item) => {
    const Index = _.findIndex(data, p => p[filed] === item);
    if (Index >= 0) {
      return data[Index].indexName;
    }
    return item;
  };

  const showTargetModel = async () => {
    // 是否有修改触发器权限
    const { error, data } = await authCan({
      resourceType: 'PROCESS_DEFINITION_INFO',
      resourceName: ['交易录入'],
      resourcePermissionType: 'BIND_PROCESS_TRIGGER',
    });
    if (error) return;
    if (!data[0]) {
      return notification.info({
        message: '没有修改流程触发的权限',
      });
    }
    handleData();
    setTargetVisible(true);
  };

  const handleTargetOk = async () => {
    const res = await $form.current.validate();
    if (res.error) return;

    const formData = Form2.getFieldsValue(targetData);
    if (formData.operation === 'all') {
      setColumns(columns1);
      // 解除触发器绑定
      setLoading(true);
      const { error } = await wkProcessTriggerUnbind({
        processName,
      });
      setLoading(false);
      if (error) return;
      setTargetVisible(false);
      notification.success({
        message: `${processName}流程触发修改成功`,
      });
      return fetchData();
    }
    // 修改触发器||创建绑定触发器
    let conditionsData = [...formData.conditions];
    const cerror = await $formModel.current.validate();
    const errLen = cerror.filter(item => item && item.error).length;
    if (errLen > 0) return;
    conditionsData = conditionsData.filter(item => !!item).map(item => Form2.getFieldsValue(item));

    if (conditionsData.length <= 0) {
      return message.info('至少添加一个条件');
    }

    conditionsData = conditionsData.map(item => {
      item.rightValue = item.rightValue ? { number: item.rightValue } : {};
      return item;
    });
    const { data: _data, error: _error } = await wkIndexList({});
    const strArr = conditionsData.map(
      item =>
        `${findName(_data, 'indexClass', item.leftIndex)}${SYMBOL_MAP[item.symbol]}${
          item.rightIndex === 'returnNumberIndexImpl'
            ? _.get(item, 'rightValue.number')
            : findName(_data, 'indexClass', item.rightIndex)
        }`,
    );
    if (isCreate) {
      const triggerName = processName;
      setLoading(true);
      const { error, data } = await wkProcessTriggerBusinessCreate({
        triggerName,
        operation: formData.operation,
        description: strArr.join(','),
        conditions: conditionsData,
        processName,
      });
      setLoading(false);
      if (error) return;
      setTargetVisible(false);
      notification.success({
        message: `${processName}流程触发修改成功`,
      });
      return fetchData();
    }
    setLoading(true);
    const { error: merror, data } = await wkProcessTriggerBusinessModify({
      triggerId: trigger.triggerId,
      triggerName: trigger.triggerName,
      operation: formData.operation,
      description: strArr.join(','),
      conditions: conditionsData,
    });
    setLoading(false);

    if (merror) return;
    setTargetVisible(false);
    notification.success({
      message: `${processName}流程触发修改成功`,
    });
    fetchData();
  };

  const handleTargetCancel = () => {
    setTargetVisible(false);
  };

  const onFormChange = async (props, changedFields, allFields, rowIndex) => {
    const changedData = Form2.getFieldsValue(changedFields);
    if (changedData.operation === 'all') {
      setColumns(columns1);
      return setTargetData({
        ...targetData,
        ...changedFields,
      });
    }
    setColumns(columns2);
    if (changedData.triggerName) {
      const { error, data } = await wkProcessTriggerList({});
      if (error) return;
      const _data =
        _.get(data.filter(item => item.triggerId === changedData.triggerName), '[0]') || {};
      return setTargetData({
        ...targetData,
        ...changedFields,
        ...Form2.createFields({
          operation: OPERATION_MAP[_data.operation],
          description: _data.description,
        }),
      });
    }

    setTargetData({
      ...targetData,
      ...changedFields,
    });
  };
  console.log(targetData);
  return (
    <>
      <Card
        title="流程触发"
        style={{ marginTop: '10px' }}
        bordered={false}
        extra={<a onClick={showTargetModel}>修改</a>}
      >
        {trigger ? (
          <>
            <p>
              触发方式：
              <Tag style={{ margin: 5 }} key={trigger.approveGroupId}>
                {OPERATION_MAP[trigger.operation]}
              </Tag>
            </p>
            <p>
              条件列表：
              <Tag style={{ margin: 5 }} key={trigger.approveGroupId}>
                {trigger.conditions.length}个条件
              </Tag>
              <PopconfirmCard data={trigger} key={trigger.triggerId} />
            </p>
          </>
        ) : (
          '触发方式：全部触发'
        )}
      </Card>
      <Modal
        visible={targetVisible}
        width={1000}
        title="配置流程触发"
        onOk={handleTargetOk}
        onCancel={handleTargetCancel}
        confirmLoading={loading}
      >
        <Form2
          ref={node => ($form.current = node)}
          layout="horizontal"
          footer={false}
          dataSource={targetData}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          onFieldsChange={onFormChange}
          columns={columns}
        />
      </Modal>
    </>
  );
});

export default TriggerCard;
