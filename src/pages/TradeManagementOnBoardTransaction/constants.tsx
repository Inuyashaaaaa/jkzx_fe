import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';

const bookId = {
  field: 'bookId',
  headerName: '交易簿',
};

const instrumentId = {
  field: 'instrumentId',
  headerName: '合约代码',
};

const direction = {
  field: 'direction',
  headerName: '买/卖',
};

const openClose = {
  field: 'openClose',
  headerName: '开/平',
};

const dealPrice = {
  field: 'dealPrice',
  headerName: '价格',
};

const dealAmount = {
  field: 'dealAmount',
  headerName: '手数/股数',
};

const dealTime = {
  field: 'dealTime',
  headerName: '交易时间',
};

const tradeId = {
  field: 'tradeId',
  headerName: '成交ID',
};

const tradeAccount = {
  field: 'tradeAccount',
  headerName: '交易账号',
};

const multiplier = {
  field: 'multiplier',
  headerName: '合约乘数',
};

const historyBuyAmount = {
  field: 'historyBuyAmount',
  headerName: '总买金额',
};

const historySellAmount = {
  field: 'historySellAmount',
  headerName: '总卖金额',
};

const totalBuy = {
  field: 'totalBuy',
  headerName: '总买量',
};

const longPosition = {
  field: 'longPosition',
  headerName: '多头持仓',
};

const shortPosition = {
  field: 'shortPosition',
  headerName: '空头持仓',
};

const netPosition = {
  field: 'netPosition',
  headerName: '持仓数量',
};

const totalSell = {
  field: 'totalSell',
  headerName: '总卖量',
};

const totalPnl = {
  field: 'totalPnl',
  headerName: '总盈亏',
};

const marketValue = {
  field: 'marketValue',
  headerName: '市值',
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
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
