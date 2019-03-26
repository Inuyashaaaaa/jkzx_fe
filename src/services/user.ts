import { HOST_TEST } from '@/constants/global';
import { delay } from '@/lib/utils';
import request from '@/lib/utils/request';
import fetch from 'dva/fetch';

export const permissions = {
  notifications: false,
  pricing: true,
  pricingEnvironment: false,
  clientManagement: true,
  spotLadder: false,
  pnlAttribution: false,
  roles: true,
  intradayGreeks: true,
  intradayPnl: true,
  bookEdit: true,
  subjectStore: true,
  marketManagement: true,
  bankAccount: true,
  customSalesManage: true,
  userInfo: true,
  users: true,
  booking: true,
  contractManagement: true,
  volSurface: true,
  riskFreeCurve: true,
  dividendCurve: true,
  baseContractManagement: true,
  workflowSettings: true,
  processManagement: true,
  risk: true,
  eodPosition: true,
  eodRiskByUnderlyer: true,
  eodDailyPnlByUnderlyer: true,
  eodHistoricalPnlByUnderlyer: true,
  tradingStatements: true,
  fundsDetailedStatements: true,
  customerFundsSummaryStatements: true,
  calendars: true,
  riskSettings: true,
  permissions: true,
  dashboard: true,
  department: true,
  resources: true,
  tradeBooks: true,
  documentManagement: true,
};

/**
 * 登录
 *
 * @module services.user
 * @export
 * @param {object} params
 * @param {string} params.userName
 * @param {string} params.password
 * @returns
 * {
 *     "jsonrpc": "2.0",
 *     "id": "1",
 *     "result": {
 *         "roles": [
 *             "admin"
 *         ],
 *         "pages": "some pages",
 *         "locked": false,
 *         "expired": false,
 *         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZXMiOlsiYWRtaW4iXSwic3ViIjoiYWRtaW4iLCJleHAiOjE1NTIxOTg1NzE0NjUsImlhdCI6MTU0NDQyMjU3MTQ2NX0.ZaQ4RK-Un-M3iU7lKgtIakIrIDgbiLnKXKfyXgmCIMY"
 *     }
 * }
 */
export async function login(params) {
  return request(`${HOST_TEST}auth-service/users/login`, {
    method: `POST`,
    body: params,
  }).then(result => {
    const { data } = result;
    let error = data && data.error;
    const message = (data && data.message) || '';
    if (message.includes('错误') || message.includes('失败') || data.expired || data.locked) {
      error = new Error(message || '登录失败');
    }
    return {
      ...result,
      data: {
        ...result.data,
      },
      error,
    };
  });
}

export async function logout() {
  return {
    error: false,
    data: {
      token: 'xxxx',
    },
  };
}

export async function queryCaptcha(params) {
  return fetch(`${HOST_TEST}auth-service/users/captcha`, {
    method: `GET`,
    credentials: 'include',
  })
    .then(response => response.blob())
    .then(imageBlob => {
      if (window.webkitURL) {
        return window.webkitURL.createObjectURL(imageBlob);
      } else if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(imageBlob);
      } else {
        return null;
      }
    });
}

export async function createUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserCreate',
      params,
    },
  });
}

export async function updateUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserUpdate',
      params,
    },
  });
}

export async function deleteUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserRevoke',
      params,
    },
  });
}

export async function updateUserRole(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserRoleModify',
      params,
    },
  });
}

export async function authUserList(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserList`,
      params,
    },
  });
}

export async function expireUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserExpire`,
      params,
    },
  });
}

export async function unexpireUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserUnexpire`,
      params,
    },
  });
}

export async function lockUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserLock',
      params,
    },
  });
}
export async function unlockUser(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserUnlock',
      params,
    },
  });
}

export async function queryUserInfo() {
  // return request(`${HOST_TEST}auth-service/api/rpc`, {
  //   method: `POST`,
  //   body: {
  //     method: `authCurrentUserGet`,
  //     params: {},
  //   },
  // });
  return {
    data: {
      userName: localStorage.getItem('login_name') || 'visitor',
    },
  };
}

// 获取某个用户页面权限
export async function queryUserPagesByName(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authPageTreeGetByUsername`,
      params,
    },
  });
}

// 获取用户所有页面权限
export async function queryUserPages() {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authPageTreeGet`,
      params: {},
    },
  });
}
/**
 * 获取数据权限（交易权限）
 *
 * @export
 */
export async function queryDataPermissions() {
  return delay(1000, {
    user1: true,
    user2: true,
    user3: true,
  });
}

export async function saveUserRoles(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserRolesModify`,
      params,
    },
  });
}

export async function saveUserPassword(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserPasswordModifySelf`,
      params,
    },
  });
}

export async function saveUserPasswordByAdmin(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `authUserPasswordChange`,
      params,
    },
  });
}

export async function queryNotices() {
  return delay(1000, [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '你收到了 14 份新周报',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: '你推荐的 曲妮妮 已通过第三轮面试',
      datetime: '2017-08-08',
      type: 'notification',
    },
    {
      id: '000000003',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
      title: '这种模板可以区分多种通知类型',
      datetime: '2017-08-07',
      read: true,
      type: 'notification',
    },
    {
      id: '000000004',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
      title: '左侧图标用于区分不同的类型',
      datetime: '2017-08-07',
      type: 'notification',
    },
    {
      id: '000000005',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: '内容不要超过两行字，超出时自动截断',
      datetime: '2017-08-07',
      type: 'notification',
    },
    {
      id: '000000006',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      title: '曲丽丽 评论了你',
      description: '描述信息描述信息描述信息',
      datetime: '2017-08-07',
      type: 'message',
      clickClose: true,
    },
  ]);
}

// 根据用户名查询用户信息
// function authUserGetByName(name) {
//   return fetchMethod('auth-service/api/rpc', 'POST', 'authUserByNameGet', {username:name});
// }
export async function authUserGetByName(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authUserByNameGet',
      params,
    },
  });
}

export async function updateOwnPassword(params) {
  return request(`${HOST_TEST}auth-service/users/password-change`, {
    method: `POST`,
    body: params,
  });
}
