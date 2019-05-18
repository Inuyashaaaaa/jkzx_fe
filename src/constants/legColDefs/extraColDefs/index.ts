import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
} from '@/constants/common';
import { IColDef } from '@/components/Table/types';

export const AlUnwindNotionalAmount: IColDef = {
  headerName: '已平仓名义本金',
  field: LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT,
  editable: true,
  input: record => {
    if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
      return INPUT_NUMBER_CURRENCY_CNY_CONFIG;
    }
    if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
      return INPUT_NUMBER_LOT_CONFIG;
    }
    return INPUT_NUMBER_LOT_CONFIG;
  },
};

export const InitialNotionalAmount: IColDef = {
  headerName: '初始名义本金',
  field: LEG_FIELD.INITIAL_NOTIONAL_AMOUNT,
  editable: true,
  input: record => {
    if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
      return INPUT_NUMBER_CURRENCY_CNY_CONFIG;
    }
    if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT) {
      return INPUT_NUMBER_LOT_CONFIG;
    }
    return INPUT_NUMBER_LOT_CONFIG;
  },
};
