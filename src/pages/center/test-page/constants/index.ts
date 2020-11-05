export enum SearchFormFieldsEnums {
  BaseDate = 'baseDate',
}

export const MainTableColumnsList = [
  {
    title: '指标名称',
    dataIndex: 'riskLimitIndex',
    width: 300,
    fixed: 'left',
  },
  {
    title: '细分类型',
    dataIndex: 'riskLimitCategory',
    width: 250,
  },
  {
    title: '当前状态',
    width: 150,
    dataIndex: 'status',
  },
  {
    title: '当前值',
    width: 200,
    dataIndex: 'currentValue',
    align: 'right',
  },
  {
    title: '警告阈值',
    width: 200,
    dataIndex: 'warningLimit',
    align: 'right',
  },
  {
    title: '严重阈值',
    width: 200,
    dataIndex: 'criticalLimit',
    align: 'right',
  },
  {
    title: '描述信息',
    dataIndex: 'riskLimitDescription',
  },
];
