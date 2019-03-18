import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { delay, mockData } from '@/lib/utils';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import SourceTable from '..';

class TableDataChange extends PureComponent<any, any> {
  public state = {
    dataSource: [],
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
    const dataSouce = mockData({
      name: '@name',
      money: '@integer(10, 100)',
    });

    return (
      <SourceTable
        editable={true}
        removeable={true}
        createable={true}
        rowKey="id"
        actionColDef={{
          headerName: '操作栏',
        }}
        // tslint:disable-next-line:no-console
        onSave={(...args) => console.log('onSave', args)}
        // tslint:disable-next-line:no-console
        onSearch={(...args) => console.log('onSearch', args)}
        // tslint:disable-next-line:no-console
        onReset={(...args) => console.log('onReset', args)}
        // tslint:disable-next-line:no-console
        onCreate={(...args) => console.log('onCreate', args)}
        // tslint:disable-next-line:no-console
        onRemove={(...args) => console.log('onRemove', args)}
        rowActions={[
          // tslint:disable-next-line:no-console
          <Button key="b1" onClick={event => console.log(event)}>
            action
          </Button>,
        ]}
        // tslint:disable-next-line:no-console
        onTableFormChange={(...args) => console.log('onTableFormChange', args)}
        // tslint:disable-next-line:no-console
        onSearchFormChange={(...args) => console.log('onSearchFormChange', args)}
        dataSource={dataSouce}
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
              ...INPUT_NUMBER_DIGITAL_CONFIG,
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
              ...INPUT_NUMBER_DIGITAL_CONFIG,
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
  title: '基础受控版本',
  sort: -11,
};
