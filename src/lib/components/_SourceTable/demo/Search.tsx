import { delay, mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';
import SourceTable from '..';

class GeneralSourceTable extends PureComponent<any, any> {
  public onFetch = () => {
    return delay(
      1000,
      mockData({
        name: '@name',
        money: '@integer(10, 100)',
      })
    );
  };

  public onCreate = () => {
    return delay(
      1000,
      mockData(
        {
          name: '@name',
          money: '@integer(10, 100)',
        },
        '1'
      )
    );
  };

  public onSearch = () => {
    return this.onFetch();
  };

  public onSave = () => {
    return delay(1000, true);
  };

  public render() {
    return (
      <SourceTable
        rowKey="id"
        onFetch={this.onFetch}
        onSearch={this.onSearch}
        searchFormControls={[
          {
            control: {
              label: '交易对手',
            },
            dataIndex: '交易对手',
            input: {
              type: 'select',
              options: [
                {
                  label: '交易对手1',
                  value: '交易对手1',
                },
                {
                  label: '交易对手2',
                  value: '交易对手2',
                },
              ],
            },
          },
          {
            control: {
              label: '分公司',
            },
            dataIndex: '分公司',
            input: {
              type: 'select',
              options: [
                {
                  label: '分公司1',
                  value: '分公司1',
                },
                {
                  label: '分公司2',
                  value: '分公司2',
                },
              ],
            },
          },
          {
            control: {
              label: '营业部',
            },
            dataIndex: '营业部',
            input: {
              type: 'select',
              options: [
                {
                  label: '营业部1',
                  value: '营业部1',
                },
                {
                  label: '营业部2',
                  value: '营业部2',
                },
              ],
            },
          },
        ]}
        tableColumnDefs={[
          {
            headerName: 'name',
            field: 'name',
          },
          {
            headerName: 'money',
            field: 'money',
            input: {
              type: 'number',
              precision: 2,
              format: '¥ 0,0.00',
            },
          },
        ]}
      />
    );
  }
}

export default {
  component: GeneralSourceTable,
  title: '搜索',
  sort: 1,
};
