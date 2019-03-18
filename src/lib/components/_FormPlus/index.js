import FormControl from '@/lib/components/_FormControl';
import { FormPlus as types } from '@/lib/components/_FormPlus/types';
import { assert, isType } from '@/lib/utils';
import { Button, Col, Form, Row } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import './index.less';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { dataSource = {} } = props;
    const values = Object.keys(dataSource).reduce((result, dataIndex) => {
      result[dataIndex] = Form.createFormField({ value: dataSource[dataIndex] });
      return result;
    }, {});
    return values;
  },
  onValuesChange(props, changedValues, allValues) {
    const { onChange } = props;
    onChange?.({
      values: allValues,
      changedValues,
    });
  },
})
class FormPlus extends PureComponent {
  static propTypes = types;

  static defaultProps = {
    saveText: '保存',
    resetText: '重置',
    dataSource: {},
    initalDataSource: {},
    items: [],
    cellNumberOneRow: 3,
    resetable: false,
    strictUpdate: false,
    actionPlacement: 'offset',
    compact: false,
  };

  static defaultCols = {
    labelCol: { md: { span: 6 } },
    wrapperCol: { md: { span: 18 } },
  };

  constructor(props) {
    super(props);
    assert(
      props.resetable ? props.initialDataSource : true,
      `FormPlus: props.resetable and props.initialDataSource must be exsit together!`
    );
  }

  componentDidMount = () => {
    const { getFormRef } = this.props;
    getFormRef?.(this);
  };

  validateForm = cb => {
    const { form } = this.props;
    return new Promise(resolve => {
      form.validateFieldsAndScroll((error, values) => {
        cb?.({ error, values });
        resolve({ error, values });
      });
    });
  };

  saveForm = () => {
    const { onSave } = this.props;
    this.validateForm(onSave);
  };

  resetForm = () => {
    const { initialDataSource, onChange, onReset } = this.props;
    onReset?.() || onChange?.(initialDataSource);
  };

  getActionLabel = type => {
    switch (type) {
      case 'file':
      case 'select':
        return '选择';
      default:
        return '填写';
    }
  };

  // 6 => { span: 6 } => { xxl : { span: 6 } }
  // undefined => { xxl: {} }
  converCol = col => {
    if (!col) {
      return {};
    }
    if (isType(col, Number)) {
      return { md: { span: col } };
    }
    if (col.span) {
      return { md: col };
    }
    return col;
  };

  subtractionGrid = (labelCol, wrapperCol) => {
    if (!labelCol && !wrapperCol) {
      return [];
    }
    labelCol = this.converCol(labelCol);
    wrapperCol = this.converCol(wrapperCol);

    Object.keys(labelCol).forEach(key => {
      if (wrapperCol[key]) return;
      wrapperCol[key] = {
        span: 24 - labelCol[key].span,
      };
    });

    Object.keys(wrapperCol).forEach(key => {
      if (labelCol[key]) return;
      labelCol[key] = {
        span: 24 - wrapperCol[key].span,
      };
    });
    return [labelCol, wrapperCol];
  };

  getItemGridCol = (priorityLabelCol, priorityWrapperCol, filledLabelCol, filledWrapperCol) => {
    if (!priorityLabelCol && !priorityWrapperCol) return [filledLabelCol, filledWrapperCol];
    return this.subtractionGrid(priorityLabelCol, priorityWrapperCol);
  };

  render() {
    const {
      width,
      cellNumberOneRow,
      dataSource,
      initialDataSource,
      items,
      className,
      saveLoading,
      saveText,
      resetable,
      resetText,
      footer,
      rowClassName,
      strictUpdate,
      form,
      actionPlacement,
      style,
      saveButtonProps,
      compact,
      labelCol,
      wrapperCol,
    } = this.props;

    const rows = _.chunk(items, cellNumberOneRow);
    const gutter = { md: 8, lg: 24, xl: 48 };

    const [
      filledLabelCol = FormPlus.defaultCols.labelCol,
      filledWrapperCol = FormPlus.defaultCols.wrapperCol,
    ] = this.subtractionGrid(labelCol, wrapperCol);

    const actionBar = (
      <Row type="flex" gutter={8}>
        <Col>
          <Button
            type="primary"
            {...saveButtonProps}
            loading={saveLoading}
            onClick={this.saveForm}
            htmlType="submit"
          >
            {saveText}
          </Button>
        </Col>
        {resetable && (
          <Col>
            <Button onClick={this.resetForm}>{resetText}</Button>
          </Col>
        )}
      </Row>
    );

    return (
      <div style={style} className={classNames(className)}>
        <Form style={{ width }} className="tongyu-form-plus" layout="inline">
          {rows.map((chunks, index) => {
            return (
              <Row
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                type="flex"
                justify="start"
                align="top"
                gutter={gutter}
                className={classNames(rowClassName, {
                  'tongyu-form-plus-interval': index === rows.length - 1 ? !compact : true,
                })}
              >
                {chunks.map(item => {
                  const {
                    labelCol: priorityLabelCol,
                    wrapperCol: priorityWrapperCol,
                    label,
                    required,
                    rules = [],
                    extra,
                    countValue,
                    dataIndex,
                    ...field
                  } = item;
                  const { type } = field;

                  if (required) {
                    rules.push({
                      required: true,
                      message: isType(required, 'String')
                        ? required
                        : `请${this.getActionLabel(type)}${label}`,
                    });
                  }

                  const [controlFilledLabelCol, controlFilledWrapperCol] = this.getItemGridCol(
                    priorityLabelCol,
                    priorityLabelCol,
                    filledLabelCol,
                    filledWrapperCol
                  );

                  if (index === chunks.length - 1) {
                    this.lastControlCol = {
                      labelCol: controlFilledLabelCol,
                      wrapperCol: controlFilledWrapperCol,
                    };
                  }

                  return (
                    <Col key={dataIndex} md={Math.round(24 / cellNumberOneRow)} sm={24}>
                      <FormItem
                        extra={extra}
                        label={label}
                        labelCol={controlFilledLabelCol}
                        wrapperCol={controlFilledWrapperCol}
                      >
                        {form.getFieldDecorator(dataIndex, {
                          rules,
                          initialValue: initialDataSource?.[dataIndex],
                        })(
                          <FormControl
                            field={field}
                            formData={dataSource}
                            dataIndex={dataIndex}
                            strictUpdate={strictUpdate}
                            countValue={countValue}
                          />
                        )}
                      </FormItem>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Form>
        {footer !== false &&
          (footer || (
            <Row
              type="flex"
              justify={actionPlacement === 'right' ? 'end' : 'start'}
              align="top"
              gutter={gutter}
            >
              {actionPlacement === 'offset' ? (
                _.range(cellNumberOneRow).map(index => {
                  return (
                    <Col key={index} md={Math.round(24 / cellNumberOneRow)} sm={24}>
                      {index === 0 && (
                        <FormItem
                          wrapperCol={_.mapValues(this.lastControlCol.wrapperCol, (value, key) => {
                            return {
                              ...value,
                              offset: this.lastControlCol.labelCol[key].span,
                            };
                          })}
                        >
                          {actionBar}
                        </FormItem>
                      )}
                    </Col>
                  );
                })
              ) : (
                <Col>{actionBar}</Col>
              )}
            </Row>
          ))}
      </div>
    );
  }
}

export default FormPlus;
