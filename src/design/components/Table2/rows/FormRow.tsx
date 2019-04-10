import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _, { omit } from 'lodash';
import React, { PureComponent } from 'react';
import {
  IFormField,
  ITableRowProps,
  ITableTriggerCellFieldsChangeParams,
  ITableTriggerCellValueChangeParams,
} from '../../type';
import styles from '../cells/SwitchCell.less';
import { TABLE_CELL_FIELDS_CHANGE, TABLE_CELL_VALUES_CHANGE } from '../constants/EVENT';

const EditableContext = React.createContext<{ form?: WrappedFormUtils }>({});

class EditableRow extends PureComponent<ITableRowProps> {
  public componentDidMount = () => {
    const { record, getRowKey } = this.props;
    this.props.api.tableManager.registeRow(record[getRowKey()], this);
  };

  public validate = async (options = {}, fieldNames = []) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      return this.props.form.validateFields(fieldNames, options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public render() {
    const { form } = this.props;
    return (
      <EditableContext.Provider value={{ form }}>
        <tr
          {...omit(this.props, [
            'form',
            'record',
            'rowIndex',
            'trigger',
            'api',
            'getRowKey',
            'context',
          ])}
          className={styles.row}
        />
      </EditableContext.Provider>
    );
  }
}

const FormRow = Form.create({
  onValuesChange(props: ITableRowProps, changedValues, allValues) {
    const { record, rowIndex, api, getRowKey } = props;
    const event: ITableTriggerCellValueChangeParams = {
      changedValues,
      allValues,
      record,
      rowIndex,
      rowId: record[getRowKey()],
    };
    api.eventBus.emit(TABLE_CELL_VALUES_CHANGE, event);
  },
  onFieldsChange(props: ITableRowProps, changedFields: object, allFields: any, add: string) {
    const { record, rowIndex, api, getRowKey } = props;
    const event: ITableTriggerCellFieldsChangeParams = {
      changedFields: _.mapValues(changedFields, (val: IFormField) => ({ ...val, type: 'field' })),
      allFields: _.mapValues(allFields, (val: IFormField) => ({ ...val, type: 'field' })),
      record,
      rowIndex,
      rowId: record[getRowKey()],
      add,
    };
    api.eventBus.emit(TABLE_CELL_FIELDS_CHANGE, event);
  },
  mapPropsToFields: props => {
    const { record, columns } = props;
    if (!record) return null;
    const filledDataSource = columns.reduce((data, next) => {
      data[next.dataIndex] = record[next.dataIndex];
      return data;
    }, {});
    const result = _.mapValues(
      _.pickBy(filledDataSource, (val: IFormField) => {
        return typeof val === 'object' && val.type === 'field';
      }),
      (val: IFormField) => {
        return Form.createFormField(val);
      }
    );
    return result;
  },
})(EditableRow);

export default FormRow;
export { EditableContext, EditableRow };
