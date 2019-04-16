import {
  ITableColDef,
  ITableData,
  ITableTriggerCellFieldsChangeParams,
} from '@/design/components/type';

export interface ILegColDef extends ITableColDef {
  linkage?: boolean;
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
    setLoadings: (colId: string, loading: boolean) => void,
    setData: (newData: ITableData) => void
  ) => ITableData;
}
