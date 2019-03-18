import Table from '../index';

import { mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';

class Pagination extends PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make', rowDrag: true },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
      ],
      rowData: mockData(
        {
          make: '@name',
          model: '@name',
          price: '@name',
        },
        '30-50'
      ),
    };
  }

  public render() {
    const { columnDefs, rowData } = this.state;
    return (
      <Table
        rowKey="id"
        columnDefs={columnDefs}
        rowData={rowData}
        paginationProps={{
          defaultPageSize: 20,
        }}
      />
    );
  }
}

export default {
  component: Pagination,
  title: '分页',
};
