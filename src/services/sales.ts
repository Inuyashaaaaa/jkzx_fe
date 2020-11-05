// 销售相关
import { HOST_TEST } from '@/constants/global';
import { request, arr2treeOptions } from '@/tools';
import _ from 'lodash';
import { COMPANY_KEY, BRANCH_KEY, SALES_KEY, SALES_SHOW_KEY } from '@/constants/sales';

export async function querySalers(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesList',
      params,
    },
  });
}

export async function queryCompanys(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryBranchList',
      params,
    },
  });
}

export async function queryCompleteCompanys() {
  const results = await Promise.all([querySalers(), queryCompanys()]);

  const errors = results.filter(item => item.error);
  if (errors.length > 0) {
    return { error: errors };
  }

  const [{ data: salersData }, { data: companysData }] = results;

  const salesData = salersData.map(item => {
    return {
      ...item,
      salesId: item.uuid,
    };
  });

  companysData.forEach(item => {
    const findedItem = salersData.find(
      it => it.subsidiaryId === item.subsidiaryId && it.branchId === item.branchId
    );
    if (findedItem) return;

    salesData.push({
      ...item,
      salesName: '',
      salesId: null,
    });
  });

  return {
    error: false,
    data: salesData,
  };
}

export async function queryCompleteCompanysTrees() {
  const { error, data } = await queryCompleteCompanys();
  if (error) return { error };
  return {
    error,
    data: arr2treeOptions(
      data,
      [COMPANY_KEY, BRANCH_KEY, SALES_KEY],
      [COMPANY_KEY, BRANCH_KEY, SALES_SHOW_KEY]
    ),
  };
}

/**
 * 创建分公司，营业部
 *
 * @export
 * @param {*} params
 * - subsidiaryName
 * - branchName
 * @returns
 */
export function createCompany(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryBranchCreate',
      params,
    },
  }).then(rp => {
    if (rp.error) return rp;
    return {
      ...rp,
      data: {
        ..._.omit(rp.data, ['uuid']),
        companyUuid: rp.data.uuid,
      },
    };
  });
}

/**
 * 创建销售
 *
 * @export
 * @param {*} params
 * - subsidiaryName
 * - branchName
 * - salesName
 * @returns
 */
export function createSaler(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesCreate',
      params,
    },
  });
}

/**
 * 删除分公司，营业部
 *
 * @export
 * @param {*} params
 * - subsidiaryName
 * - branchName
 * @returns
 */
export function removeCompany(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryBranchDelete',
      params,
    },
  });
}

/**
 * 删除销售
 *
 * @export
 * @param {*} params
 * - subsidiaryName
 * - branchName
 * - salesNames[]
 * @returns
 */
export function removeSalers(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesDelete',
      params,
    },
  });
}

// 创建分公司
export function refSubsidiaryCreate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryCreate',
      params,
    },
  });
}

// 更新分公司
export function refSubsidiaryUpdate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryUpdate',
      params,
    },
  });
}

// 删除分公司
export function refSubsidiaryDelete(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSubsidiaryDelete',
      params,
    },
  });
}

// 创建营业部
export function refBranchCreate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refBranchCreate',
      params,
    },
  });
}

// 更新营业部
export function refBranchUpdate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refBranchUpdate',
      params,
    },
  });
}

// 删除营业部
export function refBranchDelete(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refBranchDelete',
      params,
    },
  });
}

// 创建销售
export function refSalesCreate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesCreate',
      params,
    },
  });
}

// 更新销售
export function refSalesUpdate(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesUpdate',
      params,
    },
  });
}

// 删除销售
export function refSalesDelete(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSalesDelete',
      params,
    },
  });
}

// 根据销售人员姓名进行模糊查询，获取销售列表
export function refSimilarSalesNameList(params) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'refSimilarSalesNameList',
      params,
    },
  });
}
