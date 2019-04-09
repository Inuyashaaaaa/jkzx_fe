import { Form2, Input, ModalButton, Select, Table2 } from '@/design/components';
import { remove, uuid } from '@/design/utils';
import { Button, Divider, Icon, Steps } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import { BASE_FORM_FIELDS, TRADER_TYPE } from './constants';

const CreateModalButton = memo<any>(props => {
  const formRef = useRef<Form2>(null);
  const initialFormDatas: any = {};
  const [traderList, setTraderList] = useState(
    (initialFormDatas.trader || []).map(item => ({ ...item, uuid: uuid() }))
  );

  const tableEl = useRef<Table2>(null);

  const [baseFormData, setBaseFormData] = useState({});

  const [currenStep, setCurrentStep] = useState(0);

  const editable = true;

  const [modalVisible, setModalVisible] = useState(false);

  const getProduceIcon = () => {
    if (baseFormData[BASE_FORM_FIELDS.TRADER_TYPE] === TRADER_TYPE.PRODUCT) {
      if (currenStep === 1) {
        // use number icon
        return undefined;
      }
      if (currenStep > 1) {
        return undefined;
      }
    }

    if (currenStep > 1) {
      return <Icon type="stop" />;
    }

    return <Icon type="fork" />;
  };

  return (
    <ModalButton
      type="primary"
      content={
        <>
          <Steps current={currenStep} style={{ padding: '30px 20px' }}>
            <Steps.Step title="基本信息" />
            <Steps.Step title="产品信息" icon={getProduceIcon()} />
            <Steps.Step title="权限和授信" />
            <Steps.Step title="交易授权人" />
            <Steps.Step title="附件" />
          </Steps>
          <Divider />
          {currenStep === 0 && (
            <Form2
              ref={node => {
                formRef.current = node;
              }}
              onValueChange={params => {
                setBaseFormData(params.allValues);
              }}
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '交易对手类型',
                  dataIndex: BASE_FORM_FIELDS.TRADER_TYPE,
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(
                          <Select
                            style={{ width: '100%' }}
                            editing={editable}
                            options={[
                              {
                                label: '产品户',
                                value: TRADER_TYPE.PRODUCT,
                              },
                              {
                                label: '企业户',
                                value: TRADER_TYPE.ENTERPRISE,
                              },
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '机构类型',
                  dataIndex: '机构类型',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          )}
          {currenStep === 1 && (
            <Form2
              ref={node => {
                formRef.current = node;
              }}
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          )}
          {currenStep === 2 && (
            <Form2
              ref={node => {
                formRef.current = node;
              }}
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
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
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          initialValue: val,
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          )}
          {currenStep === 3 && (
            <>
              <Table2
                size="small"
                rowKey={'uuid'}
                pagination={false}
                dataSource={traderList}
                ref={node => (tableEl.current = node)}
                onCellValueChange={({
                  record,
                  rowIndex,
                  value,
                  changedValues,
                  allValues,
                  rowId,
                }) => {
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
                        <FormItem hasFeedback={true}>
                          {form.getFieldDecorator({
                            initialValue: val,
                            rules: [
                              {
                                required: true,
                                message: '必填',
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
                        <FormItem hasFeedback={true}>
                          {form.getFieldDecorator({
                            initialValue: val,
                            rules: [
                              {
                                required: true,
                                message: '必填',
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
                        <FormItem hasFeedback={true}>
                          {form.getFieldDecorator({
                            initialValue: val,
                            rules: [
                              {
                                required: true,
                                message: '必填',
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
                        <FormItem hasFeedback={true}>
                          {form.getFieldDecorator({
                            initialValue: val,
                            rules: [
                              {
                                required: true,
                                message: '必填',
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
            </>
          )}
        </>
      }
      onClick={() => setModalVisible(true)}
      modalProps={{
        title: '新建交易对手',
        width: 900,
        onCancel: () => setModalVisible(false),
        visible: modalVisible,
        okText: currenStep === 4 ? '确认提交' : '下一步',
        onOk: async () => {
          if (currenStep === 4) {
            // const formData = formRefs.base.decoratorForm.getFieldsValue();
            return;
          }

          if (
            currenStep === 0 &&
            baseFormData[BASE_FORM_FIELDS.TRADER_TYPE] === TRADER_TYPE.ENTERPRISE
          ) {
            return setCurrentStep(currenStep + 2);
          }

          if ([0, 1, 2, 5].find(item => item === currenStep)) {
            const { error } = await formRef.current.validate();
            if (error) return;
          }

          setCurrentStep(currenStep + 1);
        },
      }}
    >
      新建交易对手
    </ModalButton>
  );
});

export default CreateModalButton;
