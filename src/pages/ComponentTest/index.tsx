import { Form2, Input, InputNumber, Table2 } from '@/design/components';
import { Button, Form as AntdForm } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import produce from 'immer';
import React, { memo, useRef, useState } from 'react';

const StatelessForm = memo(() => {
  const formEl = useRef<Form2>(null);

  return (
    <Form2
      onValueChanged={params => {
        console.log('onValueChanged', params);
      }}
      onSubmitButtonClick={e => {
        e.domEvent.preventDefault();
        console.log(formEl.current.decoratorForm.getFieldsValue());
      }}
      ref={node => (formEl.current = node)}
      columns={[
        {
          title: 'a',
          dataIndex: 'a',
          editable: true,
          render: (value, record, index, { form, editing }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  initialValue: 'a',
                })(<Input editing={editing} />)}
              </FormItem>
            );
          },
        },
        {
          title: 'b',
          dataIndex: 'b',
          render: (value, record, index, { form }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  initialValue: 'a',
                })(<InputNumber />)}
              </FormItem>
            );
          },
        },
      ]}
    />
  );
});

function ControlForm() {
  const initial = {
    a: { type: 'field', value: '111' },
  };
  const [formData, setFormData] = useState(initial);
  return (
    <Form2
      onResetButtonClick={() => {
        setFormData(initial);
      }}
      onFieldsChange={(props, fields, allFields) => {
        setFormData(allFields);
      }}
      onSubmitButtonClick={e => {
        e.domEvent.preventDefault();
        console.log(formData);
      }}
      dataSource={formData}
      columns={[
        {
          title: 'a',
          dataIndex: 'a',
          editable: true,
          render: (value, record, index, { form, editing }) => {
            return <FormItem>{form.getFieldDecorator()(<Input editing={editing} />)}</FormItem>;
          },
        },
        {
          title: 'b',
          dataIndex: 'b',
          render: (value, record, index, { form }) => {
            return <FormItem>{form.getFieldDecorator()(<InputNumber />)}</FormItem>;
          },
        },
      ]}
    />
  );
}

const ControlTable = memo(() => {
  const [tableData, setTableData] = useState([]);
  return (
    <>
      <div>
        <Button
          onClick={() => {
            setTableData(
              tableData.concat({
                id: new Date().getTime(),
                a: {
                  type: 'field',
                  value: 'aaa',
                },
                b: {
                  type: 'field',
                  value: 'bbb',
                },
              })
            );
          }}
        >
          add item
        </Button>
        <Button
          onClick={() => {
            setTableData(pre => {
              return pre.map(item => {
                return { ...item, a: { ...item.a, value: '10' } };
              });
            });
          }}
        >
          change item
        </Button>
      </div>
      <Table2
        rowKey="id"
        dataSource={tableData}
        onCellValueChanged={params => {
          console.log(params);
          console.log(tableData);
        }}
        onCellFieldsChange={params => {
          console.log(params);
          //   setTableData(pre =>
          //     pre.map(item => {
          //       if (item.id === params.rowId) {
          //         return {
          //           ...item,
          //           ...params.changedFields,
          //         };
          //       }
          //       return item;
          //     })
          //   );
        }}
        columns={[
          {
            title: 'id',
            dataIndex: 'id',
            editable: true,
            render: (value, record, index, { form, editing }) => {
              return value;
            },
          },
          {
            title: 'a',
            dataIndex: 'a',
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator()(<Input editing={true} />)}</FormItem>;
            },
          },
          {
            title: 'b',
            dataIndex: 'b',
            editable: true,
            render: (value, record, index, { form, editing }) => {
              return <FormItem>{form.getFieldDecorator()(<Input editing={editing} />)}</FormItem>;
            },
            getValue: [
              record => {
                return record.a.value;
              },
              'a',
            ],
          },
        ]}
      />
    </>
  );
});

export default () => {
  return (
    <div>
      <div>StatelessForm</div>
      <div>
        <StatelessForm />
      </div>
      <div>ControlForm</div>
      <div>
        <ControlForm />
      </div>
      <div>ControlTable</div>
      <div>
        <ControlTable />
      </div>
    </div>
  );
};
