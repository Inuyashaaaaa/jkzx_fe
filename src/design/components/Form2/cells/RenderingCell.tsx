import _ from 'lodash';
import { PureComponent } from 'react';
import { IFormCellProps, IFormTriggerCellValueChangedParams } from 'src/components/type';
import { delay } from '../../../utils';
import { FORM_CELL_VALUE_CHANGED } from '../constants';

class RenderingCell extends PureComponent<IFormCellProps> {
  public componentDidMount = () => {
    if (!this.props.form.isFieldTouched(this.getDataIndex())) {
      this.props.form.validateFields();
    }
    this.props.api.eventBus.listen(FORM_CELL_VALUE_CHANGED, this.onTableCellValueChanged);
  };

  public componentWillUnmount = () => {
    this.props.api.eventBus.unListen(FORM_CELL_VALUE_CHANGED, this.onTableCellValueChanged);
  };

  public onTableCellValueChanged = (params: IFormTriggerCellValueChangedParams) => {
    this.linkage(params);
  };

  public linkage = (params: IFormTriggerCellValueChangedParams) => {
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
  };

  public linkageValue = (params: IFormTriggerCellValueChangedParams) => {
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

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public render() {
    const {
      form,
      record,
      colDef: { dataIndex, render },
      cellApi,
    } = this.props;
    const value = record[dataIndex];
    if (render) {
      return cellApi.renderElement(
        render(value, record, 0, {
          form,
          editing: false,
        })
      );
    }
    return value;
  }
}

export default RenderingCell;
