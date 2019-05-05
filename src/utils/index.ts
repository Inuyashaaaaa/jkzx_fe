import moment, { isMoment } from 'moment';

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
