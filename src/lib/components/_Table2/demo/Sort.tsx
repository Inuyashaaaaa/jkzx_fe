import React, { PureComponent } from 'react';
import Table from '../index';

class SortTable extends PureComponent {
  public state = {
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

  public render() {
    const { columnDefs, rowData } = this.state;
    return <Table enableSorting={true} columnDefs={columnDefs} rowData={rowData} />;
  }
}

export default {
  component: SortTable,
  title: '表格排序',
  desc: '描述信息',
};
