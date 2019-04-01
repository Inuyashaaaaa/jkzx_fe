import { OB_DAY_FIELD } from '@/constants/common';
import { getMoment } from '@/utils';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export const countAvg = tableData => {
  return tableData
    .reduce((sum, next) => {
      return sum.plus(new BigNumber(next.weight || 0).multipliedBy(next.price || 0));
    }, new BigNumber(0))
    .toNumber();
};

export const filterObDays = tableData => {
  return tableData.filter(item => {
    return getMoment(item[OB_DAY_FIELD]).valueOf() <= moment().valueOf();
  });
};
