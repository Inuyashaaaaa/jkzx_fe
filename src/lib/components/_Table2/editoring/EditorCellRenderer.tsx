import schema from 'async-validator';
import _ from 'lodash';
import memo from 'memoize-one';
import React from 'react';
import Input from '../../_Form2/Input';
import { VALIDATE_CHAR_PRESS, VERTICAL_COLUMN_FIELD } from '../constants';
import { IInputCellEditorParams } from '../interface';
import { getData } from '../rendering/RendererCellRenderer';

class EditableCellRenderer extends React.PureComponent<IInputCellEditorParams, any> {
  public validating = false;

  public validate = _.debounce(
    memo(value => {
      this.setState({
        status: 'validating',
      });
      const colDef = this.getColDef();
      const { rules, field } = colDef;
      const validator = new schema({
        [field]: rules,
      });
      return new Promise((resolve, reject) => {
        try {
          validator.validate(
            {
              [field]: value,
            },
            (error, fields) => {
              if (error) {
                this.setState({
                  status: 'error',
                  statusTip: fields[field].map(item => item.message).join(','),
                  statusTipVisible: true,
                });
              } else {
                this.setState(
                  {
                    status: 'success',
                    statusTipVisible: false,
                  },
                  () => {
                    this.setState({
                      statusTip: '',
                    });
                  }
                );
              }
              resolve({ error, fields });
            }
          );
        } catch (error) {
          reject(error);
        }
      });
    }),
    50
  );

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  public getValue = () => {
    const colDef = this.getColDef();
    const data = this.getRowData();
    const { rules } = colDef;

    let value;
    if (
      rules &&
      rules.length &&
      ((this.state.value !== this.props.value && !this.state.status) ||
        this.state.status === 'validating' ||
        this.state.status === 'error')
    ) {
      value = this.props.value;
    }

    value = this.state.value;

    // vertical hack
    if (this.props.context.vertical) {
      data[this.props.node.data[VERTICAL_COLUMN_FIELD]] = value;
    }

    return value;
  };

  public onChange = value => {
    this.setState({ value });
  };

  public getInput = input => {
    if (typeof input === 'function') {
      const { column, node, context } = this.props;
      const colDef = column.getColDef();
      const { data } = node;
      const { vertical, rowData: originData, rowKey } = context;
      const actualData = getData(colDef, data, originData, vertical, rowKey);
      return input(actualData);
    }
    return input;
  };

  public componentDidUpdate = () => {
    const colDef = this.getColDef();
    const { rules } = colDef;

    // tslint:disable-next-line:no-unused-expression
    rules && rules.length && this.validate(this.state.value);
  };

  public componentDidMount = () => {
    if (this.props.charPress === VALIDATE_CHAR_PRESS) {
      this.validate(this.props.value);
    }
  };

  public render() {
    const { value, cellStartedEdit } = this.props;
    const actualColDef = this.getColDef();
    const { status, statusTip, statusTipVisible } = this.state;

    return (
      <Input
        {...this.getInput(actualColDef.input)}
        autoFocus={true}
        value={cellStartedEdit ? this.state.value : value}
        subtype="editing"
        onChangeValue={this.onChange}
        status={status}
        statusTip={statusTip}
        statusTipVisible={statusTipVisible}
        style={{ height: this.props.context.rowHeight - 2 }}
      />
    );
  }

  private getColDef = () => {
    const { context, column, rowIndex } = this.props;
    const colDef = column.getColDef();
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableColDefByRowIndex(rowIndex);
    }
    return colDef;
  };

  private getRowData = () => {
    const { context, column, node } = this.props;
    const colDef = column.getColDef();
    const { vertical } = context;
    if (vertical) {
      return context.getVerticalTableRowDataByColField(colDef.field) || {};
    }
    return node.data || {};
  };
}

export default EditableCellRenderer;
