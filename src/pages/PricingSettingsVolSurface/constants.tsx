import { INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { IFormControl } from '@/containers/_Form2';
import { IColumnDef } from '@/containers/_Table2';
import { getCanUsedTranorsOtionsNotIncludingSelf } from '@/services/common';
import { OptionProps } from 'antd/lib/select';

export const TRADER_VALUE = 'trader';

export const RISK_CONTROLER_VALUE = 'riskControler';

export const GROUP_KEY = 'modelType';

export const MARKET_KEY = 'underlyer';

export const INSTANCE_KEY = 'instance';

export const SEARCH_FORM_CONTROLS: (groups: OptionProps[], formData: any) => IFormControl[] = (
  groups,
  formData
) => [
  {
    control: {
      label: '标的',
      required: true,
    },
    dataIndex: MARKET_KEY,
    input: {
      disabled: true,
      placeholder: '请选择左侧标的物',
      type: 'input',
      subtype: 'show',
      hoverIcon: 'lock',
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
    control: {
      label: '分组',
    },
    dataIndex: GROUP_KEY,
    input: {
      type: 'select',
      options: groups,
      placeholder: '选择标的物后，继续选择分组项',
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
    control: {
      label: '定价环境',
    },
    dataIndex: INSTANCE_KEY,
    input: {
      disabled: !formData[GROUP_KEY],
      type: 'select',
      options: [
        {
          label: '日内',
          value: 'INTRADAY',
        },
        {
          label: '收盘',
          value: 'CLOSE',
        },
      ],
      placeholder: '选择定价环境',
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

export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    editable: true,
    field: 'tenor',
    headerName: '期限',
    input: {
      type: 'select',
      options: getCanUsedTranorsOtionsNotIncludingSelf([]),
    },
  },
  {
    editable: true,
    field: '80% SPOT',
    headerName: '80% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 0.8,
  },
  {
    editable: true,
    field: '90% SPOT',
    headerName: '90% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 0.9,
  },
  {
    editable: true,
    field: '95% SPOT',
    headerName: '95% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 0.95,
  },
  {
    editable: true,
    field: '100% SPOT',
    headerName: '100% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 1,
  },
  {
    editable: true,
    field: '105% SPOT',
    headerName: '105% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 1.05,
  },
  {
    editable: true,
    field: '110% SPOT',
    headerName: '110% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 1.1,
  },
  {
    editable: true,
    field: '120% SPOT',
    headerName: '120% SPOT',
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
    percent: 1.2,
  },
];
