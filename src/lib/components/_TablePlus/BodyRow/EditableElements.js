import FormControl from '@/lib/components/_FormControl';
import { isShallowEqual, isType } from '@/lib/utils';
import { Form } from 'antd';
import classNames from 'classnames';
import lodash from 'lodash';
import React, { Component, PureComponent } from 'react';

const mapPropsToFields = props => {
  const { record } = props;
  const result = lodash.mapValues(record, value => Form.createFormField({ value }));
  return result;
};

const onValuesChange = (props, field) => {
  const { onEditCell, record } = props;
  onEditCell?.(record, field);
};

const EditableContext = React.createContext();

const EditableRow = BaseRow =>
  class EditableRowInner extends PureComponent {
    state = {
      errors: {},
    };

    componentDidMount = () => {
      const { $editableRows } = this.props;
      $editableRows?.push(this);
    };

    validateRow = cb => {
      const { form, rowId } = this.props;
      form.validateFields(errors => {
        if (errors) {
          this.setState({ errors });
        }
        cb?.([rowId, errors]);
      });
    };

    // when cell changed
    cleanError = colIndex => {
      const { errors } = this.state;
      this.setState({
        errors: {
          ...errors,
          [colIndex]: false,
        },
      });
    };

    render() {
      const { form, onEditCell, editable, $editableRows, rowId, ...props } = this.props;
      const { errors } = this.state;
      // console.log('render EditableRowInner');
      return (
        <EditableContext.Provider value={{ form, errors, cleanError: this.cleanError }}>
          <BaseRow {...props} />
        </EditableContext.Provider>
      );
    }
  };

const EditableFormRowHOC = BaseRow =>
  Form.create({
    mapPropsToFields,
    onValuesChange,
  })(EditableRow(BaseRow));

// eslint-disable-next-line react/no-multi-comp
class EditableCell extends Component {
  static defaultProps = {
    record: {},
  };

  constructor(props) {
    super(props);
    const { record, dataIndex } = props;
    this.initialValue = record[dataIndex];
  }

  shouldComponentUpdate(nextProps) {
    // @todo children is unused but pass in?
    // console.log('getDiffProps', getDiffProps(nextProps, this.props));
    return !isShallowEqual(
      lodash.omit(nextProps, ['children']),
      lodash.omit(this.props, ['children'])
    );
  }

  componentDidUpdate = preProps => {
    const { editing: preEditing } = preProps;
    const { editing } = this.props;

    if (editing && !preEditing) {
      console.log(
        `type is ${preProps.formItem.type}; has getFormControlRef: ${!!this
          .$formInput}; has focus: ${!!this.$formInput?.focus}`
      );
      this.$formInput?.focus();
    }
  };

  handleEnterEdit = interactive => () => {
    if (!interactive) return;
    const { onStartEdit, record, dataIndex } = this.props;
    onStartEdit?.(record, dataIndex);
  };

  render() {
    const {
      editing,
      editable,
      dataIndex,
      record,
      formItem,
      children,
      tableSize,
      onStartEdit,
      onHightlightDepends,
      vertical,
      depend,
      ...rest
    } = this.props;

    const changed = record[dataIndex] !== this.initialValue;

    // console.log('render EditableCell');

    return (
      <td {...rest}>
        {editable ? (
          <EditableContext.Consumer>
            {({ form, errors, cleanError }) => {
              this.form = form;

              if (!formItem) {
                return <div className={classNames('cell-placeholder', tableSize)} />;
              }

              const { countValue, strictUpdate = true, rules, ...field } = formItem;
              const { interactive = true, options, type } = field;

              const depends = countValue?.slice(0, countValue.length - 1) || [];

              const mergedField = {
                ...field,
                interactive: !!editing,
                hideEditIcon: !interactive,
                bordered: false,
                size: tableSize === 'middle' ? 'default' : tableSize,
                onEditIconClick: this.handleEnterEdit(interactive),
                getFormControlRef: node => {
                  this.$formInput = node;
                },
                onChangePlus: () => cleanError(dataIndex),
                // @todo FormControl 可以注入，使用的话不需要返回 函数
                options: type === 'select' && isType(options, Function) ? options(record) : options,
              };

              return (
                <div
                  onMouseEnter={() => onHightlightDepends(record, depends)}
                  onMouseLeave={() => onHightlightDepends(record, [])}
                  className={classNames('editable-cell-inner', tableSize, {
                    editing,
                    interactable: interactive,
                    changed,
                    depend,
                    error: errors[dataIndex],
                  })}
                >
                  {form.getFieldDecorator(dataIndex, {
                    rules,
                  })(
                    <FormControl
                      field={mergedField}
                      formData={record}
                      strictUpdate={strictUpdate}
                      dataIndex={dataIndex}
                      countValue={countValue}
                    />
                  )}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export { EditableCell, EditableFormRowHOC };
