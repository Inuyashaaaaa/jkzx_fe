import { delay, mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';
import SourceTable from '..';
import { ISourceTableOnCreate } from '../interface';

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

  public onCreate1: ISourceTableOnCreate = event => {
    return delay(1000, {
      tableDataSource: event.tableDataSource.concat(
        mockData(
          {
            name: '@name',
            money: '@integer(10, 100)',
          },
          '1'
        )
      ),
    });
  };

  public onCreate2: ISourceTableOnCreate = event => {
    return delay(1000, {
      state: {
        tableDataSource: event.tableDataSource.concat(
          mockData(
            {
              name: '@name',
              money: '@integer(10, 100)',
            },
            '1'
          )
        ),
      },
      message: '自定义通知标题',
      type: 'info',
    });
  };

  public onCreate3: ISourceTableOnCreate = event => {
    return delay(1000, true);
  };

  public render() {
    return (
      <>
        <SourceTable
          rowKey="id"
          onCreate={this.onCreate1}
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
          createFormControls={[
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
          ]}
        />
        <p>自定义通知标题</p>
        <SourceTable
          rowKey="id"
          onCreate={this.onCreate2}
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
          createFormControls={[
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
          ]}
        />
        <p>后端分页</p>
        <SourceTable
          rowKey="id"
          onCreate={this.onCreate3}
          onSearch={this.onSearch}
          paginationProps={{
            backend: true,
          }}
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
          createFormControls={[
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
          ]}
        />
      </>
    );
  }
}

export default {
  component: GeneralSourceTable,
  title: '新建',
  sort: 1,
};
