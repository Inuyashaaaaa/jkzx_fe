import moment, { isMoment } from 'moment';

export const convertOptions = (maps, zhcn) => {
  return Object.keys(maps).map(key => ({
    label: zhcn[key],
    value: maps[key],
  }));
};

export const wrapMoment = (val, clone = true) => {
  return isMoment(val) ? (clone ? val.clone() : val) : moment(val);
};

export const isSameDay = (a, b, format = 'YYYY-MM-DD') => {
  if (a === b) return true;
  if (!(a && b)) return false;
  return wrapMoment(a).format(format) === wrapMoment(b).format(format);
};
