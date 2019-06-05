import {
  DatePicker,
  Form2,
  Input,
  InputNumber,
  ModalButton,
  Select,
  Table2,
  Upload,
  SmartTable,
} from '@/containers';
import { remove, uuid } from '@/tools';
import { UPLOAD_URL } from '@/services/document';
import { createRefParty } from '@/services/reference-data-service';
import { AutoComplete, Button, Cascader, Divider, Icon, notification, Row, Steps } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import { BASE_FORM_FIELDS, PARTY_DOC_CREATE_OR_UPDATE, TRADER_TYPE } from './constants';
import EmailInput from '@/containers/EmailInput';
import { getToken } from '@/tools/authority';

const CreateModalButton = memo<any>(props => {
  const { salesCascaderList, fetchTableData } = props;

  const formRef = useRef<Form2>(null);
  const initialFormDatas: any = {};
  const [traderList, setTraderList] = useState(
    (initialFormDatas.trader || []).map(item => ({ ...item, uuid: uuid() }))
  );
  const tableEl = useRef<Table2>(null);
  const [baseFormData, setBaseFormData] = useState({});
  const [productFormData, setProductFormData] = useState({});
  const [authFormData, setAuthFormData] = useState({});
  const [attachFormData, setAttachFormData] = useState({});
  const [currenStep, setCurrentStep] = useState(0);
  const editable = true;
  const [modalVisible, setModalVisible] = useState(false);
  const [trustorSource, setTrustorSource] = useState([]);
  const [tradeSource, setTradeSource] = useState([]);

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

  const trustorChange = value => {
    const trustorSource = [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`];
    if (!value || value.indexOf('@') >= 0) {
      const trustorSource = [];
    }
    setTrustorSource(trustorSource);
  };

  const tradeChange = value => {
    const tradeSource = [`${value}@gmail.com`, `${value}@163.com`, `${value}@qq.com`];
    if (!value || value.indexOf('@') >= 0) {
      const tradeSource = [];
    }
    setTradeSource(tradeSource);
  };

  return (
    <ModalButton
      type="primary"
      content={
        <>
          <Steps current={currenStep} style={{ padding: '40px 30px' }} size="small">
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
              onFieldsChange={(props, changedFields, allFields) => {
                setBaseFormData({
                  ...baseFormData,
                  ...changedFields,
                });
              }}
              dataSource={baseFormData}
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
                      <FormItem hasFeedback={true} extra={'产品户 需要在下一步补充产品信息内容'}>
                        {form.getFieldDecorator({
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
                                label: '机构户',
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
                  dataIndex: 'investorType',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(
                          <Select
                            editing={editable}
                            options={[
                              {
                                label: ' 一般机构普通投资者',
                                value: 'NON_PROFESSINAL_INVESTOR',
                              },
                              {
                                label: '一般机构专业投资者',
                                value: 'PROFESSIONAL_INVESTOR',
                              },
                              {
                                label: '金融机构专业投资者',
                                value: 'FINANCIAL_INSTITUTIONAL_INVESTOR',
                              },
                              {
                                label: '金融产品',
                                value: 'FINANCIAL_PRODUCT',
                              },
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '开户法人',
                  dataIndex: 'legalRepresentative',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'address',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'salesName',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(
                          <Cascader
                            placeholder="请输入内容"
                            style={{ width: '100%' }}
                            options={salesCascaderList}
                            showSearch={{
                              filter: (inputValue, path) => {
                                return path.some(
                                  option =>
                                    option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >
                                    -1
                                );
                              },
                            }}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '担保人',
                  dataIndex: 'warrantor',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'warrantorAddress',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'contact',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'tradePhone',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'tradeEmail',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: true,
                              message: '必填',
                            },
                          ],
                        })(<EmailInput style={{ width: '100%' }} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '主协议编号',
                  dataIndex: 'masterAgreementId',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
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
                  dataIndex: 'trustorEmail',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<EmailInput style={{ width: '100%' }} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '补充协议编号',
                  dataIndex: 'supplementalAgreementId',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '授权到期日',
                  dataIndex: 'authorizeExpiryDate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<DatePicker editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '协议签署授权人姓名',
                  dataIndex: 'signAuthorizerName',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '协议签署授权人身份证号',
                  dataIndex: 'signAuthorizerIdNumber',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '协议签署授权人证件有效期',
                  dataIndex: 'signAuthorizerIdExpiryDate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<DatePicker editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '主协议编号版本',
                  dataIndex: 'masterAgreementNoVersion',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Select
                            editing={editable}
                            options={[
                              {
                                label: ' SAC2014',
                                value: 'SAC2014',
                              },
                              {
                                label: 'SAC2015',
                                value: 'SAC2015',
                              },
                              {
                                label: 'ISDA',
                                value: 'ISDA',
                              },
                              {
                                label: 'OTHER',
                                value: 'OTHER',
                              },
                              {
                                label: 'NAFMII',
                                value: 'NAFMII',
                              },
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '主协议签证日期',
                  dataIndex: 'masterAgreementSignDate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<DatePicker editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '营业执照',
                  dataIndex: 'businessLicense',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
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
              onFieldsChange={(props, changedFields, allFields) => {
                setProductFormData({
                  ...productFormData,
                  ...changedFields,
                });
              }}
              dataSource={productFormData}
              style={{ paddingTop: 20 }}
              footer={false}
              columnNumberOneRow={3}
              layout="vertical"
              columns={[
                {
                  title: '产品名称',
                  dataIndex: BASE_FORM_FIELDS.PRODUCTNAME,
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '产品代码',
                  dataIndex: 'productCode',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '产品类型',
                  dataIndex: 'productType',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '备案编号',
                  dataIndex: 'recordNumber',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '产品成立日',
                  dataIndex: 'productFoundDate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<DatePicker editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '产品到期日',
                  dataIndex: 'productExpiringDate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<DatePicker editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '基金经理',
                  dataIndex: 'fundManager',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
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
              onFieldsChange={(props, changedFields, allFields) => {
                setAuthFormData({
                  ...authFormData,
                  ...changedFields,
                });
              }}
              dataSource={authFormData}
              style={{ paddingTop: 20 }}
              footer={false}
              columnNumberOneRow={3}
              layout="vertical"
              columns={[
                {
                  title: '交易方向',
                  dataIndex: 'tradingDirection',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Select
                            editing={editable}
                            options={[
                              {
                                label: '买',
                                value: 'BUY',
                              },
                              {
                                label: '卖',
                                value: 'SELL',
                              },
                              {
                                label: '买卖',
                                value: 'BUY_SELL',
                              },
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '交易权限',
                  dataIndex: 'tradingPermission',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Select
                            editing={editable}
                            options={[
                              {
                                label: '交易',
                                value: 'FULL',
                              },
                              {
                                label: '限制交易',
                                value: 'LIMITED',
                              },
                              {
                                label: '交易标的',
                                value: 'BY_UNDERLYER',
                              },
                            ]}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '交易权限备注',
                  dataIndex: 'tradingPermissionNote',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<Input editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '交易标的',
                  dataIndex: 'tradingUnderlyers',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Select
                            options={[
                              {
                                label: '个股商品',
                                value: 'EQUITY_COMMODITY',
                              },
                              {
                                label: '商品',
                                value: 'COMMODITY',
                              },
                            ]}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: (
                    <span>
                      保证金折扣<span style={{ fontSize: 12 }}>（例如：0.8表示八折）</span>
                    </span>
                  ),
                  dataIndex: 'marginDiscountRate',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={true}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(<InputNumber editing={editable} />)}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          )}
          {currenStep === 3 && (
            <>
              <SmartTable
                size="small"
                rowKey={'uuid'}
                pagination={false}
                dataSource={traderList}
                ref={node => (tableEl.current = node)}
                onCellFieldsChange={({ rowIndex, changedFields }) => {
                  setTraderList(
                    traderList.map((item, index) => {
                      if (index === rowIndex) {
                        return {
                          ...item,
                          ...changedFields,
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
                            rules: [
                              {
                                required: true,
                                message: '必填',
                              },
                            ],
                          })(<DatePicker editing={editable} />)}
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
          {currenStep === 4 && (
            <Form2
              ref={node => {
                formRef.current = node;
              }}
              onFieldsChange={(props, changedFields, allFields) => {
                setAttachFormData({
                  ...attachFormData,
                  ...changedFields,
                });
              }}
              dataSource={attachFormData}
              style={{ paddingTop: 20, paddingLeft: 30 }}
              footer={false}
              columnNumberOneRow={3}
              layout="vertical"
              columns={[
                {
                  title: '主协议',
                  dataIndex: 'masterAgreementDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '主协议',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '补充协议',
                  dataIndex: 'supplementalAgreementDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '补充协议',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '风险问卷调查',
                  dataIndex: 'riskSurveyDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '风险问卷调查',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '交易授权书',
                  dataIndex: 'tradeAuthDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '交易授权书',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '对手尽职调查',
                  dataIndex: 'dueDiligenceDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '对手尽职调查',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '风险承受能力调查问卷',
                  dataIndex: 'riskPreferenceDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '风险承受能力调查问卷',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '合规性承诺书',
                  dataIndex: 'complianceDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '合规性承诺书',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '风险揭示书',
                  dataIndex: 'riskRevelationDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '风险揭示书',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '适当性警示书',
                  dataIndex: 'qualificationWarningDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '适当性警示书',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '授信协议',
                  dataIndex: 'creditAgreement',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '授信协议',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
                {
                  title: '履约保障协议',
                  dataIndex: 'performanceGuaranteeDoc',
                  render: (val, record, index, { form }) => {
                    return (
                      <FormItem hasFeedback={val && val.length > 0 ? true : false}>
                        {form.getFieldDecorator({
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Upload
                            action={UPLOAD_URL}
                            data={{
                              method: PARTY_DOC_CREATE_OR_UPDATE,
                              params: JSON.stringify({
                                name: '履约保障协议',
                              }),
                            }}
                            headers={{ Authorization: `Bearer ${getToken()}` }}
                            editing={editable}
                          />
                        )}
                      </FormItem>
                    );
                  },
                },
              ]}
            />
          )}
        </>
      }
      onClick={() => setModalVisible(true)}
      modalProps={{
        title: '新建交易对手',
        width: 900,
        visible: modalVisible,
        maskClosable: false,
        onCancel: () => setModalVisible(false),
        footer: (
          <Row gutter={8} type="flex" justify="end">
            {currenStep === 0 && (
              <Button
                onClick={() => {
                  setModalVisible(false);
                }}
              >
                取消
              </Button>
            )}
            {currenStep > 0 && (
              <Button
                onClick={() => {
                  if (
                    currenStep === 2 &&
                    _.get(baseFormData[BASE_FORM_FIELDS.TRADER_TYPE], 'value') ===
                      TRADER_TYPE.ENTERPRISE
                  ) {
                    return setCurrentStep(currenStep - 2);
                  }

                  setCurrentStep(currenStep - 1);
                }}
              >
                上一步
              </Button>
            )}
            <Button
              type="primary"
              onClick={async () => {
                if (currenStep === 4) {
                  const baseData = {};
                  Object.keys(baseFormData).forEach(item => {
                    baseData[item] = baseFormData[item].value;
                    if (item.endsWith('Date') && baseData[item]) {
                      baseData[item] = baseData[item].format('YYYY-MM-DD');
                    }
                  });
                  Object.keys(productFormData).forEach(item => {
                    baseData[item] = productFormData[item].value;
                    if (item.endsWith('Date') && baseData[item]) {
                      baseData[item] = baseData[item].format('YYYY-MM-DD');
                    }
                  });
                  Object.keys(authFormData).forEach(item => {
                    baseData[item] = authFormData[item].value;
                    if (item.endsWith('Date') && baseData[item]) {
                      baseData[item] = baseData[item].format('YYYY-MM-DD');
                    }
                  });
                  Object.keys(attachFormData).forEach(item => {
                    if (attachFormData[item].value && attachFormData[item].value.length > 0) {
                      baseData[item] = attachFormData[item].value;
                      baseData[item] = attachFormData[item].value[0].response.result.uuid;
                    }
                  });
                  const tradeAuthorizer = traderList.map(item => {
                    return {
                      tradeAuthorizerName: item.姓名.value,
                      tradeAuthorizerIdNumber: item.身份证号.value,
                      tradeAuthorizerIdExpiryDate: item.证件有效期.value.format('YYYY-MM-DD'),
                      tradeAuthorizerPhone: item.联系电话.value,
                    };
                  });
                  const [subsidiaryName, branchName, salesName] = baseData.salesName;
                  baseData.subsidiaryName = subsidiaryName;
                  baseData.branchName = branchName;
                  baseData.salesName = salesName;
                  baseData.tradeAuthorizer = tradeAuthorizer;

                  const { data, error } = await createRefParty(baseData);
                  if (error) return;
                  setModalVisible(false);
                  setCurrentStep(0);
                  setBaseFormData({});
                  setProductFormData({});
                  setAuthFormData({});
                  setTraderList([]);
                  setAttachFormData({});
                  fetchTableData({});
                  notification.success({
                    message: '新建交易对手成功',
                  });
                  return;
                }

                const ref = currenStep === 3 ? tableEl : formRef;
                const res = await ref.current.validate();
                if (_.isArray(res)) {
                  if (res.some(value => value.error)) return;
                } else if (res.error) {
                  return;
                }

                if (
                  currenStep === 0 &&
                  _.get(baseFormData[BASE_FORM_FIELDS.TRADER_TYPE], 'value') ===
                    TRADER_TYPE.ENTERPRISE
                ) {
                  return setCurrentStep(currenStep + 2);
                }

                setCurrentStep(currenStep + 1);
              }}
            >
              {currenStep === 4 ? '确认提交' : '下一步'}
            </Button>
          </Row>
        ),
      }}
    >
      新建交易对手
    </ModalButton>
  );
});

export default CreateModalButton;
