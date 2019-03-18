import React, { PureComponent } from 'react';
import Table from '../index';

class General extends PureComponent<any, any> {
  public table: any;

  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: 'Make',
          field: 'make',
        },
        {
          headerName: 'Model',
          field: 'model',
        },
        {
          headerName: 'Price',
          field: 'price',
          editable: true,
        },
        {
          headerName: 'Total',
          field: 'total',
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
    return <Table vertical={true} rowKey="make" columnDefs={columnDefs} rowData={rowData} />;
  }
}

export default { component: General, title: '纵向表格' };
