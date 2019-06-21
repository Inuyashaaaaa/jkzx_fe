import { LCM_EVENT_TYPE_ZHCN_MAP } from '@/constants/common';
import moment from 'moment';

export const ROW_KEY = 'tradeId';

export const OVERVIEW_TABLE_COLUMNDEFS = [
  {
    title: '交易编号',
    dataIndex: 'tradeId',
    width: 150,
  },
  {
    title: '持仓编号',
    dataIndex: 'positionId',
    width: 150,
  },
  {
    title: '操作用户',
    dataIndex: 'userLoginId',
    width: 150,
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    width: 150,
    render: value => moment(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '生命周期事件',
    dataIndex: 'lcmEventType',
    width: 150,
    render: value => LCM_EVENT_TYPE_ZHCN_MAP[value] || value,
  },
];
