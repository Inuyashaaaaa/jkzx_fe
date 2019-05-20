import { Button } from 'antd';
import Table from '../index';

import React, { PureComponent } from 'react';

class General extends PureComponent<any, any> {
  public $table: Table = null;

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        {
          headerName: 'Price',
          field: 'price',
          editable: true,
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        },
      ],
      rowData: [
        { make: 'Toyota', model: 'Celica', price: undefined },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 },
      ],
    };
  }

  public onClick = () => {
    this.$table.$baseTable.validateTableCells().then(results => {
      if (results.some(item => item.error)) {
        alert('has error');
      }
    });
  };

  public render() {
    const { columnDefs, rowData } = this.state;
    return (
      <>
        <Button onClick={this.onClick}>验证</Button>
        <Table
          vertical={true}
          ref={node => (this.$table = node)}
          rowKey="make"
          columnDefs={columnDefs}
          rowData={rowData}
        />
      </>
    );
  }
}

export default {
  component: General,
  title: 'validate',
  sort: -101,
};
