import { delay, mockData } from '@/tools';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import SourceTable from '..';
import { TableRowEventData } from '../interface';

class GeneralSourceTable extends PureComponent<any, any> {
  public $souceTable: SourceTable = null;

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
          name: ['a', 'b'],
          money: '@integer(10, 100)',
        },
        '1'
      )
    );
  };

  public onSave = () => {
    return delay(1000, true);
  };

  public onClick = a => {
    return {
      message: '测试通知',
    };
  };

  public render() {
    return (
      <SourceTable
        rowKey="id"
        ref={node => (this.$sourceTable = node)}
        onSave={this.onSave}
        onCreate={this.onCreate}
        onSearch={this.onSearch}
        rowActions={(record, state) => {
          return [
            <Button type="primary" key="操作1" onClick={this.onClick}>
              操作{record.rowData.name}
            </Button>,
          ];
        }}
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
        ]}
      />
    );
  }
}

export default {
  component: GeneralSourceTable,
  title: '行操作',
  sort: 1,
};
