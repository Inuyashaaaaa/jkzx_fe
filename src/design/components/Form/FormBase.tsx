import { Button, Col, Row } from 'antd';
import FormAnt, { FormComponentProps } from 'antd/lib/form';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ComponentClass, PureComponent } from 'react';
import Control from './Control';
import './index.less';
import Input from './Input/Input';
import { Form2BaseProps } from './types';

function mapPropsToFields(props) {
  const { dataSource = {}, fields = {}, controls } = props;
  const values = controls
    .map(control => control.field)
    .reduce((result, field) => {
      result[field] = FormAnt.createFormField({
        ...fields[field],
        value: dataSource[field],
      });
      return result;
    }, {});
  return values;
}

function onValuesChange(props: Form2BaseProps, changedValues, values) {
  const { onValueChange } = props;

  if (onValueChange) {
    onValueChange({
      values,
      changedValues,
    });
  }
}

function onFieldsChange(props, changedFields) {
  props.onFieldChange({
    fields: changedFields,
  });
}

class Form2Base extends PureComponent<Form2BaseProps, any> {
  public static defaultProps = {
    submitText: '提 交',
    resetText: '重 置',
    controlNumberOneRow: 1,
    layout: 'horizontal',
    submitable: true,
    resetable: true,
  };

  public maxRowControlNumber: number = 0;

  public getDecorator = (decorator, control) => {
    if (typeof decorator !== 'object') return decorator;

    if (decorator.rules && Array.isArray(decorator.rules)) {
      return {
        ...decorator,
        rules: decorator.rules.map(item => {
          if (item.required && control.label) {
            return {
              message: `${control.label}为必填项目`,
              ...item,
            };
          }
          return item;
        }),
      };
    }

    return decorator;
  };

  public getControlElement = item => {
    const { field, control, decorator, input } = item;
    return (
      <Control key={field} {...this.getFormItemLayout()} {...control}>
        {this.props.form.getFieldDecorator<string>(field, this.getDecorator(decorator, control))(
          <Input raw={true} {...input} />
        )}
      </Control>
    );
  };

  public onSubmit = domEvent => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      if (!this.props.onSubmitButtonClick) return;
      return this.props.onSubmitButtonClick({
        dataSource: this.props.dataSource,
        domEvent,
      });
    });
  };

  public onReset = domEvent => {
    if (!this.props.onResetButtonClick) return;
    return this.props.onResetButtonClick({
      dataSource: this.props.dataSource,
      domEvent,
    });
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
      return footer && <Control>{footer}</Control>;
    }

    return (
      <Control {...this.getButtonItemLayout()}>
        <Button.Group>
          {!!submitable && (
            <Button
              type="primary"
              {...this.props.submitButtonProps}
              loading={submitLoading}
              onClick={this.onSubmit}
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
      </Control>
    );
  };

  public getRowContainer = () => {
    const { controlNumberOneRow, controls } = this.props;
    return _.chunk(controls, controlNumberOneRow);
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
    const buttonItemLayout =
      this.props.layout === 'horizontal'
        ? {
            wrapperCol: {
              span: this.props.labelCol
                ? this.props.labelCol.span
                : 24 - 16 / this.props.controlNumberOneRow,
              offset: this.props.wrapperCol
                ? this.props.wrapperCol.span
                : 16 / this.props.controlNumberOneRow,
            },
            ...this.props.actionControlProps,
          }
        : this.props.actionControlProps;

    return buttonItemLayout;
  };

  public render() {
    const {
      rowProps,
      colProps,
      controls,
      layout,
      style,
      className,
      controlNumberOneRow,
      ...formProps
    } = this.props;
    const rowContainers = this.getRowContainer();

    this.maxRowControlNumber = controlNumberOneRow;

    return (
      <FormAnt
        {...formProps}
        style={style}
        className={classNames(`tongyu-form`, className)}
        layout={layout as any}
      >
        {layout === 'inline'
          ? controls.map(item => this.getControlElement(item))
          : rowContainers.map((cols, key) => {
              this.maxRowControlNumber =
                cols.length > this.maxRowControlNumber ? cols.length : this.maxRowControlNumber;

              return (
                <Row gutter={12} key={key} {...(rowProps ? rowProps({ index: key }) : undefined)}>
                  {cols.map((item, index) => {
                    const { field } = item;
                    return (
                      <Col
                        span={24 / this.maxRowControlNumber}
                        key={field}
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
      </FormAnt>
    );
  }
}

const WrappedForm2 = FormAnt.create({
  mapPropsToFields,
  onValuesChange,
  onFieldsChange,
})(Form2Base as ComponentClass<FormComponentProps>);

export default WrappedForm2;
