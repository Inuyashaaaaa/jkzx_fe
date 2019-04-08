import { Form2, Input, ModalButton, Table2 } from '@/design/components';
import { remove, uuid } from '@/design/utils';
import { Button, Tabs } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import { BASE_FORM_FIELDS } from './constants';
import { IFormRefs } from './type';

const GeneralTabTable = memo<{
  initialFormDatas?: {
    base?: {};
    produce?: {};
    auth?: {};
    trader?: any[];
    attachment?: {};
  };
  formRefs?: IFormRefs;
  editable?: boolean;
}>(({ initialFormDatas, formRefs, editable = true }) => {
  const [traderList, setTraderList] = useState(
    (initialFormDatas.trader || []).map(item => ({ ...item, uuid: uuid() }))
  );

  const tableEl = useRef<Table2>(null);

  return (
    <Tabs defaultActiveKey="1" onChange={() => {}}>
      <Tabs.TabPane tab="基本信息" key="1">
        <Form2
          ref={node => _.set(formRefs, 'base', node)}
          dataSource={_.get(initialFormDatas, 'base')}
          style={{ paddingTop: 20 }}
          footer={false}
          columnNumberOneRow={3}
          layout="vertical"
          columns={[
            {
              title: (
                <span>
                  开户名称<span style={{ fontSize: 12 }}>（创建后不允许修改）</span>
                </span>
              ),
              dataIndex: BASE_FORM_FIELDS.LEGALNAME,
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易对手类型',
              dataIndex: '交易对手类型',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '机构类型',
              dataIndex: '机构类型',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '开户法人',
              dataIndex: '开户法人',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '注册地址',
              dataIndex: '注册地址',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '开户销售',
              dataIndex: '开户销售',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '担保人',
              dataIndex: '担保人',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '担保人地址',
              dataIndex: '担保人地址',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '托管邮箱',
              dataIndex: '托管邮箱',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },

            {
              title: '联系人',
              dataIndex: '联系人',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易电话',
              dataIndex: '交易电话',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易指定邮箱',
              dataIndex: '交易指定邮箱',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '主协议编号',
              dataIndex: '主协议编号',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '补充协议编号',
              dataIndex: '补充协议编号',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '授权到期日',
              dataIndex: '授权到期日',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '协议签署授权人姓名',
              dataIndex: '协议签署授权人姓名',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '协议签署授权人身份证号',
              dataIndex: '协议签署授权人身份证号',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '协议签署授权人证件有效期',
              dataIndex: '协议签署授权人证件有效期',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
          ]}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="产品信息" key="2">
        <Form2
          ref={node => _.set(formRefs, 'base', node)}
          dataSource={_.get(initialFormDatas, 'base')}
          style={{ paddingTop: 20 }}
          footer={false}
          columnNumberOneRow={3}
          layout="vertical"
          columns={[
            {
              title: '产品名称',
              dataIndex: BASE_FORM_FIELDS.LEGALNAME,
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '产品代码',
              dataIndex: '产品代码',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '产品类型',
              dataIndex: '产品类型',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '备案编号',
              dataIndex: '备案编号',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '产品成立日',
              dataIndex: '产品成立日',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '产品到期日',
              dataIndex: '产品到期日',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '基金经理',
              dataIndex: '基金经理',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
          ]}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="权限和授信" key="3">
        <Form2
          ref={node => _.set(formRefs, 'base', node)}
          dataSource={_.get(initialFormDatas, 'base')}
          style={{ paddingTop: 20 }}
          footer={false}
          columnNumberOneRow={3}
          layout="vertical"
          columns={[
            {
              title: '交易方向',
              dataIndex: BASE_FORM_FIELDS.LEGALNAME,
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易权限',
              dataIndex: '交易权限',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易权限备注',
              dataIndex: '交易权限备注',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '交易标的',
              dataIndex: '交易标的',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '我方授信额度',
              dataIndex: '我方授信额度',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '对方授信额度',
              dataIndex: '对方授信额度',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: () => (
                <span>
                  保证金折扣<span style={{ fontSize: 12 }}>（例如：0.8表示八折）</span>
                </span>
              ),
              dataIndex: '保证金折扣',
              render: (val, record, index, { form }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
          ]}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="交易授权人" key="4">
        <Table2
          size="small"
          rowKey={'uuid'}
          pagination={false}
          dataSource={traderList}
          ref={node => (tableEl.current = node)}
          onCellValueChange={({ record, rowIndex, value, changedValues, allValues, rowId }) => {
            setTraderList(
              traderList.map((item, index) => {
                if (index === rowIndex) {
                  return {
                    ...item,
                    ...changedValues,
                  };
                }
                return item;
              })
            );
          }}
          columns={[
            {
              title: '姓名',
              dataIndex: '姓名',
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '身份证号',
              dataIndex: '身份证号',
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '证件有效期',
              dataIndex: '证件有效期',
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '联系电话',
              dataIndex: '联系电话',
              render: (val, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({
                      initialValue: val,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input editing={editable} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '操作',
              dataIndex: '操作',
              render: (val, record, index, { form, editing }) => {
                return (
                  <a
                    href="javascript:;"
                    style={{ color: 'red' }}
                    onClick={() => {
                      const next = remove(traderList, (item, iindex) => iindex === index);
                      setTraderList(next);
                    }}
                  >
                    删除
                  </a>
                );
              },
            },
          ]}
        />
        <Button
          style={{ marginTop: 10 }}
          onClick={() => {
            setTraderList(traderList.concat({ uuid: uuid() }));
          }}
          block={true}
          type="dashed"
        >
          添加
        </Button>
      </Tabs.TabPane>
      <Tabs.TabPane tab="附件" key="5">
        Content of Tab Pane 3
      </Tabs.TabPane>
    </Tabs>
  );
});

const CreateModalButton = memo<any>(props => {
  const formRefs: IFormRefs = {};
  return (
    <ModalButton
      type="primary"
      content={
        <GeneralTabTable
          // editable={false}
          formRefs={formRefs}
          initialFormDatas={{ base: { 基本信息: '23423' } }}
        />
      }
      modalProps={{
        title: '新建交易对手',
        width: 900,
        onOk: async () => {
          const formData = formRefs.base.decoratorForm.getFieldsValue();
        },
      }}
    >
      新建交易对手
    </ModalButton>
  );
});

export default CreateModalButton;
