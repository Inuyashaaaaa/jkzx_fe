import { isShallowEqual } from '@/design/utils';
import { Dropdown, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _, { omit } from 'lodash';
import React from 'react';
import {
  IFormField,
  ITableRowProps,
  ITableTriggerCellFieldsChangeParams,
  ITableTriggerCellValueChangeParams,
} from '../../type';
import styles from '../cells/SwitchCell.less';
import { TABLE_CELL_FIELDS_CHANGE, TABLE_CELL_VALUES_CHANGE } from '../constants/EVENT';

const EditableContext = React.createContext<{ form?: WrappedFormUtils }>({});

class EditableRow extends React.Component<ITableRowProps> {
  public shouldComponentUpdate(nextProps) {
    if (nextProps.getEditing()) {
      nextProps.setEditing(false);
      return true;
    }

    if (_.some(nextProps.editings, val => !!val)) {
      return false;
    }

    return !isShallowEqual(nextProps, this.props);
  }

  public componentDidMount = () => {
    const { record, getRowKey } = this.props;
    this.props.api.tableManager.registeRow(record[getRowKey()], this);
  };

  public validate = (options = {}, colIds = []) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      return this.props.form.validateFields(colIds, options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public getContextMenu = () => {
    const { getContextMenu } = this.props;
    return (
      getContextMenu &&
      getContextMenu(
        _.pick(this.props, [
          'record',
          'rowIndex',
          'api',
          'context',
          'getRowKey',
          'columns',
          'rowId',
        ])
      )
    );
  };

  public render() {
    const { form } = this.props;
    const child = (
      <tr
        {...omit(this.props, [
          'form',
          'record',
          'rowIndex',
          'trigger',
          'api',
          'getRowKey',
          'context',
          'columns',
          'getContextMenu',
          'getEditing',
          'setEditing',
          'editings',
          'rowId',
        ])}
        className={styles.row}
      />
    );
    const contextMenu = this.getContextMenu();
    return (
      <EditableContext.Provider value={{ form }}>
        {contextMenu ? (
          <Dropdown trigger={['contextMenu']} overlay={contextMenu}>
            {child}
          </Dropdown>
        ) : (
          child
        )}
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
