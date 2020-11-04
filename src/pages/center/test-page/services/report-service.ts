import { HOST_TEST } from '@/constants/global';
import { fetch, PickRPCParamsType } from '@/utils';
import request from '@/utils/request';

async function importRiskLimit(
  params: PickRPCParamsType<
    Parameters<typeof fetch['POST/report-service/api/rpc/method=importRiskLimit']>
  >,
) {
  return fetch['POST/report-service/api/rpc/method=importRiskLimit'](params, {
    mock: false,
  });
}

async function searchRiskLimitListPaged(
  params: PickRPCParamsType<
    Parameters<typeof fetch['POST/report-service/api/rpc/method=searchRiskLimitListPaged']>
  >,
) {
  return fetch['POST/report-service/api/rpc/method=searchRiskLimitListPaged'](params, {
    mock: false,
  });
}

async function searchRiskLimitListByBaseDatePaged(
  params: PickRPCParamsType<
    Parameters<
      typeof fetch['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged']
    >
  >,
) {
  return fetch['POST/report-service/api/rpc/method=searchRiskLimitListByBaseDatePaged'](params, {
    mock: false,
  });
}

const ReportServices = {
  importRiskLimit,
  searchRiskLimitListPaged,
  searchRiskLimitListByBaseDatePaged,
};

export { ReportServices };
