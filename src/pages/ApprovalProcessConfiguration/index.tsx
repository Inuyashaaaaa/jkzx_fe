import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  Button,
  Checkbox,
  Drawer,
  notification,
  Popconfirm,
  Row,
  Switch,
  Tabs,
  List,
  Icon,
  Select,
} from 'antd';
import React, { PureComponent } from 'react';
import { wkApproveGroupList } from '@/services/auditing';
import { wkTaskApproveGroupList } from '@/services/approvalProcessConfiguration';
import styles from './ApprovalProcessConfiguration.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class ApprovalProcessConfiguration extends PureComponent {
  public state = {
    approveGroupList: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchData();
  };

  public fetchData = async () => {
    const { data, error } = await wkApproveGroupList();
    if (error) return;
    this.setState({
      approveGroupList: data,
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
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={true} />
          <span style={{ marginLeft: '6px' }}>启用流程</span>
        </div>
        <div style={{ marginTop: '60px' }}>
          <p style={{ fontWeight: 'bolder' }}>全局配置</p>
          <p>
            <Checkbox>不允许审批自己发起的审批单</Checkbox>
          </p>
          {/* <p><Checkbox>使用最末一个身披着的数据权限（不勾选则使用发起者的数据权限）</Checkbox></p> */}
        </div>
        <div className={styles.configButtonBox}>
          <p>
            <Button type="primary">保存</Button>
          </p>
          <p>
            <Button>重置</Button>
          </p>
          {/* <p>
            <Button>预览流程图</Button>
          </p> */}
          <p className={styles.message}>离开页面前，请确认所做的修改已经保存。</p>
        </div>
      </div>
    );
  };

  public render() {
    return (
      <div className={styles.approvalProcessConfiguration}>
        <PageHeaderWrapper>
          <Tabs defaultActiveKey="1">
            <TabPane tab="交易录入审批" key="1">
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
                <List bordered={false}>
                  <List.Item>
                    <div className={styles.approvalNode} style={{ background: '#e8e5e5' }}>
                      <Icon type="more" style={{ width: '4px', color: '#999' }} />
                      <Icon type="more" style={{ width: '4px', color: '#999' }} />
                      <span style={{ marginLeft: '20px' }}>发起审批</span>
                    </div>
                    <span className={styles.approvalIcon}>{/* <Icon type="plus-circle" /> */}</span>
                  </List.Item>
                  <List.Item>
                    <div className={styles.approvalNode} style={{ background: '#e8e5e5' }}>
                      <Icon type="more" style={{ width: '4px', color: '#999' }} />
                      <Icon type="more" style={{ width: '4px', color: '#999' }} />
                      <span style={{ marginLeft: '20px' }}>审批节点</span>
                      <span className={styles.selectTile}>选择审批组</span>
                      <Select defaultValue="a1" style={{ width: 500 }} mode="multiple">
                        {this.state.approveGroupList.map(item => (
                          <Option key={item.approveGroupId}>{item.approveGroupName}</Option>
                        ))}
                      </Select>
                    </div>
                    <span className={styles.approvalIcon}>
                      {/* <Icon type="minus-circle" />  
                      <Icon type="plus-circle" /> */}
                    </span>
                  </List.Item>
                  {/* <List.Item>
                    <div className={styles.approvalNode}  style={{ background: '#cce7f2' }}>
                      <Icon type="more" style={{ width: '4px', color: '#999' }}/>
                      <Icon type="more" style={{ width: '4px', color: '#999' }}/>
                      <span style={{ marginLeft: '20px' }}>审批节点</span>
                      <span className={styles.selectTile}>选择审批组</span>
                      <Select
                        defaultValue="a1"
                        style={{ width: 500 }}
                        mode="multiple"
                      >
                        <Option key='1'>1</Option>
                        <Option key='2'>2</Option>
                        <Option key='3'>3</Option>
                      </Select>
                    </div>
                    <span className={styles.approvalIcon}>
                      <Icon type="minus-circle" />  
                      <Icon type="plus-circle" />
                    </span>
                  </List.Item>
                  <List.Item>
                    <div className={styles.approvalNode}  style={{ border: '1px dashed #e8e5e5' }}>
                      <Button><Icon type="plus" style={{fontSize: '12px'}} />增加节点</Button>
                    </div>
                    <span className={styles.approvalIcon}></span>
                  </List.Item> */}
                </List>
              </div>
            </TabPane>
          </Tabs>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ApprovalProcessConfiguration;
