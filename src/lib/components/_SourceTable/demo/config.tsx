export default {
  title: 'SourceTable',
  subtitle: 'xxxx',
  sort: 1,
  api: `
rowKey | 行唯一标识 | null | true | string &
loading | 控制表格加载状态 | false | false | boolean &
tableColumnDefs | 表格列的定义 | [] | false | IColumnDef[] &
searchable | 开启搜索 | false | false | boolean &
editable | 开启编辑 | false | false | boolean &
resetable | 开启重置 | false | false | boolean &
removeable | 开启删除 | false | false | boolean &
insertable | 开启插入 | false | false | boolean &
rowActions | 额外的行操作列，可以返回一个 Promise | [] | false | React.ReactElement<IRowActionProps>[] &
extraActions | 额外的表格操作 | [] | false | React.ReactElement<IExtraActionProps>[] &
totalFooter |  增加统计底部 | false | false | boolean &
totalColDef | 统计列项的定义，只对纵向表格有用 | null | false | IColumnDef &
actionColDef | 操作列项的属性，比如控制操作列的 title | null | false | IColumnDef &
onCreateFormChange | 创建表单的变化回调 | null | false | (values: object, tableData: any[], tableFormData: object) => void &
saveLoading | 保存按钮的加载状态 | null | false | boolean &
resetText | 重置按钮的文本 | 重 置 | false | string &
createButton | 替换创建按钮 | null | false | React.RectNode &
createModalContent | 定制创建 Model 的内容 | null | false | React.ReactNode &
tableProps | 表格的额外属性，比如 onCellValueChanged | null | false | TableProps &
createable | 开启创建 | false | false | boolean &
resetButtonProps | 重置按钮属性 | null | false | ButtonProps &
style | 表格样式 | null | false |  CSSProperties &
tableFormControls | 表格表单的字段描述 | null | false | IFormControl[] &
onTableFormChange | 表格表单修改回调 | null | false | (event: ITableFormEvent) => void &
searchText | 搜索按钮文本 | 搜 索 | false | string &
searchButtonProps | 搜索按钮属性 | null | false | ButtonProps &
searchFormData | 搜索表单受控属性 | null | false | object &
dataSource | 表格数据源 | [] | false | any[] &
tableFormData | 表格表单受控属性 | null | false | object &
saveText | 保存按钮文本 | 保 存 | false | string &
createText | 创建按钮文本 | 新 建 | false | string &
createModalProps | 创建 Model 的额外属性 | null | false | ModalProps &
onSwitchCreateModal | 控制切换创建 Model 的延迟 | null | false | (visible: boolean) => void | Promise<any> &
tableFormProps | 表格表单额外属性 | null | false | Form2StateProps &
saveDisabled | 保存按钮禁用状态，优先级低于 saveButtonProps | false | false | boolean &
saveButtonProps | 保存按钮属性 | null | false | ButtonProps &
createFormControls | 创建表单的字段描述 | null | false | IFormControl[] | ((createFormData: {}, tableData: any[]) => IFormControl[]) &
createFormData | 创建表单受控属性 | null | false | object &
onCreate | 保存按钮回调 | null | false | (modalFormData?: object) => void | boolean | Promise<void | boolean | object> &
createFormProps | 创建表单额外属性 | null | false | Form2StateProps &
onSearchFormChange | 搜索表单变化触发回调 | null | false | (event: ITableFormEvent) => void &
searchFormProps | 搜索表单额外属性 | null | false | Form2StateProps &
searchFormControls | 搜索表单的字段描述 | null | false | IFormControl[] &
autoFetch | 组件初始化时候是否自动调用一次 onFetch | true | false | boolean &
onSearch | 点击搜索回调，返回数组会刷新 table | null | false | (
  event: {
    searchFormData: object;
    tableDataSource: any[];
    tableFormData: object;
  }
) => void | any[] | Promise<any[] | void> &
onReset | 点击重置按钮回调 | null | false | (
  event: {
    searchFormData: object;
    tableDataSource: any[];
    tableFormData: object;
  }
) => void | any[] | Promise<void | any[]> &
onFetch | 初次拉取表格的回调，通常和 onSearch 逻辑一致 | null | false | (
  event: {
    searchFormData: object;
    tableDataSource: any[];
    tableFormData: object;
  }
) => void | ITableDataCompose | any[] | Promise<void | ITableDataCompose | any[]> &
onSave | 点击保存按钮回调 | null | false | (
  event: {
    searchFormData: object;
    tableDataSource: any[];
    tableFormData: {};
  }
) => void | boolean | Promise<boolean | void> &
onRemove | 点击每一行删除按钮回调 | null | false | (
  event: {
    rowId: string;
    rowData: any;
    rowIndex: number;
    originEvent: Event;
  }
) => void | boolean | Promise<void | boolean> &
onInsert | 点击每一行插入按钮回调，返回 true 默认插入当前行，可以控制插入成功后的消息打印内容 | null | false | (
  event: {
    rowId: string;
    rowData: any;
    rowIndex: number;
    originEvent: Event;
  }
) =>
  | void
  | object
  | { message: string; rowData: object }
  | Promise<void | object | { message: string; rowData: object }>
  `,
};
