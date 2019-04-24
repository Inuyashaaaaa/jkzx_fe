import {
  ACCOUNT_DIRECTION_TYPE_OPTIONS,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PAYMENT_DIRECTION_TYPE_OPTIONS,
  PROCESS_STATUS_TYPES_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'clientId',
  },
  {
    headerName: '交易对手银行账号',
    field: 'bankAccount',
  },
  {
    headerName: '序列号',
    field: 'serialNumber',
  },
  {
    headerName: '出入金额 (¥)',
    field: 'paymentAmount',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '方向',
    field: 'paymentDirection',
    input: {
      type: 'select',
      options: PAYMENT_DIRECTION_TYPE_OPTIONS,
    },
  },
  {
    headerName: '账户类型',
    field: 'accountDirection',
    input: {
      type: 'select',
      options: ACCOUNT_DIRECTION_TYPE_OPTIONS,
    },
  },
  {
    headerName: '支付日期',
    field: 'paymentDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
  {
    headerName: '状态',
    field: 'processStatus',
    input: {
      type: 'select',
      options: PROCESS_STATUS_TYPES_OPTIONS,
    },
  },
];

export const CREATE_FORM_CONTROLS: (bankAccountList) => IFormControl[] = bankAccountList => [
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易对手',
    },
    field: 'clientId',
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易对手银行账号',
    },
    input: {
      type: 'select',
      options: bankAccountList,
    },
    field: 'bankAccount',
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金金额',
    },
    field: 'paymentAmount',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金日期',
    },
    field: 'paymentDate',
    input: {
      type: 'date',
      range: 'day',
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '出入金方向',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: PAYMENT_DIRECTION_TYPE_OPTIONS,
    },
    field: 'paymentDirection',
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '账户类型',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: ACCOUNT_DIRECTION_TYPE_OPTIONS,
    },
    field: 'accountDirection',
  },
];

export const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易对手',
    },
    field: 'clientId',
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '主协议编号',
    },
    field: 'masterAgreementId',
    input: {
      allowClear: true,
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refMasterAgreementSearch({
          masterAgreementId: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '银行账号',
    },
    field: 'bankAccount',
  },
  {
    control: {
      label: '支付日期',
    },
    field: 'paymentDate',
    input: {
      type: 'date',
      range: 'range',
    },
  },
  {
    control: {
      label: '出入金状态',
    },
    field: 'processStatus',
    input: {
      type: 'select',
      options: [{ label: '全部', value: 'all' }, ...PROCESS_STATUS_TYPES_OPTIONS],
    },
  },
];
