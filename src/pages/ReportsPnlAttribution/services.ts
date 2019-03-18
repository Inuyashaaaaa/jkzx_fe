import { IFormControl } from '@/lib/components/_Form2';

export const searchFormControls: (markets) => IFormControl[] = markets => [
  {
    dataIndex: 'reportName',
    control: {
      label: '名称',
    },
    input: {
      type: 'select',
      options: markets,
    },
  },
  {
    dataIndex: 'valuationDate',
    control: {
      label: '日期',
    },
    input: {
      type: 'date',
      range: 'day',
    },
  },
];
