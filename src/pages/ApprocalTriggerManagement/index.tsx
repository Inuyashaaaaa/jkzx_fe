import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import Page from '@/containers/Page';
import { Table2, Select, Form2, Input } from '@/containers';
import { Card, Icon, Row, Col, Modal, Spin, Popconfirm } from 'antd';
import styles from './index.less';
import GroupList from './GroupList';
import PopconfirmCard from './PopconfirmCard';
import { operation, symbol, operation_map } from './constants';
import {
  wkProcessTriggerList,
  wkTriggerConditionModify,
} from '@/services/approvalProcessConfiguration';
import useLifecycles from 'react-use/lib/useLifecycles';

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

  const showModel = param => {
    setCurrentTrigger(param ? Form2.createFields(param) : {});
    setVisible(true);
  };

  const handleOk = async () => {
    const currentTriggerData = _.cloneDeep(currentTrigger);
    currentTriggerData.conditions = $formModel.value.map(item => Form2.getFieldsValue(item));
    const { data, error } = await wkTriggerConditionModify(currentTriggerData);
    if (error) return;
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const deleteConfirm = () => {};

  const deleteCancel = () => {};

  const onFormChange = (props, changedFields, allFields) => {
    console.log(props, changedFields, allFields, $formModel);
    // let data = _.cloneDeep(value);
    // data[rowIndex] = {
    //   ...data[rowIndex],
    //   ...changedFields,
    // }
    // setValue(data);
  };

  return (
    <Page title="流程管理" footer={false} card={false}>
      <Spin size="large" tip="Loading..." spinning={loading}>
        <Row type="flex" justify="start" align="top">
          <Col span={8}>
            <Card className={styles.cardAdd} onClick={showModel}>
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
                  <p>{operation_map[item.operation]}</p>
                  <ul className={styles.desList}>
                    {item.description.split(',').map((des, index) => {
                      return <li key={index}>{des}</li>;
                    })}
                  </ul>
                  <PopconfirmCard />
                  <p style={{ textAlign: 'right' }}>
                    <a style={{ marginRight: 10 }} onClick={() => showModel(item)}>
                      修改
                    </a>

                    <Popconfirm title="确定删除?" onConfirm={deleteConfirm} onCancel={deleteCancel}>
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
                    })(<Select style={{ width: 250 }} options={operation} />)}
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
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(
                      <GroupList
                        getCurrent={node => ($formModel = node)}
                        record={record}
                        value={value}
                        index={index}
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
