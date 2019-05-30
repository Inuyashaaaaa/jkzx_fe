import schema from 'async-validator';
import _ from 'lodash';
import memo from 'memoize-one';
import React from 'react';
import Input from '../../Form/Input';
import { VALIDATE_CHAR_PRESS, VERTICAL_COLUMN_FIELD } from '../constants';
import { normalizeInput, normalizeRules } from '../normalize';
import { IInputCellEditorParams } from '../types';

class EditableCellRenderer extends React.PureComponent<IInputCellEditorParams, any> {
  public validating = false;

  public validateCell = _.debounce(
    memo(value => {
      const colDef = this.getColDef();
      const record = this.getRowData();
      const { field } = colDef;

      const normaledRuels = normalizeRules(record, colDef);

      if (!normaledRuels.value.length) return Promise.resolve({ error: false });

      this.setState({
        status: 'validating',
      });

      return new Promise((resolve, reject) => {
        try {
          const validator = new schema({
            [field]: normaledRuels.value,
          });
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
    const record = this.getRowData();
    const normaledRuels = normalizeRules(record, colDef);

    if (
      normaledRuels.value.length &&
      ((this.state.value !== this.props.value && !this.state.status) ||
        this.state.status === 'validating' ||
        this.state.status === 'error')
    ) {
      const value = this.props.value;
      this.setVerticalRecordValue(record, value);
      return value;
    }

    const value = this.state.value;
    this.setVerticalRecordValue(record, value);
    return value;
  };

  public setVerticalRecordValue = (record, value) => {
    // vertical hack
    if (this.props.context.vertical) {
      record[this.props.node.data[VERTICAL_COLUMN_FIELD]] = value;
    }
  };

  public onChange = value => {
    this.setState({ value });
  };

  public componentDidUpdate = () => {
    this.validateCell(this.state.value);
  };

  public componentDidMount = () => {
    if (this.props.charPress === VALIDATE_CHAR_PRESS) {
      this.validateCell(this.props.value);
    }
  };

  public render() {
    const { value, cellStartedEdit } = this.props;
    const actualColDef = this.getColDef();
    const actualData = this.getRowData();
    const { status, statusTip, statusTipVisible } = this.state;
    const normaledInput = normalizeInput(actualData, actualColDef);

    return (
      <Input
        {...normaledInput.value}
        autoFocus={true}
        value={cellStartedEdit ? this.state.value : value}
        subtype="editing"
        onValueChange={this.onChange}
        status={status}
        statusTip={statusTip}
        statusTipVisible={statusTipVisible}
        style={{ height: this.props.context.rowHeight - 2, width: '100%' }}
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
