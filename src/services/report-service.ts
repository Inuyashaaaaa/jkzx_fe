import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

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

export async function rptIntradayPortfolioRiskReportSearchPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayPortfolioRiskReportSearchPaged',
      params,
    },
  });
}

export async function rptIntradayRiskReportSearchPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayRiskReportSearchPaged',
      params,
    },
  });
}

export async function rptIntradayPnlReportSearchPaged(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptIntradayPnlReportSearchPaged',
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
    `${HOST_TEST}airflow-service/api/experimental/dags/${id}/dag_runs`,
    {
      method: `POST`,
      body: {},
    },
    true,
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

export async function rptRiskReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptRiskReportSearchPaged',
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

export async function rptPnlReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlReportSearchPaged',
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

export async function rptPnlHstReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptPnlHstReportSearchPaged',
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

export async function rptOtcTradeReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptOtcTradeReportSearchPaged',
      params,
    },
  });
}

export async function rptFinancialOtcFundDetailReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptFinancialOtcFundDetailReportSearchPaged',
      params,
    },
  });
}

export async function rptCustomReportNameList(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptCustomReportNameList',
      params,
    },
  });
}

export async function rptCustomReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptCustomReportSearchPaged',
      params,
    },
  });
}

export async function rptFinanicalOtcClientFundReportSearchPaged(params) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptFinanicalOtcClientFundReportSearchPaged',
      params,
    },
  });
}
