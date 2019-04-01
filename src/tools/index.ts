import { LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';

export const isAutocallPhoenix = data => {
  return (
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL ||
    data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_UNANNUAL
  );
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
