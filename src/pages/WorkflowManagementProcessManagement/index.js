import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { PureStateComponent } from '@/components/Components';
import StandardTable from '@/components/_StandardTable';
import { delay, mockData } from '@/utils';
import { Divider, Tag } from 'antd';
import React from 'react';

class WorkflowManagementProcessManagement extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper>
        <StandardTable
          {...{
            selectedRowKeys: false,
            title: () => '审批任务',
            columns: [
              {
                title: '交易ID',
                dataIndex: '交易ID',
              },
              {
                title: '交易对手',
                dataIndex: '交易对手',
              },
              {
                title: '交易日',
                dataIndex: '交易日',
              },
              {
                title: '销售',
                dataIndex: '销售',
              },
              {
                title: '交易簿',
                dataIndex: '交易簿',
              },
            ],
            dataSource() {
              return delay(
                1000,
                mockData({
                  交易ID: '@integer(1, 100000)',
                  交易对手: '@first',
                  交易日: '@date("yyyy-MM-dd")',
                  销售: '@first',
                  交易簿: '@word',
                })
              );
            },
          }}
        />
        <Divider />
        <StandardTable
          {...{
            selectedRowKeys: false,
            title: () => '你发起的任务',
            columns: [
              {
                title: '交易ID',
                dataIndex: '交易ID',
              },
              {
                title: '交易对手',
                dataIndex: '交易对手',
              },
              {
                title: '交易日',
                dataIndex: '交易日',
              },
              {
                title: '销售',
                dataIndex: '销售',
              },
              {
                title: '交易簿',
                dataIndex: '交易簿',
              },
              {
                title: '审批状态',
                dataIndex: '审批状态',
                render: val => {
                  const status = {
                    success: 'green',
                    done: 'purple',
                    pending: 'orange',
                  };
                  return <Tag color={status[val]}>{val}</Tag>;
                },
              },
              {
                title: '下一步审批人员',
                dataIndex: '下一步审批人员',
              },
            ],
            dataSource() {
              return delay(
                1000,
                mockData({
                  交易ID: '@integer(1, 100000)',
                  交易对手: '@first',
                  交易日: '@date("yyyy-MM-dd")',
                  销售: '@first',
                  交易簿: '@word',
                  审批状态: ['success', 'done', 'pending'],
                  下一步审批人员: '@first',
                })
              );
            },
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default WorkflowManagementProcessManagement;
