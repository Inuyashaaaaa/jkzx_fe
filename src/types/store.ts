import { initialState as RiskControlIndexReportModelInitialState } from '@/pages/center/test-page/models/table';
import { initialState as RiskControlVarMonitoringReportModelInitialState } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/company-var/models/table'
import { initialState as RiskControlCounterpartyVarMonitoringReportModelInitialState } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/counterparty-var/models/table'
import { initialState as RiskControlSinglePartyCouterpartyVarVarMonitoringReportModelInitialState } from '@/pages/center/var-monitoring-and-analysis/var-monitoring-report/single-party-counterparty-var/models/table'

import { initialState as UserInitialState } from '@/models/user';


type RiskControlIndexReportModel = typeof RiskControlIndexReportModelInitialState;
type RiskControlVarMonitoringReportModel = typeof RiskControlVarMonitoringReportModelInitialState
type RiskControlCounterpartyVarMonitoringReportModel = typeof RiskControlCounterpartyVarMonitoringReportModelInitialState
type RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel = typeof RiskControlSinglePartyCouterpartyVarVarMonitoringReportModelInitialState

type UserModel = typeof UserInitialState;

enum ModelNameSpaces {
  RiskControlIndexReportModel = 'RiskControlIndexReport',
  RiskControlVarMonitoringReportModel = 'RiskControlVarMonitoringReportModel',
  RiskControlCounterpartyVarMonitoringReportModel = 'RiskControlCounterpartyVarMonitoringReportModel',
  RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel = 'RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel',
  User = 'User',
  Loading = 'loading',
}

type RootStore = {
  [key in ModelNameSpaces.RiskControlIndexReportModel]: RiskControlIndexReportModel;
} & {
  [key in ModelNameSpaces.RiskControlVarMonitoringReportModel]: RiskControlVarMonitoringReportModel;
} & {
  [key in ModelNameSpaces.RiskControlCounterpartyVarMonitoringReportModel]: RiskControlCounterpartyVarMonitoringReportModel;
} & {
  [key in ModelNameSpaces.RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel]: RiskControlSinglePartyCouterpartyVarVarMonitoringReportModel;
} & {
  [key in ModelNameSpaces.User]: UserModel;
} & {
  [key in ModelNameSpaces.Loading]: any;
};

export { RootStore, ModelNameSpaces, RiskControlIndexReportModel, RiskControlVarMonitoringReportModel, RiskControlCounterpartyVarMonitoringReportModel };
