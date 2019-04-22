import {
  LCM_EVENT_TYPE_MAP,
  LEG_ENV_FIELD,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import _ from 'lodash';

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

export function arr2treeOptions(arr, paths, labelPaths) {
  if (!arr || arr.length === 0) return [];

  if (paths.length !== labelPaths.length) {
    throw new Error('arr2treeOptions: paths.length should be equal with labelPaths.length.');
  }

  const deeps = paths.map((path, index) => {
    return _.unionBy(arr, item => item[paths[index]]).filter(item => !!item[paths[index]]);
  });

  function getTree(deeps, _item?, index = 0) {
    const deep = deeps[index];

    if (!deep) return [];

    return deep
      .filter(item => {
        if (!_item) {
          return true;
        }

        return _.range(index).every(iindex => {
          return item[paths[iindex]] === _item[paths[iindex]];
        });
      })
      .map(item => {
        return {
          data: item,
          label: item[labelPaths[index]],
          value: item[paths[index]],
          children: getTree(deeps, item, index + 1),
        };
      });
  }
  return getTree(deeps);
}

export const getLegByRecord = record => {
  const leg = TOTAL_LEGS.find(item => item.type === record[LEG_TYPE_FIELD]);
  return leg;
};

export const legEnvIsBooking = record => record[LEG_ENV_FIELD] === LEG_ENV.BOOKING;

export const legEnvIsPricing = record => record[LEG_ENV_FIELD] === LEG_ENV.PRICING;

export const getFormEditingMeta = (status: string) => {
  if (status === FORM_EDITABLE_STATUS.EDITING_NO_CONVERT) {
    return {
      editable: false,
      editing: true,
    };
  } else if (status === FORM_EDITABLE_STATUS.EDITING_CAN_CONVERT) {
    return {
      editable: true,
    };
  } else {
    return {
      editable: false,
      editing: false,
    };
  }
};
