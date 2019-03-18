import { delay, mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';
import SourceTable from '..';

class GeneralSourceTable extends PureComponent<any, any> {
  public onSearch = () => {
    return delay(
      1000,
      mockData({
        name: '@name',
        money: '@integer(10, 100)',
      }).map(item => ({
        ...item,
        total: item.money,
      }))
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

  public onSave = () => {
    return delay(1000, true);
  };

  public render() {
    return (
      <SourceTable
        rowKey="id"
        onSave={this.onSave}
        onCreate={this.onCreate}
        onSearch={this.onSearch}
        tableColumnDefs={[
          {
            headerName: 'name',
            field: 'name',
          },
          {
            headerName: 'money',
            field: 'money',
            editable: true,
            input: {
              type: 'number',
              precision: 2,
              format: '¥ 0,0.00',
            },
          },
          {
            headerName: 'total',
            field: 'total',
            input: {
              type: 'number',
              precision: 2,
              format: '¥ 0,0.00',
            },
            computed: {
              depends: ['money'],
              getValue: money => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve(money);
                  }, 1000);
                });
              },
            },
          },
        ]}
      />
    );
  }
}

export default {
  component: GeneralSourceTable,
  title: '编辑保存',
  sort: 1,
};
