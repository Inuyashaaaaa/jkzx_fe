import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/containers/_Form2';

export const CREATE_FORM_CONTROLS: (venueCodes) => IFormControl[] = venueCodes => [
  {
    dataIndex: 'venueCode',
    control: {
      label: '交易所',
    },
    input: {
      type: 'select',
      options: venueCodes,
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    dataIndex: 'instrumentId',
    control: {
      label: '标的',
    },
    input: {
      type: 'input',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    dataIndex: 'notionalLimit',
    control: {
      label: '存续期名义金额',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    options: {
      rules: [
        {
          required: true,
          message: '金额上限不能为空',
        },
      ],
    },
  },
];
