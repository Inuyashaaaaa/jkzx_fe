import { Button, Col, Form as AntdForm, Row } from 'antd';
import { FormCreateOption } from 'antd/lib/form';
import classNames from 'classnames';
import { chunk, omit } from 'lodash';
import React, { PureComponent } from 'react';
import { defaultInputManager } from '../Input';
import { IFormColDef, IFormProps, IWrappedForm } from '../type';

class Form extends PureComponent<IFormProps, any> {
  public static defaultProps = {
    submitText: '提 交',
    resetText: '重 置',
    fieldNumberOneRow: 1,
    layout: 'horizontal',
    submitable: true,
    resetable: true,
    dataSource: {},
    inputManager: defaultInputManager,
  };

  public static create = (createOptions: FormCreateOption<IFormProps>): IWrappedForm => {
    return AntdForm.create<IFormProps>(createOptions)(Form);
  };

  public maxRowControlNumber: number = 0;

  constructor(props) {
    super(props);
  }

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

  public getColDef = (colDef: IFormColDef): IFormColDef => {
    const { field = {}, input = {}, title } = colDef;
    return {
      decorator: {},
      ...colDef,
      field: {
        hasFeedback: input.status === 'rendering' ? false : true,
        ...field,
        label: field.label || title,
      },
    };
  };

  public getControlElement = (colDef: IFormColDef) => {
    const { field, dataIndex, decorator, input, render } = this.getColDef(colDef);
    const { form, inputManager, dataSource } = this.props;
    const value = dataSource[dataIndex];

    if (render) {
      return render(value, dataSource);
    }

    if (input) {
      const Input = inputManager.getInput(input.type);
      return (
        <AntdForm.Item {...this.getFormItemLayout()} {...field}>
          {form.getFieldDecorator(dataIndex, {
            ...decorator,
            initialValue: value,
            rules: this.getRules(decorator.rules, field.label),
          })(<Input status="editing" {...input} />)}
        </AntdForm.Item>
      );
    }

    return value;
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
      this.props.form.resetFields();
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
    const { fieldNumberOneRow, columns } = this.props;
    return chunk(columns, fieldNumberOneRow);
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
    const { rowProps, colProps, columns, layout, className, fieldNumberOneRow } = this.props;
    const rowContainers = this.getRowContainer();

    this.maxRowControlNumber = fieldNumberOneRow;

    return (
      <AntdForm
        {...omit(this.props, [
          'form',
          'actionFieldProps',
          'submitable',
          'resetable',
          'submitText',
          'fieldNumberOneRow',
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
          'inputManager',
        ])}
        className={classNames(`tongyu-form`, className)}
        layout={layout}
        onSubmit={this.onSubmit}
      >
        {layout === 'inline'
          ? columns.map(item => this.getControlElement(item))
          : rowContainers.map((cols, key) => {
              this.maxRowControlNumber =
                cols.length > this.maxRowControlNumber ? cols.length : this.maxRowControlNumber;

              return (
                <Row gutter={12} key={key} {...(rowProps ? rowProps({ index: key }) : undefined)}>
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
          <Row gutter={12}>
            <Col span={24 / this.maxRowControlNumber}>{this.getFooter()}</Col>
          </Row>
        )}
      </AntdForm>
    );
  }
}

export default Form;
