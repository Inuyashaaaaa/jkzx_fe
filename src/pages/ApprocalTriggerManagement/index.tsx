import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import Page from '@/containers/Page';
import { Table2, Select, Form2, Input } from '@/containers';
import { Card, Icon, Row, Col, Modal, Spin, Popconfirm, notification, message } from 'antd';
import styles from './index.less';
import GroupList from './GroupList';
import PopconfirmCard from './PopconfirmCard';
import { operation, symbol, OPERATION_MAP, SYMBOL_MAP } from './constants';
import {
  wkProcessTriggerList,
  wkTriggerConditionModify,
  wkProcessTriggerModify,
  wkProcessTriggerCreate,
  wkTriggerConditionCreate,
  wkProcessTriggerDelete,
  wkIndexList,
  wkProcessTriggerBusinessCreate,
  wkProcessTriggerBusinessModify,
} from '@/services/approvalProcessConfiguration';
import useLifecycles from 'react-use/lib/useLifecycles';
import { replace } from 'react-router-redux';

const useList = () => {
  const [triggerList, setTriggerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const featchTriggerList = async () => {
    setLoading(true);
    const { data, error } = await wkProcessTriggerList({});
    setLoading(false);
    if (error) return;
    setTriggerList(data);
  };

  useLifecycles(() => {
    featchTriggerList();
  });

  return {
    triggerList,
    setTriggerList,
    loading,
    setLoading,
  };
};

const ApprocalTriggerManagement = props => {
  let $form = useRef<Form2>(null);
  let $formModel = useRef<Form2>(null);

  const [visible, setVisible] = useState(false);
  const { triggerList, setTriggerList, loading, setLoading } = useList();
  const [currentTrigger, setCurrentTrigger] = useState({});
  const [create, setCreate] = useState(false);

  const showModel = (e, param) => {
    if (param) {
      let data = param.conditions;
      data = data.map(item => {
        item.leftIndex = _.get(item, 'leftIndex.indexClass');
        item.rightIndex = _.get(item, 'rightIndex.indexClass');
        item.rightValue = _.get(item, 'rightValue.number');
        return {
          ...Form2.createFields(item),
          conditionId: item.conditionId,
        };
      });
      setCurrentTrigger(Form2.createFields({ ...param, conditions: data }));
      setCreate(!param);
      setVisible(true);
      return;
    }
    setCurrentTrigger({});
    setCreate(!param);
    setVisible(true);
  };

  const findName = (data, filed, item) => {
    // debugger
    const Index = _.findIndex(data, p => {
      return p[filed] === item;
    });
    if (Index >= 0) {
      return data[Index].indexName;
    }
    return item;
  };

  const handleOk = async () => {
    const rsp = await $form.validate();
    if (rsp.error) return;
    console.log(rsp);

    const currentTriggerData = Form2.getFieldsValue(_.cloneDeep(currentTrigger));
    let conditionsData = [...currentTriggerData.conditions];
    console.log($formModel);
    const cerror = $formModel.validate();
    console.log(cerror);
    // conditionsData.forEach(async (item,index) => {
    //   console.log(item);
    //   const _res = await item.validate();
    //   console.log(_res);
    // })
    conditionsData = conditionsData
      .filter(item => !!item)
      .map(item => {
        return Form2.getFieldsValue(item);
      });

    if (conditionsData.length <= 0) {
      return message.info('至少添加一个条件');
    }

    conditionsData = conditionsData.map(item => {
      item.rightValue = { number: item.rightValue };
      return item;
    });
    const { data: _data, error: _error } = await wkIndexList({});
    // debugger
    const strArr = conditionsData.map(item => {
      return `${findName(_data, 'indexClass', item.leftIndex)}${SYMBOL_MAP[item.symbol]}${
        item.rightIndex === 'returnNumberIndexImpl'
          ? _.get(item, 'rightValue.number')
          : findName(_data, 'indexClass', item.rightIndex)
      }`;
    });
    if (create) {
      const { error, data } = await wkProcessTriggerBusinessCreate({
        triggerName: currentTriggerData.triggerName,
        operation: currentTriggerData.operation,
        description: strArr.join(','),
        conditions: conditionsData,
      });
      if (error) return;
      setTriggerList(data);
      notification.success({
        message: '创建成功',
      });
      return setVisible(false);
    }
    const { error, data } = await wkProcessTriggerBusinessModify({
      triggerId: currentTriggerData.triggerId,
      triggerName: currentTriggerData.triggerName,
      operation: currentTriggerData.operation,
      description: strArr.join(','),
      conditions: conditionsData,
    });
    if (error) return;
    setTriggerList(data);
    notification.success({
      message: '修改成功',
    });
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const deleteConfirm = async (e, param) => {
    const { error, data } = await wkProcessTriggerDelete({ triggerId: param.triggerId });
    if (error) return;
    setTriggerList(triggerList.filter(item => item.triggerId !== param.triggerId));
    notification.success({
      message: '删除成功',
    });
  };

  const onFormChange = (props, changedFields, allFields) => {
    // debugger
    setCurrentTrigger({
      ...currentTrigger,
      ...changedFields,
    });
  };

  const conditionLength = 3;
  console.log(currentTrigger);
  return (
    <Page title="流程管理" footer={false} card={false}>
      <Spin size="large" tip="Loading..." spinning={loading}>
        <Row type="flex" justify="start" align="top">
          <Col span={8}>
            <Card className={styles.cardAdd} onClick={e => showModel(e, null)}>
              <span>
                <Icon type="plus" />
                新增触发器
              </span>
            </Card>
          </Col>
          {triggerList.map(item => {
            return (
              <Col span={8} key={item.triggerId}>
                <Card title={item.triggerName} className={styles.card}>
                  <p>{OPERATION_MAP[item.operation]}</p>
                  <ul className={styles.desList}>
                    {item.description &&
                      item.description.split(',').length > 0 &&
                      (item.description || '').split(',').map((des, index) => {
                        if (index > conditionLength - 1) return null;
                        return <li key={index}>{des}</li>;
                      })}
                    {item.description &&
                    item.description.split(',').length > 0 &&
                    (item.description || '').split(',').length > conditionLength ? (
                      <li style={{ listStyle: 'none', paddingLeft: 20 }}>
                        等{item.description.split(',').length}个条件
                        <PopconfirmCard data={item} key={item.triggerId} />
                      </li>
                    ) : null}
                  </ul>
                  <p className={styles.action}>
                    <a style={{ marginRight: 10 }} onClick={e => showModel(e, item)}>
                      修改
                    </a>

                    <Popconfirm title="确定删除?" onConfirm={e => deleteConfirm(e, item)}>
                      <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                  </p>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Spin>
      <Modal
        title="编辑触发器"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Form2
          ref={node => ($form = node)}
          layout="horizontal"
          footer={false}
          dataSource={currentTrigger}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          onFieldsChange={onFormChange}
          columns={[
            {
              title: '触发器名称',
              dataIndex: 'triggerName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(<Input style={{ width: 250 }} />)}
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
                      rules: [{ required: true }],
                    })(<Select style={{ width: 250 }} options={operation} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '条件列表',
              dataIndex: 'conditions',
              render: (value, record, index, { form, editing }) => {
                // debugger
                console.log(value);
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true, message: '条件列表为必填项' }],
                    })(
                      <GroupList
                        getCurrent={node => ($formModel = node)}
                        {...{ record, index, form, editing }}
                      />
                    )}
                  </FormItem>
                );
              },
            },
          ]}
        />
      </Modal>
    </Page>
  );
};

export default ApprocalTriggerManagement;
