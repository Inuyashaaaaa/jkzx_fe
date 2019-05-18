import { delay, mockData } from '@/utils';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import SourceTable from '..';

class TableDataChange extends PureComponent<any, any> {
  public state = {
    dataSource: [],
    actionLoading: false,
  };

  public componentDidMount = () => {
    this.onFetch();
  };

  public onFetch = () => {
    return delay(
      1000,
      mockData({
        name: '@name',
        money: '@integer(10, 100)',
      })
    ).then(dataSource => this.setState({ dataSource }));
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

  public onCellValueChanged = event => {
    // tslint:disable-next-line:no-console
    console.log(event);
  };

  public render() {
    return (
      <SourceTable
        // autoFetch={false}
        editable={true}
        removeable={true}
        createable={true}
        insertable={true}
        rowKey="id"
        actionColDef={{
          headerName: '操作栏',
        }}
        onFetch={() => {
          return delay(
            1000,
            mockData({
              name: '@name',
              money: '@integer(10, 100)',
            })
          );
        }}
        // tslint:disable-next-line:no-console
        // tslint:disable-next-line:no-console
        onReset={(...args) => console.log('onReset', args)}
        // tslint:disable-next-line:no-console
        onCreate={() => {
          // return delay(
          //   1000,
          //   mockData(
          //     {
          //       name: '@name',
          //       money: '@integer(10, 100)',
          //     },
          //     '1'
          //   )
          // );

          return mockData(
            {
              name: '@name',
              money: '@integer(10, 100)',
            },
            '1'
          );
        }}
        // tslint:disable-next-line:no-console
        onRemove={() => {
          return delay(3000, true);
        }}
        onInsert={() => {
          return delay(3000, true);
        }}
        onSave={() => {
          return delay(3000, true);
        }}
        onSearch={() => {
          return delay(3000, true);
        }}
        rowActions={[
          // tslint:disable-next-line:no-console
          <Button
            loading={this.state.actionLoading}
            key="b1"
            onClick={event => {
              return delay(1000, true);
            }}
          >
            action
          </Button>,
        ]}
        // tslint:disable-next-line:no-console
        onTableFormChange={(...args) => console.log('onTableFormChange', args)}
        // tslint:disable-next-line:no-console
        onSearchFormChange={(...args) => console.log('onSearchFormChange', args)}
        tableProps={{
          onCellValueChanged: this.onCellValueChanged,
        }}
        // createModalContent={
        //   <div>createModalContent</div>
        // }
        // createButton={
        //   <Button>createButton</Button>
        // }
        extraActions={[
          // tslint:disable-next-line:no-console
          <Button key="b1" onClick={event => console.log(event)}>
            change data
          </Button>,
        ]}
        createFormControls={[
          {
            dataIndex: 'name',
            control: {
              label: 'name',
            },
            input: {
              type: 'input',
            },
          },
          {
            dataIndex: 'age',
            control: {
              label: 'age',
            },
            input: {
              type: 'number',
              precision: 2,
              format: '0,0.00',
            },
          },
        ]}
        tableFormControls={[
          {
            dataIndex: 'name',
            control: {
              label: 'table-name',
            },
            input: {
              type: 'input',
            },
          },
          {
            dataIndex: 'age',
            control: {
              label: 'table-age',
            },
            input: {
              type: 'number',
              precision: 2,
              format: '0,0.00',
            },
          },
        ]}
        searchFormControls={[
          {
            dataIndex: 'name',
            control: {
              label: 'name',
            },
            input: {
              type: 'input',
            },
          },
          {
            dataIndex: 'age',
            control: {
              label: 'age',
            },
            input: {
              type: 'number',
              precision: 2,
              format: '0,0.00',
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
  component: TableDataChange,
  title: '非受控版本',
  sort: -12,
};
