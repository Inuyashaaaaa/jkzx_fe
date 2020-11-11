import { ColumnProps } from 'antd/lib/table';
import { TabPaneProps } from 'antd/lib/tabs'

export enum SearchFormFieldsEnums {
  // 持仓日期
  positionDate = 'positionDate',
  // 置信度
  confidence = 'confidence',
  // 展望期 (天)
  outlook = 'outlook'
}


export const CounterpartyVARTabsList: TabPaneProps[] = [{
  tabKey: '1',
  tab: '子公司VaR',
}, {
  tabKey: '2',
  tab: '子公司分持仓类型PNL'
}, {
  tabKey: '3',
  tab: '子公司分品种PNL'
}, {
  tabKey: '4',
  tab: '子公司持仓明细'
}]

export const CounterpartyVARColumnsList: ColumnProps<any>[] = [{
  title: '序号',
  width: 80,
  render: (text, record, index) => `${index + 1}`,
}, {
  title: '对手方',
  dataIndex: 'CounterpartyName',
  width: 248,
  sorter: (a, b) => a.CounterpartyName > b.CounterpartyName ? -1 : 1,
}, {
  title: '对手方VaR(万元)',
  dataIndex: 'var',
  width: 248,
  sorter: (a, b) => a.VaR - b.VaR,
  align: 'right',
}, {
  title: '对手方市值权益总和(万元)',
  dataIndex: 'netCapital',
  width: 248,
  sorter: (a, b) => a.netCapital - b.netCapital,
  align: 'right',
}, {
  title: '对手方市值权益总额-对手方VaR(万元)',
  dataIndex: 'varByNetCapital',
  width: 248,
  sorter: (a, b) => a.VaRDivNetCapital - b.VaRDivNetCapital,
  align: 'right'
}]
