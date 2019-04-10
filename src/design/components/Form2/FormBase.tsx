import { Button, Col, Form as AntdForm, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import classNames from 'classnames';
import _, { chunk, omit } from 'lodash';
import React, { PureComponent } from 'react';
import { EVERY_EVENT_TYPE } from '../../utils';
import { IFormBaseProps, IFormColDef, IFormTriggerCellValueChangeParams } from '../type';
import SwitchCell from './cells/SwitchCell';
import { FORM_CELL_VALUE_CHANGED, FORM_CELL_VALUES_CHANGE } from './constants';
import FormManager from './formManager';
import './index.less';

class FormBase extends PureComponent<IFormBaseProps & FormComponentProps, any> {
  public static defaultProps = {
    submitText: '提 交',
    resetText: '重 置',
    columnNumberOneRow: 1,
    layout: 'horizontal',
    submitable: true,
    resetable: true,
    dataSource: {},
  };

  public formManager: FormManager = new FormManager();

  public maxRowControlNumber: number = 0;

  public eventBus;

  constructor(props) {
    super(props);
    this.eventBus = props.eventBus;
    this.eventBus.listen(EVERY_EVENT_TYPE, this.handleTableEvent);
  }

  public handleTableEvent = (params, eventName) => {
    if (eventName === FORM_CELL_VALUE_CHANGED) {
      return this.props.onValueChanged && this.props.onValueChanged(params);
    }
  };

  public validate = async (
    options = {},
    fieldNames = this.props.columns.map(item => item.dataIndex)
  ) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      this.props.form.validateFieldsAndScroll(fieldNames, options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public getRules = (rules, label) => {
    if (rules && Array.isArray(rules)) {
      return rules.map(item => {
        if (item.required && label) {
          return {
            message: `${label}为必填项目`,
            ...item,
          };
        }
        return item;
      });
    }
    return rules;
  };

  public getControlElement = (colDef: IFormColDef = {}, key?) => {
    const { form, dataSource } = this.props;
    const { getValue } = colDef;
    return (
      <SwitchCell
        key={key}
        getValue={this.normalizeGetValue(getValue)}
        colDef={colDef}
        form={form}
        record={dataSource}
        api={this}
      />
    );
  };

  public normalizeGetValue = colGetValue => {
    const [value, ...depends] = Array.isArray(colGetValue) ? colGetValue : [colGetValue];
    return {
      value,
      depends,
    };
  };

  public onSubmit = domEvent => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      if (!this.props.onSubmitButtonClick) return;
      return this.props.onSubmitButtonClick({
        dataSource: this.getFormData(),
        domEvent,
      });
    });
  };

  public onReset = domEvent => {
    if (!this.props.onResetButtonClick) {
      return;
    }
    return this.props.onResetButtonClick({
      dataSource: this.getFormData(),
      domEvent,
    });
  };

  public getFormData = () => {
    return this.props.dataSource || this.props.form.getFieldsValue();
  };

  public getFooter = () => {
    const {
      footer,
      submitLoading,
      submitable,
      submitText,
      resetable,
      resetText,
      resetLoading,
    } = this.props;

    if (typeof footer === 'boolean' || React.isValidElement(footer)) {
      return footer && <AntdForm.Item>{footer}</AntdForm.Item>;
    }

    return (
      <AntdForm.Item {...this.getButtonItemLayout()}>
        <Button.Group>
          {!!submitable && (
            <Button
              htmlType="submit"
              type="primary"
              {...this.props.submitButtonProps}
              loading={submitLoading}
            >
              {submitText}
            </Button>
          )}
          {!!resetable && (
            <Button {...this.props.resetButtonProps} onClick={this.onReset} loading={resetLoading}>
              {resetText}
            </Button>
          )}
        </Button.Group>
      </AntdForm.Item>
    );
  };

  public getRowContainer = () => {
    const { columnNumberOneRow: columnNumberOneRow, columns } = this.props;
    return chunk(columns, columnNumberOneRow);
  };

  public getFormItemLayout = () => {
    const formItemLayout =
      this.props.layout === 'horizontal'
        ? {
            labelCol: this.props.labelCol || { span: 8 },
            wrapperCol: this.props.wrapperCol || { span: 16 },
          }
        : null;
    return formItemLayout;
  };

  public getButtonItemLayout = () => {
    const formItemLayout = this.getFormItemLayout();

    const buttonItemLayout =
      this.props.layout === 'horizontal'
        ? {
            wrapperCol: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
            ...this.props.actionFieldProps,
          }
        : this.props.actionFieldProps;

    return buttonItemLayout;
  };

  public render() {
    const {
      rowProps,
      colProps,
      columns,
      layout,
      className,
      columnNumberOneRow: columnNumberOneRow,
    } = this.props;
    const rowContainers = this.getRowContainer();

    this.maxRowControlNumber = columnNumberOneRow;

    return (
      <AntdForm
        {...omit(this.props, [
          'form',
          'actionFieldProps',
          'submitable',
          'resetable',
          'submitText',
          'columnNumberOneRow',
          'dataSource',
          'columns',
          'footer',
          'submitLoading',
          'saveText',
          'resetLoading',
          'resetText',
          'rowProps',
          'colProps',
          'wrappedComponentRef',
          'onSubmitButtonClick',
          'onResetButtonClick',
          'submitButtonProps',
          'resetButtonProps',
          'getValue',
          'eventBus',
          'onValueChanged',
          'onValuesChange',
        ])}
        className={classNames(`tongyu-form2`, className)}
        layout={layout}
        onSubmit={this.onSubmit}
      >
        {layout === 'inline'
          ? columns.map((item, index) => this.getControlElement(item, index))
          : rowContainers.map((cols, key) => {
              this.maxRowControlNumber =
                cols.length > this.maxRowControlNumber ? cols.length : this.maxRowControlNumber;

              return (
                <Row
                  gutter={16 + 8 * 2}
                  key={key}
                  {...(rowProps ? rowProps({ index: key }) : undefined)}
                >
                  {cols.map((item, index) => {
                    const { dataIndex } = item;
                    return (
                      <Col
                        span={24 / this.maxRowControlNumber}
                        key={dataIndex}
                        {...(colProps ? colProps({ rowIndex: key, index }) : undefined)}
                      >
                        {this.getControlElement(item)}
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
        {layout === 'inline' ? (
          this.getFooter()
        ) : (
          <Row>
            <Col span={24 / this.maxRowControlNumber}>{this.getFooter()}</Col>
          </Row>
        )}
      </AntdForm>
    );
  }
}

export default FormBase;
