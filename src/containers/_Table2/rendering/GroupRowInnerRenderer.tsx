import { CellClassParams } from 'ag-grid-community';
import React, { PureComponent } from 'react';

export default class GroupRowInnerRenderer extends PureComponent<CellClassParams> {
  public render() {
    return <div style={{ display: 'inline-block' }}>{this.props.value}</div>;
  }
}
