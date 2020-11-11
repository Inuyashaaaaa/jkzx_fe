import { ColumnProps } from 'antd/lib/table';
import formatNumber from '../utils/formatNumber'

export enum SearchFormFieldsEnums {
  // 持仓日期
  date = 'date',
  // 置信度
  confidenceLevel = 'confidenceLevel',
  // 展望期 (天)
  varDay = 'varDay'
}

export const exportExcelConfig = {
  fileName: ''
}

export const PartyVARColumnsList: ColumnProps<any>[] = [{
  title: '序号',
  width: 80,
  dataIndex: 'id',
  render: (text, record, index) => `${index + 1}`,
}, {
  title: '子公司',
  dataIndex: 'partyName',
  width: 248,
  sorter: (a, b)=> a.partyName > b.partyName ? -1 : 1,
}, {
  title: '总体VaR(万元)',
  dataIndex: 'var',
  width: 248,
  sorter: (a, b) => a.VaR - b.VaR,
  align: 'right',
  render: text => formatNumber(text)
}, {
  title: '净资本(万元)',
  dataIndex: 'netCapital',
  width: 248,
  sorter: (a, b) => a.netCapital - b.netCapital,
  align: 'right',
  render: text => formatNumber(text)
}, {
  title: '总体VaR /净资本',
  dataIndex: 'varByNetCapital',
  width: 248,
  sorter: (a, b) => a.VaRDivNetCapital - b.VaRDivNetCapital,
  align: 'right',
  render: text => `${formatNumber(text)}%`
}, {
  title: '净资产(万元)',
  dataIndex: 'netAsset',
  width: 248,
  sorter: (a, b) => a.netAssets - b.netAssets,
  align: 'right',
  render: text => formatNumber(text)
}, {
  title: '总体VaR /净资产',
  dataIndex: 'varByNetAsset',
  width: 248,
  sorter: (a, b) => a.VaRDivNetAssets - b.VaRDivNetAssets,
  align: 'right',
  render: text => `${formatNumber(text)}%`
}]
