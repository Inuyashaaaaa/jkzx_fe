import { LCM_EVENT_TYPE_MAP, LEG_FIELD, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';

export const isAutocallPhoenix = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX
  );
};

export const isAutocallSnow = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL
  );
};

export const isAsian = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN
  );
};

export const isRangeAccruals = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS
  );
};

export const isKnockIn = data => {
  return data[LEG_FIELD.LCM_EVENT_TYPE] === LCM_EVENT_TYPE_MAP.KNOCK_IN;
};

export const getMinRule = (message = '不允许小于0') => {
  return {
    message,
    validator: (rule, value, callback) => {
      if (value < 0) {
        return callback(true);
      }
      return callback();
    },
  };
};

export const getRequiredRule = (message = '必填') => {
  return {
    message,
    required: true,
  };
};
