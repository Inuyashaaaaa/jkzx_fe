import { HOST_TEST } from '@/constants/global';
import { delay } from '@/tools';
import request from '@/tools/request';
import fetch from 'dva/fetch';
import _ from 'lodash';

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
  const getLoginErrorMessage = data => {
    const { expired, locked, message } = data;
    if (expired) {
      return '用户已过期';
    }
    if (locked) {
      return '用户已锁定';
    }

    return message;
  };

  return request(`${HOST_TEST}auth-service/users/login`, {
    method: `POST`,
    body: params,
    passToken: true,
  }).then(result => {
    const { data } = result;

    if (data.error) {
      // 验证码错误
      return {
        error: true,
        data: {
          message: _.get(data, 'error.message'),
          captcha: true,
        },
      };
    } else if (!data.loginStatus) {
      // 登录状态错误
      return {
        error: true,
        data: {
          ...data,
          message: getLoginErrorMessage(data),
        },
      };
    }

    return {
      error: false,
      data,
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
