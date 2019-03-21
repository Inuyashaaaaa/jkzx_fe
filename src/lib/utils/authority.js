import { ROLE_LOCAL_FIELD, TOKEN_LOCAL_FIELD, PERMISSIONS_LOCAL_FIELD } from '@/constants/global';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authorityString = localStorage.getItem(ROLE_LOCAL_FIELD);
  return authorityString ? authorityString.split(',') : [];
}

export function setAuthority(authority) {
  if (typeof authority === 'undefined') return;
  return localStorage.setItem(ROLE_LOCAL_FIELD, authority);
}

export function getToken() {
  const userInfoStr = localStorage.getItem(TOKEN_LOCAL_FIELD);
  return userInfoStr;
}

export function setToken(token) {
  if (typeof token === 'undefined') return;
  return localStorage.setItem(TOKEN_LOCAL_FIELD, token);
}

export function getPermissions() {
  const userInfoStr = JSON.parse(localStorage.getItem(PERMISSIONS_LOCAL_FIELD));
  return userInfoStr || {};
}

export function setPermissions(permissions) {
  if (typeof permissions === 'undefined') return;
  return localStorage.setItem(
    PERMISSIONS_LOCAL_FIELD,
    JSON.stringify({
      ...permissions,
      customReport: true,
      tradingStatements: true,
      fundsDetailedStatements: true,
      customerFundsSummaryStatements: true,
    })
  );
}
