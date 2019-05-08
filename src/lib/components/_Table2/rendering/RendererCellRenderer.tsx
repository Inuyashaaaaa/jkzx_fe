import schema from 'async-validator';
import classnames from 'classnames';
import $ from 'jquery';
import _ from 'lodash';
import memo from 'memoize-one';
import React from 'react';
import { getDependsValue } from '../../_Form2';
import Input from '../../_Form2/Input';
import { TOTAL_DATA_TAG } from '../../_SourceTable/constants';
import {
  EVENT_CELL_DEPEND_HOVER,
  EVENT_CELL_VALUE_CHANGED,
  VERTICAL_TABLE_HEADER_COLUMN_FIELD,
} from '../constants';
import { IInputCellRendererParams, IInputCellRendererValue } from '../interface';
import './RendererCellRenderer.less';

export const getColDef = memo((columnDefs, vertical, node, colDef) => {
  const { field } = colDef;
  if (vertical) {
    if (field === VERTICAL_TABLE_HEADER_COLUMN_FIELD) {
      return colDef;
    }
    return columnDefs[node.rowIndex];
  }
  return colDef;
});

export const getData = memo((oldColDef, data, rowData, vertical, rowKey) => {
  if (!vertical) return data;

  const verticalData = rowData.find(item => item[rowKey] === oldColDef.field);
  return verticalData;
});

class RendererCellRenderer extends React.PureComponent<IInputCellRendererParams, any> {
  public fetchNum = 0;

  public _isMounted = false;

  public cacheValue = null;

  private _getEditable = memo((colDef, actualColDef, actualData, actualNode) => {
    return (
      colDef.field !== VERTICAL_TABLE_HEADER_COLUMN_FIELD &&
      (actualColDef.editable !== undefined
        ? typeof actualColDef.editable === 'function'
          ? actualColDef.editable({ colDef: actualColDef, data: actualData, node: actualNode })
          : actualColDef.editable
        : false)
    );
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      depended: false,
      hasError: false,
      errorMessage: '',
      statusTipVisible: false,
    };
  }

  public componentDidMount = () => {
    this._isMounted = true;
    this.props.context.TableEventBus.listen(EVENT_CELL_VALUE_CHANGED, this.onCellChanged, this);
    this.props.context.TableEventBus.listen(EVENT_CELL_DEPEND_HOVER, this.onCellDependHover, this);
  };

  public componentWillUnmount = () => {
    this._isMounted = false;
    this.props.context.TableEventBus.unListen(EVENT_CELL_VALUE_CHANGED, this.onCellChanged);
    this.props.context.TableEventBus.unListen(EVENT_CELL_DEPEND_HOVER, this.onCellDependHover);
  };

  public getEditable = () => {
    const colDef = this.getColDef();
    const nodeData = this.getRowData();
    const isTotalFooterCell = nodeData && nodeData[TOTAL_DATA_TAG];
    const isHeaderColumn = this.props.colDef.field === VERTICAL_TABLE_HEADER_COLUMN_FIELD;
    const editable =
      !isTotalFooterCell &&
      !isHeaderColumn &&
      this._getEditable(this.props.colDef, colDef, nodeData, this.getNode());
    return editable;
  };

  public validateCell = () => {
    const colDef = this.getColDef();
    const value = this.props.value;

    const { rules, field } = colDef;

    return new Promise((resolve, reject) => {
      try {
        if (!rules) resolve(true);

        const validator = new schema({
          [field]: rules,
        });
        validator.validate(
          {
            [field]: value == null,
          },
          (error, fields) => {
            resolve({ error, fields });
          }
        );
      } catch (error) {
        reject(error);
      }
    }).then((result: any) => {
      if (result.error) {
        this.setState({
          hasError: true,
          errorMessage: result.error[0].message,
          statusTipVisible: true,
        });
      }
      return result;
    });
  };

  public onCellDependHover = event => {
    const { colDef, node, context, data } = this.props;
    const { columnDefs, vertical, rowKey } = context;

    const { depends, colDef: triggerColDef } = event;
    const actualColDef = getColDef(columnDefs, vertical, node, colDef);

    this.setState({
      depended:
        (vertical ? triggerColDef.field === colDef.field : data[rowKey] === event.data[rowKey]) &&
        depends.indexOf(actualColDef.field) !== -1,
    });
  };

  public onVerticalCellChanged = event => {
    const { node, column, context } = event;
    const { columnDefs, vertical, rowData, rowKey } = context;
    const { colDef } = column;

    const triggerColDef = getColDef(columnDefs, vertical, node, colDef);
    const curColDef = getColDef(columnDefs, vertical, this.props.node, this.props.colDef);

    const changeField = triggerColDef.field;

    if (curColDef.field === VERTICAL_TABLE_HEADER_COLUMN_FIELD) return;

    if (triggerColDef.field === curColDef.field && colDef.field === this.props.colDef.field) {
      // changed refer rowData when vertical
      const findedRowData = rowData.find(data => data[rowKey] === colDef.field);

      if (!findedRowData) {
        throw new Error(
          'sync vertical table cell value fail! may be you change your rowKey value? you cannot do that!'
        );
      }

      findedRowData[changeField] = event.value;

      // this.renderDelta(event);
    }

    if (triggerColDef.field === curColDef.field || colDef.field !== this.props.colDef.field) return;

    setTimeout(() => {
      this.computedValue([changeField]);
    }, 0);
  };

  public onCellChanged = event => {
    const { node, context } = this.props;
    const { vertical } = context;
    const changeField = event.column.colDef.field;

    if (vertical) {
      return this.onVerticalCellChanged(event);
    }

    // if (changeField === this.props.colDef.field && event.rowIndex === node.rowIndex) {
    //   this.renderDelta(event);
    // }

    if (changeField === this.props.colDef.field || event.rowIndex !== node.rowIndex) return;

    setTimeout(() => {
      this.computedValue([changeField]);
    }, 0);
  };

  public computedValue = changeFields => {
    const { setValue, value } = this.props;

    const actualColDef = this.getColDef();
    const actualData = this.getRowData();
    const { getValue, depends } = this.getComputed(actualColDef, actualData);
    const exsitable = this.getExsitable(actualColDef, actualData);

    if (exsitable && getValue && _.intersection(changeFields, depends).length > 0) {
      const dependsValue = getDependsValue(actualData, depends);
      const nextValue = getValue(...dependsValue, actualData) || value;

      if (nextValue === this.props.value) return;

      if (nextValue instanceof Promise) {
        return this.setState(
          {
            loading: true,
          },
          () => {
            const fetchNum = ++this.fetchNum;
            nextValue
              .then(result => {
                if (fetchNum !== this.fetchNum || !this._isMounted) return;
                this.setState({
                  loading: false,
                });
                setValue(result);
              })
              .catch(() => {
                if (fetchNum !== this.fetchNum || !this._isMounted) return;
                this.setState({
                  loading: false,
                });
              });
          }
        );
      }
      setValue(nextValue);
    }
  };

  public getExsitable = (actualColDef, actualData) => {
    const { exsitable } = actualColDef;

    return exsitable ? exsitable({ colDef: actualColDef, data: actualData }) : true;
  };

  public bindCellStatusEenter = depends => () => {
    this.props.context.TableEventBus.emit(EVENT_CELL_DEPEND_HOVER, {
      depends,
      colDef: this.props.colDef,
      data: this.props.data,
    });
  };

  public onCellStatusLeave = () => {
    this.props.context.TableEventBus.emit(EVENT_CELL_DEPEND_HOVER, {
      depends: [],
      colDef: this.props.colDef,
      data: this.props.data,
    });
  };

  public renderDelta = event => {
    const { newValue, oldValue } = event;

    if (oldValue !== newValue && newValue && oldValue) {
      // copy value is string type
      const { colDef, node, context } = this.props;
      const { columnDefs, vertical } = context;
      const actualColDef = getColDef(columnDefs, vertical, node, colDef);

      if (actualColDef.input && actualColDef.input.type === 'number') {
        const diff = newValue - oldValue;

        let $tip;

        const diffNumber = Math.abs(diff).toLocaleString();

        if (diff > 0) {
          $tip = $(`<div class="delta-up tongyu-table-delta">↑${diffNumber}</div>`);
        } else if (diff < 0) {
          $tip = $(`<div class="delta-down tongyu-table-delta">↓${diffNumber}</span>`);
        }

        if ($tip) {
          setTimeout(() => {
            $(this.props.eGridCell).append($tip);
            setTimeout(() => {
              $tip.remove();
            }, 2000);
          }, 0);
        }
      }
    }
  };

  public refresh = () => false;

  // 聚合时 value 类型是一个对象
  public getNormalValue = (value: IInputCellRendererValue) => {
    // omit moment object
    if (value && typeof value === 'object' && value.value) {
      return value.value;
    }
    return value;
  };

  public render() {
    const { colDef, value, context } = this.props;
    const { darkIfDoNotEditable } = context;
    const { loading } = this.state;
    const isHeaderColumn = colDef.field === VERTICAL_TABLE_HEADER_COLUMN_FIELD;

    if (isHeaderColumn) {
      return (
        <Input
          loading={loading}
          type="input"
          value={value}
          style={{
            height: this.props.context.rowHeight,
          }}
          wrapperClassName={classnames('tongyu-table-spread')}
          subtype="static"
        />
      );
    }

    const actualColDef = this.getColDef();
    const actualData = this.getRowData();
    const { depends } = this.getComputed(actualColDef, actualData);
    const isTotalFooterCell = actualData && actualData[TOTAL_DATA_TAG];
    const editable =
      !isTotalFooterCell && this._getEditable(colDef, actualColDef, actualData, this.getNode());
    const status = this.state.hasError
      ? 'error'
      : !isTotalFooterCell && !isHeaderColumn && depends
      ? 'info'
      : undefined;
    const isDark =
      !isHeaderColumn && !isTotalFooterCell && darkIfDoNotEditable && !isHeaderColumn && !editable;
    const exsitable =
      isTotalFooterCell || isHeaderColumn ? true : this.getExsitable(actualColDef, actualData);
    const normalvalue = exsitable ? this.getNormalValue(value) : undefined;

    const input =
      (typeof actualColDef.input === 'function'
        ? actualColDef.input(actualData)
        : actualColDef.input) || {};

    return (
      <Input
        loading={loading}
        {...input}
        value={normalvalue}
        style={{
          height: this.props.context.rowHeight,
        }}
        wrapperClassName={classnames('tongyu-table-spread', {
          'tongyu-table-dark': exsitable && isDark,
          'tongyu-table-status': exsitable && status,
          'tongyu-table-notexsit': !exsitable,
          'tongyu-table-corner': exsitable && !isHeaderColumn && this.state.depended,
        })}
        subtype="static"
        status={exsitable && status}
        // statusTip={actualColDef.depends ? actualColDef.depends.join(', ') : undefined}
        onStatusTipMouseLeave={depends && this.onCellStatusLeave}
        onStatusTipMouseEnter={depends && this.bindCellStatusEenter(depends)}
        emptyFormatWhenNullValue={input.emptyFormatWhenNullValue && !exsitable}
      />
    );
  }

  private getColDef = () => {
    const { context, colDef, rowIndex } = this.props;
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableColDefByRowIndex(rowIndex);
    }
    return colDef;
  };

  private getRowData = () => {
    const { context, colDef, node } = this.props;
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableRowDataByColField(colDef.field) || {};
    }
    return node.data || {};
  };

  private getNode = () => {
    const { context, colDef, node } = this.props;
    const { vertical } = context;
    if (vertical) {
      return {
        ...node,
        rowIndex: context.getVerticalTableRowIndexByColField(colDef.field),
      };
    }
    return node;
  };

  private getComputed = (colDef = this.getColDef(), rowData = this.getRowData()) => {
    const { computed = {} } = colDef;
    if (typeof computed === 'function') {
      return computed(rowData) || {};
    }
    return computed;
  };
}

export default RendererCellRenderer;
