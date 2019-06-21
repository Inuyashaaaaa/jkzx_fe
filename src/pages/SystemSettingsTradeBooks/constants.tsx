import { IFormControl } from '@/containers/Form/types';

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    field: 'resourceName',
    control: {
      label: '交易簿名称',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
];
