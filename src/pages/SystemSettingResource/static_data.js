const common = [
  {
    value: 'GRANT_ACTION',
    zh: '授权',
  },
];

const ROLE = common.concat([
  {
    value: 'CREATE_ROLE',
    zh: '创建角色',
  },
  {
    value: 'UPDATE_ROLE',
    zh: '更新角色',
  },
  {
    value: 'DELETE_ROLE',
    zh: '删除角色',
  },
]);

const USER = common.concat([
  {
    value: 'CREATE_USER',
    zh: '创建用户',
  },
  {
    value: 'UPDATE_USER',
    zh: '更新用户',
  },
  {
    value: 'READ_USER',
    zh: '读取用户',
  },
  {
    value: 'DELETE_USER',
    zh: '删除用户',
  },
  {
    value: 'LOCK_USER',
    zh: '锁定用户',
  },
  {
    value: 'UNLOCK_USER',
    zh: '解锁用户',
  },
  {
    value: 'EXPIRE_USER',
    zh: '使用户过期',
  },
  {
    value: 'UNEXPIRE_USER',
    zh: '取消用户过期状态',
  },
  {
    value: 'CHANGE_PASSWORD',
    zh: '重置用户密码',
  },
]);

const NAMESPACE = common.concat([
  {
    value: 'CREATE_NAMESPACE',
    zh: '创建资源组',
  },
  {
    value: 'UPDATE_NAMESPACE',
    zh: '更新资源组',
  },
  {
    value: 'DELETE_NAMESPACE',
    zh: '删除资源组',
  },
  {
    value: 'CREATE_DEPARTMENT',
    zh: '创建部门',
  },
  {
    value: 'UPDATE_DEPARTMENT',
    zh: '更新部门',
  },
  {
    value: 'DELETE_DEPARTMENT',
    zh: '删除部门',
  },
  {
    value: 'READ_USER',
    zh: '读取用户',
  },
  {
    value: 'CREATE_BOOK',
    zh: '创建交易簿',
  },
  {
    value: 'CREATE_PORTFOLIO',
    zh: '创建投资组合',
  },
]);

const BOOK = common.concat([
  {
    value: 'UPDATE_BOOK',
    zh: '更新交易簿',
  },
  {
    value: 'READ_BOOK',
    zh: '读取交易簿',
  },
  {
    value: 'DELETE_BOOK',
    zh: '删除交易簿',
  },
  {
    value: 'CREATE_TRADE',
    zh: '创建交易',
  },
  {
    value: 'UPDATE_TRADE',
    zh: '更新交易',
  },
  {
    value: 'READ_TRADE',
    zh: '读取交易',
  },
  {
    value: 'DELETE_TRADE',
    zh: '删除交易',
  },
]);

const DEPARTMENT = common.concat([
  {
    value: 'CREATE_DEPARTMENT',
    zh: '创建部门',
  },
  {
    value: 'UPDATE_DEPARTMENT',
    zh: '更新部门',
  },
  {
    value: 'DELETE_DEPARTMENT',
    zh: '删除部门',
  },
  {
    value: 'READ_USER',
    zh: '读取用户',
  },
]);

const PORTFOLIO = common.concat([
  {
    value: 'UPDATE_PORTFOLIO',
    zh: '更新投资组合',
  },
  {
    value: 'READ_PORTFOLIO',
    zh: '读取投资组合',
  },
  {
    value: 'DELETE_PORTFOLIO',
    zh: '删除投资组合',
  },
]);

const INSTRUMENT = common.concat([
  {
    value: 'CREATE_INSTRUMENT',
    zh: '创建标的物',
  },
  {
    value: 'UPDATE_INSTRUMENT',
    zh: '更新标的物',
  },
  {
    value: 'DELETE_INSTRUMENT',
    zh: '删除标的物',
  },
]);
const TRADE = common.concat([
  {
    value: 'CREATE_TRADE',
    zh: '创建交易',
  },
  {
    value: 'UPDATE_TRADE',
    zh: '更新交易',
  },
  {
    value: 'READ_TRADE',
    zh: '读取交易',
  },
  {
    value: 'DELETE_TRADE',
    zh: '删除交易',
  },
]);

// let PORTFOLIO = [{
//   value: 'CREATE_',
//   zh: '创建'
// },{
//   value: 'UPDATE_',
//   zh: '更新'
// },{
//   value: 'READ_',
//   zh: '读取'
// },{
//   value: 'DELETE_',
//   zh: '删除'
// },];

const MARGIN = [
  {
    value: 'UPDATE_MARGIN',
    zh: '更新保证金',
  },
];

const CLIENT_INFO = [
  {
    value: 'READ_CLIENT',
    zh: '读取客户',
  },
  {
    value: 'CREATE_CLIENT',
    zh: '创建客户',
  },
  {
    value: 'UPDATE_CLIENT',
    zh: '更新客户',
  },
  {
    value: 'DELETE_CLIENT',
    zh: '删除客户',
  },
];

const TEMP = [
  {
    value: 'CREATE_NAMESPACE',
    zh: '创建资源组',
  },
  {
    value: 'CREATE_DEPARTMENT',
    zh: '创建部门',
  },
  {
    value: 'UPDATE_DEPARTMENT',
    zh: '更新部门',
  },
  ...ROLE,
  ...USER,
];
const ROOT = [...common];
TEMP.forEach(t => {
  if (!ROOT.find(r => r.value === t.value)) {
    ROOT.push(t);
  }
});

export const RESOURCE_ENUM = [
  'ROOT',
  'NAMESPACE',
  'ROLE',
  'USER',
  'DEPARTMENT',
  'BOOK',
  'PORTFOLIO',
  'INSTRUMENT',
  'TRADE',
  'MARGIN',
  'CLIENT_INFO',
];

export default {
  ROOT,
  NAMESPACE,
  ROLE,
  USER,
  DEPARTMENT,
  BOOK,
  PORTFOLIO,
  INSTRUMENT,
  TRADE,
  MARGIN,
  CLIENT_INFO,
};
