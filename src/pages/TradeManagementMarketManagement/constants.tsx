import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { getDate, getUnit } from '@/tools/format';
import { formatMoney } from '@/tools';
export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    headerName: '标的物代码',
    field: 'instrumentId',
    width: 100,
    pinned: 'left',
    // checkboxSelection: true,
  },
  {
    headerName: '标的物名称',
    field: 'instrumentName',
    width: 100,
  },
  {
    headerName: '买价',
    field: 'bid',
    width: 100,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '卖价',
    field: 'ask',
    width: 100,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '最新成交价',
    field: 'last',
    width: 100,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '时间戳',
    field: 'intradayQuoteTimestamp',
    width: 160,
    input: {
      type: 'date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    headerName: '今收',
    field: 'close',
    width: 100,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '昨收',
    field: 'yesterdayClose',
    width: 100,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '交易所',
    field: 'exchange',
    width: 100,
  },
  {
    headerName: '合约乘数',
    field: 'multiplier',
    width: 100,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '资产类别',
    field: 'assetClass',
    width: 100,
  },
  {
    headerName: '合约类型',
    field: 'instrumentType',
    width: 100,
  },
  {
    headerName: '合约到期日',
    field: 'maturity',
    width: 100,
  },
];

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
  // {
  //   dataIndex: 'valuationDate',
  //   control: {
  //     label: '估值日',
  //   },
  //   input: {
  //     type: 'date',
  //     range: 'day',
  //   },
  // },
  // {
  //   dataIndex: '时区',
  //   control: {
  //     label: '时区',
  //   },
  //   input: {
  //     type: 'select',
  //     options: [
  //       {
  //         label: 'label',
  //         value: 'value',
  //       },
  //     ],
  //   },
  // },
];

export const columns: IColumnDef[] = [
  {
    title: '标的物代码',
    dataIndex: 'instrumentId',
    key: 1,
    fixed: 'left',
    width: 150,
  },
  {
    title: '标的物名称',
    dataIndex: 'instrumentName',
    width: 150,
    key: 2,
  },
  {
    title: '买价(￥)',
    dataIndex: 'bid',
    width: 150,
    key: 3,
    render: (text, record, index) => {
      return formatMoney(text);
    },
  },
  {
    title: '卖价(￥)',
    dataIndex: 'ask',
    width: 150,
    key: 4,
    render: (text, record, index) => {
      return formatMoney(text);
    },
  },
  {
    title: '最新成交价(￥)',
    dataIndex: 'last',
    width: 150,
    key: 5,
    render: (text, record, index) => {
      return formatMoney(text);
    },
  },
  {
    title: '时间戳',
    dataIndex: 'intradayQuoteTimestamp',
    width: 150,
    key: 6,
    render: (text, record, index) => {
      return getDate(text);
    },
  },
  {
    title: '今收(￥)',
    dataIndex: 'close',
    width: 150,
    key: 7,
    render: (text, record, index) => {
      return formatMoney(text);
    },
  },
  {
    title: '昨收(￥)',
    dataIndex: 'yesterdayClose',
    width: 150,
    key: 8,
    render: (text, record, index) => {
      return formatMoney(text);
    },
  },
  {
    title: '交易所',
    dataIndex: 'exchange',
    width: 150,
    key: 9,
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
    width: 150,
    key: 10,
    render: (text, record, index) => {
      return getUnit(' ', text);
    },
  },
  {
    title: '资产类别',
    dataIndex: 'assetClass',
    width: 150,
    key: 11,
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    width: 150,
    key: 12,
  },
  {
    title: '合约到期日',
    dataIndex: 'maturity',
    width: 150,
    key: 13,
  },
];
