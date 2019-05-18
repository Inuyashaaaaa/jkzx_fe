import moment, { isMoment } from 'moment';
import mapTree from './mapTree';
import request from './request';

export { request };
export { mapTree };
export * from './utils';
export * from './extensibleProduce';

export const convertOptions = (maps, zhcn) => {
  return Object.keys(maps).map(key => ({
    label: zhcn[key],
    value: maps[key],
  }));
};

// NOTE: 如果 val 是空，则返回当前时间
export const getMoment = (val, clone = false) => {
  return isMoment(val) ? (clone ? val.clone() : val) : !!val ? moment(val) : moment();
};

export * from './delay';
export * from './eventBus';
export * from './isShallowEqual';
export * from './mockData';
export * from './someDeep';
export * from './uuid';
export * from './utils';
export * from './toggleItem';
export * from './getDiffAttrs';
