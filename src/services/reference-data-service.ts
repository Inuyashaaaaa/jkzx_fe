import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function createRefParty(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refPartySave',
      params,
    },
  });
}

export async function clientAccountDel(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientAccountDel',
      params,
    },
  });
}

export async function queryBranchSalesList() {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refPartyBranchSalesList',
      params: {},
    },
  });
}

export async function mgnMarginList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mgnMarginList',
      params,
    },
  });
}

export async function mgnMarginUpdate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mgnMarginUpdate',
      params,
    },
  });
}

export async function mgnMarginsUpdate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mgnMarginsUpdate',
      params,
    },
  });
}

// export async function refPartyList(params = {}) {
//   return request(`${HOST_TEST}reference-data-service/api/rpc`, {
//     method: `POST`,
//     body: {
//       method: 'refPartyList',
//       params,
//     },
//   });
// }

export async function refPartyGetByLegalName(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refPartyGetByLegalName',
      params,
    },
  });
}

export async function refBankAccountSearch(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refBankAccountSearch',
      params,
    },
  });
}

export async function refSimilarLegalNameList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refSimilarLegalNameList',
      params,
    },
  });
}

export async function refMasterAgreementSearch(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refMasterAgreementSearch',
      params,
    },
  });
}

export async function refSimilarAccountNameList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refSimilarAccountNameList',
      params,
    },
  });
}

export async function refSimilarBankAccountList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refSimilarBankAccountList',
      params,
    },
  });
}

export async function refBankAccountSave(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refBankAccountSave',
      params,
    },
  });
}

export async function refSalesGetByLegalName(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refSalesGetByLegalName',
      params,
    },
  });
}

export async function queryList() {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientAccountList',
      params: {},
    },
  });
}

export async function queryOpRecord(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientAccountOpRecordList',
      params,
    },
  });
}

export async function cliAccountListByLegalNames(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliAccountListByLegalNames',
      params,
    },
  });
}

export async function clientSaveAccountOpRecord(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientSaveAccountOpRecord',
      params,
    },
  });
}

export async function cliTradeTaskListByLegalNames(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliTradeTaskListByLegalNames',
      params,
    },
  });
}

export async function cliFundEventListByClientIds(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliFundEventListByClientIds',
      params,
    },
  });
}

export async function clientAccountOpRecordList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientAccountOpRecordList',
      params,
    },
  });
}

export async function cliTasksGenerateByTradeId(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliTasksGenerateByTradeId',
      params,
    },
  });
}

export async function createOpRecord(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientSaveAccountOpRecord',
      params,
    },
  });
}

export async function updateRole(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRoleUpdate',
      params,
    },
  });
}

export async function cliFundEventSave(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliFundEventSave',
      params,
    },
  });
}

export async function clientTradeCashFlow(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientTradeCashFlow',
      params,
    },
  });
}

export async function clientDeposit(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientDeposit',
      params,
    },
  });
}

export async function clientWithdraw(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientWithdraw',
      params,
    },
  });
}

export async function clientChangeCredit(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientChangeCredit',
      params,
    },
  });
}

export async function clientChangeMargin(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientChangeMargin',
      params,
    },
  });
}

export async function cliMmarkTradeTaskProcessed(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliMmarkTradeTaskProcessed',
      params,
    },
  });
}

export async function cliUnProcessedTradeTaskListByTradeId(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'cliUnProcessedTradeTaskListByTradeId',
      params,
    },
  });
}

export async function clientAccountSearch(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientAccountSearch',
      params,
    },
  });
}
