import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useEffect, useState } from 'react';
import { Table2, Select, Form2, Input } from '@/containers';
import { operation, symbol, RETURN_NUMBER } from './constants';
import { Card, Icon, Row, Col, Modal } from 'antd';
import { wkIndexList } from '@/services/approvalProcessConfiguration';
import uuidv4 from 'uuid/v4';

const GroupList = memo<{
  value: any;
  record: object;
  index: number;
}>(props => {
  const [options, setOptions] = useState(null);
  const { record, index, getCurrent } = props;
  const [value, setValue] = useState([]);

  const $childForm: Form2 = {};

  useEffect(
    () => {
      fetchOptions();
    },
    [props.record]
  );

  const fetchOptions = async () => {
    let data = props.value ? props.value : [];
    data = data.map(item => {
      item.leftIndex = _.get(item, 'leftIndex.indexClass');
      item.rightIndex = _.get(item, 'rightIndex.indexClass');
      item.rightValue = _.get(item, 'rightValue.number');
      return {
        ...Form2.createFields(item),
        conditionId: item.conditionId,
      };
    });
    setValue(data);
  };

  const handleAdd = () => {
    const block = {
      ...Form2.createFields({
        description: '',
        leftIndex: '',
        leftValue: {},
        rightIndex: '',
        rightValue: null,
        symbol: '',
      }),
      conditionId: uuidv4(),
    };
    setValue([...value, block]);
  };

  const handleDelete = rowIndex => {
    const data = _.cloneDeep(value);
    data.splice(rowIndex, 1);
    setValue(data);
  };

  const onFormChange = (props, changedFields, allFields, rowIndex) => {
    const data = _.cloneDeep(value);
    data[rowIndex] = {
      ...data[rowIndex],
      ...changedFields,
    };
    setValue(data);
  };

  if (getCurrent) {
    getCurrent({
      value,
    });
  }

  return (
    <>
      {value.map((condition, index) => {
        return (
          <>
            <Form2
              key={condition.conditionId}
              style={{ marginBottom: '15px' }}
              ref={node => ($childForm[index] = node)}
              layout="inline"
              dataSource={condition}
              columnNumberOneRow={4}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 0 }}
              onFieldsChange={(props, changedFields, allFields) =>
                onFormChange(props, changedFields, allFields, index)
              }
              footer={
                <a onClick={() => handleDelete(index)} style={{ color: 'red' }}>
                  删除
                </a>
              }
              columns={[
                {
                  dataIndex: 'leftIndex',
                  render: (val, record, index, { form, editing }) => {
                    return (
                      <FormItem>
                        {form.getFieldDecorator({
                          rules: [{ required: true }],
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
                          rules: [{ required: true }],
                        })(
                          <Select
                            style={{ width: '150px' }}
                            options={symbol}
                            placeholder="请选择计算福"
                          />
                        )}
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
                          rules: [{ required: true }],
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
                {
                  dataIndex: 'rightValue',
                  render: (val, record, index, { form, editing }) => {
                    const disabled = Form2.getFieldValue(condition.rightIndex) === RETURN_NUMBER;
                    return (
                      <FormItem>
                        {form.getFieldDecorator({
                          rules: [{ required: true }],
                        })(<Input style={{ width: '150px' }} disabled={!disabled} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          </>
        );
      })}
      <div
        style={{
          border: '2px dashed #e8e5e5',
          textAlign: 'center',
          cursor: 'pointer',
          width: '82%',
          marginTop: '15px',
        }}
        onClick={handleAdd}
      >
        <Icon type="plus" style={{ fontSize: '12px' }} />
        增加审批节点
      </div>
    </>
  );
});

export default GroupList;
