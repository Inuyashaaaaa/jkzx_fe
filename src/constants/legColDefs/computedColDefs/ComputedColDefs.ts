import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  INPUT_NUMBER_PERCENTAGE_CONFIG,
} from '@/constants/common';
import { IColDef } from '@/lib/components/_Table2/interface';
import _ from 'lodash';

export const COMPUTED_LEG_FIELD_MAP = {
  PRICE_PER: 'PRICE_PER',
  PRICE: 'PRICE',
  STD_DELTA: 'STD_DELTA',
  DELTA: 'DELTA',
  DELTA_CASH: 'DELTA_CASH',
  GAMMA: 'GAMMA',
  GAMMA_CASH: 'GAMMA_CASH',
  VEGA: 'VEGA',
  THETA: 'THETA',
  RHO_R: 'RHO_R',
};

export const COMPUTED_LEG_FIELDS = _.map(COMPUTED_LEG_FIELD_MAP, val => val);

const CELL_STYLE = {
  background: '#08436e',
  color: 'white',
};

export const ComputedColDefs: IColDef[] = [
  {
    editable: false,
    headerName: '价格',
    field: COMPUTED_LEG_FIELD_MAP.PRICE,
    input: {
      ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      formatValue: val => (val !== undefined ? Math.abs(val) : val),
    },
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: '百分比价格',
    field: COMPUTED_LEG_FIELD_MAP.PRICE_PER,
    input: {
      ...INPUT_NUMBER_PERCENTAGE_CONFIG,
      formatValue: val => (val !== undefined ? Math.abs(val) : val),
    },
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'STD DELTA',
    field: COMPUTED_LEG_FIELD_MAP.STD_DELTA,
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'DELTA',
    field: COMPUTED_LEG_FIELD_MAP.DELTA,
    input: INPUT_NUMBER_LOT_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'DELTA_CASH',
    field: COMPUTED_LEG_FIELD_MAP.DELTA_CASH,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'GAMMA',
    field: COMPUTED_LEG_FIELD_MAP.GAMMA,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'GAMMA_CASH',
    field: COMPUTED_LEG_FIELD_MAP.GAMMA_CASH,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'VEGA',
    field: COMPUTED_LEG_FIELD_MAP.VEGA,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'THETA',
    field: COMPUTED_LEG_FIELD_MAP.THETA,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    cellStyle: CELL_STYLE,
  },
  {
    editable: false,
    headerName: 'RHO_R',
    field: COMPUTED_LEG_FIELD_MAP.RHO_R,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    cellStyle: CELL_STYLE,
  },
];
