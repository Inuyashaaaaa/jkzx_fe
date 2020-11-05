import { fetch, PickRPCParamsType, request } from '@/utils';
// import { PathPrefixCont } from '@/constants';

async function searchRiskLimitListByBaseDatePaged(
  params: PickRPCParamsType<
    Parameters<
      typeof fetch['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged']
    >
  >,
) {
  return fetch['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged'](params, {
    mock: true,
  });
}


// export async function trdBookList(params = {}) {
//   return request(`${PathPrefixCont}trade-service/api/rpc`, {
//     method: 'POST',
//     data: {
//       method: 'trdBookList',
//       params,
//     }
//   });
// }

const ReportServices = {
  searchRiskLimitListByBaseDatePaged,
  // trdBookList
};

export { ReportServices };
