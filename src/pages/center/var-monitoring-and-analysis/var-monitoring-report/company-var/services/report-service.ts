import { fetch, PickRPCParamsType, request } from '@/utils';
import { PathPrefixCont } from '@/constants';


async function searchPartyRecordsByParams(
  params: PickRPCParamsType<
    Parameters<
      typeof fetch['POST/var-service/api/rpc/method=varSearchPartyRecords']
    >
  >,
) {
  return fetch['POST/var-service/api/rpc/method=varSearchPartyRecords'](params, {
    mock: true,
  });
}

export async function varSearchPartyRecords(params = {}) {
  return request(`/var-service/api/rpc`, {
    method: 'POST',
    data: {
      method: 'varSearchPartyRecords',
      params
    }
  })
}

const ReportServices = {
  searchPartyRecordsByParams,
  varSearchPartyRecords
};

export { ReportServices };
