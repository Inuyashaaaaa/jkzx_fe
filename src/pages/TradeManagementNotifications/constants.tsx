import {
  EVENT_TYPE_OPTIONS,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import { IColumnDef } from '@/containers/Table/types';
import moment from 'moment';

export const DEFAULT_CALENDAR = 'DEFAULT_CALENDAR';

export const HOLIDAY_FORMAT = 'YYYY-MM-DD';

export const SEARCH_FORM_DEFS: IFormControl[] = [
  {
    field: 'date',
    control: {
      label: '选择日期',
    },
    input: {
      type: 'date',
      range: 'range',
      disabledDate(startValue) {
        return (
          startValue.valueOf() <
          moment()
            .subtract(1, 'days')
            .valueOf()
        );
      },
    },
  },
  {
    field: 'notificationEventType',
    control: {
      label: '事件类型',
    },
    input: {
      type: 'select',
      options: [
        {
          label: '全部',
          value: 'all',
        },
        ...EVENT_TYPE_OPTIONS,
      ],
    },
  },
];

export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    headerName: '事件类型',
    field: 'notificationEventType',
    input: {
      type: 'select',
      options: EVENT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '事件日期',
    field: 'notificationTime',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '交易ID',
    field: 'tradeId',
  },
  {
    headerName: '持仓ID',
    field: 'positionId',
  },
  {
    headerName: '期权类型',
    field: 'productType',
    input: {
      type: 'select',
      options: PRODUCT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '标的物',
    field: 'underlyerInstrumentId',
  },
  {
    headerName: '当前价格 (¥)',
    field: 'underlyerPrice',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '障碍价 (¥)',
    field: 'barriers',
  },
  {
    headerName: '支付类型',
    field: 'paymentType',
  },
  {
    headerName: '支付金额 (¥)',
    field: 'payment',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
