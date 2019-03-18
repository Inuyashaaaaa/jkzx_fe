import { INPUT_NUMBER_CURRENCY_CNY_CONFIG } from '@/constants/common';
import { Table } from '@/design/components';
import Form from '@/design/components/Form';
import { IFormControl } from '@/design/components/Form/types';
import ModalButton from '@/design/components/ModalButton';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import { Button, Col, Row, Typography } from 'antd';
import moment, { isMoment } from 'moment';
import React from 'react';

const { Title } = Typography;

export const bookingTableFormControls = (
  formData,
  tadeInfo,
  tradeTableData,
  onSwtichModal,
  modalVisible,
  onClearCounterPartyCodeButtonClick
): IFormControl[] => [
  {
    control: {
      label: '交易簿',
    },
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await trdBookListBySimilarBookName({
          similarBookName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
    field: 'bookName',
  },
  {
    control: {
      label: '交易编号',
    },
    field: 'tradeId',
  },
  {
    control: {
      label: '交易对手',
    },
    field: 'counterPartyCode',
    input: {
      after: (
        <ModalButton
          type="primary"
          visible={modalVisible}
          onClick={onSwtichModal}
          disabled={!formData.counterPartyCode}
          onCancel={onClearCounterPartyCodeButtonClick}
          onConfirm={onSwtichModal}
          modalProps={{
            title: `${formData.counterPartyCode} 的基本信息`,
            width: 800,
            maskClosable: false,
            okText: '确认并继续',
          }}
          content={
            <div>
              <Typography>
                <Title level={4} style={{ fontSize: 14 }}>
                  交易权限
                </Title>
                <Form
                  footer={false}
                  dataSource={tadeInfo}
                  controlNumberOneRow={2}
                  controls={[
                    {
                      field: 'tradingDirection',
                      control: {
                        label: '交易方向',
                      },
                      input: {
                        subtype: 'static',
                        type: 'input',
                        formatValue: value => {
                          if (value === 'BUY') {
                            return '买';
                          } else if (value === 'SELL') {
                            return '卖';
                          } else {
                            return '买卖';
                          }
                        },
                      },
                    },
                    {
                      field: 'tradingPermission',
                      control: {
                        label: '交易权限',
                      },
                      input: {
                        subtype: 'static',
                        type: 'input',
                        formatValue: value => {
                          if (value === 'FULL') {
                            return '交易';
                          } else if (value === 'LIMITED') {
                            return '限制交易';
                          } else {
                            return '交易标的';
                          }
                        },
                      },
                    },
                    {
                      field: 'tradingPermissionNote',
                      control: {
                        label: '交易权限备注',
                      },
                      input: {
                        subtype: 'static',
                        type: 'input',
                      },
                    },
                    {
                      field: 'tradingUnderlyers',
                      control: {
                        label: '交易标的',
                      },
                      input: {
                        subtype: 'static',
                        type: 'input',
                        formatValue: value => {
                          if (value === 'COMMODITY') {
                            return '商品';
                          } else {
                            return '个股商品';
                          }
                        },
                      },
                    },
                  ]}
                />
                <Title level={4} style={{ fontSize: 14 }}>
                  客户可用资金
                </Title>
                <Form
                  footer={false}
                  dataSource={tadeInfo}
                  controlNumberOneRow={2}
                  controls={[
                    {
                      field: 'cash',
                      control: {
                        label: '可用资金',
                      },
                      input: {
                        ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                        subtype: 'static',
                      },
                    },
                  ]}
                />
                <Title level={4} style={{ fontSize: 14, marginBottom: 20 }}>
                  交易授权人
                </Title>
                <Table
                  pagination={false}
                  rowKey="tradeAuthorizerIdNumber"
                  columnDefs={[
                    {
                      headerName: '姓名',
                      field: 'tradeAuthorizerName',
                    },
                    {
                      headerName: '身份证号',
                      field: 'tradeAuthorizerIdNumber',
                      input: {
                        type: 'number',
                      },
                    },
                    {
                      headerName: '证件有效期',
                      field: 'tradeAuthorizerIdExpiryDate',
                      render: params => {
                        let value = params.value;
                        if (isMoment(value)) {
                          value = value.format('YYYY-MM-DD');
                        }
                        const isOverlate = moment(value).isBefore(moment());

                        if (isOverlate) {
                          return (
                            <span
                              style={{ color: 'red', lineHeight: `${params.context.rowHeight}px` }}
                            >
                              {`${value}${isOverlate ? `(已过期)` : ``}`}
                            </span>
                          );
                        }
                        return (
                          <span style={{ lineHeight: `${params.context.rowHeight}px` }}>
                            {value}
                          </span>
                        );
                      },
                    },
                    {
                      headerName: '电话',
                      field: 'tradeAuthorizerPhone',
                    },
                  ]}
                  rowData={tradeTableData}
                />
              </Typography>
            </div>
          }
        >
          查看交易对手
        </ModalButton>
      ),
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '销售',
    },
    field: 'salesCode',
    input: {
      type: 'input',
      subtype: 'show',
      hoverIcon: 'lock',
    },
  },
  {
    control: {
      label: '交易日',
    },
    field: 'tradeDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
];
