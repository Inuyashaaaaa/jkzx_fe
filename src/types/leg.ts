import {
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
  getPosition: (env: string, baseInfo: any) => any;
  getPageData: (env: string) => any;
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoadings: (colId: string, loading: boolean) => void,
    setLoadings: (colId: string, rowId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: ITableData) => void,
    setTableData: (newData: ITableData[]) => void
  ) => void;
}
