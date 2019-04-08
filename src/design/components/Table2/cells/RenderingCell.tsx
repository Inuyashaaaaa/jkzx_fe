import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { delay } from '../../../utils';
import {
  ITableCellProps,
  ITableTriggerCellValueChangedParams,
  ITableTriggerCellValueChangeParams,
} from '../../type';
import { TABLE_CELL_VALUE_CHANGED } from '../constants/EVENT';

class RenderingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public form: WrappedFormUtils;

  public linkage = (params: ITableTriggerCellValueChangedParams) => {
    const { rowId } = params;

    if (rowId !== this.getRowId()) return;

    const dataIndex = this.getDataIndex();

    if (params.dataIndex === dataIndex) return;

    if (this.props.form.isFieldValidating(dataIndex)) {
      return;
    }

    const error = this.props.form.getFieldError(dataIndex);

    if (error) {
      return;
    }

    this.linkageValue(params);

    // 当前行 form 只要有非自身 field 发生 value changed 就会触发更新
    this.forceUpdate();
  };

  public linkageValue = (params: ITableTriggerCellValueChangedParams) => {
    const { record, getValue } = this.props;
    if (!getValue.value) return;
    const changedFields = [params.dataIndex];
    // 函数形式表示依赖所有 field
    if (
      getValue.depends.length === 0 ||
      _.intersection(changedFields, getValue.depends).length > 0
    ) {
      const temp = getValue.value(record, params);
      const { cellApi } = this.props;
      cellApi.startLoading();
      (temp instanceof Promise ? temp : delay(100, temp))
        .then(newVal => {
          const {
            record,
            colDef: { dataIndex },
          } = this.props;
          const oldVal = record[dataIndex];

          if (newVal === oldVal) return;

          cellApi.mutableChangeRecordValue(newVal, true);
          const instance = (this.props.form as any).getFieldInstance(dataIndex);
          if (instance && instance.onChange) {
            instance.onChange(newVal);
          } else {
            this.refreshCellView();
          }
        })
        .finally(() => {
          cellApi.stopLoading();
        });
    }
  };

  public refreshCellView = () => {
    const {
      colDef: { dataIndex },
    } = this.props;
    this.forceUpdate(() => {
      this.props.form.resetFields([dataIndex]);
    });
  };

  public componentDidMount = () => {
    this.props.api.eventBus.listen(TABLE_CELL_VALUE_CHANGED, this.onTableCellValueChanged);
  };

  public componentWillUnmount = () => {
    this.props.api.eventBus.unListen(TABLE_CELL_VALUE_CHANGED, this.onTableCellValueChanged);
  };

  public onTableCellValueChanged = (params: ITableTriggerCellValueChangedParams) => {
    this.linkage(params);
  };

  public getRowId = () => {
    const { record, getRowKey } = this.props;
    return record[getRowKey()];
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public getInputRef = node => {
    this.$input = node;
  };

  public getValue = () => {
    const { colDef, record } = this.props;
    const { dataIndex } = colDef;
    return record[dataIndex];
  };

  public render() {
    const value = this.getValue();
    const { record, rowIndex, children, $$render } = this.props;
    return React.Children.toArray(children)
      .slice(0, -1)
      .concat(
        $$render
          ? $$render(value, record, rowIndex, {
              form: this.props.form,
              editing: false,
              key: 'last',
            })
          : value
      );
  }
}

export default RenderingCell;
