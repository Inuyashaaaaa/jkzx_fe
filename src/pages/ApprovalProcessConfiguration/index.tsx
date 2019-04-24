import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  wkGlobalConfigList,
  wkGlobalConfigModify,
  wkProcessList,
  wkProcessStatusModify,
  wkTaskApproveGroupCreateBatch,
  wkTaskApproveGroupList,
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
} from 'antd';
import React, { PureComponent } from 'react';
import styles from './ApprovalProcessConfiguration.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class ApprovalProcessConfiguration extends PureComponent {
  public state = {
    approveGroupList: [],
    taskApproveGroupList: [],
    processList: [],
    loading: false,
    currentProcessName: '资金录入经办复合流程',
    status: false,
    resetVisible: false,
    globalConfigList: [],
    globalConfig: {},
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchData();
  };

  public fetchData = async () => {
    this.setState({
      loading: true,
    });
    const requests = () =>
      Promise.all([
        wkTaskApproveGroupList({ processName: this.state.currentProcessName }),
        wkApproveGroupList(),
        wkProcessList(),
        wkGlobalConfigList({ processName: this.state.currentProcessName }),
      ]);
    const res = await requests();
    const [taskApproveGroupList, approveGroupList, processList, globalConfigList] = res;
    const error = res.some(item => {
      return item.error;
    });

    if (error) {
      return this.setState({
        loading: false,
        taskApproveGroupList: [],
      });
    }

    let tabsData = processList.data.map(item => {
      item.tabName = item.processName.split('经办复合流程')[0] + '审批';
      return item;
    });

    tabsData = tabsData.filter(item => item.tabName.indexOf('资金录入') >= 0);

    const taskData = (taskApproveGroupList.data || []).map(item => {
      item.approveGroupList = (item.approveGroupDTO || []).map(item => item.approveGroupId);
      return item;
    });

    this.setState({
      loading: false,
      approveGroupList: approveGroupList.data || [],
      taskApproveGroupList: taskData,
      processList: tabsData,
      globalConfigList: globalConfigList.data || [],
      globalConfig: globalConfigList.data ? globalConfigList.data[0] : {},
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
        this.fetchData();
      }
    );
  };

  public handleApproveGroup = (e, taskId) => {
    let { taskApproveGroupList } = this.state;
    taskApproveGroupList = taskApproveGroupList.map(item => {
      if (item.taskId === taskId) {
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
    const { currentProcessName, taskApproveGroupList, status, globalConfig } = this.state;
    const requests = () =>
      Promise.all([
        wkProcessStatusModify({ processName: currentProcessName, status }),
        wkTaskApproveGroupCreateBatch({
          processName: currentProcessName,
          taskList: taskApproveGroupList,
        }),
        wkGlobalConfigModify(globalConfig),
      ]);
    const res = await requests();
    const [modify, batch, globalConfigModify] = res;
    const error = res.some(item => {
      return item.error;
    });
    if (error) return;

    notification.success({
      message: `保存成功`,
    });
  };

  public handleResetOk = async () => {
    this.fetchData();
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
    this.setState({
      globalConfig: {
        processName: param.processName,
        id: param.id,
        status: e.target.checked,
      },
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
          {this.state.globalConfigList.map(item => {
            return (
              <p key={item.id}>
                <Checkbox
                  onChange={e => this.configListChange(e, item)}
                  defaultChecked={!!item.status}
                >
                  {item.globalName}
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
        <PageHeaderWrapper>
          <Tabs defaultActiveKey="交易录入经办复合流程" onChange={this.tabsChange}>
            {this.state.processList.map((tab, index) => {
              // 只显示第二条数据
              // if (index !== 1) return null;
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
                      {this.state.taskApproveGroupList.map(group => {
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
                                <span style={{ marginLeft: '30px' }}>{group.taskName}</span>
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
                            <span className={styles.approvalIcon}>
                              {/* <Icon type="minus-circle" />  
                                  <Icon type="plus-circle" /> */}
                            </span>
                          </List.Item>
                        );
                      })}
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
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ApprovalProcessConfiguration;
