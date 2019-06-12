import { OB_DAY_FIELD, LEG_TYPE_MAP, BIG_NUMBER_CONFIG } from '@/constants/common';
import { getMoment, getLegByRecord } from '@/tools';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export const countAvg = (tableData, data) => {
  const leg = getLegByRecord(data);
  if (leg.type === LEG_TYPE_MAP.ASIAN) {
    return tableData
      .reduce((sum, next) => {
        return sum.plus(new BigNumber(next.weight || 0).multipliedBy(next.price || 0));
      }, new BigNumber(0))
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();
  }
  return tableData
    .reduce((sum, next) => {
      return sum.plus(next.price || 0);
    }, new BigNumber(0))
    .div(tableData.length)
    .toNumber();
};

export const filterObDays = tableData => {
  return tableData.filter(item => {
    return getMoment(item[OB_DAY_FIELD]).valueOf() <= moment().valueOf();
  });
};
