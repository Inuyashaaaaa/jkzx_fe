import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { AntdTableProps, IOnRow } from './types';

class AntdTable extends PureComponent<AntdTableProps, {}> {
  public getOnRow = (oldOnRow: IOnRow<{}>, vertical, components, rowKey) => {
    const { body = {} } = components;
    const { row = 'div' } = body;

    return (record, index) => {
      return {
        ...oldOnRow(record, index),
        index,
        vertical,
        rowId: record[rowKey],
      };
    };
  };

  public render() {
    const { vertical, onRow, ...restProps } = this.props;
    const { components, rowKey } = restProps;
    return <Table onRow={this.getOnRow(onRow, vertical, components, rowKey)} {...restProps} />;
  }
}

export default AntdTable;
