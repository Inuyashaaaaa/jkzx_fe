import { fetch, PickRPCParamsType } from '@/utils';

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

const ReportServices = {
  searchRiskLimitListByBaseDatePaged,
};

export { ReportServices };
