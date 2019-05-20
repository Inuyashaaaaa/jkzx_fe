import { Form2, Input, InputNumber, Table2 } from '@/components';
import { Button, Menu } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { memo, useRef, useState } from 'react';

const StatelessForm = memo(() => {
  const formEl = useRef<Form2>(null);

  return (
    <Form2
      onEditingChanged={params => {
        console.log('onEditingChanged', params);
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
          // editable: true,
          // loading: true,
          render: (value, record, index, { form, editing }) => {
            return (
              <FormItem>
                {form.getFieldDecorator({
                  initialValue: 'a',
                })(<Input />)}
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
  const [loadings, setLoadings] = useState({
    b: false,
  });
  const [vertical, setVertical] = useState(true);
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
        <Button
          onClick={() => {
            setLoadings(pre => {
              return {
                b: !pre.b,
              };
            });
          }}
        >
          change loading
        </Button>
        <Button
          onClick={() => {
            setVertical(pre => !pre);
          }}
        >
          setVertical
        </Button>
      </div>
      <Table2
        getContextMenu={params => {
          if (params.rowIndex % 2) {
            return (
              <Menu>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                    1st menu item
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                    2nd menu item
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                    3rd menu item
                  </a>
                </Menu.Item>
              </Menu>
            );
          }

          return (
            <Menu>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                  1st menu item
                </a>
              </Menu.Item>
            </Menu>
          );
        }}
        vertical={vertical}
        rowKey="id"
        dataSource={tableData}
        onCellEditingChanged={params => {
          console.log(params);
          console.log(tableData);
        }}
        onCellFieldsChange={params => {
          console.log(params);
          setTableData(pre =>
            pre.map(item => {
              if (item.id === params.rowId) {
                return {
                  ...item,
                  ...params.changedFields,
                };
              }
              return item;
            })
          );
        }}
        columns={[
          {
            onCell: record => ({
              style: {
                width: 300,
              },
            }),
            title: 'id',
            dataIndex: 'id',
            render: (value, record, index, { form, editing }) => {
              return value;
            },
          },
          {
            title: 'a',
            dataIndex: 'a',
            editable: true,
            // width: 300,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem hasFeedback={true}>
                  {form.getFieldDecorator({
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a1',
            dataIndex: 'a1',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a2',
            dataIndex: 'a2',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a3',
            dataIndex: 'a3',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a4',
            dataIndex: 'a4',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a5',
            dataIndex: 'a5',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a6',
            dataIndex: 'a6',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a7',
            dataIndex: 'a7',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a8',
            dataIndex: 'a8',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a9',
            dataIndex: 'a9',
            editable: true,
            // editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            title: 'a10',
            dataIndex: 'a10',
            editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
          },
          {
            loading: () => loadings.b,
            title: 'b',
            dataIndex: 'b',
            editable: true,
            render: (value, record, index, { form, editing }) => {
              return (
                <FormItem>
                  {form.getFieldDecorator()(<Input editing={editing} autoSelect={true} />)}
                </FormItem>
              );
            },
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
