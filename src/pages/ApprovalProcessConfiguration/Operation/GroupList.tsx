import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState, useRef } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { operation, symbol, RETURN_NUMBER } from '../constants';
import { InputNumber, Icon, Row, Button, Modal, message } from 'antd';
import { wkIndexList } from '@/services/approvalProcessConfiguration';
import uuidv4 from 'uuid/v4';

const GroupList = memo<any>(props => {
  const [options, setOptions] = useState(null);
  const { record, index, onChange, getCurrent } = props;
  const { value } = props;

  const columnData = [
    {
      dataIndex: 'leftIndex',
      render: (val, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [{ required: true, message: '指标为必填项' }],
            })(
              <Select
                style={{ width: '150px' }}
                options={async () => {
                  const { data, error } = await wkIndexList({});
                  if (error) return;
                  return data
                    .map(item => {
                      return {
                        label: item.indexName,
                        value: item.indexClass,
                      };
                    })
                    .filter(item => {
                      return item.value !== RETURN_NUMBER;
                    });
                }}
                placeholder="请选择指标"
              />
            )}
          </FormItem>
        );
      },
    },
    {
      dataIndex: 'symbol',
      render: (val, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [{ required: true, message: '计算符为必填项' }],
            })(<Select style={{ width: '150px' }} options={symbol} placeholder="请选择计算符" />)}
          </FormItem>
        );
      },
    },
    {
      dataIndex: 'rightIndex',
      render: (val, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [{ required: true, message: '指标为必填项' }],
            })(
              <Select
                style={{ width: '150px' }}
                options={async () => {
                  const { data, error } = await wkIndexList({});
                  if (error) return;
                  return data.map(item => {
                    return {
                      label: item.indexName,
                      value: item.indexClass,
                    };
                  });
                }}
                placeholder="请选择指标"
              />
            )}
          </FormItem>
        );
      },
    },
  ];

  const column1 = [
    {
      dataIndex: 'rightValue',
      render: (val, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [{ required: true, message: '数值为必填项' }],
            })(<InputNumber style={{ width: '150px' }} disabled={false} />)}
          </FormItem>
        );
      },
    },
  ];

  const column2 = [
    {
      dataIndex: 'rightValue',
      render: (val, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({})(<InputNumber style={{ width: '150px' }} disabled={true} />)}
          </FormItem>
        );
      },
    },
  ];
  const [column, setColumn] = useState([]);

  const handelColumn = value => {
    const data = (value || []).map((condition, index) => {
      if (
        _.get(condition, 'rightIndex') &&
        Form2.getFieldValue(condition.rightIndex) === RETURN_NUMBER
      ) {
        return _.concat(columnData, column1);
      }
      return _.concat(columnData, column2);
    });
    setColumn(data);
  };

  useEffect(
    () => {
      handelColumn(value);
    },
    [value]
  );

  const handleAdd = () => {
    const block = {
      ...Form2.createFields({
        description: '',
        // leftIndex: '',
        leftValue: {},
        // rightIndex: '',
        // rightValue: null,
        // symbol: '',
      }),
      conditionId: uuidv4(),
    };
    onChange(_.concat(value, block));
  };

  const handleDelete = (condition, rowIndex) => {
    const data = _.cloneDeep(value);
    if (data.length <= 1) {
      return message.info('至少保留一个条件');
    }
    data.splice(rowIndex, 1);
    onChange(data);
  };

  const onFormChange = (props, changedFields, allFields, rowIndex) => {
    const data = _.cloneDeep(value);
    if (changedFields.rightIndex && changedFields.rightIndex.value !== RETURN_NUMBER) {
      const rightValue = data[rowIndex].rightValue || {};
      rightValue.errors = null;
      data[rowIndex] = {
        ...data[rowIndex],
        ...changedFields,
        rightValue,
      };
      return onChange(data);
    }
    data[rowIndex] = {
      ...data[rowIndex],
      ...changedFields,
    };
    onChange(data);
  };

  const $childForm = useRef<Form2>({});

  const validate = () => {
    return Promise.all(
      value.map((item, index) => {
        if (!item) {
          return null;
        }
        return $childForm.current[index].validate();
      })
    );
  };

  if (getCurrent) {
    getCurrent({
      value,
      validate,
    });
  }

  return (
    <>
      {(value || []).map((condition, index) => {
        if (!condition) return;
        return (
          <>
            <Form2
              key={condition.conditionId}
              style={{ marginBottom: '15px' }}
              layout="inline"
              dataSource={condition}
              ref={node => ($childForm.current[index] = node)}
              columnNumberOneRow={4}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 0 }}
              onFieldsChange={(props, changedFields, allFields) =>
                onFormChange(props, changedFields, allFields, index)
              }
              footer={
                <a onClick={() => handleDelete(condition, index)} style={{ color: 'red' }}>
                  删除
                </a>
              }
              columns={column[index] || []}
            />
          </>
        );
      })}
      <Button
        type="dashed"
        style={{
          width: '82%',
        }}
        size="large"
        onClick={handleAdd}
      >
        <Icon type="plus" style={{ fontSize: '16px' }} />
        添加
      </Button>
    </>
  );
});

export default GroupList;
