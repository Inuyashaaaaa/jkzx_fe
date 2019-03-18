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
      })
    );
  };

  public onRemove = () => {
    return delay(1000, true);
  };

  public render() {
    return (
      <SourceTable
        removeable={true}
        rowKey="id"
        onRemove={this.onRemove}
        onSearch={this.onSearch}
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
  title: '删除',
  sort: 1,
};
