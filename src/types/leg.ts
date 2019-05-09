import {
  IFormField,
  ITableColDef,
  ITableData,
  ITableTriggerCellFieldsChangeParams,
} from '@/design/components/type';

export interface ILegColDef extends ITableColDef {
  linkage?: boolean;
  exsitable?: (record: any) => boolean;
}

export interface ILeg {
  name: string;
  type: string;
  assetClass: string;
  getColumns: (env: string) => ILegColDef[];
  getDefaultData: (env: string) => ITableData;
  getPosition: (env: string, dataItem: any, baseInfo: any) => any;
  getPageData: (env: string, position: any) => any;
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void
  ) => void;
}
