import { judagePromise } from '@/lib/utils';
import { Omit } from '@/lib/viewModel';
import { Button, Col, message, Row } from 'antd';
import FormAnt, { FormComponentProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import classNames from 'classnames';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { CSSProperties, PureComponent } from 'react';
import Control, { ControlProps, IColSpace } from './Control';
import './index.less';
import Input, { AllInputProps } from './Input';

export interface ComputedProps {
  depends?: string[];
  getValue?: (...depends: any[]) => any;
}

export interface IComputedInput {
  // @todo
  depends?: string[];
  getValue?: (...depends: any[]) => any;
  computed?: ComputedProps | ((record: any) => ComputedProps);
}

export interface IFormControl extends IComputedInput {
  dataIndex: string;
  options?: GetFieldDecoratorOptions;
  control?: ControlProps;
  input?: AllInputProps;
}

export type IFormChangeValueHandle = (values: object, changed: object) => void;

export interface Form2BaseProps extends FormComponentProps {
  style?: CSSProperties;
  ref?: (node: any) => void;
  wrappedComponentRef?: (node: any) => void;
  controlNumberOneRow?: number;
  dataSource?: object;
  controls?: IFormControl[] | ((formData: {}) => IFormControl[]);
  footer?: boolean | JSX.Element;
  submitLoading?: boolean;
  saveText?: string;
  hideReset?: boolean;
  resetLoading?: boolean;
  resetText?: string;
  compact?: boolean;
  multiGutter?: number;
  labelSpace?: IColSpace;
  wrapperSpace?: IColSpace;
  onChangeValue?: IFormChangeValueHandle;
  onStartAsyncComputed?: (dataIndex: string, loading: boolean) => void;
  onEndAsyncComputed?: (dataIndex: string, loading: boolean) => void;
  onReset?: () => void;
  onSubmit?: (values: object) => void;
  rowClassName?: (index: number) => string | string;
  onChangeField?: (field: {}) => void;
}

function mapPropsToFields(props) {
  const { dataSource = {}, fields = {}, controls } = props;
  const values = controls
    .map(control => control.dataIndex)
    .reduce((result, dataIndex) => {
      result[dataIndex] = FormAnt.createFormField({
        ...fields[dataIndex],
        value: dataSource[dataIndex],
      });
      return result;
    }, {});
  return values;
}

function onValuesChange(props, changed, values) {
  const {
    onChangeValue = () => {},
    onStartAsyncComputed = () => {},
    onEndAsyncComputed = () => {},
    controls,
  } = props;

  onChangeValue(values, changed);

  checkControls(values, changed, controls, onStartAsyncComputed, onEndAsyncComputed, onChangeValue);
}

function onFieldsChange(props, changedFields) {
  props.onChangeField(changedFields);
}

const checkControls = memo(
  (values, changed, controls, onStartAsyncComputed, onEndAsyncComputed, onChangeValue) => {
    const changeFields = Object.keys(changed);
    controls.forEach(control => {
      const { depends, getValue, dataIndex } = control;
      if (
        getValue &&
        depends &&
        depends.length > 0 &&
        _.intersection(changeFields, depends).length
      ) {
        const dependsValue = getDependsValue(values, depends);
        const computedValue = getValue(...dependsValue);
        if (computedValue instanceof Promise) {
          onStartAsyncComputed(dataIndex);
          computedValue
            .then(value => {
              onEndAsyncComputed(dataIndex);
              onChangeValue(
                {
                  ...values,
                  [dataIndex]: value,
                },
                changed
              );
            })
            .catch(() => {
              onEndAsyncComputed(dataIndex);
            });
        } else {
          onChangeValue(
            {
              ...values,
              [dataIndex]: computedValue,
            },
            changed
          );
        }
      }
    });
  }
);

export const getDependsValue = (values, depends: string[]): any[] => {
  return depends.map(depend => {
    return values[depend];
  });
};

const getFormRows = memo((controls: IFormControl[], controlNumberOneRow: number) => {
  return _.chunk(controls, controlNumberOneRow);
});

const getGutter = memo(gutter => {
  return 16 + 8 * gutter;
});

const getRowClassName = (className, index) => {
  if (typeof className === 'function') {
    return className(index);
  }
  return className;
};

const handleOptions = memo((options, controlProps) => {
  if (options && 'rules' in options) {
    options.rules = options.rules.map(rule => {
      if (rule.required) {
        return {
          message: `${controlProps.label}不能为空`,
          ...rule,
        };
      }
      return rule;
    });
  }
  return options;
});

const bindOnSubmit = (values: object, onSubmit: (values: object) => void) => () => {
  return onSubmit(values);
};

class Form2Base extends PureComponent<Form2BaseProps, any> {
  public getControls = () => {
    if (typeof this.props.controls === 'function') {
      return this.props.controls(this.props.dataSource);
    }
    return this.props.controls;
  };

  public render() {
    const {
      controlNumberOneRow = 4,
      dataSource = {},
      controls: _controls,
      footer = true,
      submitLoading = false,
      saveText = '保 存',
      resetText = '重 置',
      compact = false,
      multiGutter = 1,
      onSubmit,
      hideReset = false,
      onReset = () => {},
      resetLoading = false,
      form,
      rowClassName,
      labelSpace = 6,
      wrapperSpace,
      onChangeValue,
      onChangeField,
      onStartAsyncComputed,
      ...rest
    } = this.props;

    const controls = this.getControls();

    const formRows: IFormControl[][] = getFormRows(controls, controlNumberOneRow);

    let firstFormControlInLastFormRow;

    return (
      <FormAnt {...rest} className="tongyu-form-plus" layout="inline">
        {formRows.map((item, index) => {
          return (
            <Row
              key={index}
              gutter={getGutter(multiGutter)}
              type="flex"
              justify="start"
              align="top"
              className={classNames(getRowClassName(rowClassName, index), {
                'tongyu-form-plus-interval': index === formRows.length - 1 ? !compact : true,
              })}
            >
              {item.map((formControl, iindex) => {
                if (index === formRows.length - 1 && iindex === 0) {
                  firstFormControlInLastFormRow = formControl;
                }
                const { dataIndex, options, control: controlProps, input } = formControl;

                return (
                  <Col key={dataIndex} md={Math.round(24 / controlNumberOneRow)} sm={24}>
                    <Control labelSpace={labelSpace} wrapperSpace={wrapperSpace} {...controlProps}>
                      {form.getFieldDecorator(dataIndex, handleOptions(options, controlProps))(
                        <Input raw={true} {...input} />
                      )}
                    </Control>
                  </Col>
                );
              })}
            </Row>
          );
        })}
        {footer !== false &&
          (footer !== true ? (
            footer
          ) : (
            <Row gutter={getGutter(multiGutter)} type="flex" justify="start" align="top">
              {Array(controlNumberOneRow)
                .fill(null)
                .map((unuse, index) => {
                  return (
                    index === 0 && (
                      <Col key={index} md={Math.round(24 / controlNumberOneRow)} sm={24}>
                        <Control
                          label=" "
                          labelSpace={
                            (firstFormControlInLastFormRow &&
                              firstFormControlInLastFormRow.control &&
                              firstFormControlInLastFormRow.control.labelSpace) ||
                            labelSpace
                          }
                          colon={false}
                        >
                          <Row gutter={8} type="flex" justify="start">
                            <Col>
                              <Button
                                type="primary"
                                loading={submitLoading}
                                onClick={bindOnSubmit(dataSource, onSubmit)}
                              >
                                {saveText}
                              </Button>
                            </Col>
                            {!hideReset && (
                              <Col>
                                <Button onClick={onReset} loading={resetLoading}>
                                  {resetText}
                                </Button>
                              </Col>
                            )}
                          </Row>
                        </Control>
                      </Col>
                    )
                  );
                })}
            </Row>
          ))}
      </FormAnt>
    );
  }
}

const WrappedForm2 = FormAnt.create({
  mapPropsToFields,
  onValuesChange,
  onFieldsChange,
})(Form2Base);

export type IFormStateChangeValueHandle = (
  formData: object,
  changed: object,
  oldFormData: object
) => void | {};

export interface Form2Props extends Omit<Form2BaseProps, 'form' | 'onChangeValue'> {
  onChangeValue?: IFormStateChangeValueHandle;
}

// tslint:disable-next-line:max-classes-per-file
class Form extends PureComponent<Form2Props, any> {
  public static defaultProps = {
    dataSource: {},
    controls: [],
    fields: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      submitLoading: false,
      dataSource: props.controls
        .map(item => item.dataIndex)
        .reduce((dataSource, dataIndex) => {
          // fill keys, setFieldsValue need to judge
          dataSource[dataIndex] = dataSource[dataIndex];
          return dataSource;
        }, props.dataSource),
    };
  }

  public onSubmit = values => {
    if ('onSubmit' in this.props) {
      this.setState({
        submitLoading: true,
      });
      judagePromise(this.props.onSubmit(values), result => {
        this.setState({
          submitLoading: false,
        });
        if (result) {
          message.success(typeof result === 'string' ? result : '保存成功!');
        }
      });
    }
  };

  public onChangeValue = (values, changed) => {
    let changedValues;
    if (this.props.onChangeValue) {
      changedValues = this.props.onChangeValue(values, changed, this.getDataSource());
    }

    if (!this.props.dataSource) {
      this.setState({
        dataSource: changedValues || values,
      });
    }
  };

  public onChangeField = changedFields => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...changedFields,
      },
    });
  };

  public getDataSource = () => this.props.dataSource || this.state.dataSource;

  public render() {
    return (
      <WrappedForm2
        submitLoading={this.state.submitLoading}
        {...this.props}
        onSubmit={this.onSubmit}
        dataSource={this.getDataSource()}
        fields={this.state.fields}
        onChangeValue={this.onChangeValue}
        onChangeField={this.onChangeField}
      />
    );
  }
}

export default Form;
