import { message } from 'antd';
import _ from 'lodash';
import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

const composeMsg = (diagnostics = [], prefix) =>
  diagnostics.forEach(item => {
    const type = String.prototype.toLocaleLowerCase.call(item.type);
    if (type !== 'error') return;
    message[type](`${prefix}:${item.message}`);
  });

export async function getInstrumentRollingVol(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRollingVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '波动率曲线');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getInstrumentVolCone(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentVolCone',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '波动率锥');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getInstrumentVolSurface(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentVolSurface',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getInstrumentRealizedVol(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRealizedVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '历史波动率');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getImpliedVolReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getImpliedVolReport',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getHistoricalAndNeutralVolList(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getHistoricalAndNeutralVolList',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcSummaryReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_summary_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcTradeSummaryReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_trade_summary_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcPositionSummaryReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_position_summary_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcAssetToolReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_asset_tool_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcCusDistReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_cus_dist_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcSubCompanyDistReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_sub_company_dist_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcVarietyDistReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_variety_dist_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcCusTypeReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_cus_type_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcMarketDistReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_market_dist_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcEtCommodityReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_et_commodity_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcEtCusReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_et_cus_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcEtSubCompanyReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_et_sub_company_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcMarketManipulateReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_market_manipulate_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getOtcCompPropagateReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'get_otc_comp_propagate_report',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}
