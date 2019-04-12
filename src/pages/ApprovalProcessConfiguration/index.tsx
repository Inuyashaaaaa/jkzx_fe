import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  wkProcessList,
  wkProcessStatusModify,
  wkTaskApproveGroupCreateBatch,
  wkTaskApproveGroupList,
} from '@/services/approvalProcessConfiguration';
import { wkApproveGroupList } from '@/services/auditing';
import { Button, Checkbox, Icon, List, Modal, notification, Select, Switch, Tabs } from 'antd';
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
    currentProcessName: '交易录入经办复合流程',
    visible: false,
    status: false,
    resetVisible: false,
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
      ]);
    const res = await requests();
    const [taskApproveGroupList, approveGroupList, processList] = res;
    const error = res.some(item => {
      return item.error;
    });

    if (error) {
      return this.setState({
        loading: false,
        taskApproveGroupList: [],
      });
    }

    const tabsData = (processList.data || []).map(item => {
      item.tabName = item.processName.split('经办复合流程')[0] + '审批';
      return item;
    });

    const taskData = (taskApproveGroupList.data || []).map(item => {
      item.approveGroupList = (item.approveGroupDTO || []).map(item => item.approveGroupId);
      return item;
    });

    this.setState({
      loading: false,
      approveGroupList: approveGroupList.data || [],
      taskApproveGroupList: taskData,
      processList: tabsData,
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

  public onProcess = async () => {
    const { currentProcessName, status } = this.state;
    const { data, error } = await wkProcessStatusModify({
      processName: currentProcessName,
      status,
    });
    if (error) return;
  };

  public tabsChange = e => {
    this.setState(
      {
        currentProcessName: e,
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
    this.setState({
      visible: true,
    });
  };

  public onReset = async () => {
    this.setState({
      resetVisible: true,
    });
  };

  public handleOk = async () => {
    this.setState({
      visible: false,
    });
    const { currentProcessName, taskApproveGroupList } = this.state;
    const { error } = await wkTaskApproveGroupCreateBatch({
      processName: currentProcessName,
      taskList: taskApproveGroupList,
    });
    if (error) return;
    notification.success({
      message: `保存成功`,
    });
  };

  public handleCancel = e => {
    this.setState({
      visible: false,
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

  public renderTabs = tab => {
    return (
      <div
        style={{
          width: '300px',
          background: '#FFF',
          padding: '30px',
          float: 'right',
          height: '100%',
          position: 'relative',
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
        <div style={{ marginTop: '60px' }}>
          <p style={{ fontWeight: 'bolder' }}>全局配置</p>
          <p>
            <Checkbox>不允许审批自己发起的审批单</Checkbox>
          </p>
        </div>
        <div className={styles.configButtonBox}>
          <p>
            <Button type="primary" onClick={this.onSave}>
              保存
            </Button>
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
            {this.state.processList.map(tab => {
              return (
                <TabPane tab={tab.tabName} key={tab.processName}>
                  {this.renderTabs(tab)}
                  <div
                    style={{
                      marginRight: '302px',
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
                          <span style={{ marginLeft: '20px' }}>发起审批</span>
                        </div>
                        <span className={styles.approvalIcon}>
                          {/* <Icon type="plus-circle" /> */}
                        </span>
                      </List.Item>
                      {this.state.taskApproveGroupList.map(group => {
                        return (
                          <List.Item key={group.taskId}>
                            <div className={styles.approvalNode} style={{ background: '#e8e5e5' }}>
                              <Icon type="more" style={{ width: '4px', color: '#999' }} />
                              <Icon type="more" style={{ width: '4px', color: '#999' }} />
                              <span style={{ marginLeft: '20px' }}>{group.taskName}</span>
                              <span className={styles.selectTile}>选择审批组</span>
                              <Select
                                value={group.approveGroupList}
                                style={{ width: 500 }}
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
                            <span className={styles.approvalIcon}>
                              {/* <Icon type="minus-circle" />  
                                  <Icon type="plus-circle" /> */}
                            </span>
                          </List.Item>
                        );
                      })}
                    </List>
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
          <Modal
            title="消息提示"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>
              流程被修改后，所有进行中的审批单均会被重置，从第一个节点开始重新进行审批。是否确定保存修改？
            </p>
          </Modal>
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
