import { Form2, SmartTable, Table2 } from '@/containers';
import {
  wkProcessConfigModify,
  wkProcessGet,
  wkProcessInstanceListByProcessName,
  wkProcessModify,
  wkProcessStatusModify,
  wkTaskApproveGroupBind,
} from '@/services/approvalProcessConfiguration';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  message,
  Modal,
  notification,
  Row,
  Switch,
  Tag,
} from 'antd';
import _ from 'lodash';
import { default as React, default as React, useEffect, useRef, useState } from 'react';
import uuidv4 from 'uuid/v4';
import { COLUMNS, GTE_PROCESS_CONFIGS, TASKTYPE } from '../constants';
import EditTable from './EditTable';
import TriggerCard from './TriggerCard';

const Operation = props => {
  const [process, setProcess] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewTask, setReviewTask] = useState([]);
  const [warningVisible, setWarningVisible] = useState(false);
  const [otherVisible, setOtherVisible] = useState(false);
  const [otherTask, setOtherTask] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [processConfigs, setProcessConfigs] = useState([]);
  let tableE1 = useRef<Table2>(null);
  let $editTable = useRef<Table2>(null);

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
    setProcess(processData);
    setProcessConfigs(processData.processConfigs);
    handleReviewData(processData);
  };

  const handleReviewData = processData => {
    const data = processData ? processData : process;
    let reviewTaskData = (data.tasks || []).filter(item => item.taskType === 'reviewData');
    reviewTaskData = _.sortBy(reviewTaskData, 'sequence');

    reviewTaskData = reviewTaskData.map(item => {
      return {
        ...Form2.createFields(item),
        taskId: item.taskId,
      };
    });
    setReviewTask(reviewTaskData);
  };

  const handleReviewOk = async () => {
    const res = await tableE1.validate();
    if (_.isArray(res)) {
      if (res.some(value => value.errors)) return;
    }

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
    featchProcessModify(tasks);
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
    const { error: _error, data: _data } = await wkProcessInstanceListByProcessName({
      processName,
    });
    if (_error) return;
    if (_data.length > 0) {
      setExcelData(_data);
      return setWarningVisible(true);
    }
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
    if (error) {
      handleReviewData(process);

      setReviewVisible(false);
      return;
    }
    const cloneData = { ...data };
    cloneData.tasks = cloneData.tasks.map(item => {
      item.approveGroupList = item.approveGroups.map(i => i.approveGroupId);
      return item;
    });

    setProcess(cloneData);
    setProcessConfigs(data.processConfigs);
    handleReviewData(data);

    notification.success({
      message: `${process.processName}流程保存成功`,
    });
    setReviewVisible(false);
  };

  const handleReviewCancel = () => {
    handleReviewData(null);
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
    setProcessConfigs(processConfigsData);

    handleReviewData(processData);
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
      taskId: uuidv4(),
    });
    setReviewTask(reviewTaskData);
  };

  const reviewDelete = (e, record, rowIndex) => {
    const reviewTaskData = _.cloneDeep(reviewTask);
    if (reviewTaskData.length <= 1) return message.warning('至少保留一个复核节点');
    reviewTaskData.splice(rowIndex, 1);
    setReviewTask(reviewTaskData);
  };

  const reviewMove = (n, record, rowIndex) => {
    const reviewTaskData = _.cloneDeep(reviewTask);
    reviewTaskData.splice(rowIndex, 1);
    reviewTaskData.splice(rowIndex - n, 0, record);
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

  const warningCancel = () => {
    setWarningVisible(false);
  };

  const showOtherModel = (e, currentTaskIdData) => {
    setCurrentTaskId(currentTaskIdData);
    let otherTaskData = (process.tasks || []).filter(item => item.taskId === currentTaskIdData);
    otherTaskData = otherTaskData.map(item => {
      item.approveGroupList = (item.approveGroups || []).map(i => i.approveGroupId);
      return item;
    });
    otherTaskData = otherTaskData.map(item => {
      return {
        ...Form2.createFields(item),
        taskId: item.taskId,
      };
    });

    setOtherTask(otherTaskData);
    setOtherVisible(true);
  };

  const handleOtherOk = async () => {
    const res = await $editTable.tableE2.current.validate();
    if (_.isArray(res)) {
      if (res.some(value => value.errors)) return;
    }

    const { processName } = process;
    const { error: _error, data: _data } = await wkProcessInstanceListByProcessName({
      processName,
    });
    if (_error) return;
    if (_data.length > 0) {
      setExcelData(_data);
      return setWarningVisible(true);
    }

    let tasks = _.cloneDeep(process.tasks);
    tasks = _.sortBy(tasks, 'sequence');
    tasks = tasks.map(item => {
      if (item.taskId === currentTaskId) {
        return Form2.getFieldsValue(otherTask[0]);
      }
      return item;
    });
    const { error, data } = await wkTaskApproveGroupBind({
      processName,
      taskList: tasks.map(item => {
        return {
          taskId: item.taskId,
          approveGroupList: item.approveGroupList,
        };
      }),
    });
    if (error) {
      let otherTaskData = (process.tasks || []).filter(item => item.taskId === currentTaskId);

      otherTaskData = otherTask.map(item => {
        return {
          ...Form2.createFields(item),
          taskId: item.taskId,
        };
      });
      setOtherTask(otherTaskData);
      return setOtherVisible(false);
    }
    const cloneData = { ...data };
    cloneData.tasks = cloneData.tasks.map(item => {
      item.approveGroupList = item.approveGroups.map(i => i.approveGroupId);
      return item;
    });
    setProcess(cloneData);
    setProcessConfigs(cloneData.processConfigs);
    handleReviewData(cloneData);
    setOtherVisible(false);
    notification.success({
      message: `${processName}流程保存成功`,
    });
  };

  const handleOtherCancel = () => {
    setOtherVisible(false);
  };

  const onOtherCellFieldsChange = ({ allFields, changedFields, record, rowIndex }) => {
    setOtherTask(
      otherTask.map((item, index) => {
        if (index === rowIndex) {
          return record;
        }
        return item;
      })
    );
  };

  const insertData = (_.get(process, 'tasks') || []).filter(item => {
    return item.taskType === 'insertData';
  });
  const approveGroups = _.get(insertData, '[0].approveGroups') || [];
  const { status } = process;

  return (
    <>
      <Row type="flex" justify="space-between" align="top" gutter={16 + 8}>
        <Col xs={24} sm={6}>
          <div>
            <Card bordered={false}>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={status}
                onClick={e => handleStatus(e, process.processName)}
              />
              <span style={{ marginLeft: '6px' }}>
                {process.status ? '流程已启用' : '流程已停用'}
              </span>
            </Card>
            <TriggerCard
              triggers={process.triggers}
              processName={process.processName}
              fetchData={fetchData}
            />
            <Card
              title="谁能发起"
              style={{ marginTop: '10px' }}
              bordered={false}
              extra={<a onClick={e => showOtherModel(e, _.get(insertData, '[0].taskId'))}>修改</a>}
            >
              {approveGroups.map(item => {
                return (
                  <Tag style={{ margin: 5 }} key={item.approveGroupId}>
                    {item.approveGroupName}
                  </Tag>
                );
              })}
            </Card>
            <Card title="审批配置" style={{ marginTop: '10px' }} bordered={false}>
              {(processConfigs || []).map(item => {
                return (
                  <p key={item.id}>
                    <Checkbox onChange={e => configListChange(e, item)} checked={item.status}>
                      {GTE_PROCESS_CONFIGS(item.configName)}
                    </Checkbox>
                  </p>
                );
              })}
            </Card>
          </div>
        </Col>
        <Col xs={24} sm={18} style={{ background: '#fff', minHeight: '700px', padding: '20px' }}>
          <Button type="primary" onClick={showReview} style={{ marginBottom: 15 }}>
            编辑流程
          </Button>
          <EditTable
            reviewTask={reviewTask}
            showOtherModel={showOtherModel}
            otherVisible={otherVisible}
            handleOtherOk={handleOtherOk}
            handleOtherCancel={handleOtherCancel}
            otherTask={otherTask}
            onOtherCellFieldsChange={onOtherCellFieldsChange}
            getRef={node => ($editTable = node)}
            warningVisible={warningVisible}
            warningCancel={warningCancel}
            excelData={excelData}
            processName={process.processName}
            setWarningVisible={setWarningVisible}
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
          showIcon={true}
        />
        <SmartTable
          ref={node => (tableE1 = node)}
          dataSource={reviewTask}
          rowKey="taskId"
          pagination={false}
          onCellFieldsChange={onReviewCellFieldsChange}
          columns={COLUMNS(reviewMove, reviewInsert, reviewDelete, reviewTask)}
        />
      </Modal>
    </>
  );
};

export default Operation;
