import Table from '../index';

import React, { PureComponent } from 'react';

class General extends PureComponent<any, any> {
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
    return <Table enableFilter={true} columnDefs={columnDefs} rowData={rowData} />;
  }
}

export default {
  component: General,
  title: '筛选',
};
