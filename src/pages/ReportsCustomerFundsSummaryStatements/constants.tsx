import { formatNumber, formatMoney } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: 'SAC协议编码',
    dataIndex: 'masterAgreementId',
    width: 100,
  },
  {
    title: '客户名称',
    dataIndex: 'clientName',
    width: 100,
  },
  {
    title: '财务录入资金',
    children: [
      {
        title: '客户入金金额 (¥)',
        align: 'right',
        dataIndex: 'paymentIn',
        render: (value, record, index) => formatMoney(value),
        width: 100,
      },
      {
        title: '客户出金金额 (¥)',
        align: 'right',
        dataIndex: 'paymentOut',
        render: (value, record, index) => formatMoney(value),
        width: 100,
      },
    ],
  },
  {
    title: '交易权利金收支',
    children: [
      {
        title: '期权收取权利金 (¥)',
        dataIndex: 'premiumBuy',
        align: 'right',
        render: (value, record, index) => formatMoney(value),
        width: 100,
      },
      {
        title: '期权支出权利金 (¥)',
        align: 'right',
        dataIndex: 'premiumSell',
        render: (value, record, index) => formatMoney(value),
        width: 100,
      },
    ],
  },
  {
    title: '交易了结盈亏/赔付',
    children: [
      {
        title: '期权了结盈利 (¥)',
        align: 'right',
        dataIndex: 'profitAmount',
        render: (value, record, index) => formatMoney(value),
        width: 100,
      },
      {
        align: 'right',
        title: '期权了结赔付 (¥)',
        dataIndex: 'lossAmount',
        width: 100,
        render: (value, record, index) => formatMoney(value),
      },
    ],
  },
  {
    title: '场外预付金金额 (¥)',
    dataIndex: 'fundTotal',
    align: 'right',
    render: (value, record, index) => formatMoney(value),
    width: 100,
  },
];
