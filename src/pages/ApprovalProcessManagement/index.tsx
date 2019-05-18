import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { PureComponent } from 'react';
import Pending from './Pending';
import Related from './Related';

class ApprovalProcessManage extends PureComponent {
  public state = {
    activeKey: 'pending',
  };

  public onTabChange = key => {
    this.setState({
      activeKey: key,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper
        title="流程管理"
        tabList={[{ key: 'pending', tab: '待处理事项' }, { key: 'related', tab: '与我相关的' }]}
        tabActiveKey={this.state.activeKey}
        onTabChange={this.onTabChange}
      >
        {this.state.activeKey === 'pending' && <Pending />}
        {this.state.activeKey === 'related' && <Related />}
      </PageHeaderWrapper>
    );
  }
}

export default ApprovalProcessManage;
