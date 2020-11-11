/* eslint-disable no-param-reassign */
import { ReportServices } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/single-party-counterparty-var/services/report-service';
import { PickServiceReturnType } from '@/utils';
import createModel, { PayloadAction } from '@/../libs/create-dva-model';
import { PaginationConfig } from 'antd/lib/pagination';
import { ModelNameSpaces } from '@/types/index';
import { Moment } from 'moment';
import { TablePaginationConfig } from 'antd/lib/table';

const initialState = {
  // 对手方 VaR 表格数据
  singlePartyCouterpartyVarVaRTableData: [] as any[],
  // 持仓日期
  positionDate: null as null | any,
  // 置信度
  confidence: null as null | number,
  // 展望期 (天)
  outlook: null as null | number,

  // 表格分页数据
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0
  } as PaginationConfig,

};

type RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel = typeof initialState;

const model = createModel({
  namespace: ModelNameSpaces.RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel,
  state: initialState,
  reducers: {
    setDataWhenSinglePartyCouterpartyVarVaRTableFetchSuccess(
      state: RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel,
      action: PayloadAction<{
        list: any[];
        total: number;
      }>,
    ) {
      const { list, total } = action.payload;
      state.singlePartyCouterpartyVarVaRTableData = list.sort(
        (a, b) => b.VaRDivNetCapital - a.VaRDivNetCapital
      );
      state.pagination.total = total;
    },
    setPositionDate(
      state: RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel,
      action: PayloadAction<Moment | null>
    ) {
      state.positionDate = action.payload;
    },
    setConfidence(
      state: RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel,
      action: PayloadAction<number | null>
    ) {
      state.confidence = action.payload
    },
    setOutlook(
      state: RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel,
      action: PayloadAction<number | null>
    ) {
      state.outlook = action.payload
    },
    setSinglePartyCouterpartyVarVaRTableMeta(
      state,
      action: PayloadAction<{
        pagination: TablePaginationConfig;
      }>,
    ) {
      const { pagination} = action.payload;
      state.pagination = pagination;
    },
  },
},
  {
    *fetchSinglePartyCouterpartyVarVaRTableData(action: PayloadAction<undefined>, { put, call, select }) {
      const { positionDate, confidence, outlook, pagination } = (yield select(
        ({ [ModelNameSpaces.RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel]: RiskControlVarMonitoringReport }) => {
          return RiskControlVarMonitoringReport
        })) as RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel;

      const {
        data: {
          error,
          data: { result },
        },
      } = (yield call(ReportServices.searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPagedMockd, {
        positionDate,
        confidence,
        outlook,
        page: (pagination.current || 1) - 1,
        pageSize: pagination.pageSize,
      })) as PickServiceReturnType<typeof ReportServices.searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPagedMockd>
      if (error) return;
      const { page, totalCount } = result;
      yield put({
        type: 'setDataWhenSinglePartyCouterpartyVarVaRTableFetchSuccess',
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
