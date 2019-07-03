import { message, Divider, Modal, Popconfirm } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useRef } from 'react';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { getCanUsedTranorsOtionsNotIncludingSelf } from '@/services/common';
import { Form2, Input, Select, InputNumber } from '@/containers';

const Action = memo<any>(props => {
  const formEl = useRef<Form2>(null);

  const { onRemove, index, value, record } = props;

  const onConfirm = async (rowIndex, param, recordData) => {
    const { error } = await formEl.current.validate();
    if (error) return;

    const data = {
      ...props.insertFormData,
      id: uuidv4(),
      visible: false,
      expiry: Form2.createField(null),
      use: Form2.createField(true),
    };
    const clone = _.concat(props.tableDataSource, data).map(item => {
      if (item.id === recordData.id) {
        return {
          ...item,
          visible: false,
        };
      }
      return item;
    });
    props.onInsertConfirm(clone);
    message.success('插入成功');
  };

  return (
    <>
      <a onClick={() => props.onClick(record)}>插入</a>
      <Divider type="vertical" />
      <Popconfirm title="确认要删除吗？" onConfirm={() => onRemove(index)}>
        <a style={{ color: 'red' }}>删除</a>
      </Popconfirm>
      <Modal
        visible={props.tableDataSource.find(item => item.id === record.id).visible}
        onOk={e => onConfirm(index, value, record)}
        onCancel={() => props.onInsertCancel(record)}
        closable={false}
      >
        <Form2
          ref={node => {
            formEl.current = node;
          }}
          dataSource={props.insertFormData}
          footer={false}
          onFieldsChange={props.onInsertFormChange}
          columns={[
            {
              title: '期限',
              dataIndex: 'tenor',
              render: (val, recordData, i, { form }) => (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                        message: '期限必填',
                      },
                    ],
                  })(
                    <Select
                      style={{ minWidth: 180 }}
                      options={getCanUsedTranorsOtionsNotIncludingSelf(
                        props.tableDataSource.map(item => Form2.getFieldsValue(item)),
                      )}
                    />,
                  )}
                </FormItem>
              ),
            },
            {
              title: '利率(%)',
              dataIndex: 'quote',
              render: (val, recordData, i, { form }) => (
                <FormItem>{form.getFieldDecorator({})(<InputNumber />)}</FormItem>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
});

export default Action;
