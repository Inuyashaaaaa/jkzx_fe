import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { notification, Card, Tag, Col, Modal, message } from 'antd';
import {
  wkProcessTriggerList,
  wkProcessTriggerBind,
  wkProcessTriggerUnbind,
} from '@/services/approvalProcessConfiguration';
import uuidv4 from 'uuid/v4';
import { TRIGGERTYPE, OPERATION_MAP } from '../constants';
import PopconfirmCard from '../../ApprocalTriggerManagement/PopconfirmCard';

const TriggerCard = memo<any>(props => {
  const { processName, fetchData, triggers } = props;
  let $form = useRef<Form2>(null);

  const [targetVisible, setTargetVisible] = useState(false);
  const [targetData, setTargetData] = useState({});
  const [columns, setColumns] = useState([
    {
      title: '触发方式',
      dataIndex: 'byTrigger',
      render: (value, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [{ required: true, message: '触发方式为必填项' }],
            })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
          </FormItem>
        );
      },
    },
  ]);

  const showTargetModel = () => {
    setTargetData({});
    setColumns([
      {
        title: '触发方式',
        dataIndex: 'byTrigger',
        render: (value, record, index, { form, editing }) => {
          return (
            <FormItem>
              {form.getFieldDecorator({
                rules: [{ required: true, message: '触发方式为必填项' }],
              })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
            </FormItem>
          );
        },
      },
    ]);
    setTargetVisible(true);
  };

  const handleTargetOk = async () => {
    const res = await $form.validate();
    if (res.error) return;

    const formData = Form2.getFieldsValue(targetData);
    if (formData.byTrigger === true) {
      const { data, error } = await wkProcessTriggerBind({
        processName,
        triggerId: formData.triggerName,
      });
      if (error) return;
      fetchData();
      notification.success({
        message: `${processName}流程触发器修改成功`,
      });
      return setTargetVisible(false);
    }
    const { error } = await wkProcessTriggerUnbind({
      processName,
    });
    if (error) return;
    fetchData();
    notification.success({
      message: `${processName}流程触发器修改成功`,
    });
    setTargetVisible(false);
  };

  const handleTargetCancel = () => {
    setTargetVisible(false);
  };

  const onFormChange = async (props, changedFields, allFields, rowIndex) => {
    const changedData = Form2.getFieldsValue(changedFields);
    if (changedData.byTrigger === true) {
      setColumns([
        {
          title: '触发方式',
          dataIndex: 'byTrigger',
          render: (value, record, index, { form, editing }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  rules: [{ required: true, message: '触发方式为必填项' }],
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
                  rules: [{ required: true, message: '选择触发器为必填项' }],
                })(
                  <Select
                    style={{ width: 250 }}
                    options={async () => {
                      const { error, data } = await wkProcessTriggerList({});
                      if (error) return [];
                      return data.map(item => {
                        return {
                          label: item.triggerName,
                          value: item.triggerId,
                        };
                      });
                    }}
                  />
                )}
              </FormItem>
            );
          },
        },
        {
          title: '组合方式',
          dataIndex: 'operation',
          render: (value, record, index, { form, editing }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  rules: [{ required: true, message: '组合方式为必填项' }],
                })(<Input style={{ width: 250 }} editing={false} />)}
              </FormItem>
            );
          },
        },
        {
          title: '条件列表',
          dataIndex: 'description',
          render: (value, record, index, { form, editing }) => {
            value = (value || '').split(',') || [];
            return (
              <FormItem>
                {form.getFieldDecorator({
                  rules: [{ required: true, message: '条件列表为必填项' }],
                })(
                  // <Input style={{ width: 250 }} editing={false}/>
                  <>
                    {value.map(item => (
                      <Input key={item} value={item} style={{ width: 250 }} editing={false} />
                    ))}
                  </>
                )}
              </FormItem>
            );
          },
        },
      ]);
    }
    if (changedData.byTrigger === false) {
      setColumns([
        {
          title: '触发方式',
          dataIndex: 'byTrigger',
          render: (value, record, index, { form, editing }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  rules: [{ required: true, message: '触发方式为必填项' }],
                })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
              </FormItem>
            );
          },
        },
      ]);
    }
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

  return (
    <>
      <Card
        title="流程触发"
        style={{ marginTop: '10px' }}
        bordered={false}
        extra={<a onClick={showTargetModel}>修改</a>}
      >
        {(triggers || []).map(item => {
          return (
            <p key={item.triggerId}>
              触发器：
              <Tag style={{ margin: 5 }} key={item.approveGroupId}>
                {item.triggerName}
              </Tag>
              <PopconfirmCard data={item} key={item.triggerId} />
            </p>
          );
        })}
        {!triggers || triggers.length <= 0 ? '全部触发' : null}
      </Card>
      <Modal
        visible={targetVisible}
        width={700}
        title="选择触发器"
        onOk={handleTargetOk}
        onCancel={handleTargetCancel}
      >
        <Form2
          ref={node => ($form = node)}
          layout="horizontal"
          footer={false}
          dataSource={targetData}
          wrapperCol={{ span: 16 }}
          labelCol={{ span: 8 }}
          onFieldsChange={onFormChange}
          columns={columns}
        />
      </Modal>
    </>
  );
});

export default TriggerCard;
