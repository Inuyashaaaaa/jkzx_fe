import BigNumber from 'bignumber.js';
import moment from 'moment';
import { BIG_NUMBER_CONFIG, LEG_TYPE_MAP, OB_DAY_FIELD } from '@/constants/common';
import { getLegByRecord, getMoment } from '@/tools';

export const countAvg = (tableData, data) => {
  if (!tableData.length) return 0;
  const leg = getLegByRecord(data);
  if (leg.type === LEG_TYPE_MAP.ASIAN) {
    return tableData
      .reduce(
        (sum, next) => sum.plus(new BigNumber(next.weight || 0).multipliedBy(next.price || 0)),
        new BigNumber(0),
      )
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();
  }
  return tableData
    .reduce((sum, next) => sum.plus(next.price || 0), new BigNumber(0))
    .div(tableData.length)
    .toNumber();
};

export const filterObDays = tableData =>
  tableData.filter(item => getMoment(item[OB_DAY_FIELD]).valueOf() <= moment().valueOf());
