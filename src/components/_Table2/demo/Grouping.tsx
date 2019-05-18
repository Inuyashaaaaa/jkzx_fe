import Table from '../index';

import React, { PureComponent } from 'react';

class General extends PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make', type: 'dimension' },
        { headerName: 'Model', field: 'model', type: 'dimension' },
        { headerName: 'Price', field: 'price', type: 'dimension' },
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
        rowGroupPanelShow="always"
        columnTypes={{
          dimension: {
            enableRowGroup: true,
          },
        }}
        columnDefs={columnDefs}
        rowData={rowData}
      />
    );
  }
}

export default {
  component: General,
  title: '分组',
};
