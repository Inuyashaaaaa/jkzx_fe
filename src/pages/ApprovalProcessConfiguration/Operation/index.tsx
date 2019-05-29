import Page from '@/containers/Page';
import TabHeader from '@/containers/TabHeader';
import {
  wkProcessGet,
  wkProcessStatusModify,
  wkProcessConfigModify,
  wkProcessModify,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import _ from 'lodash';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE } from '../constants';
import { List, Switch, notification, Row, Col, Checkbox, Alert, Tag, Modal, Button } from 'antd';
import { Table2, Select, Form2, Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState } from 'react';
import GroupSelcet from './GroupSelcet';

const Operation = props => {
  const [process, setProcess] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewTask, setReviewTask] = useState([]);
  useEffect(
    () => {
      if (props.processName) {
        fetchData();
      }
    },
    [props.processName]
  );

  const fetchData = async () => {
    setLoading(true);
    const { processName } = props;
    const { data, error } = await wkProcessGet({ processName });
    if (error) {
      return setLoading(false);
    }
    const processData = { ...data };
    processData.tasks.map(task => {
      task.approveGroupList = (_.get(task, 'approveGroups') || []).map(item => {
        return item.approveGroupId;
      });
      return task;
    });
    setLoading(false);
    let { tasks } = processData;
    tasks = _.sortBy(tasks, 'sequence');
    processData.tasks = tasks;
    let reviewTaskData = (tasks || []).filter(item => item.taskType === 'reviewData');

    reviewTaskData = reviewTaskData.map(item => {
      return Form2.createFields({ ...item, taskId: item.taskId });
    });
    setProcess(processData);
    setReviewTask(reviewTaskData);
  };

  const handleReviewOk = async () => {
    let tasks = _.cloneDeep(process.tasks);
    tasks = _.sortBy(tasks, 'sequence');
    const reviewTasklength = (tasks || []).filter(item => item.taskType === 'reviewData').length;
    tasks.splice(
      1,
      reviewTasklength,
      ..._.values(
        reviewTask.map(item => {
          return Form2.getFieldsValue(item);
        })
      )
    );
    tasks = tasks.map((item, index) => {
      item.sequence = index;
      return item;
    });
    console.log(tasks);
    featchProcessModify(tasks);

    setReviewVisible(false);
  };

  const getActionClass = (taskType, processName) => {
    // 资金
    if (processName === '财务出入金') {
      if (taskType === 'REVIEW_DATA') {
        return `tech.tongyu.bct.workflow.process.func.action.cap.FundReviewTaskAction`;
      }
      return `tech.tongyu.bct.workflow.process.func.action.cap.FundInputTaskAction`;
    }

    // 授信
    if (processName === '授信额度变更') {
      if (taskType === 'REVIEW_DATA') {
        return `tech.tongyu.bct.workflow.process.func.action.credit.CreditInputTaskAction`;
      }
      return `tech.tongyu.bct.workflow.process.func.action.credit.CreditReviewTaskAction`;
    }

    // 交易
    if (processName === '交易录入') {
      if (taskType === 'REVIEW_DATA') {
        return `tech.tongyu.bct.workflow.process.func.action.trade.TradeInputTaskAction`;
      }
      return `tech.tongyu.bct.workflow.process.func.action.trade.TradeReviewTaskAction`;
    }

    throw new Error('getActionClass: no match');
  };

  const featchProcessModify = async tasks => {
    const { processName } = process;
    const taskList = tasks.map((item, index) => {
      return {
        ...item,
        sequence: index,
        taskType: TASKTYPE[item.taskType],
        actionClass: getActionClass(item.taskType, processName),
      };
    });

    const { error, data } = await wkProcessModify({
      processName,
      taskList,
    });
    if (error) return;

    setProcess({
      ...process,
      tasks: taskList,
    });
  };

  const handleReviewCancel = () => {
    setReviewVisible(false);
  };

  const showReview = () => {
    setReviewVisible(true);
  };

  const handleStatus = async (e, processName) => {
    const processData = { ...process };
    processData.status = e;
    setProcess(processData);

    const { error, data } = await wkProcessStatusModify({
      processName,
      status: e,
    });
    if (error) return;
    notification.success({
      message: `${processName}流程${e ? '启用' : '停用'}成功`,
    });
  };

  const configListChange = async (e, param) => {
    const processData = { ...process };
    const processConfigs = processData.processConfigs;

    const processConfigsData = processConfigs.map(item => {
      if (item.id === param.id) {
        item.status = e.target.checked;
      }
      return item;
    });
    const { error, data } = await wkProcessConfigModify({
      configList: processConfigsData.map(item => {
        return {
          configId: item.configId,
          status: item.status,
        };
      }),
    });
    if (error) return;
    processData.processConfigs = processConfigsData;
    setProcess(processData);
    notification.success({
      message: `修改全局配置成功`,
    });
  };

  const reviewInsert = (e, record, rowIndex) => {
    const recordData = Form2.getFieldsValue(record);
    const reviewTaskData = _.cloneDeep(reviewTask);
    reviewTaskData.splice(rowIndex + 1, 0, {
      ...Form2.createFields({
        approveGroupList: [],
        approveGroups: [],
        taskCompletableFilters: recordData.taskCompletableFilters,
        taskReadableFilters: recordData.taskReadableFilters,
        taskAction: recordData.taskAction,
        taskType: recordData.taskType,
        taskName: '',
      }),
    });
    setReviewTask(reviewTaskData);
  };

  const reviewDelete = (e, record, rowIndex) => {
    const recordData = Form2.getFieldsValue(record);
    const reviewTaskData = _.cloneDeep(reviewTask);
    reviewTaskData.splice(rowIndex + 1, 1);
    setReviewTask(reviewTaskData);
  };

  const onReviewCellFieldsChange = ({ allFields, changedFields, record, rowIndex }) => {
    setReviewTask(
      reviewTask.map((item, index) => {
        if (index === rowIndex) {
          return record;
        }
        return item;
      })
    );
  };

  return (
    <>
      <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
        <Col xs={24} sm={4}>
          <List itemLayout="vertical">
            <List.Item>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={process.status}
                onClick={e => handleStatus(e, process.processName)}
              />
              <span style={{ marginLeft: '6px' }}>
                {process.status ? '流程已启用' : '流程已停用'}
              </span>
            </List.Item>
            <List.Item extra={<a>修改</a>}>
              <List.Item.Meta title="谁能发起" />
              {process.tasks
                ? (process.tasks || [])
                    .filter(item => {
                      return item.taskType === 'insertData';
                    })[0]
                    .approveGroups.map(item => {
                      return (
                        <Tag style={{ margin: 5 }} key={item.approveGroupId}>
                          {item.approveGroupName}
                        </Tag>
                      );
                    })
                : null}
            </List.Item>
            <List.Item>
              <List.Item.Meta title="审批配置" />
              {(process.processConfigs || []).map(item => {
                return (
                  <p key={item.id}>
                    <Checkbox
                      onChange={e => configListChange(e, item)}
                      defaultChecked={!!item.status}
                    >
                      {GTE_PROCESS_CONFIGS(item.configName)}
                    </Checkbox>
                  </p>
                );
              })}
            </List.Item>
          </List>
        </Col>
        <Col xs={24} sm={20}>
          <Button type="primary" onClick={showReview}>
            编辑流程
          </Button>
          <Table2
            dataSource={reviewTask}
            rowKey="taskId"
            pagination={false}
            columns={[
              {
                title: '节点名称',
                dataIndex: 'taskName',
                render: (value, record, index, { form, editing }) => {
                  return value;
                },
              },
              {
                title: '审批组',
                dataIndex: 'approveGroupList',
                render: (value, record, index, { form, editing }) => {
                  return (
                    <GroupSelcet
                      value={value}
                      record={record}
                      index={index}
                      formData={{ form, editing }}
                    />
                  );
                },
              },
            ]}
          />
        </Col>
      </Row>
      <Modal
        title="编辑流程"
        visible={reviewVisible}
        onOk={handleReviewOk}
        onCancel={handleReviewCancel}
        okText="保存"
        cancelText="放弃修改"
        width={800}
      >
        <Alert
          message="如果不需要增删节点、调整节点顺序或修改节点名称，建议通过编辑节点来实现审批组或触发器的修改。"
          type="info"
        />
        <Table2
          dataSource={reviewTask}
          rowKey="taskId"
          pagination={false}
          onCellFieldsChange={onReviewCellFieldsChange}
          columns={[
            {
              title: '节点名称',
              dataIndex: 'taskName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [{ required: true }],
                    })(<Input editing={true} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '审批组',
              dataIndex: 'approveGroupList',
              render: (value, record, index, { form, editing }) => {
                return (
                  <GroupSelcet
                    value={value}
                    record={record}
                    index={index}
                    formData={{ form, editing: true }}
                  />
                );
              },
            },
            {
              title: '操作',
              dataIndex: 'action',
              render: (value, record, index, { form, editing }) => {
                return (
                  <div>
                    <a style={{ margin: '0 5px' }}>上移</a>
                    <a style={{ margin: '0 5px' }}>下移</a>
                    <a style={{ margin: '0 5px' }} onClick={e => reviewInsert(e, record, index)}>
                      插入
                    </a>
                    <a style={{ margin: '0 5px' }} onClick={e => reviewDelete(e, record, index)}>
                      删除
                    </a>
                  </div>
                );
              },
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default Operation;
