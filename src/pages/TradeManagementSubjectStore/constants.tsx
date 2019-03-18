import { IColumnDef } from '@/lib/components/_Table2/interface';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '标的物代码',
    field: 'instrumentId',
  },
  {
    headerName: '标的物名称',
    field: 'name',
  },
  {
    headerName: '交易所',
    field: 'exchange',
  },
  {
    headerName: '资产类别',
    field: 'assetClass',
  },
  {
    headerName: '合约类型',
    field: 'instrumentType',
  },
  {
    headerName: '合约乘数',
    field: 'multiplier',
  },
  {
    headerName: '期货到期日',
    field: 'maturity',
  },
];
