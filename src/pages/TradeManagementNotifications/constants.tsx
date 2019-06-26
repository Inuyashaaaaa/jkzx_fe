import {
  EVENT_TYPE_OPTIONS,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
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
