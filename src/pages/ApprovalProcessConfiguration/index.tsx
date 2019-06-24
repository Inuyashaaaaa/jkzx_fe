import Page from '@/containers/Page';
import React, { PureComponent } from 'react';
import TabHeader from '@/containers/TabHeader';
import { wkProcessList } from '@/services/approvalProcessConfiguration';
import _ from 'lodash';
import { REVIEW_DATA } from './constants';
import Operation from './Operation';

class ApprovalProcessManage extends PureComponent {
  public state = {
    processList: [],
    activeKey: null,
    tabList: [],
  };

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

    if (!this.state.activeKey) {
      this.setState({
        activeKey: processList[0].processName,
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
        // if (task.taskType === 'modifyData') {
        //   task.index = 2;
        // } else if (task.taskType === REVIEW_DATA) {
        //   task.index = 1;
        // } else if (task.taskType === 'insertData') {
        //   task.index = 0;
        // } else {
        //   task.index = 4;
        // }
        return task;
      });

      // tab.tasks = _.sortBy(tab.tasks, ['index']);
      return tab;
    });

    const tabList = processList.map(pro => {
      return {
        key: `${pro.processName}`,
        tab: `${pro.processName}审批`,
      };
    });

    this.setState({
      loading: false,
      processList: tabsData,
      tabList,
      activeKey: processList[0].processName,
    });
  };

  public onTabChange = key => {
    this.setState({
      activeKey: key,
    });
  };

  public render() {
    const { tabList } = this.state;
    return (
      <Page
        title="流程管理"
        card={false}
        footer={
          <TabHeader
            activeKey={this.state.activeKey}
            onChange={this.onTabChange}
            tabList={tabList}
          />
        }
      >
        {this.state.activeKey ? <Operation processName={this.state.activeKey} /> : null}
      </Page>
    );
  }
}

export default ApprovalProcessManage;
