/* eslint-disable no-param-reassign */
import { ReportServices } from '@/pages/center/test-page/services/report-service';
import { ModelNameSpaces } from '@/typings';
import { PickServiceReturnType } from '@/utils';
import createModel, { PayloadAction } from '@ty-fee-tools/create-dva-model';
import { PaginationConfig } from 'antd/lib/table';
import { SorterResult } from 'antd/lib/table/interface';
import moment from 'moment';

const initialState = {
  // 交易对手表格数据
  traderTableData: [],
  // 搜索表格数据
  searchData: '',
  // 分页数据
  pagination: {
    current: 1,
    pageSize: 15,
  } as PaginationConfig,
  // 表格总数据
  total: null as null | number,
};

type RiskControlIndexReportModel = typeof initialState;

const model = {
  namespace: ModelNameSpaces.RiskControlIndexReportModel,
  state: initialState,
  effects: {
    *fetchTableData(action: PayloadAction<null>, { put, call, select }) {
      const { searchData, pagination } = (yield select(
        ({ [ModelNameSpaces.RiskControlIndexReportModel]: RiskControlIndexReport }) =>
          RiskControlIndexReport,
      )) as RiskControlIndexReportModel;

      const {
        data: {
          error,
          data: { result },
        },
      } = (yield call(ReportServices.searchRiskLimitListByBaseDatePaged, {
        baseDate: searchData,
        page: pagination.current - 1,
        pageSize: pagination.pageSize,
      })) as PickServiceReturnType<typeof ReportServices.searchRiskLimitListByBaseDatePaged>;

      if (error) return;

      const { page, totalCount } = result;

      yield put({
        type: 'setDataWhenTableFetchSuccess',
        payload: {
          list: page,
          total: totalCount,
        },
      });
    },
  },
  reducers: {
    setDataWhenTableFetchSuccess(
      state,
      action: PayloadAction<{
        total: number;
        list: any[];
      }>,
    ) {
      const { list, total } = action.payload;
      state.traderTableData = list.sort(
        (a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf(),
      );
      state.total = total;
    },
    setSearchData(state, action: PayloadAction<string>) {
      state.searchData = action.payload;
    },
    setTableMeta(
      state,
      action: PayloadAction<{
        pagination: PaginationConfig;
        sorter: SorterResult<any>;
      }>,
    ) {
      const { pagination, sorter } = action.payload;
      state.pagination = pagination;
      state.sorter = sorter;
    },
  },
};

const RiskControlIndexReportWithEnhanced = createModel(model);

export { RiskControlIndexReportWithEnhanced, RiskControlIndexReportModel };

export default model;
