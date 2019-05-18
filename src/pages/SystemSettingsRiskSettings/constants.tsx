import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/components/_Form2';
import { IColumnDef } from '@/components/_Table2';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';

export const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    dataIndex: 'instrumentIds',
    control: {
      label: '标的物列表',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: async (value: string) => {
        const { data, error } = await mktInstrumentWhitelistSearch({
          instrumentIdPart: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
];

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

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易所',
    field: 'venueCode',
  },
  {
    headerName: '标的',
    field: 'instrumentId',
  },
  {
    headerName: '存续期名义金额上限',
    field: 'notionalLimit',
    editable: true,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
  },
];
