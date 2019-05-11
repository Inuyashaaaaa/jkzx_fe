import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  EQUITY_EXCHANGE_ZHCN_MAP,
  COMMODITY_EXCHANGE_ZHCN_MAP,
  ASSET_CLASS_ZHCN_MAP,
  INSTRUMENT_TYPE_ZHCN_MAP,
} from '@/constants/common';
import { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { getDate, getUnit } from '@/tools/format';
import { formatNumber } from '@/tools';

export const searchFormControls: (markets) => IFormControl[] = markets => [
  {
    dataIndex: 'instrumentIds',
    control: {
      label: '标的物列表',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: async (value: string) => {
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
  },
];

export const columns: IColumnDef[] = [
  {
    title: '标的物代码',
    dataIndex: 'instrumentId',
    fixed: 'left',
    width: 150,
  },
  {
    title: '标的物名称',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: '买价 (¥)',
    dataIndex: 'bid',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '卖价 (¥)',
    dataIndex: 'ask',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '最新成交价 (¥)',
    dataIndex: 'last',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '时间戳',
    dataIndex: 'intradayQuoteTimestamp',
    render: (value, record, index) => {
      return getDate(value);
    },
    width: 200,
  },
  {
    title: '今收 (¥)',
    dataIndex: 'close',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '昨收 (¥)',
    dataIndex: 'yesterdayClose',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '交易所',
    dataIndex: 'exchange',
    render: (value, record, index) => {
      return {
        ...EQUITY_EXCHANGE_ZHCN_MAP,
        ...COMMODITY_EXCHANGE_ZHCN_MAP,
      }[value];
    },
    width: 150,
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: (value, record, index) => INSTRUMENT_TYPE_ZHCN_MAP[value],
    width: 150,
  },
  {
    title: '合约到期日',
    dataIndex: 'maturity',
  },
];
