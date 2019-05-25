import { Dropdown, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import classNames from 'classnames';
import _, { omit } from 'lodash';
import React from 'react';
import { VALIDATE_MESSAGES } from '../../../containers/constants';
import Form2 from '../../Form2';
import {
  IFormField,
  ITableRowProps,
  ITableTriggerCellFieldsChangeParams,
  ITableTriggerCellValueChangeParams,
} from '../../type';
import { TABLE_CELL_FIELDS_CHANGE, TABLE_CELL_VALUES_CHANGE } from '../constants/EVENT';
// import schema from 'async-validator';

const EditableContext = React.createContext<{ form?: WrappedFormUtils }>({});

class EditableRow extends React.Component<ITableRowProps> {
  // public shouldComponentUpdate(nextProps) {
  //   if (nextProps.getEditing()) {
  //     nextProps.setEditing(false);
  //     return true;
  //   }

  //   if (_.some(nextProps.editings, val => !!val)) {
  //     return false;
  //   }

  //   return !isShallowEqual(nextProps, this.props);
  // }

  public componentDidMount = () => {
    const { record, getRowKey } = this.props;
    this.props.api.tableManager.registeRow(record[getRowKey()], this);
  };

  public componentWillUnmount = () => {
    const { record, getRowKey } = this.props;
    this.props.api.tableManager.deleteRow(record[getRowKey()]);
  };

  public validate = (options: any = {}, colIds = []) => {
    const { silence, scroll = true, ...rest } = options;
    // const { columns, record } = this.props;

    return new Promise<{ errors: any; values: any }>((resolve, reject) => {
      // if (silence) {
      //   const fieldsProps = columns
      //     .map(item => {
      //       return item.dataIndex;
      //     })
      //     .reduce((obj, dataIndex) => {
      //       obj[dataIndex] = this.props.form.getFieldProps(dataIndex);
      //       return obj;
      //     }, {});

      //   const schemaConfig = _.mapValues(fieldsProps, (meta, dataIndex) => {
      //     return meta['data-__meta'].rules || [];
      //   });

      //   const validator = new schema(schemaConfig);

      //   const values = this.props.form.getFieldsValue();
      //   validator.validate(values, errors => {
      //     resolve({ errors, values });
      //   });
      //   return;
      // }
      return this.props.form[scroll ? 'validateFieldsAndScroll' : 'validateFields'](
        colIds,
        rest,
        (errors, values) => {
          resolve({ errors, values });
        }
      );
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
        className={classNames('tongyu-row', 'tongyu-table-row', this.props.className)}
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
  validateMessages: VALIDATE_MESSAGES,
  onValuesChange(props: ITableRowProps, changedValues, allValues) {
    const { record, rowIndex, api, getRowKey } = props;
    const event: ITableTriggerCellValueChangeParams = {
      changedValues,
      allValues,
      record: {
        ...record,
        ...changedValues,
      },
      rowIndex,
      rowId: record[getRowKey()],
    };
    api.eventBus.emit(TABLE_CELL_VALUES_CHANGE, event);
  },
  onFieldsChange(props: ITableRowProps, changedFields: object, allFields: any) {
    const { record, rowIndex, api, getRowKey } = props;
    const fieldedChangedFields = _.mapValues(changedFields, (val: IFormField) => ({
      ...val,
      type: 'field',
    }));
    const event: ITableTriggerCellFieldsChangeParams = {
      changedFields: fieldedChangedFields,
      allFields: _.mapValues(allFields, (val: IFormField) => ({ ...val, type: 'field' })),
      record: {
        ...record,
        ...fieldedChangedFields,
      },
      rowIndex,
      rowId: record[getRowKey()],
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
        return Form2.isField(val);
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
