import { IFormControl } from '@/design/components/Form/types';
import _ from 'lodash';
import { HOLIDAY_FORMAT } from './constants';

export const createFormControls: (data: any[]) => IFormControl[] = tableDataSource => [
  {
    field: 'holiday',
    control: {
      label: '日期',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '日期必须填写',
        },
        {
          validator: (rule, value, callback) => {
            const val = value.format(HOLIDAY_FORMAT);
            if (_.map(tableDataSource, 'holiday').indexOf(val) !== -1) {
              callback(true);
            }
            callback();
          },
          message: '日期不可以重复',
        },
      ],
    },
  },
  {
    field: 'note',
    control: {
      label: '备注',
    },
    input: {
      type: 'input',
    },
  },
];
