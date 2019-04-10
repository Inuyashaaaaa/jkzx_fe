import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { Button, Checkbox, Drawer, notification, Popconfirm, Row, Switch, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import styles from './ApprovalProcessConfiguration.less';

const TabPane = Tabs.TabPane;

class ApprovalProcessConfiguration extends PureComponent {
  public state = {};

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {};

  public render() {
    return (
      <div className={styles.approvalProcessConfiguration}>
        <PageHeaderWrapper>
          <Tabs defaultActiveKey="1">
            <TabPane tab="交易录入审批" key="1">
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
                  <span>启用流程</span>
                </div>
                <div style={{ marginTop: '60px' }}>
                  <p style={{ fontWeight: 'bolder' }}>全局配置</p>
                  <Checkbox>不允许审批自己发起的审批单</Checkbox>
                  <Checkbox>使用最末一个身披着的数据权限（不勾选则使用发起者的数据权限）</Checkbox>
                </div>
                <div className={styles.configButtonBox}>
                  <p>
                    <Button type="primary">保存</Button>
                  </p>
                  <p>
                    <Button>重置</Button>
                  </p>
                  <p>
                    <Button>预览流程图</Button>
                  </p>
                  <p className={styles.message}>离开页面前，请确认所做的修改已经保存。</p>
                </div>
              </div>
              <div
                style={{
                  marginRight: '320px',
                  background: '#FFF',
                  padding: '30px',
                  position: 'relative',
                  height: '100%',
                }}
              >
                <p>审批流程</p>
              </div>
            </TabPane>
          </Tabs>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ApprovalProcessConfiguration;
