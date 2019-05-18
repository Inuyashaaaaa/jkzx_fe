import React from 'react';
import { PureStateComponent } from '@/components/Components';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card } from 'antd';
import Mock from 'mockjs';
import BackBtn from '@/components/BackBtn';
import StandardTable from '@/components/_StandardTable';
import { delay } from '@/utils';

class CustomValuation extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const tableProps = {
      columns: [
        {
          title: '交易对手',
          dataIndex: '交易对手',
        },
        {
          title: '交易ID',
          dataIndex: '交易ID',
        },
        {
          title: '交易日期',
          dataIndex: '交易日期',
        },
        {
          title: '上次估值日期',
          dataIndex: '上次估值日期',
        },
        {
          title: '交易邮箱',
          dataIndex: '交易邮箱',
        },
        {
          title: '估值',
          dataIndex: '估值',
        },
      ],
      dataSource() {
        return delay(
          1000,
          Mock.mock({
            'list|1-10': [
              {
                'id|+1': 0,
                交易对手: '@word',
                交易ID: '@word',
                交易日期: '@word',
                上次估值日期: '@word',
                交易邮箱: '@word',
                估值: '@word',
              },
            ],
          }).list
        );
      },
      section: [
        {
          name: '持仓',
          type: 'primary',
        },
      ],
      extra: [
        {
          name: '批量估值',
          batch: true,
        },
        {
          name: '批量发送报告',
          batch: true,
        },
      ],
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false} extra={<BackBtn />}>
          <StandardTable {...tableProps} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CustomValuation;
