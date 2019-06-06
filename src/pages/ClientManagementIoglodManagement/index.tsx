import Page from '@/containers/Page';
import { delay, mockData } from '@/tools';
import React, { PureComponent } from 'react';
import History from './History';
import Processed from './Processed';
import TabHeader from '@/containers/TabHeader';

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
      <Page
        title="台账管理"
        footer={
          <TabHeader
            activeKey={this.state.activeTabKey}
            onChange={this.onHeaderTabChange}
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
          />
        }
      >
        {this.state.activeTabKey === 'processed' && <Processed />}
        {this.state.activeTabKey === 'history' && <History />}
      </Page>
    );
  }
}

export default ClientManagementIoglodManagement;
