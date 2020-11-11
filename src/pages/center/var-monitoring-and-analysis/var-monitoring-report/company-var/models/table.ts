/* eslint-disable no-param-reassign */
import { ReportServices } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/company-var/services/report-service';
import { PickServiceReturnType } from '@/utils';
import createModel, { PayloadAction } from '@/../libs/create-dva-model';
import { ModelNameSpaces } from '@/types/index';
import { Moment } from 'moment';
import { TablePaginationConfig } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';

const initialState = {
  // 子公司 VaR 表格数据
  PartyVaRTableData: [] as any[],

  // 持仓日期
  date: null as null | any,
  // 置信度
  confidenceLevel: null as null | number,
  // 展望期 (天)
  varDay: null as null | number,

  // sort
  sorter: {
    order: 'descend',
    field: 'varByNetCapital'
  } as SorterResult<any>,

  // 表格分页数据
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  } as TablePaginationConfig,

};

type RiskControlVarMonitoringReportModel = typeof initialState;

const model = createModel({
  namespace: ModelNameSpaces.RiskControlVarMonitoringReportModel,
  state: initialState,
  reducers: {
    setDataWhenPartyVaRTableFetchSuccess(
      state: RiskControlVarMonitoringReportModel,
      action: PayloadAction<{
        list: any[];
        total: number;
      }>,
    ) {
      const { list, total } = action.payload;
      state.PartyVaRTableData = list
      state.pagination.total = total;
    },
    setDate(
      state: RiskControlVarMonitoringReportModel,
      action: PayloadAction<Moment | null>
    ) {
      state.date = action.payload;
    },
    setConfidenceLevel(
      state: RiskControlVarMonitoringReportModel,
      action: PayloadAction<number | null>
    ) {
      state.confidenceLevel = action.payload
    },
    setVarDay(
      state: RiskControlVarMonitoringReportModel,
      action: PayloadAction<number | null>
    ) {
      state.varDay = action.payload
    },
    setPartyVaRTableMeta(
      state,
      action: PayloadAction<{
        pagination: TablePaginationConfig;
        sorter: SorterResult<any>;
      }>,
    ) {
      const { pagination, sorter } = action.payload;
      state.pagination = pagination;
      state.sorter = sorter
    },
  },
},
  {
    *fetchPartyVaRTableData(action: PayloadAction<undefined>, { put, call, select }) {
      const { date, confidenceLevel, varDay, pagination, sorter } = (yield select(
        ({ [ModelNameSpaces.RiskControlVarMonitoringReportModel]: RiskControlVarMonitoringReport }) => {
          return RiskControlVarMonitoringReport
        })) as RiskControlVarMonitoringReportModel;

      const { order, field } = sorter
      const sortDirection = order === 'ascend' ? 'asc' : 'desc'
      const sortBy = field || 'varByNetCapital'
      const formatDate = date && date.format('YYYY-MM-DD')

      
      const {
        data: {
          error,
          data: { result },
        },
      } = (yield call(ReportServices.varSearchPartyRecords, {
        confidenceLevel,
        varDay,
        date: formatDate,
        pageNumber: (pagination.current || 1) - 1,
        pageSize: pagination.pageSize,
        sortDirection,
        sortBy
      })) as PickServiceReturnType<typeof ReportServices.varSearchPartyRecords>
      if (error) return;
      const { page, totalCount } = result;
      yield put({
        type: 'setDataWhenPartyVaRTableFetchSuccess',
        payload: {
          list: page,
          total: totalCount,
        },
      });
    }
  },
);

export { initialState }
export default model;
