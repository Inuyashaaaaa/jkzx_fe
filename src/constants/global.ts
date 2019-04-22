import _ from 'lodash';

export const ROLE_LOCAL_FIELD = 'tongyu_ROLE_LOCAL_FIELD';

export const TOKEN_LOCAL_FIELD = 'tongyu_TOKEN_LOCAL_FIELD';

export const PERMISSIONS_LOCAL_FIELD = 'tongyu_PERMISSIONS_LOCAL_FIELD';

export const VERTICAL_GUTTER = 12;

export const VERTICAL_GUTTER_LG = 24;

export const COL_GUTTER = 8;

export const COL_GUTTER_LG = 16;

export const TABLE_HEIGHT_LG = 720;

// 测试环境
export const HOST_TEST = process.env.NODE_ENV === 'development' ? '/api/' : '/';

// 生产环境
export const HOST_PRO = process.env.NODE_ENV === 'development' ? '/api/' : '/';

export const SOCKET_MAP = {
  ALL: 'ALL',
  PNL: 'PNL',
  RISK: 'RISK',
  POSITION: 'POSITION',
  VALUATION: 'VALUATION',
};

// 下拉 select 的 全部 选项
export const ALL_OPTIONS_VALUE = 'all';

export const CNY_FORMAT = '¥ 0,0.0000';

export const FORM_EDITABLE_STATUS = {
  // 编辑表单
  EDITING_NO_CONVERT: 'EDITING_NO_CONVERT',
  // 编辑转换表单
  EDITING_CAN_CONVERT: 'EDITING_CAN_CONVERT',
  // 展示表单
  SHOW: 'SHOW',
};

export const TRADESCOLDEFS_LEG_FIELD_MAP = {
  UNDERLYER_PRICE: 'underlyerPrice',
  VOL: 'vol',
  R: 'r',
  Q: 'q',
};

export const TRADESCOL_FIELDS = _.map(TRADESCOLDEFS_LEG_FIELD_MAP, val => val);
