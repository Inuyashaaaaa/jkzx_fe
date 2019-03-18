import { IFormControl } from '@/design/components/Form/types';

export const searchFormControls: (markets) => IFormControl[] = markets => [
  {
    field: 'reportName',
    control: {
      label: '名称',
    },
    input: {
      type: 'select',
      options: markets,
    },
  },
  {
    field: 'valuationDate',
    control: {
      label: '日期',
    },
    input: {
      type: 'date',
      range: 'day',
    },
  },
];
