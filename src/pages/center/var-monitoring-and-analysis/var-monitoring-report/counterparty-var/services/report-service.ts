import { fetch, PickRPCParamsType } from '@/utils';
// import { PathPrefixCont } from '@/constants';

import { getMockData } from '../mocks/subsidiary-var-list'

async function searchCounterpartyVaRListByPositionDateConfidenceOutlookPaged(
  params: PickRPCParamsType<
    Parameters<
      typeof fetch['POST/report-service/api/rpc/method=searchCounterpartyVaRListByPositionDateConfidenceOutlookPaged']
    >
  >,
) {
  return fetch['POST/report-service/api/rpc/method=searchCounterpartyVaRListByPositionDateConfidenceOutlookPaged'](params, {
    mock: true,
  });
}

async function searchCounterpartyVaRListByPositionDateConfidenceOutlookPagedMockd () {
  return getMockData()
}

const ReportServices = {
  searchCounterpartyVaRListByPositionDateConfidenceOutlookPaged,
  searchCounterpartyVaRListByPositionDateConfidenceOutlookPagedMockd
};

export { ReportServices };
