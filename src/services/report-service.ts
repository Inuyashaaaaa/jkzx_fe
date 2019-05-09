import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function rptIntradayTradeReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayTradeReportPaged',
      params,
    },
  });
}

export async function rptIntradayTradeReportSearchPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayTradeReportSearchPaged',
      params,
    },
  });
}

export async function rptIntradayPortfolioRiskReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayPortfolioRiskReportPaged',
      params,
    },
  });
}

export async function rptIntradayRiskReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayRiskReportPaged',
      params,
    },
  });
}

export async function rptIntradayPnlReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayPnlReportPaged',
      params,
    },
  });
}

export async function rptIntradayTradeExpiringReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayTradeExpiringReportPaged',
      params,
    },
  });
}

export async function reloadAirflowTrigger(id) {
  return request(
    `${location.protocol}//${location.hostname}:8080/admin/airflow/trigger?dag_id=${id}`,
    {
      method: `GET`,
    },
    true
  );
}

export async function rptRiskReportNameList(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptRiskReportNameList',
    },
  });
}

export async function rptReportNameList(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptReportNameList',
      params,
    },
  });
}

export async function rptRiskReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptRiskReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptRiskReportUpdate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptRiskReportUpdate',
      params,
    },
  });
}

export async function rptPnlReportNameList(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlReportNameList',
      params,
    },
  });
}

export async function rptPnlReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptPnlReportUpdate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlReportUpdate',
      params,
    },
  });
}

export async function rptValuationReportList(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptValuationReportList',
      params,
    },
  });
}

export async function emlSendValuationReport(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'emlSendValuationReport',
      params,
    },
  });
}

export async function rptPositionReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPositionReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptPositionReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPositionReportSearchPaged',
      params,
    },
  });
}

export async function rptPnlHstReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlHstReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptIntradayReportNamesList(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayReportNamesList',
      params,
    },
  });
}

export async function rptIntradayReportPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayReportPaged',
      params,
    },
  });
}

export async function rptOtcTradeReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptOtcTradeReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptFinancialOtcFundDetailReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptFinancialOtcFundDetailReportPagedByNameAndDate',
      params,
    },
  });
}

export async function rptFinanicalOtcClientFundReportPagedByNameAndDate(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptFinanicalOtcClientFundReportPagedByNameAndDate',
      params,
    },
  });
}
