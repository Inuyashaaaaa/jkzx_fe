import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '标的物',
    field: 'instrumentId',
  },
  {
    headerName: '总盈亏',
    field: 'totalPnl',
    editable: true,
  },
  {
    headerName: '场外总盈亏',
    field: 'optionPnl',
    editable: true,
  },
  {
    headerName: '场内总盈亏',
    field: 'hedgingPnl',
    editable: true,
  },
  {
    headerName: '交易簿',
    field: 'bookId',
  },
  {
    headerName: '计算日期',
    field: 'valuationDate',
  },
  {
    headerName: '期权盈亏',
    field: '期权盈亏',
  },
  {
    headerName: '标的物盈亏',
    field: '标的物盈亏',
  },
  {
    headerName: 'DELTA贡献',
    field: 'DELTA贡献',
  },
  {
    headerName: 'GAMMA贡献',
    field: 'GAMMA贡献',
  },
  {
    headerName: 'VEGA贡献',
    field: 'VEGA贡献',
  },
  {
    headerName: 'THETA贡献',
    field: 'THETA贡献',
  },
  {
    headerName: 'RHO贡献',
    field: 'RHO贡献',
  },
  {
    headerName: '其他',
    field: '其他',
  },
  {
    headerName: '当日新交易',
    field: '当日新交易',
  },
];
