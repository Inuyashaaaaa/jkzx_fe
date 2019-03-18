import { IColumnDef } from '@/lib/components/_Table2';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易簿',
    field: 'bookId',
  },
  {
    headerName: '交易ID',
    field: 'tradeId',
  },
  {
    headerName: '持仓ID',
    field: 'positionId',
  },
  {
    headerName: '数量',
    field: 'quantity',
  },
  {
    headerName: '交易状态',
    field: 'tradeStatus',
    width: 130,
  },
  {
    headerName: '持仓状态',
    field: 'positionStatus',
    width: 130,
  },
  {
    headerName: '交易日',
    field: 'tradeDate',
  },
  {
    headerName: '资产类型',
    field: 'assetClass',
  },
  {
    headerName: '产品类型',
    field: 'productType',
  },
  {
    headerName: '标的物代码',
    field: 'underlyerInstrumentId',
  },
  {
    headerName: '名义本金',
    field: 'notional',
  },
  {
    headerName: '期权类型',
    field: 'optionType',
  },
  {
    headerName: '到期日',
    field: 'expirationDate',
  },
  {
    headerName: '标的物价格',
    field: 'underlyerPrice',
  },
  {
    headerName: '波动率',
    field: 'vol',
    editable: true,
  },
  {
    headerName: '无风险利率',
    field: 'r',
    editable: true,
  },
  {
    headerName: '分红利率',
    field: 'q',
    editable: true,
  },
  {
    headerName: '现价',
    field: 'price',
    editable: true,
  },
  {
    headerName: 'Delta',
    field: 'delta',
    editable: true,
  },
  {
    headerName: 'Gamma',
    field: 'gamma',
    editable: true,
  },
  {
    headerName: 'Vega',
    field: 'vega',
    editable: true,
  },
  {
    headerName: 'Theta',
    field: 'theta',
    editable: true,
  },
  {
    headerName: '基础合约代码',
    field: 'baseContractInstrumentId',
  },
  {
    headerName: '基础合约价格',
    field: 'baseContractPrice',
    editable: true,
  },
  {
    headerName: '基础合约Delta',
    field: 'baseContractDelta',
    editable: true,
  },
  {
    headerName: '基础合约Gamma',
    field: 'baseContractGamma',
    editable: true,
  },
  {
    headerName: '基础合约Theta',
    field: 'baseContractTheta',
    editable: true,
  },
  {
    headerName: '错误信息',
    field: 'message',
  },
];
