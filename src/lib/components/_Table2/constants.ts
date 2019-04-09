import { StatusPanelDef } from 'ag-grid-community/dist/lib/interfaces/iStatusPanel';

export const VERTICAL_TABLE_HEADER_COLUMN_FIELD = '$vertical_header';

export const VERTICAL_COLUMN_HEADER_NAME = '$headerName';

export const VERTICAL_COLUMN_FIELD = '$field';

export const EVENT_CELL_VALUE_CHANGED = 'EVENT_CELL_VALUE_CHANGED';

export const EVENT_CELL_DEPEND_HOVER = 'EVENT_CELL_DEPEND_HOVER';

export const VALIDATE_CHAR_PRESS = 'VALIDATE_CHAR_PRESS';

export const ADD_ITEM_TAG = '$add';

export const DEFAULT_STATUS_PANEL_DEF: { statusPanels: StatusPanelDef[] } = {
  statusPanels: [
    {
      statusPanel: 'agTotalRowCountComponent',
      align: 'left',
    },
    { statusPanel: 'agFilteredRowCountComponent' },
    { statusPanel: 'agSelectedRowCountComponent' },
    { statusPanel: 'agAggregationComponent' },
  ],
};

export const LOCAL_TEXT = {
  page: '分页',
  more: '更多',
  to: '至',
  of: '共',
  next: '下一页',
  last: '最后一页',
  first: '第一页',
  previous: '上一页',
  loadingOoo: '加载中...',

  // for set filter
  selectAll: '选择全部',
  searchOoo: '搜索...',
  blanks: '空',

  // for number filter and text filter
  filterOoo: '过滤...',
  applyFilter: '过滤...',
  equals: '等于',
  notEquals: '不等于',

  // for number filter
  lessThan: '小于',
  greaterThan: '大于',
  lessThanOrEqual: '小于或等于',
  greaterThanOrEqual: '大于或等于',
  inRange: '范围内',

  // for text filter
  contains: '容器',
  notContains: '暂无容器',
  startsWith: '开始于',
  endsWith: '结束于',

  // the header of the default group column
  group: '分组',

  // tool panel
  columns: '列项',
  filters: '过滤',
  rowGroupColumns: '轴列项',
  rowGroupColumnsEmptyMessage: '拖拽到此处来进行分组',
  valueColumns: '数值列项',
  pivotMode: '轴数据',
  groups: '分组管理',
  values: '数值管理',
  pivots: '轴管理',
  valueColumnsEmptyMessage: '拖拽列项到此处使用聚合',
  pivotColumnsEmptyMessage: '拖拽列项到此处使用轴管理',
  toolPanelButton: '工具栏',

  // other
  noRowsToShow: '暂无数据',

  // enterprise menu
  pinColumn: '固定',
  valueAggregation: '聚合',
  autosizeThiscolumn: '该列自适应',
  autosizeAllColumns: '全部自适应',
  groupBy: '使用分组',
  ungroupBy: '取消分组',
  resetColumns: '重置',
  expandAll: '展开',
  collapseAll: '关闭',
  toolPanel: '工具栏',
  export: '导出',
  csvExport: '导出CSV',
  excelExport: '导出Excel',

  // enterprise menu pinning
  pinLeft: '左侧固定',
  pinRight: '右侧固定',
  noPin: '解除固定',

  // enterprise menu aggregation and status bar
  sum: '总和',
  min: '最小',
  max: '最大',
  none: '暂无数据',
  count: '计数',
  average: '平均',
  avg: '平均',

  // standard menu
  copy: '复制',
  copyWithHeaders: '结合表头复制',
  ctrlC: 'ctrl & C',
  paste: '粘贴',
  ctrlV: 'ctrl & V',
};

export const DEFAULT_CONTEXT_MENU_ITEMS = [
  'autoSizeAll',
  'copyWithHeadersCopy',
  'expandAll',
  'separator',
  'contractAll',
  'resetColumns',
  'copy',
  'paste',
];
