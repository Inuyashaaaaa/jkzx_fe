/* eslint-disable no-param-reassign */
import createModel, { PayloadAction } from '@/../libs/create-dva-model';
import { ReportServices } from '@/pages/center/test-page/services/report-service';
import { ModelNameSpaces, RootStore } from '@/types/index';
import { PickServiceReturnType } from '@/utils';
import { PaginationConfig } from 'antd/lib/pagination';
import moment from 'moment';
import { getRoutes } from '@@/core/routes';

interface MenuItem {
  path: string;
  exact: boolean;
  component: React.ComponentClass;
  routes?: MenuItem[];
}

const initialState = {
  // 登录用户
  userinfo: {
    username: '',
    token: '',
  },
  menus: getRoutes() as MenuItem[],
};

const model = createModel(
  {
    namespace: ModelNameSpaces.User,
    state: initialState,
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
        }>,
      ) {
        const { pagination } = action.payload;
        state.pagination = pagination;
      },
    },
  },
  {
    *fetchTableData(action: PayloadAction<undefined>, { put, call, select, actions }) {
      const { searchData, pagination } = (yield select(
        ({ [ModelNameSpaces.RiskControlIndexReportModel]: RiskControlIndexReport }) =>
          RiskControlIndexReport,
      )) as RootStore[ModelNameSpaces.RiskControlIndexReportModel];

      const {
        data: {
          error,
          data: { result },
        },
      } = (yield call(ReportServices.searchRiskLimitListByBaseDatePaged, {
        baseDate: searchData,
        page: (pagination.current || 1) - 1,
        pageSize: pagination.pageSize,
      })) as PickServiceReturnType<typeof ReportServices.searchRiskLimitListByBaseDatePaged>;

      if (error) return;

      const { page, totalCount } = result;

      yield put(
        actions.setDataWhenTableFetchSuccess({
          list: page,
          total: totalCount,
        }),
      );
    },
  },
);

export { initialState };

export default model;
