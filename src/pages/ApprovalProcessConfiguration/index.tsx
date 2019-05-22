import Page from '@/containers/Page';
import {
  wkProcessList,
  wkProcessStatusModify,
  wkProcessGet,
  wkProcessConfigModify,
  wkTaskApproveGroupBind,
  wkProcessModify,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import {
  Button,
  Checkbox,
  Icon,
  List,
  Modal,
  notification,
  Popconfirm,
  Select,
  Switch,
  Tabs,
  Typography,
} from 'antd';
import React, { PureComponent } from 'react';
import styles from './ApprovalProcessConfiguration.less';
import _ from 'lodash';
import { GTE_PROCESS_CONFIGS, TASKTYPE } from './constants';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { Paragraph } = Typography;

class ApprovalProcessConfiguration extends PureComponent {
  public state = {
    approveGroupList: [],
    taskApproveGroupList: [],
    processList: [],
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
    const res = await Promise.all([
      wkProcessGet({
        processName: currentProcessName ? currentProcessName : processList[0].processName,
      }),
      wkApproveGroupList(),
    ]);
    const [process, approveGroupList] = res;

    if (process.error) {
      return this.setState({
        loading: false,
        taskApproveGroupList: [],
      });
    }

    const { tasks, processConfigs } = process.data;

    const tabsData = processList.map(item => {
      item.tabName = item.processName + '审批';
      return item;
    });

    let taskData = tasks.map((item, index) => {
      item.approveGroupList = (item.approveGroups || []).map(item => item.approveGroupId);
      if (item.taskType === 'modifyData') {
        item.index = 2;
      } else if (item.taskType === 'reviewData') {
        item.index = 1;
      } else if (item.taskType === 'insertData') {
        item.index = 0;
      } else {
        item.index = 4;
      }
      return item;
    });
    taskData = _.sortBy(taskData, ['index', 'sequence']);
    this.setState({
      loading: false,
      approveGroupList: approveGroupList.data || [],
      taskApproveGroupList: taskData,
      processList: tabsData,
      processConfigs,
      status: tabsData[0].status,
    });
  };

  public handleStatus = async (e, processName) => {
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

  public handleApproveGroup = (e, taskId) => {
    let { taskApproveGroupList } = this.state;
    let fristChange = false;
    taskApproveGroupList = taskApproveGroupList.map((item, index) => {
      if (item.taskId === taskId) {
        item.approveGroupList = e;
        if (index === 0) {
          fristChange = true;
        }
      }
      if (fristChange && index === taskApproveGroupList.length - 1) {
        item.approveGroupList = e;
      }
      return item;
    });
    this.setState({
      taskApproveGroupList,
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

  public onConfirm = async () => {
    const { currentProcessName, status, processConfigs, taskApproveGroupList } = this.state;
    const noneGroupIndex = _.findIndex(taskApproveGroupList, item => {
      return (
        !item ||
        !item.approveGroupList ||
        item.approveGroupList.length <= 0 ||
        _.trim(item.taskName).length <= 3 ||
        /^[0-9]/.test(_.trim(item.taskName))
      );
    });

    const reviewLength = _.filter(this.state.taskApproveGroupList, item => {
      return item.taskType === 'reviewData';
    }).length;

    if (reviewLength < 1) {
      return notification.error({
        message: `至少要有一个复合审批节点`,
      });
    }

    if (noneGroupIndex >= 0) {
      return notification.error({
        message: `请为每个节点命名为首位不能为数字长度大于三位，并且至少选择一个审批组`,
      });
    }

    let taskList = taskApproveGroupList.map((item, index) => {
      item.sequence = index;
      item.taskType = TASKTYPE[item.taskType];
      item.actionClass =
        item.taskType === 'REVIEW_DATA'
          ? 'tech.tongyu.bct.workflow.process.func.action.cap.FundInputTaskAction'
          : 'tech.tongyu.bct.workflow.process.func.action.cap.FundReviewTaskAction';
      return item;
    });

    const { error: merror, data } = await wkProcessModify({
      processName: currentProcessName,
      taskList,
    });
    const tasks = _.sortBy(data.tasks, ['sequence']);
    const taskListData = taskApproveGroupList.map((item, index) => {
      return {
        ...tasks[index],
        ...item,
      };
    });

    const requests = () =>
      Promise.all([
        wkProcessStatusModify({ processName: currentProcessName, status }),
        wkTaskApproveGroupBind({
          processName: currentProcessName,
          taskList: taskListData.map(item => {
            return {
              taskId: item.taskId,
              approveGroupList: item.approveGroupList,
            };
          }),
        }),
        wkProcessConfigModify({
          configList: processConfigs.map(item => {
            return {
              configId: item.configId,
              status: item.status,
            };
          }),
        }),
      ]);
    const res = await requests();
    const error = res.some(item => {
      return item.error;
    });
    if (error) return;

    notification.success({
      message: `保存成功`,
    });
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

  public configListChange = (e, param) => {
    const processConfigs = this.state.processConfigs.map(item => {
      if (item.id === param.id) {
        item.status = e.target.checked;
      }
      return item;
    });
    this.setState({
      processConfigs,
    });
  };

  public handleClick = () => {
    let taskName = '';
    const length = _.filter(this.state.taskApproveGroupList, item => {
      if (item.taskType === 'reviewData' && !taskName) {
        taskName = item.taskName;
      }
      return item.taskType === 'reviewData';
    }).length;
    let taskApproveGroupList = this.state.taskApproveGroupList.concat({
      taskName: `${taskName}${length + 1}`,
      index: `1.${length}`,
      taskType: 'reviewData',
      taskId: _.random(10, true),
      actionClass: 'tech.tongyu.bct.workflow.process.func.action.cap.FundReviewTaskAction',
    });
    taskApproveGroupList = _.sortBy(taskApproveGroupList, ['index', 'sequence']);
    this.setState({
      taskApproveGroupList,
    });
  };

  public handleGroupNamge = (e, param = {}) => {
    let taskApproveGroupList = [...this.state.taskApproveGroupList];
    taskApproveGroupList.map(item => {
      if (item.taskId === param.taskId) {
        item.taskName = e;
      }
      return item;
    });
    this.setState({
      taskApproveGroupList,
    });
  };

  public handleDeleteReview = (e, param = {}) => {
    const { taskApproveGroupList } = this.state;
    const reviewLength = _.filter(taskApproveGroupList, item => {
      return item.taskType === 'reviewData';
    }).length;

    if (reviewLength <= 1) return;

    this.setState({
      taskApproveGroupList: _.filter(taskApproveGroupList, item => {
        return item.taskId !== param.taskId;
      }),
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
          {this.state.processConfigs.map(item => {
            return (
              <p key={item.id}>
                <Checkbox onChange={e => this.configListChange(e, item)} checked={!!item.status}>
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
            ,
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
    return (
      <div className={styles.approvalProcessConfiguration}>
        <Page>
          <Tabs defaultActiveKey="资金录入经办复合流程" onChange={this.tabsChange}>
            {this.state.processList.map((tab, index) => {
              return (
                <TabPane tab={tab.tabName} key={tab.processName}>
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
                      {this.state.taskApproveGroupList.map((group, gIndex) => {
                        if (!group) return;
                        return (
                          <List.Item key={group.taskId}>
                            <div className={styles.approvalNode} style={{ background: '#e8e5e5' }}>
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
                                    ellipsis
                                    editable={{ onChange: e => this.handleGroupNamge(e, group) }}
                                    onChange={e => this.handleGroupNamge(e, group)}
                                  >
                                    {group.taskName}
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
                                  className={styles.select}
                                  value={group.approveGroupList}
                                  mode="multiple"
                                  disabled={gIndex === this.state.taskApproveGroupList.length - 1}
                                  onChange={e => this.handleApproveGroup(e, group.taskId)}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {this.state.approveGroupList.map(item => {
                                    return (
                                      <Option key={item.approveGroupId}>
                                        {item.approveGroupName}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </div>
                            </div>
                            {group.taskType === 'reviewData' ? (
                              <span className={styles.approvalIcon}>
                                <Icon
                                  type="minus-circle"
                                  onClick={e => {
                                    this.handleDeleteReview(e, group);
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
                          style={{ border: '2px dashed #e8e5e5' }}
                        >
                          <Button onClick={this.handleClick} style={{ height: 60 }}>
                            <Icon type="plus" style={{ fontSize: '12px' }} />
                            增加审批节点
                          </Button>
                        </div>
                        <span className={styles.approvalIcon} />
                      </List.Item>
                    </List>
                  </div>
                  {this.renderTabs(tab)}
                </TabPane>
              );
            })}
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
