import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
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
    tabsData: [
      {
        tabName: '交易录入审批',
        processName: '交易录入经办复合流程',
      },
      {
        tabName: '出入金审批',
        processName: '出入金经办复合流程',
      },
    ],
    approveGroupList: [],
    taskApproveGroupList: [],
    loading: false,
    currentProcessName: '交易录入经办复合流程',
    visible: false,
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
      ]);
    const res = await requests();
    const [taskApproveGroupList, approveGroupList] = res;
    const error = res.some(item => {
      return item.error;
    });

    if (error) {
      return this.setState({
        loading: false,
        taskApproveGroupList: [],
      });
    }
    this.setState({
      loading: false,
      approveGroupList: approveGroupList.data || [],
      taskApproveGroupList: taskApproveGroupList.data || [],
    });
  };

  public handleStatus = async e => {
    // 更新流程状态
    const { currentProcessName } = this.state;
    const { data, error } = await wkProcessStatusModify({
      processName: currentProcessName,
      status: e,
    });
    if (error) return;
    const { message } = error;
    notification.success({
      message: `流程${e ? '启用' : '停用'}成功`,
      description: message,
    });
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
    const { taskApproveGroupList } = this.state;
    taskApproveGroupList.forEach(item => {
      if (item.taskId === taskId) {
        item.approveGroupList = e;
      }
    });
    this.setState({
      taskApproveGroupList,
    });
  };

  public onSave = async () => {
    // 判断所有节点均已分配了审批组，并弹窗确认
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

  public handleOk = async () => {
    this.setState({
      visible: false,
    });
    const { currentProcessName, taskApproveGroupList } = this.state;
    const { data, error } = await wkTaskApproveGroupCreateBatch({
      processName: currentProcessName,
      taskList: taskApproveGroupList,
    });
    if (error) return;
    const { message } = error;
    notification.success({
      message: `保存成功`,
    });
  };

  public handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  public renderTabs = () => {
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
            defaultChecked={true}
            onClick={this.handleStatus}
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
            <Button>重置</Button>
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
            {this.state.tabsData.map(tab => {
              return (
                <TabPane tab={tab.tabName} key={tab.processName}>
                  {this.renderTabs()}
                  <div
                    style={{
                      marginRight: '320px',
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
                                defaultValue={(group.approveGroupDTO || []).map(
                                  dto => dto.approveGroupName
                                )}
                                style={{ width: 500 }}
                                mode="multiple"
                                onChange={e => this.handleApproveGroup(e, group.taskId)}
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
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ApprovalProcessConfiguration;
