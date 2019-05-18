import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_PERCENTAGE_CONFIG,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { IColDef } from '@/components/Table/types';
import _ from 'lodash';

export const TRADESCOLDEFS_LEG_FIELD_MAP = {
  UNDERLYER_PRICE: 'underlyerPrice',
  VOL: 'vol',
  R: 'r',
  Q: 'q',
};

export const TRADESCOL_FIELDS = _.map(TRADESCOLDEFS_LEG_FIELD_MAP, val => val);

const CELL_STYLE = {
  background: '#0b66a7',
  color: 'white',
};

export const TradesColDefs: IColDef[] = [
  {
    editable: false,
    headerName: '标的物价格',
    field: TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    cellStyle: CELL_STYLE,
    getValue: {
      depends: [LEG_FIELD.INITIAL_SPOT],
      value(record) {
        return record[LEG_FIELD.INITIAL_SPOT];
      },
    },
  },
  {
    headerName: '波动率',
    field: TRADESCOLDEFS_LEG_FIELD_MAP.VOL,
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    cellStyle: CELL_STYLE,
    editable: params => {
      const { colDef, data } = params;
      if (data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.FORWARD_UNANNUAL && colDef.field === 'vol') {
        return false;
      }
      return true;
    },
    exsitable: params => {
      const { colDef, data } = params;
      if (data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.FORWARD_UNANNUAL && colDef.field === 'vol') {
        return false;
      }
      return true;
    },
  },
  {
    editable: true,
    headerName: '无风险利率',
    field: TRADESCOLDEFS_LEG_FIELD_MAP.R,
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: true,
    headerName: '分红/融券',
    field: TRADESCOLDEFS_LEG_FIELD_MAP.Q,
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    cellStyle: CELL_STYLE,
  },
];
