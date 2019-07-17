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

const EditableContext = React.createContext<WrappedFormUtils>(null);

class EditableRow extends React.Component<ITableRowProps> {
  public state = {
    visible: false,
    disabled: false,
  };

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

    return new Promise<{ errors: any; values: any }>((resolve, reject) =>
      this.props.form[scroll ? 'validateFieldsAndScroll' : 'validateFields'](
        colIds,
        rest,
        (errors, values) => {
          resolve({ errors, values });
        },
      ),
    );
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
        ]),
      )
    );
  };

  public changeDropdownMenuVisible = visible => {
    this.setState({
      visible,
    });
  };

  public switchDropdownMenu = disabled => {
    this.setState({
      disabled: !disabled,
    });
  };

  public cloneMenu = contextMenu => {
    const upperThis = this;
    return React.cloneElement(contextMenu, {
      ...contextMenu.props,
      onClick(...args) {
        upperThis.changeDropdownMenuVisible(false);
        if (contextMenu.props.onClick) {
          contextMenu.props.onClick.call(this, ...args);
        }
      },
    });
  };

  public render() {
    const { visible, disabled } = this.state;
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
      <EditableContext.Provider value={this.props.form}>
        {contextMenu ? (
          <Dropdown
            disabled={disabled}
            visible={visible}
            trigger={['contextMenu']}
            overlay={this.cloneMenu(contextMenu)}
            onVisibleChange={this.changeDropdownMenuVisible}
          >
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
      // eslint-disable-next-line no-param-reassign
      data[next.dataIndex] = record[next.dataIndex];
      return data;
    }, {});
    const result = _.mapValues(
      _.pickBy(filledDataSource, (val: IFormField) => Form2.isField(val)),
      (val: IFormField) => Form.createFormField(val),
    );
    return result;
  },
})(EditableRow);

export default FormRow;
export { EditableContext, EditableRow };
