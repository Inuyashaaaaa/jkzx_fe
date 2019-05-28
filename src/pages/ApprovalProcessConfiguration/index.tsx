import { Select } from '@/containers';
import Page from '@/containers/Page';
import {
  wkProcessConfigModify,
  wkProcessList,
  wkProcessModify,
  wkProcessStatusModify,
  wkTaskApproveGroupBind,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import {
  Button,
  Checkbox,
  Icon,
  List,
  message,
  Modal,
  notification,
  Popconfirm,
  Switch,
  Tabs,
  Typography,
  Skeleton,
} from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import styles from './ApprovalProcessConfiguration.less';
import { GTE_PROCESS_CONFIGS, REVIEW_DATA, TASKTYPE } from './constants';

const TabPane = Tabs.TabPane;
const { Paragraph } = Typography;

class ApprovalProcessConfiguration extends PureComponent {
  public state = {
    approveGroupList: [],
    taskApproveGroupList: [],
    processList: null,
    loading: false,
    currentProcessName: '',
    status: false,
    resetVisible: false,
    processConfigs: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchData(null);
  };

  public fetchData = async currentProcessName => {
    this.setState({
      loading: true,
    });
    const { data: processList, error: pError } = await wkProcessList();
    if (pError) {
      return this.setState({
        loading: false,
      });
    }

    if (!this.state.currentProcessName) {
      this.setState({
        currentProcessName: processList[0].processName,
      });
    }

    const tabsData = processList.map(tab => {
      const reviewDataLength = _.filter(tab.tasks, item => {
        return item.taskType === REVIEW_DATA;
      }).length;
      tab.reviewDataLength = reviewDataLength;
      tab.tasks.map(task => {
        task.approveGroupList = (_.get(task, 'approveGroups') || []).map(item => {
          return item.approveGroupId;
        });
        if (task.taskType === 'modifyData') {
          task.index = 2;
        } else if (task.taskType === REVIEW_DATA) {
          task.index = 1;
        } else if (task.taskType === 'insertData') {
          task.index = 0;
        } else {
          task.index = 4;
        }
        return task;
      });

      // tab.tasks = _.sortBy(tab.tasks, ['index']);
      tab.tasks = _.sortBy(tab.tasks, ['sequence']);
      return tab;
    });

    this.setState({
      loading: false,
      processList: tabsData,
    });
  };

  public handleStatus = async (e, processName) => {
    const { error, data } = await wkProcessStatusModify({
      processName,
      status: e,
    });
    if (error) return;
    notification.success({
      message: `${e ? '启用' : '关闭'}流程成功`,
    });
    this.setState({
      status: e,
    });
    let { processList } = this.state;
    processList = processList.map(item => {
      if (item.processName === processName) {
        item.status = e;
      }
      return item;
    });
    this.setState({
      processList,
    });
  };

  public tabsChange = e => {
    let status = false;
    let { processList } = this.state;
    processList = processList.map(item => {
      if (item.processName === e) {
        status = item.status;
      }
      return item;
    });
    this.setState(
      {
        currentProcessName: e,
        status,
        processList,
      },
      () => {
        this.fetchData(e);
      }
    );
  };

  public handleApproveGroup = (e, processId, taskId) => {
    let fristChange = false;
    let processList = [...this.state.processList];
    processList = processList.map(tab => {
      if (tab.processId === processId) {
        tab.tasks.map((task, tIndex) => {
          if (task.taskId === taskId) {
            task.approveGroupList = e;
            if (tIndex === 0) {
              fristChange = true;
            }
          }
          if (fristChange && tIndex === tab.tasks.length - 1) {
            task.approveGroupList = e;
          }
        });
      }
      return tab;
    });
    this.setState({
      processList,
    });
  };

  public onSave = async () => {
    const { taskApproveGroupList } = this.state;
    const isEvery = taskApproveGroupList.every(item => {
      return item.approveGroupList && item.approveGroupList.length > 0;
    });
    if (!isEvery) {
      return notification.error({
        message: '确认所有审批节点都已选中审批组',
      });
    }
  };

  public onReset = async () => {
    this.setState({
      resetVisible: true,
    });
  };

  public getActionClass = (taskType, processName) => {
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

  public changeData = data => {
    const { currentProcessName, processList } = this.state;
    const pIndex = _.findIndex(processList, item => {
      return item.processName === currentProcessName;
    });
    const _processList = { ...data };
    let _tasks = [..._processList.tasks];
    _tasks = _tasks.map(item => {
      item.approveGroupList = item.approveGroups.map(ap => ap.approveGroupId);
      if (item.taskType === 'modifyData') {
        item.index = 2;
      } else if (item.taskType === REVIEW_DATA) {
        item.index = 1;
      } else if (item.taskType === 'insertData') {
        item.index = 0;
      } else {
        item.index = 4;
      }
      return item;
    });
    _tasks = _.sortBy(_tasks, 'index');

    const reviewDataLength = _.filter(_tasks, item => {
      return item.taskType === REVIEW_DATA;
    }).length;
    _processList.reviewDataLength = reviewDataLength;

    _processList.tasks = _tasks;
    processList[pIndex] = _processList;
    this.setState(
      {
        processList,
      },
      () => {
        notification.success({
          message: `保存成功`,
        });
      }
    );
  };

  public onConfirm = async () => {
    const { currentProcessName, processList } = this.state;
    const pIndex = _.findIndex(processList, item => {
      return item.processName === currentProcessName;
    });
    let addFlag = false;
    const tasks = processList[pIndex].tasks;

    const length = _.filter(tasks, item => {
      return item.taskType === REVIEW_DATA;
    }).length;

    const noneGroupIndex = _.findIndex(tasks, item => {
      // if (_.isNumber(item.taskId) || processList[pIndex].reviewDataLength !== length) {
      //   addFlag = true;
      // }
      if (
        (item.editId && _.isNumber(item.editId)) ||
        processList[pIndex].reviewDataLength !== length
      ) {
        addFlag = true;
      }
      return (
        !item ||
        !item.approveGroupList ||
        item.approveGroupList.length <= 0 ||
        /^[0-9]/.test(_.trim(item.taskName))
      );
    });

    if (noneGroupIndex >= 0) {
      return notification.error({
        message: `请为每个节点命名，并至少选择一个审批组。节点名称不能以数字开头。`,
      });
    }

    const taskList = tasks.map((item, index) => {
      return {
        ...item,
        sequence: index,
        taskType: TASKTYPE[item.taskType],
        actionClass: this.getActionClass(item.taskType, currentProcessName),
      };
    });

    // 如果没有增加节点不调wkProcessModify接口
    let taskListData = [...tasks];
    if (addFlag) {
      const { error: merror, data } = await wkProcessModify({
        processName: currentProcessName,
        taskList,
      });
      if (merror) return;
      const tasksData = _.sortBy(data.tasks, ['sequence']);
      taskListData = tasksData.map((item, index) => {
        return {
          ...tasks[index],
          ...item,
        };
      });
      return this.changeData(data);
    }

    const { error: _error, data } = await wkTaskApproveGroupBind({
      processName: currentProcessName,
      taskList: taskListData.map(item => {
        return {
          taskId: item.taskId,
          approveGroupList: item.approveGroupList,
        };
      }),
    });
    if (_error) return;
    this.changeData(data);
  };

  public handleResetOk = async () => {
    this.fetchData(this.state.currentProcessName);
    this.setState({
      resetVisible: false,
    });
  };

  public handleResetCancel = e => {
    this.setState({
      resetVisible: false,
    });
  };

  public configListChange = async (e, processId, param) => {
    const processList = [...this.state.processList];

    const pIndex = _.findIndex(processList, item => {
      return item.processId === processId;
    });
    const processConfigs = processList[pIndex].processConfigs;

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
    this.setState({
      processConfigs,
    });
    notification.success({
      message: `修改全局配置成功`,
    });
  };

  public handleClick = (e, processId) => {
    const processList = [...this.state.processList];
    const { currentProcessName } = this.state;

    const pIndex = _.findIndex(processList, item => {
      return item.processId === processId;
    });
    const tasks = processList[pIndex].tasks;

    let taskName = '';
    const length = _.filter(tasks, item => {
      if (item.taskType === REVIEW_DATA && !taskName) {
        taskName = item.taskName;
      }
      return item.taskType === REVIEW_DATA;
    }).length;

    let taskApproveGroupList = tasks.concat({
      taskName: `${currentProcessName}复核节点`,
      index: `1.${length}`,
      taskType: REVIEW_DATA,
      taskId: _.random(10, true),
      editId: _.random(10, true),
      actionClass: this.getActionClass(TASKTYPE[REVIEW_DATA], currentProcessName),
    });

    taskApproveGroupList = _.sortBy(taskApproveGroupList, ['index']);

    processList[pIndex].tasks = taskApproveGroupList;
    processList[pIndex].tabName = processList[pIndex].processName + '审批';

    this.setState({
      processList,
    });
  };

  public handleGroupNamge = (e, processId, taskId) => {
    const processList = [...this.state.processList];

    const pIndex = _.findIndex(processList, item => {
      return item.processId === processId;
    });
    let tasks = processList[pIndex].tasks;

    tasks = tasks.map(item => {
      if (item.taskId === taskId) {
        item.taskName = e;
        item.editId = _.random(10, true);
      }
      return item;
    });
    processList[pIndex].tasks = tasks;
    this.setState({
      processList,
    });
  };

  public handleDeleteReview = (e, processId, taskId) => {
    const processList = [...this.state.processList];

    const pIndex = _.findIndex(processList, item => {
      return item.processId === processId;
    });

    let tasks = processList[pIndex].tasks;

    const reviewLength = _.filter(tasks, item => {
      return item.taskType === REVIEW_DATA;
    }).length;

    if (reviewLength <= 1) return message.info('至少保留一个复合审批节点');

    tasks = _.filter(tasks, item => {
      return item.taskId !== taskId;
    });
    processList[pIndex].tasks = tasks;
    this.setState({
      processList,
    });
  };

  public renderTabs = tab => {
    return (
      <div
        style={{
          width: '400px',
          background: '#FFF',
          padding: '30px',
          float: 'right',
          height: '100%',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={tab.status}
            onClick={e => this.handleStatus(e, tab.processName)}
          />
          <span style={{ marginLeft: '6px' }}>启用流程</span>
        </div>
        <div style={{ marginTop: '60px', minHeight: '60px' }}>
          <p style={{ fontWeight: 'bolder' }}>全局配置</p>
          {tab.processConfigs.map(item => {
            return (
              <p key={item.id}>
                <Checkbox
                  onChange={e => this.configListChange(e, tab.processId, item)}
                  defaultChecked={!!item.status}
                >
                  {GTE_PROCESS_CONFIGS(item.configName)}
                </Checkbox>
              </p>
            );
          })}
        </div>
        <div className={styles.configButtonBox}>
          <p>
            <Popconfirm
              title="确认保存?"
              onConfirm={this.onConfirm}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary">保存</Button>
            </Popconfirm>
          </p>
          <p>
            <Button onClick={this.onReset}>重置</Button>
          </p>
          <p className={styles.message}>离开页面前，请确认所做的修改已经保存。</p>
        </div>
      </div>
    );
  };

  public render() {
    console.log(this.state.processList);
    return (
      <div className={styles.approvalProcessConfiguration}>
        <Page>
          <Tabs animated={false} onChange={this.tabsChange}>
            {!this.state.processList ? (
              <TabPane>
                <div
                  style={{
                    background: '#FFF',
                    padding: '30px',
                    width: '100%',
                  }}
                >
                  <Skeleton active={true} />
                </div>
              </TabPane>
            ) : (
              this.state.processList.map((tab, index) => {
                return (
                  <TabPane tab={tab.processName + '审批'} key={tab.processName}>
                    <div
                      style={{
                        marginRight: '2px',
                        background: '#FFF',
                        padding: '30px',
                        position: 'relative',
                        height: '100%',
                      }}
                    >
                      <p className={styles.bolder}>审批流程</p>
                      <List bordered={false} loading={this.state.loading}>
                        <List.Item>
                          <div className={styles.approvalNode} style={{ background: '#e8e5e5' }}>
                            <Icon type="more" style={{ width: '4px', color: '#999' }} />
                            <Icon type="more" style={{ width: '4px', color: '#999' }} />
                            <span style={{ marginLeft: '30px' }}>发起审批</span>
                          </div>
                          <span className={styles.approvalIcon}>
                            {/* <Icon type="plus-circle" /> */}
                          </span>
                        </List.Item>
                        {tab.tasks.map((task, gIndex) => {
                          if (!task) return;
                          return (
                            <List.Item key={task.taskId}>
                              <div
                                className={styles.approvalNode}
                                style={{ background: '#e8e5e5' }}
                              >
                                <div
                                  style={{
                                    display: 'inline-block',
                                    float: 'left',
                                    marginRight: '150px',
                                  }}
                                >
                                  <Icon type="more" style={{ width: '4px', color: '#999' }} />
                                  <Icon type="more" style={{ width: '4px', color: '#999' }} />
                                  {/* <span style={{ marginLeft: '30px' }}>{group.taskName}</span> */}
                                  <span
                                    style={{
                                      marginLeft: '30px',
                                      display: 'inline-block',
                                      width: '150px',
                                    }}
                                  >
                                    <Paragraph
                                      ellipsis={true}
                                      editable={{
                                        onChange: e =>
                                          this.handleGroupNamge(e, tab.processId, task.taskId),
                                      }}
                                      onChange={e =>
                                        this.handleGroupNamge(e, tab.processId, task.taskId)
                                      }
                                    >
                                      {task.taskName}
                                    </Paragraph>
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: 'inline-block',
                                    float: 'left',
                                    marginLeft: '40px',
                                    width: '600px',
                                  }}
                                >
                                  <span className={styles.selectTile}>选择审批组</span>
                                  <Select
                                    style={{
                                      width: '280px',
                                    }}
                                    editing={true}
                                    fetchOptionsOnSearch={true}
                                    showSearch={true}
                                    allowClear={true}
                                    placeholder="请输入内容搜索"
                                    mode="multiple"
                                    disabled={gIndex === tab.tasks.length - 1}
                                    value={_.get(task, 'approveGroupList') || []}
                                    options={async (value: string = '') => {
                                      const { data, error } = await wkApproveGroupList();
                                      if (error) return [];
                                      return _.sortBy(
                                        data.map(item => ({
                                          value: item.approveGroupId,
                                          label: item.approveGroupName,
                                        })),
                                        'label'
                                      );
                                    }}
                                    onChange={e =>
                                      this.handleApproveGroup(e, tab.processId, task.taskId)
                                    }
                                  />
                                </div>
                              </div>
                              {task.taskType === REVIEW_DATA ? (
                                <span className={styles.approvalIcon}>
                                  <Icon
                                    type="minus-circle"
                                    onClick={e => {
                                      this.handleDeleteReview(e, tab.processId, task.taskId);
                                    }}
                                  />
                                  {/* <Icon type="plus-circle" onClick={(e) => {this.handleAddReview(e, group)}}/> */}
                                </span>
                              ) : (
                                <span className={styles.approvalIcon} />
                              )}
                            </List.Item>
                          );
                        })}
                        <List.Item>
                          <div
                            className={styles.approvalNode}
                            style={{
                              border: '2px dashed #e8e5e5',
                              textAlign: 'center',
                              cursor: 'pointer',
                            }}
                            onClick={e => {
                              return this.handleClick(e, tab.processId);
                            }}
                          >
                            <Icon type="plus" style={{ fontSize: '12px' }} />
                            增加审批节点
                          </div>
                          <span className={styles.approvalIcon} />
                        </List.Item>
                      </List>
                    </div>
                    {this.renderTabs(tab)}
                  </TabPane>
                );
              })
            )}
          </Tabs>
          <Modal
            title="消息提示"
            visible={this.state.resetVisible}
            onOk={this.handleResetOk}
            onCancel={this.handleResetCancel}
          >
            <p>重置后即放弃当前页面的编辑，恢复到编辑前的状态。是否确定重置？</p>
          </Modal>
        </Page>
      </div>
    );
  }
}

export default ApprovalProcessConfiguration;
