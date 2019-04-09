import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _, { omit } from 'lodash';
import React, { PureComponent } from 'react';
import { ITableRowProps, ITableTriggerCellValueChangeParams } from '../../type';
import styles from '../cells/SwitchCell.less';
import { TABLE_CELL_VALUE_CHANGE } from '../constants/EVENT';

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
    api.eventBus.emit(TABLE_CELL_VALUE_CHANGE, event);
  },
})(EditableRow);

export default FormRow;
export { EditableContext, EditableRow };
