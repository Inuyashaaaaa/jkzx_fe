import { formatNumber, formatMoney } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '客户名称',
    dataIndex: 'clientName',
    width: 100,
  },
  {
    title: 'SAC协议编码',
    dataIndex: 'masterAgreementId',
    width: 100,
  },
  {
    title: '出入金日期',
    dataIndex: 'paymentDate',
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    width: 100,
  },
  {
    title: '入金 (¥)',
    align: 'right',
    dataIndex: 'paymentIn',
    render: (value, record, index) => formatMoney(value),
    width: 100,
  },
  {
    title: '出金 (¥)',
    align: 'right',
    dataIndex: 'paymentOut',
    render: (value, record, index) => formatMoney(value),
    width: 100,
  },
  {
    title: '出入金净额 (¥)',
    align: 'right',
    dataIndex: 'paymentAmount',
    render: (value, record, index) => formatMoney(value),
    width: 100,
  },
];
