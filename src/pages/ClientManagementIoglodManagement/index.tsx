import SourceTable from '@/components/SourceTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { delay, mockData } from '@/utils';
import React, { PureComponent } from 'react';
import History from './History';
import Processed from './Processed';

class ClientManagementIoglodManagement extends PureComponent {
  public state = {
    dataSource: [],
    loading: false,
    searchFormData: {},
    activeTabKey: 'processed',
  };

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = () => {
    this.setState({
      loading: true,
    });
    delay(1000, mockData({})).then(res => {
      this.setState({
        loading: false,
        dataSource: res,
      });
    });
  };

  public onReset = () => {
    this.setState(
      {
        searchFormData: {},
      },
      () => {
        this.fetchTable();
      }
    );
  };

  public onSearchFormChange = params => {
    this.setState({
      searchFormData: params.values,
    });
  };

  public onHeaderTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  public render() {
    return (
      <PageHeaderWrapper
        title="台账管理"
        tabList={[
          {
            key: 'processed',
            tab: '待处理台账',
          },
          {
            key: 'history',
            tab: '历史台账',
          },
        ]}
        tabActiveKey={this.state.activeTabKey}
        onTabChange={this.onHeaderTabChange}
      >
        {this.state.activeTabKey === 'processed' && <Processed />}
        {this.state.activeTabKey === 'history' && <History />}
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementIoglodManagement;
