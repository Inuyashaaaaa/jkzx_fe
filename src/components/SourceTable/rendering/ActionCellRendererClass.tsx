import React from 'react';
import StationalComponent from '../../StationalComponent';
import {
  ActionCellRendererClassParams,
  ActionCellRendererClassState,
  IRowActionProps,
} from '../types';
import ActionCellRendererClassBase from './ActionCellRendererClassBase';

/**
 * 修改 columns params 修改 loadings 将导致组件卸载，loadings 效果僵硬
 * 等待 ag-grid-react issue 修复，使用 context 来实现跨组件传参
 * https://github.com/ag-grid/ag-grid-react/issues/131
 * 目前 action 组件的 loadings 是非受控参数，不过好在，这个参数的需求度很低
 */
class ActionCellRendererClass extends StationalComponent<
  ActionCellRendererClassParams,
  ActionCellRendererClassState
> {
  public state = {
    actionLoadings: [],
  };

  public rowActions = params => {
    // const { rowKey } = this.props.context;
    return this.props.rowActions(params).map((element, index) => {
      // const actionLoadings = this.getControlStateField('actionLoadings');
      return React.cloneElement<IRowActionProps>(element, {
        ...element.props,
        // loading: actionLoadings[index] && actionLoadings[index][this.props.data[rowKey]],
        onClick: this.bindActionClick(element.props.onClick, index),
      });
    });
  };

  public bindActionClick = (preClick, index) => params => {
    if (!preClick) return;

    this.switchActionLoadings(index, true);

    return preClick(params)
      .then(result => {
        this.switchActionLoadings(index, false, result);
        return result;
      })
      .catch(error => {
        this.switchActionLoadings(index, false);
        console.error(error);
        return error;
      });
  };

  public switchActionLoadings = (index, loading, callback?) => {
    const actionLoadings = this.getUsedStateField('actionLoadings');
    actionLoadings[index] = loading;
    this.$setState(
      {
        actionLoadings: [...actionLoadings],
      },
      () => callback && callback(this)
    );
  };

  public render() {
    return (
      <ActionCellRendererClassBase
        {...this.props}
        {...this.getUsedState()}
        rowActions={this.rowActions}
      />
    );
  }
}

export default ActionCellRendererClass;
