import Table from '../index';

import { Button } from 'antd';
import produce from 'immer';
import React, { PureComponent } from 'react';

class General extends PureComponent<any, any> {
  public table: any;

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make', editable: true },
        {
          headerName: 'Model',
          field: 'model',
          editable: true,
          input: {
            type: 'select',
            options: [
              {
                label: 'name1',
                value: 'name1',
              },
            ],
          },
        },
        {
          headerName: 'Price',
          field: 'price',
          editable: true,
          depends: ['model'],
          getValue: model => {
            // return params.data.price + 100;
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(model);
              }, 3000);
            });
          },
        },
        {
          headerName: 'Total',
          field: 'total',
          depends: ['price'],
          getValue: price => {
            // return params.data.price + 100;
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(price);
              }, 3000);
            });
          },
        },
      ],
      rowData: [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 },
      ],
    };
  }

  public render() {
    const { columnDefs, rowData } = this.state;
    return (
      <Table
        rowKey="make"
        columnDefs={columnDefs}
        rowData={rowData}
        ref={node => (this.table = node)}
      />
    );
  }
}

export default { component: General, title: '编辑' };
