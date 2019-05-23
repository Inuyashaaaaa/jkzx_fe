import { DATE_FIELDS } from '@/containers/_InputControl/constants';
import FormControl from '@/containers/_FormControl';
import { StandardForm as types } from '@/containers/_StandardForm/types';
import { isType } from '@/tools';
import { Button, Col, Form, Row } from 'antd';
import classNames from 'classnames';
import lodash from 'lodash';
import moment, { isMoment } from 'moment';
import React, { Component } from 'react';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { dataSource = {}, items = [] } = props;

    const result = {};
    // 先找到所有有 date 相关 type 的 items
    const dateItems = items.filter(item => DATE_FIELDS.includes(item.type));
    Object.keys(dataSource).forEach(dataIndex => {
      let resultValue = dataSource[dataIndex];
      if (resultValue) {
        const dateItem = dateItems.find(item => item.dataIndex === dataIndex);
        if (dateItem) {
          resultValue = moment(resultValue, dateItem.format);
        }
      }
      result[dataIndex] = Form.createFormField({ value: resultValue });
    });

    return result;
  },
  onValuesChange(props, field) {
    const { onChange, items } = props;

    const name = Object.keys(field)[0];
    const nextField = { name, value: field[name] };

    if (isMoment(nextField.value)) {
      const findItem = items.find(item => item.dataIndex === name);
      nextField.value = nextField.value.format(findItem.format);
    }

    onChange?.(nextField);
  },
})
class StandardForm extends Component {
  static propTypes = types;

  static defaultProps = {
    saveText: '保存',
    cancelText: '取消',
    dataSource: {},
    items: [],
    chunkSize: 3,
    labelCol: 6,
    wrapperCol: 18,
  };

  shouldComponentUpdate = nextProps => {
    const { items, dataSource, form } = this.props;
    return (
      items !== nextProps.items ||
      dataSource !== nextProps.dataSource ||
      lodash.map(form.getFieldsError(), val => val).some(item => !!item)
    );
  };

  componentDidMount = () => {
    const { getNode } = this.props;
    getNode?.(this);
  };

  validateForm = cb => {
    const { form } = this.props;
    form.validateFieldsAndScroll((error, values) => {
      return cb({ error, values });
    });
  };

  handleSave = () => {
    const { onSave, form } = this.props;
    form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      onSave?.(values);
    });
  };

  convertCol = col => {
    return isType(col, 'Number')
      ? {
          span: col,
        }
      : col;
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

  render() {
    const {
      width,
      chunkSize,
      dataSource,
      items,
      className,
      labelCol,
      wrapperCol,
      confirmLoading,
      saveText,
      onCancel,
      cancelText,
      footer,
      form: { getFieldDecorator },
    } = this.props;

    const rows = lodash.chunk(items, chunkSize);

    return (
      <Row
        type="flex"
        justify="center"
        align="top"
        className={classNames(className, styles.container)}
      >
        <Form style={{ width }} className={styles.form} layout="inline">
          {rows.map((chunk, index) => {
            return (
              <Row
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                type="flex"
                justify="start"
                align="top"
                gutter={{ md: 8, lg: 24, xl: 48 }}
                className={index !== rows.length - 1 ? styles.intervalBottom : ''}
              >
                {chunk.map(
                  ({
                    labelCol: priorityLabelCol,
                    wrapperCol: priorityWrapperCol,
                    label,
                    required,
                    rules = [],
                    ...rest
                  }) => {
                    const { dataIndex, type } = rest;
                    if (required) {
                      rules.push({
                        required: true,
                        message: isType(required, 'String')
                          ? required
                          : `请${this.getActionLabel(type)}${label}`,
                      });
                    }

                    return (
                      <Col key={dataIndex} md={Math.round(24 / chunkSize)} sm={24}>
                        <FormItem
                          key={dataIndex}
                          label={label}
                          labelCol={this.convertCol(priorityLabelCol || labelCol)}
                          wrapperCol={this.convertCol(priorityWrapperCol || wrapperCol)}
                        >
                          {getFieldDecorator(dataIndex, {
                            rules,
                          })(<FormControl field={rest} formData={dataSource} />)}
                        </FormItem>
                      </Col>
                    );
                  }
                )}
              </Row>
            );
          })}
          {footer !== false &&
            (footer || (
              <Row
                className={styles.intervalTop}
                type="flex"
                justify="start"
                align="top"
                gutter={{ md: 8, lg: 24, xl: 48 }}
              >
                {lodash.range(chunkSize).map(index => {
                  return (
                    <Col key={index} md={Math.round(24 / chunkSize)} sm={24}>
                      {index === 0 && (
                        <FormItem wrapperCol={{ span: wrapperCol, offset: labelCol }}>
                          <Row type="flex" gutter={8}>
                            <Col>
                              <Button
                                loading={confirmLoading}
                                onClick={this.handleSave}
                                type="primary"
                                htmlType="submit"
                              >
                                {saveText}
                              </Button>
                            </Col>
                            <Col>
                              <Button onClick={onCancel}>{cancelText}</Button>
                            </Col>
                          </Row>
                        </FormItem>
                      )}
                    </Col>
                  );
                })}
              </Row>
            ))}
        </Form>
      </Row>
    );
  }
}

export default StandardForm;
