import { Button, Row } from 'antd';
import React, { PureComponent } from 'react';
import { ActionCellRendererClassBaseParams, IRowActionProps } from '../types';

const ButtonGroup = Button.Group;

/**
 * 修改 columns params 修改 loadings 将导致组件卸载，loadings 效果僵硬
 * 等待 ag-grid-react issue 修复，使用 context 来实现跨组件传参
 * https://github.com/ag-grid/ag-grid-react/issues/131
 * 目前 action 组件的 loadings 是非受控参数，不过好在，这个参数的需求度很低
 */
class ActionCellRendererClassBase extends PureComponent<ActionCellRendererClassBaseParams> {
  public bindActionClick = (preClick, index) => event => {
    if (!preClick) return;
    return preClick({
      ...event,
      ...this.getActionParams(),
    });
  };

  public getActionParams = () => {
    const { context, data } = this.props;
    const { rowKey, getRowIndexById } = context;
    const rowId = data[rowKey];
    return {
      rowId,
      rowData: data,
      rowIndex: getRowIndexById(rowId),
    };
  };

  public render() {
    const { context, actionLoadings, rowActions } = this.props;
    return (
      <Row type="flex" justify="start" align="middle" style={{ height: context.rowHeight }}>
        <ButtonGroup size="small">
          {rowActions(this.getActionParams()).map((element, index) =>
            React.cloneElement<IRowActionProps>(element, {
              key: index,
              ...element.props,
              loading: actionLoadings[index],
              onClick: this.bindActionClick(element.props.onClick, index),
            })
          )}
        </ButtonGroup>
      </Row>
    );
  }
}

export default ActionCellRendererClassBase;
