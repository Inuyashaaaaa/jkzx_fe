import { fetch, PickRPCParamsType } from '@/utils';
// import { PathPrefixCont } from '@/constants';

import { getMockData } from '../mocks/subsidiary-var-list'

async function searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPaged(
  params: PickRPCParamsType<
    Parameters<
      typeof fetch['POST/report-service/api/rpc/method=searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPaged']
    >
  >,
) {
  return fetch['POST/report-service/api/rpc/method=searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPaged'](params, {
    mock: true,
  });
}

async function searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPagedMockd () {
  return getMockData()
}

const ReportServices = {
  searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPaged,
  searchSinglePartyCouterpartyVarVaRListByPositionDateConfidenceOutlookPagedMockd
};

export { ReportServices };
