import React, { PureComponent } from 'react';
import AntdTable from './AntdTable';
import DragableHOC from './DragableHOC';
import EditableHOC from './EditableHOC';
import { TablePlusProps } from './types';

@EditableHOC()
@DragableHOC()
class TablePlus extends PureComponent<TablePlusProps> {
  public render() {
    return <AntdTable {...this.props} />;
  }
}

export default TablePlus;
