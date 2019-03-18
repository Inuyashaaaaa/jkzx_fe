import Table from '../index';

import { mockData } from '@/lib/utils';
import React, { PureComponent } from 'react';

class General extends PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
        { headerName: 'Price1', field: 'price1' },
        { headerName: 'Price2', field: 'price2' },
        { headerName: 'Price3', field: 'price3' },
        { headerName: 'Price4', field: 'price4' },
        { headerName: 'Price5', field: 'price5' },
        { headerName: 'Price6', field: 'price6' },
      ],
      rowData: [],
    };
  }

  public componentDidMount = () => {
    setInterval(() => {
      this.setState({
        rowData: mockData(
          {
            make: '@integer(100, 110)',
            model: '@integer(100, 110)',
            price: '@integer(100, 110)',
            price1: '@integer(100, 110)',
            price2: '@integer(100, 110)',
            price3: '@integer(100, 110)',
            price4: '@integer(100, 110)',
            price5: '@integer(100, 110)',
            price6: '@integer(100, 110)',
          },
          '15-20'
        ).map((item, index) => {
          return {
            ...item,
            id: index + '',
          };
        }),
      });
    }, 3000);
  };

  public render() {
    const { columnDefs, rowData } = this.state;
    return (
      <Table
        unionId="demoheatmap"
        rowKey="id"
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{
          enableCellChangeFlash: false,
          cellRenderer: 'HeatmapCellRenderer',
        }}
      />
    );
  }
}

export default {
  component: General,
  title: 'heatmap',
  sort: -100,
};
