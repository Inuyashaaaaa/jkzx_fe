import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { INPUT_NUMBER_DIGITAL_CONFIG, INPUT_NUMBER_LOT_CONFIG } from '@/constants/common';
import { Select } from '@/containers';
import { IFormControl } from '@/containers/Form/types';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  trdBookListBySimilarBookName,
  trdPortfolioListBySimilarPortfolioName,
  trdPortfolioSearch,
} from '@/services/trade-service';
import { formatMoney } from '@/tools';

export const bookId = {
  dataIndex: 'bookId',
  title: '交易簿',
  width: 150,
};

export const instrumentId = {
  dataIndex: 'instrumentId',
  width: 150,
  title: '合约代码',
};

export const direction = {
  dataIndex: 'direction',
  width: 150,
  title: '买/卖',
};

export const openClose = {
  dataIndex: 'openClose',
  width: 150,
  title: '开/平',
};

export const dealPrice = {
  dataIndex: 'dealPrice',
  width: 150,
  title: '价格',
  align: 'right',
};

export const dealAmount = {
  dataIndex: 'dealAmount',
  width: 150,
  title: '手数/股数',
  align: 'right',
};

export const dealTime = {
  dataIndex: 'dealTime',
  width: 150,
  title: '交易时间',
};

export const tradeId = {
  dataIndex: 'tradeId',
  width: 150,
  title: '成交ID',
};

export const tradeAccount = {
  dataIndex: 'tradeAccount',
  width: 150,
  title: '交易账号',
};

export const multiplier = {
  dataIndex: 'multiplier',
  width: 150,
  title: '合约乘数',
  align: 'right',
};

export const historyBuyAmount = {
  dataIndex: 'historyBuyAmount',
  width: 150,
  align: 'right',
  title: '总买金额(￥)',
  render: (text, record, index) => formatMoney(text),
};

export const historySellAmount = {
  dataIndex: 'historySellAmount',
  width: 150,
  title: '总卖金额(￥)',
  align: 'right',
  render: (text, record, index) => formatMoney(text),
};

export const totalBuy = {
  width: 150,
  dataIndex: 'totalBuy',
  title: '总买量',
  align: 'right',
};

export const longPosition = {
  dataIndex: 'longPosition',
  width: 150,
  title: '多头持仓',
  align: 'right',
};

export const shortPosition = {
  dataIndex: 'shortPosition',
  width: 150,
  title: '空头持仓',
  align: 'right',
};

export const netPosition = {
  dataIndex: 'netPosition',
  width: 150,
  title: '持仓数量',
  align: 'right',
};

export const totalSell = {
  dataIndex: 'totalSell',
  width: 150,
  title: '总卖量',
  align: 'right',
};

export const totalPnl = {
  dataIndex: 'totalPnl',
  width: 150,
  title: '总盈亏',
  align: 'right',
  render: (text, record, index) => formatMoney(text),
};

export const marketValue = {
  dataIndex: 'marketValue',
  width: 150,
  align: 'right',
  title: '市值(￥)',
  render: (text, record, index) => formatMoney(text),
};

export const portfolios = {
  dataIndex: 'portfolioNames',
  width: 150,
  title: '投资组合',
  render: (text, record, index) => (Array.isArray(text) ? text.join(',') : text),
};

export const portfolio = {
  dataIndex: 'portfolioName',
  width: 150,
  title: '投资组合',
  render: (text, record, index) => (Array.isArray(text) ? text.join(',') : text),
};

export const resultTableFailureColumns = [
  tradeId,
  {
    dataIndex: 'cause',
    title: '失败原因',
  },
];

export function generateColumns(type) {
  if (type === 'flow') {
    return [
      bookId,
      portfolios,
      instrumentId,
      direction,
      openClose,
      dealPrice,
      dealAmount,
      dealTime,
      tradeId,
      tradeAccount,
      multiplier,
    ];
  }

  const baseColumns = [
    instrumentId,
    netPosition,
    longPosition,
    shortPosition,
    totalBuy,
    historyBuyAmount,
    totalSell,
    historySellAmount,
    marketValue,
    totalPnl,
  ];

  if (type === 'detail') {
    return [bookId, ...baseColumns];
  }

  if (type === 'portfolio') {
    return [portfolio, ...baseColumns];
  }

  return baseColumns;
}

export const UPDATE_PORTFOLIO_CONTROLS = [
  {
    title: '交易编号',
    dataIndex: 'tradeId',
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({ required: true })(
          <Select
            fetchOptionsOnSearch
            options={async (v: string = '') => {
              const { data, error } = await trdPortfolioSearch({
                similarPortfolioName: v,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
];

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易簿',
    },
    field: 'bookId',
    input: {
      type: 'select',
      showSearch: true,
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
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '合约代码',
    },
    field: 'instrumentId',
    input: {
      type: 'select',
      showSearch: true,
      options: async value => {
        const { data, error } = await mktInstrumentSearch({
          instrumentIdPart: value,
        });
        if (error) return [];
        return data.slice(0, 50).map(item => ({
          label: item,
          value: item,
        }));
      },
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '投资组合',
    },
    field: 'portfolioNames',
    input: {
      type: 'select',
      showSearch: true,
      mode: 'multiple',
      options: async value => {
        const { data, error } = await trdPortfolioListBySimilarPortfolioName({
          similarPortfolioName: value,
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
      label: '买/卖',
    },
    field: 'direction',
    input: {
      type: 'select',
      options: [
        {
          label: '买',
          value: 'BUYER',
        },
        {
          label: '卖',
          value: 'SELLER',
        },
      ],
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '开/平',
    },
    field: 'openClose',
    input: {
      type: 'select',
      options: [
        {
          label: '开',
          value: 'OPEN',
        },
        {
          label: '平',
          value: 'CLOSE',
        },
      ],
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '价格',
    },
    field: 'dealPrice',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '手数/股数',
    },
    field: 'dealAmount',
    input: INPUT_NUMBER_LOT_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '交易时间',
    },
    field: 'dealTime',
    input: {
      type: 'date',
      showTime: true,
      format: 'YYYY-MM-DDTHH:mm:ss',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '成交ID',
    },
    field: 'tradeId',
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    control: {
      label: '交易帐号',
    },
    field: 'tradeAccount',
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
];
