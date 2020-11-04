import { RiskControlIndexReportModel } from '@/pages/center/test-page/models/table';

enum ModelNameSpaces {
  RiskControlIndexReportModel = 'RiskControlIndexReport',
  loading = 'loading',
}

type RootStore = {
  [key in ModelNameSpaces.RiskControlIndexReportModel]: RiskControlIndexReportModel;
} &
  {
    [key in ModelNameSpaces.loading]: any;
  };

export { RootStore, RiskControlIndexReportModel, ModelNameSpaces };
