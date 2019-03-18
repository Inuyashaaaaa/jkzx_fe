import { judagePromise, securityCall } from '@/lib/utils';
import { ICellRendererParams } from 'ag-grid-community';
import { Button, notification, Popconfirm, Row } from 'antd';
import produce from 'immer';
import React, { PureComponent } from 'react';
import { IRowActions, ISourceTableBaseRowActions, TableRowEventData } from '../interface';

const ButtonGroup = Button.Group;

export type IRowActionButtonOnClick = (event: TableRowEventData) => void;

export interface IRowActionProps {
  onClick?: IRowActionButtonOnClick;
  loading?: boolean;
}

export type IOnActionRowAction = (event: TableRowEventData) => void;

export interface ActionCellRendererClassParams extends ICellRendererParams {
  onRemove?: IOnActionRowAction;
  onInsert?: IOnActionRowAction;
  removeable?: boolean;
  insertable?: boolean;
  searchFormData: {};
  tableDataSource: any[];
  tableFormData: {};
  pagination: {};
}

/**
 * 修改 columns params 修改 loadings 将导致组件卸载，loadings 效果僵硬
 * 等待 ag-grid-react issue 修复，使用 context 来实现跨组件传参
 * https://github.com/ag-grid/ag-grid-react/issues/131
 * 目前 action 组件的 loadings 是非受控参数，不过还好，这个参数的需求度很低
 */
class ActionCellRendererClass extends PureComponent<ActionCellRendererClassParams> {
  public state = {
    removeLoadings: {},
    insertLoadings: {},
    actionLoadings: [],
  };

  public bindActionClick = (preClick: IRowActionButtonOnClick, index) => event => {
    if (!preClick) return;
    const { rowId, rowData, rowIndex } = this.getEvent();
    this.setState(
      produce((state: any) => {
        if (!state.actionLoadings[index]) {
          state.actionLoadings[index] = {};
        }
        state.actionLoadings[index][rowId] = true;
      })
    );
    return securityCall(
      () =>
        preClick({
          originEvent: event,
          rowId,
          rowData,
          rowIndex,
          params: this.props,
        }),
      result => {
        this.setState(
          produce((state: any) => {
            state.actionLoadings[index][rowId] = false;
          })
        );
        return result;
      },
      error => {
        notification.warn({
          message: '操作异常',
          description: error.toString(),
        });
        return error;
      }
    );
  };

  public onInsert = event => {
    if (!this.props.onInsert) return;
    const { rowId, rowData, rowIndex } = this.getEvent();

    this.changeLoadings('insertLoadings', rowId, true, () => {
      return securityCall(
        () =>
          this.props.onInsert({
            originEvent: event,
            rowId,
            rowData,
            rowIndex,
            params: this.props,
          }),
        result => {
          this.changeLoadings('insertLoadings', rowId, false);
        },
        error => {
          notification.warn({
            message: '插入异常',
            description: error.toString(),
          });
          return error;
        }
      );
    });
  };

  public onRemove = event => {
    if (!this.props.onRemove) return;
    const { rowId, rowData, rowIndex } = this.getEvent();

    this.changeLoadings('removeLoadings', rowId, true, () => {
      return securityCall(
        () =>
          this.props.onRemove({
            originEvent: event,
            rowId,
            rowData,
            rowIndex,
            params: this.props,
          }),
        result => {
          this.changeLoadings('removeLoadings', rowId, false);
        },
        error => {
          notification.warn({
            message: '删除异常',
            description: error.toString(),
          });
          return error;
        }
      );
    });
  };

  public changeLoadings = (type, rowId, bool, callback?) => {
    this.setState(
      {
        [type]: {
          ...this.state[type],
          [rowId]: bool,
        },
      },
      callback
    );
  };

  public getEvent = () => {
    const { context, data } = this.props;
    const { rowKey, getRowIndex } = context;
    const rowId = data[rowKey];
    return {
      rowId,
      rowData: data,
      rowIndex: getRowIndex(rowId),
    };
  };

  public render() {
    const { context, removeable, insertable } = this.props;
    const { rowKey, rowActions } = context;
    const normalizationRowActions = this.normalizeRowActions(rowActions);

    return (
      <Row
        type="flex"
        justify="start"
        align="middle"
        style={{ height: this.props.context.rowHeight }}
      >
        <ButtonGroup size="small">
          {removeable && (
            <Popconfirm title="确定删除吗?" onConfirm={this.onRemove} okText="是" cancelText="否">
              <Button loading={this.state.removeLoadings[this.props.data[rowKey]]} type="danger">
                删除
              </Button>
            </Popconfirm>
          )}
          {insertable && (
            <Button
              loading={this.state.insertLoadings[this.props.data[rowKey]]}
              onClick={this.onInsert}
            >
              插入
            </Button>
          )}
          {normalizationRowActions.map((element, index) =>
            React.cloneElement<IRowActionProps>(element, {
              ...element.props,
              loading:
                this.state.actionLoadings[index] &&
                this.state.actionLoadings[index][this.props.data[rowKey]],
              onClick: this.bindActionClick(element.props.onClick, index),
            })
          )}
        </ButtonGroup>
      </Row>
    );
  }

  private normalizeRowActions = (rowActions: ISourceTableBaseRowActions): IRowActions => {
    if (typeof rowActions === 'function') {
      return rowActions({
        ...this.getEvent(),
        params: this.props,
      });
    }
    return rowActions || [];
  };
}

export default ActionCellRendererClass;
