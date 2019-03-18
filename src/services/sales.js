// 销售相关
import { HOST_TEST } from '@/constants/global';
import { request, arr2treeOptions } from '@/lib/utils';
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

  const companysDataOtherIdName = companysData.map(item => {
    return {
      ..._.omit(item, ['uuid']),
      companyUuid: item.uuid,
    };
  });

  companysDataOtherIdName.forEach(item => {
    const findedItem = salersData.find(
      it => it.subsidiary === item.subsidiary && it.branch === item.branch
    );
    if (findedItem) return;

    salersData.push({
      ...item,
      salesName: undefined,
    });
  });

  return {
    error: false,
    data: salersData,
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
