import { DatePicker, Input, InputNumber, Select, Form2, TimePicker } from '@/containers';
import { mktInstrumentSearch } from '@/services/market-data-service';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import moment from 'moment';

const multiplier = {
  title: '合约乘数',
  dataIndex: 'multiplier',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '合约乘数是必填项',
            },
          ],
        })(
          <InputNumber
            precision={0}
            min={1}
            disabled={Form2.getFieldValue(record.instrumentType) === 'STOCK'}
          />
        )}
      </FormItem>
    );
  },
};

const name = {
  title: '合约名称',
  dataIndex: 'name',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '合约名称是必填项',
            },
          ],
        })(<Input />)}
      </FormItem>
    );
  },
};

const exchange = {
  title: '交易所',
  dataIndex: 'exchange',
  render: (value, record, index, { form, editing }) => {
    const getOptions = () => {
      if (record.assetClass && record.assetClass.value === 'EQUITY') {
        return [
          {
            label: '上交所',
            value: 'SSE',
          },
          {
            label: '深交所',
            value: 'SZSE',
          },
          {
            label: '中金所',
            value: 'CFFEX',
          },
        ];
      }
      return [
        {
          label: '上期所',
          value: 'SHFE',
        },
        {
          label: '大商所',
          value: 'DCE',
        },
        {
          label: '郑商所',
          value: 'CZCE',
        },
        {
          label: '金交所',
          value: 'SGE',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易所是必填项',
            },
          ],
        })(<Select style={{ minWidth: 180 }} options={getOptions()} />)}
      </FormItem>
    );
  },
};

const maturity = {
  title: '期货到期日',
  dataIndex: 'maturity',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '期权到期日是必填项',
            },
          ],
        })(<DatePicker editing={true} format={'YYYY-MM-DD'} />)}
      </FormItem>
    );
  },
};

const indexName = {
  title: '指数名称',
  dataIndex: 'name',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '指数名称是必填项',
            },
          ],
        })(<Input />)}
      </FormItem>
    );
  },
};

const instrumentType = {
  title: '合约类型',
  dataIndex: 'instrumentType',
  render: (value, record, index, { form, editing }) => {
    const getOptions = () => {
      if (record.assetClass && record.assetClass.value === 'EQUITY') {
        return [
          {
            label: '股票',
            value: 'STOCK',
          },
          {
            label: '股指',
            value: 'INDEX',
          },
          {
            label: '股指期货',
            value: 'INDEX_FUTURES',
          },
          {
            label: '股指期权',
            value: 'INDEX_OPTION',
          },
          {
            label: '个股/ETF期权',
            value: 'STOCK_OPTION',
          },
        ];
      }
      return [
        {
          label: '现货',
          value: 'SPOT',
        },
        {
          label: '期货',
          value: 'FUTURES',
        },
        {
          label: '期货期权',
          value: 'FUTURES_OPTION',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '合约类型是必填项',
            },
          ],
        })(<Select style={{ minWidth: 180 }} options={getOptions()} />)}
      </FormItem>
    );
  },
};

const instrumentTypeSearch = {
  title: '合约类型',
  dataIndex: 'instrumentType',
  render: (value, record, index, { form, editing }) => {
    const disable = () => {
      if (record.instrumentIds && record.instrumentIds.value && record.instrumentIds.value.length) {
        return true;
      }
      return false;
    };
    const getOptions = () => {
      if (record.assetClass && record.assetClass.value === 'EQUITY') {
        return [
          {
            label: '股票',
            value: 'STOCK',
          },
          {
            label: '股指',
            value: 'INDEX',
          },
          {
            label: '股指期货',
            value: 'INDEX_FUTURES',
          },
          {
            label: '股指期权',
            value: 'INDEX_OPTION',
          },
          {
            label: '个股/ETF期权',
            value: 'STOCK_OPTION',
          },
        ];
      }
      return [
        {
          label: '现货',
          value: 'SPOT',
        },
        {
          label: '期货',
          value: 'FUTURES',
        },
        {
          label: '期货期权',
          value: 'FUTURES_OPTION',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select style={{ minWidth: 180 }} options={getOptions()} disabled={disable()} />
        )}
      </FormItem>
    );
  },
};

const assetClassSearch = {
  title: '资产类别',
  dataIndex: 'assetClass',
  render: (value, record, index, { form, editing }) => {
    const disable = () => {
      if (record.instrumentIds && record.instrumentIds.value && record.instrumentIds.value.length) {
        return true;
      }
      return false;
    };
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            disabled={disable()}
            allowClear={true}
            options={[
              {
                label: '商品',
                value: 'COMMODITY',
              },
              {
                label: '权益',
                value: 'EQUITY',
              },
            ]}
          />
        )}
      </FormItem>
    );
  },
};

const assetClass = type => {
  return {
    title: '资产类别',
    dataIndex: 'assetClass',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '资产类别是必填项',
              },
            ],
          })(
            <Select
              style={{ minWidth: 180 }}
              disabled={type === 'edit' ? true : false}
              options={[
                {
                  label: '商品',
                  value: 'COMMODITY',
                },
                {
                  label: '权益',
                  value: 'EQUITY',
                },
              ]}
            />
          )}
        </FormItem>
      );
    },
  };
};

const instrumentId = type => {
  return {
    title: '合约代码',
    dataIndex: 'instrumentId',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '标的物代码是必填项',
              },
            ],
          })(<Input disabled={type === 'edit'} />)}
        </FormItem>
      );
    },
  };
};

const instrumentIds = {
  title: '标的物列表',
  dataIndex: 'instrumentIds',
  render: (value, record, index, { form, editing }) => {
    const disable = () => {
      if (
        (record.assetClass && record.assetClass.value) ||
        (record.instrumentType && record.instrumentType.value)
      ) {
        return true;
      }
      return false;
    };
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            mode="multiple"
            disabled={disable()}
            fetchOptionsOnSearch={true}
            options={async (value: string = '') => {
              const { data = [], error } = await mktInstrumentSearch({
                instrumentIdPart: value,
              });
              if (error) return [];
              return data.slice(0, 50).map(item => ({
                label: item,
                value: item,
              }));
            }}
          />
        )}
      </FormItem>
    );
  },
};

const exerciseType = {
  title: '行权方式',
  dataIndex: 'exerciseType',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator('exerciseType', {
          rules: [
            {
              required: true,
              message: '行权方式是必填项',
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
            options={[
              {
                label: '欧式',
                value: 'EUROPEAN',
              },
              {
                label: '美式',
                value: 'AMERICAN',
              },
            ]}
          />
        )}
      </FormItem>
    );
  },
};

const optionType = {
  title: '期权类型',
  dataIndex: 'optionType',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator('optionType', {
          rules: [
            {
              required: true,
              message: '期权类型是必填项',
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
            options={[
              {
                label: '看涨',
                value: 'CALL',
              },
              {
                label: '看跌',
                value: 'PUT',
              },
            ]}
          />
        )}
      </FormItem>
    );
  },
};

const strike = {
  title: '行权价格',
  dataIndex: 'strike',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '行权价格是必填项',
            },
          ],
        })(<InputNumber precision={4} />)}
      </FormItem>
    );
  },
};

const underlyerInstrumentId = {
  title: '标的代码',
  dataIndex: 'underlyerInstrumentId',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '标的代码是必填项',
            },
          ],
        })(
          <Select
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
            options={async (value: string = '') => {
              const { data = [], error } = await mktInstrumentSearch({
                instrumentIdPart: value,
                excludeOption: true,
              });
              if (error) return [];
              return data.slice(0, 50).map(item => ({
                label: item,
                value: item,
              }));
            }}
          />
        )}
      </FormItem>
    );
  },
};

const expirationDate = {
  title: '期权到期日',
  dataIndex: 'expirationDate',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '期权到期时间是必填项',
            },
          ],
        })(<DatePicker editing={true} format={'YYYY-MM-DD'} />)}
      </FormItem>
    );
  },
};

const expirationTime = {
  title: '期权到期时间',
  dataIndex: 'expirationTime',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          initialValue: moment('15:00:00', 'HH:mm:ss'),
          rules: [
            {
              required: true,
              message: '期权到期时间是必填项',
            },
          ],
        })(<TimePicker />)}
      </FormItem>
    );
  },
};

export const getInstrumenInfo = event => {
  const fieldMap = {
    'COMMODITY:SPOT': [multiplier, name, exchange],
    'COMMODITY:FUTURES': [multiplier, name, exchange, maturity],
    'COMMODITY:FUTURES_OPTION': [
      name,
      underlyerInstrumentId,
      exchange,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:STOCK': [multiplier, name, exchange],
    'EQUITY:INDEX': [indexName, exchange],
    'EQUITY:INDEX_FUTURES': [multiplier, name, exchange, maturity],
    'EQUITY:INDEX_OPTION': [
      name,
      underlyerInstrumentId,
      exchange,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:STOCK_OPTION': [
      name,
      underlyerInstrumentId,
      exchange,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:FUTURES_OPTION': [
      name,
      underlyerInstrumentId,
      exchange,
      multiplier,
      exerciseType,
      optionType,
      exerciseType,
      expirationDate,
      expirationTime,
    ],
  };
  const key = [event.assetClass, event.instrumentType].join(':');
  return fieldMap[key] || [];
};

export const createFormControls = (event = {}, type) => {
  return [instrumentId(type), assetClass(type), instrumentType].concat(getInstrumenInfo(event));
};

export const editFormControls = (event = {}, type) => {
  return [instrumentId(type), assetClass(type), instrumentType].concat(getInstrumenInfo(event));
};

export const searchFormControls = () => {
  return [assetClassSearch, instrumentTypeSearch, instrumentIds];
};
