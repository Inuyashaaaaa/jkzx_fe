import {
  LEG_ANNUALIZED_FIELD,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
} from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/legColDefs/computedColDefs/TradesColDefs';
import { Form2 } from '@/design/components';
import BigNumber from 'bignumber.js';

export const judgeLegTypeExsit = (colDef, data, computedAllLegTypes) => {
  // 纵向表格，删除一行数据时，已删除 colDef 会执行一次 render ？
  if (!data) return false;
  const legType = computedAllLegTypes.find(item => item.type === data[LEG_TYPE_FIELD]);

  if (!legType) return false;
  return !!legType.columnDefs.find(item => item.field === colDef.field);
};

export const handleJudge = (params, computedAllLegTypes) => {
  const { colDef, data } = params;
  return judgeLegTypeExsit(colDef, data, computedAllLegTypes);
};

export const getActualNotionAmountBigNumber = legData => {
  const isAnnualized = legData[LEG_FIELD.IS_ANNUAL];
  if (isAnnualized) {
    if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
      return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
        .multipliedBy(legData[LEG_FIELD.TERM])
        .dividedBy(365);
    }
    if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
      return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
        .multipliedBy(legData[LEG_FIELD.UNDERLYER_MULTIPLIER])
        .multipliedBy(legData[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE])
        .multipliedBy(legData[LEG_FIELD.TERM])
        .dividedBy(365);
    }
  }

  if (!isAnnualized) {
    if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
      return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT]);
    }
    if (legData[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
      return new BigNumber(legData[LEG_FIELD.NOTIONAL_AMOUNT])
        .multipliedBy(legData[LEG_FIELD.UNDERLYER_MULTIPLIER])
        .multipliedBy(legData[TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE]);
    }
  }

  throw new Error('getActualNotionAmountBigNumber not match!');
};
