import schema from 'async-validator';
import classnames from 'classnames';
import _ from 'lodash';
import memo from 'memoize-one';
import React from 'react';
import { isShallowEqual } from '../../../utils';
import Input from '../../Form/Input';
import { TOTAL_DATA_TAG } from '../../SourceTable/constants';
import {
  EVENT_CELL_DEPEND_HOVER,
  EVENT_CELL_VALUE_CHANGED,
  VERTICAL_TABLE_HEADER_COLUMN_FIELD,
} from '../constants';
import {
  normalizeExsitable,
  normalizeGetValue,
  normalizeInput,
  normalizeRules,
} from '../normalize';
import { IInputCellRendererParams, IInputCellRendererValue, ITableInput } from '../types';
import './RendererCellRenderer.less';

class RendererCellRenderer extends React.PureComponent<IInputCellRendererParams, any> {
  public forceUpdateByInput: (input: ITableInput) => void;

  public debounceUpdateByInput: (input: ITableInput) => void;

  public fetchNum = 0;

  public cacheValue = null;

  public validate = memo((value, rules, field, showError) => {
    if (!rules.length) {
      return Promise.resolve({ error: false });
    }
    return new Promise((resolve, reject) => {
      try {
        const validator = new schema({
          [field]: rules,
        });
        validator.validate(
          {
            [field]: value,
          },
          (error, fields) => {
            resolve({ error, fields });
          }
        );
      } catch (error) {
        reject(error);
      }
    }).then((result: any) => {
      if (showError && result.error) {
        this.setState({
          hasError: true,
          errorMessage: result.error[0].message,
          statusTipVisible: true,
        });
      }
      return result;
    });
  });

  public updateByExsitable = memo(exsitable => {
    this.forceUpdate();
  });

  public debounceUpdateByExsitable = _.debounce(this.updateByExsitable, 50);

  public debounceValidate = _.debounce(this.validate, 50);

  public computeValue = memo(nextValue => {
    const { setValue, value } = this.props;
    if (nextValue === value) {
      return;
    }
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
  });

  private _isMounted = false;

  private getColDefByNode = memo((columnDefs, vertical, node, colDef) => {
    const { field } = colDef;
    if (vertical) {
      if (field === VERTICAL_TABLE_HEADER_COLUMN_FIELD) {
        return colDef;
      }
      return columnDefs[node.rowIndex];
    }
    return colDef;
  });

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

    this.forceUpdateByInput = memo(
      input => {
        this.forceUpdate();
      },
      (obj, other) => isShallowEqual(obj, other, val => typeof val === 'function')
    );
    this.debounceUpdateByInput = _.debounce(this.forceUpdateByInput, 50);
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

  public validateCell = (showError = true) => {
    const colDef = this.getColDef();
    const value = this.props.value;
    const { field } = colDef;
    return this.validate(value, this.normalizeRules().value, field, showError);
  };

  public refresh = () => false;

  public onCellDependHover = event => {
    const { colDef, context, data } = this.props;
    const { vertical, rowKey } = context;

    const { depends, colDef: triggerColDef } = event;
    const actualColDef = this.getColDef();

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

    const triggerColDef = this.getColDefByNode(columnDefs, vertical, node, colDef);
    const curColDef = this.getColDefByNode(
      columnDefs,
      vertical,
      this.props.node,
      this.props.colDef
    );

    const changeField = triggerColDef.field;

    if (curColDef.field === VERTICAL_TABLE_HEADER_COLUMN_FIELD) {
      return;
    }

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

    if (triggerColDef.field === curColDef.field || colDef.field !== this.props.colDef.field) {
      return;
    }

    this.linkageComputed(changeField);
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

    if (changeField === this.props.colDef.field || event.rowIndex !== node.rowIndex) {
      return;
    }

    this.linkageComputed(changeField);
  };

  public onCellStatusLeave = () => {
    this.props.context.TableEventBus.emit(EVENT_CELL_DEPEND_HOVER, {
      depends: [],
      colDef: this.props.colDef,
      data: this.props.data,
    });
  };

  public bindCellStatusEenter = depends => () => {
    this.props.context.TableEventBus.emit(EVENT_CELL_DEPEND_HOVER, {
      depends,
      colDef: this.props.colDef,
      data: this.props.data,
    });
  };

  public linkageComputed = changeField => {
    setTimeout(() => {
      this.linkageValue([changeField]);
      this.linkageValidate([changeField]);
      this.linkageInput([changeField]);
      this.linkageExsitable([changeField]);
    }, 0);
  };

  public linkageExsitable = changeFields => {
    const { depends, value } = this.normalizeExsitable();
    if (depends.length > 0 && _.intersection(changeFields, depends).length > 0) {
      return this.debounceUpdateByExsitable(value);
    }
  };

  public linkageInput = changeFields => {
    const { depends, value } = this.normalizeInput();
    if (depends.length > 0 && _.intersection(changeFields, depends).length > 0) {
      return this.debounceUpdateByInput(value);
    }
  };

  public linkageValidate = changeFields => {
    const colDef = this.getColDef();
    const { field } = colDef;
    const value = this.props.value;
    const { depends, value: rules } = this.normalizeRules();
    if (depends.length > 0 && _.intersection(changeFields, depends).length > 0) {
      return this.debounceValidate(value, rules, field);
    }
  };

  public linkageValue = changeFields => {
    const data = this.getRowData();
    const { value } = this.props;
    const { value: getValue, depends } = this.normalizeGetValue();

    if (!getValue || !depends.length) return;

    const exsitable = this.getExsitable();

    if (exsitable && _.intersection(changeFields, depends).length > 0) {
      const nextValue = getValue(data) || value;
      this.computeValue(nextValue);
    }
  };

  public normalizeExsitable = () => {
    return normalizeExsitable(this.getRowData(), this.getColDef());
  };

  public normalizeGetValue = () => {
    return normalizeGetValue(this.getRowData(), this.getColDef());
  };

  public normalizeRules = () => {
    return normalizeRules(this.getRowData(), this.getColDef());
  };

  public normalizeInput = () => {
    return normalizeInput(this.getRowData(), this.getColDef());
  };

  public getEditable = () => {
    return (
      !this.getIsTotalFooterCell() &&
      !this.getIsHeaderCell() &&
      this._getEditable(this.props.colDef, this.getColDef(), this.getRowData(), this.getNode())
    );
  };

  public getIsHeaderCell = () => {
    return this.props.colDef.field === VERTICAL_TABLE_HEADER_COLUMN_FIELD;
  };

  public getExsitable = () => {
    if (this.getIsTotalFooterCell() || this.getIsHeaderCell()) {
      return true;
    }
    const normaledExsitable = this.normalizeExsitable();
    return normaledExsitable.value;
  };

  // 聚合时 value 类型是一个对象
  public getValue = (value: IInputCellRendererValue) => {
    // omit moment object
    if (value && typeof value === 'object' && value.value) {
      return value.value;
    }
    return value;
  };

  public getStatus = () => {
    const { depends } = this.normalizeGetValue();
    const exsitable = this.getExsitable();

    if (!exsitable || this.getIsTotalFooterCell() || this.getIsHeaderCell()) {
      return undefined;
    }
    if (this.state.hasError) {
      return 'error';
    }
    if (depends && depends.length) {
      return 'info';
    }
    return undefined;
  };

  public getIsDark = () => {
    const { context } = this.props;
    const { darkIfDoNotEditable } = context;
    const editable = this.getEditable();
    return (
      darkIfDoNotEditable && !this.getIsHeaderCell() && !this.getIsTotalFooterCell() && !editable
    );
  };

  public getIsTotalFooterCell = () => {
    const data = this.getRowData();
    return data && data[TOTAL_DATA_TAG];
  };

  public getColDef = () => {
    const { context, colDef, rowIndex } = this.props;
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableColDefByRowIndex(rowIndex);
    }
    return colDef;
  };

  public getRowData = () => {
    const { context, colDef, node } = this.props;
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableRowDataByColField(colDef.field) || {};
    }
    return node.data || {};
  };

  public getNode = () => {
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

  public render() {
    const { value, context } = this.props;
    const { loading, depended } = this.state;
    const { rowHeight } = context;
    const isHeaderCell = this.getIsHeaderCell();

    if (isHeaderCell) {
      return (
        <Input
          loading={loading}
          type="input"
          value={value}
          style={{ height: rowHeight }}
          wrapperClassName={classnames('tongyu-table-spread')}
          subtype="static"
        />
      );
    }

    const colDef = this.getColDef();

    if (colDef.render) {
      return colDef.render(this.props);
    }

    const { depends } = this.normalizeGetValue();
    const { value: input } = this.normalizeInput();
    const status = this.getStatus();
    const isDark = this.getIsDark();
    const exsitable = this.getExsitable();

    return (
      <Input
        loading={loading}
        status={status}
        {...input}
        statusTip={input.prompt}
        style={{ height: rowHeight, width: '100%' }}
        value={exsitable ? this.getValue(value) : undefined}
        subtype="static"
        onStatusTipMouseLeave={depends.length ? this.onCellStatusLeave : undefined}
        onStatusTipMouseEnter={depends.length ? this.bindCellStatusEenter(depends) : undefined}
        wrapperClassName={classnames('tongyu-table-spread', {
          'tongyu-table-dark': exsitable && isDark,
          'tongyu-table-status': exsitable && status,
          'tongyu-table-notexsit': !exsitable,
          'tongyu-table-corner': exsitable && !isHeaderCell && depended,
        })}
      />
    );
  }
}

export default RendererCellRenderer;

// public renderDelta = event => {
//   const { newValue, oldValue } = event;

//   if (oldValue !== newValue && newValue && oldValue) {
//     // copy value is string type
//     const actualColDef = this.getColDef();

//     if (actualColDef.input && actualColDef.input.type === 'number') {
//       const diff = newValue - oldValue;

//       let $tip;

//       const diffNumber = Math.abs(diff).toLocaleString();

//       if (diff > 0) {
//         $tip = $(`<div class="delta-up tongyu-table-delta">↑${diffNumber}</div>`);
//       } else if (diff < 0) {
//         $tip = $(`<div class="delta-down tongyu-table-delta">↓${diffNumber}</span>`);
//       }

//       if ($tip) {
//         setTimeout(() => {
//           $(this.props.eGridCell).append($tip);
//           setTimeout(() => {
//             $tip.remove();
//           }, 2000);
//         }, 0);
//       }
//     }
//   }
// };
