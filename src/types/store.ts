import { initialState as RiskControlIndexReportModelInitialState } from '@/pages/center/test-page/models/table';
import { initialState as UserInitialState } from '@/models/user';

type RiskControlIndexReportModel = typeof RiskControlIndexReportModelInitialState;
type UserModel = typeof UserInitialState;

enum ModelNameSpaces {
  RiskControlIndexReportModel = 'RiskControlIndexReport',
  User = 'User',
  Loading = 'loading',
}

type RootStore = {
  [key in ModelNameSpaces.RiskControlIndexReportModel]: RiskControlIndexReportModel;
} &
  {
    [key in ModelNameSpaces.User]: UserModel;
  } &
  {
    [key in ModelNameSpaces.Loading]: any;
  };

export { RootStore, RiskControlIndexReportModel, ModelNameSpaces };
