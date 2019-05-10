import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import { formatMoney } from '@/tools';

const bookId = {
  dataIndex: 'bookId',
  title: '交易簿',
  width: 150,
};

const instrumentId = {
  dataIndex: 'instrumentId',
  width: 150,
  title: '合约代码',
};

const direction = {
  dataIndex: 'direction',
  width: 150,
  title: '买/卖',
};

const openClose = {
  dataIndex: 'openClose',
  width: 150,
  title: '开/平',
};

const dealPrice = {
  dataIndex: 'dealPrice',
  width: 150,
  title: '价格',
};

const dealAmount = {
  dataIndex: 'dealAmount',
  width: 150,
  title: '手数/股数',
};

const dealTime = {
  dataIndex: 'dealTime',
  width: 150,
  title: '交易时间',
};

const tradeId = {
  dataIndex: 'tradeId',
  width: 150,
  title: '成交ID',
};

const tradeAccount = {
  dataIndex: 'tradeAccount',
  width: 150,
  title: '交易账号',
};

const multiplier = {
  dataIndex: 'multiplier',
  width: 150,
  title: '合约乘数',
};

const historyBuyAmount = {
  dataIndex: 'historyBuyAmount',
  width: 150,
  title: '总买金额(￥)',
  render: (text, record, index) => {
    return formatMoney(text, '');
  },
};

const historySellAmount = {
  dataIndex: 'historySellAmount',
  width: 150,
  title: '总卖金额(￥)',
  render: (text, record, index) => {
    return formatMoney(text, '');
  },
};

const totalBuy = {
  width: 150,
  dataIndex: 'totalBuy',
  title: '总买量',
};

const longPosition = {
  dataIndex: 'longPosition',
  width: 150,
  title: '多头持仓',
};

const shortPosition = {
  dataIndex: 'shortPosition',
  width: 150,
  title: '空头持仓',
};

const netPosition = {
  dataIndex: 'netPosition',
  width: 150,
  title: '持仓数量',
};

const totalSell = {
  dataIndex: 'totalSell',
  width: 150,
  title: '总卖量',
};

const totalPnl = {
  dataIndex: 'totalPnl',
  width: 150,
  title: '总盈亏',
};

const marketValue = {
  dataIndex: 'marketValue',
  width: 150,
  title: '市值(￥)',
  render: (text, record, index) => {
    return formatMoney(text, '');
  },
};

export function generateColumns(type) {
  if (type === 'flow') {
    return [
      bookId,
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
  if (type === 'detail') {
    return [
      bookId,
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
  }

  if (type === 'summary') {
    return [
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
  }
}

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易簿',
    },
    field: 'bookId',
    input: {
      type: 'select',
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
  // {
  //   control: {
  //     label: '合约乘数',
  //   },
  //   field: 'multiplier',
  //   input: INPUT_NUMBER_DIGITAL_CONFIG,
  //   decorator: {
  //     rules: [
  //       {
  //         required: true,
  //       },
  //     ],
  //   },
  // },
];
