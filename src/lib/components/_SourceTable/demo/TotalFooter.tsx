import { delay, mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';
import SourceTable from '..';

class TotalFooter extends PureComponent<any, any> {
  public onFetch = () => {
    return delay(
      1000,
      mockData({
        name: '@name',
        money: '@integer(10, 100)',
        money1: '@integer(10, 100)',
        money2: '@integer(10, 100)',
      })
    );
  };

  public render() {
    return (
      <>
        <SourceTable
          totalFooter={true}
          rowKey="id"
          onFetch={this.onFetch}
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
              headerName: 'money1',
              field: 'money1',
              editable: true,
              totalable: false,
              input: {
                type: 'number',
                precision: 2,
                format: '¥ 0,0.00',
              },
            },
            {
              headerName: 'money2',
              field: 'money2',
              editable: true,
              calculateTotalData: (preTotalData, record: any) => {
                return (preTotalData || 0) + record.money2 * 100;
              },
              input: {
                type: 'number',
                precision: 2,
                format: '¥ 0,0.00',
              },
            },
          ]}
        />
        <SourceTable
          style={{ marginTop: 20 }}
          totalFooter={true}
          totalColDef={{
            pinned: 'right',
          }}
          rowKey="id"
          onFetch={this.onFetch}
          tableProps={{
            vertical: true,
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
            {
              headerName: 'money1',
              field: 'money1',
              editable: true,
              totalable: false,
              input: {
                type: 'number',
                precision: 2,
                format: '¥ 0,0.00',
              },
            },
            {
              headerName: 'money2',
              field: 'money2',
              editable: true,
              calculateTotalData: (preTotalData, record: any) => {
                return (preTotalData || 0) + record.money2 * 100;
              },
              input: {
                type: 'number',
                precision: 2,
                format: '¥ 0,0.00',
              },
            },
          ]}
        />
      </>
    );
  }
}

export default {
  component: TotalFooter,
  title: '统计页脚',
};
