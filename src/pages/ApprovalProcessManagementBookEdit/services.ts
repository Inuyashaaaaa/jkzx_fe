import { IFormControl } from '@/components/_Form2';
import moment from 'moment';

export const modalFormControls: (markets) => IFormControl[] = markets => [
  {
    dataIndex: markets.info,
    input: {
      type: markets.input.type,
      ...(markets.input.type === 'date'
        ? {
            range: 'date',
            disabledDate: current => {
              const startValue = markets.input.startDate;
              return current && current <= moment(startValue).endOf('day');
            },
          }
        : {}),
    },
    control: {
      label: markets.name,
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
];
