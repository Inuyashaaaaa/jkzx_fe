import React, { PureComponent } from 'react';
import Table from '../index';

class Selection extends PureComponent<any, any> {
  public gridApi: any;

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
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
      <>
        <Table
          rowKey="make"
          rowSelection="multiple"
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={params => (this.gridApi = params.api)}
        />
      </>
    );
  }
}

export default {
  component: Selection,
  title: '行选择',
};
