import { IFormControl } from '@/components/Form/types';
import { IColumnDef } from '@/components/Table/types';
import { refSimilarLegalNameList } from '@/services/reference-data-service';

export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
  },
  {
    headerName: '交易对手银行账号',
    field: 'bankAccount',
    editable: true,
  },
  {
    headerName: '交易对手银行账户名',
    field: 'bankAccountName',
    editable: true,
  },
  {
    headerName: '交易对手开户行',
    field: 'bankName',
    editable: true,
  },
  {
    headerName: '交易对手支付系统行号',
    field: 'paymentSystemCode',
    editable: true,
  },
];

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易对手',
    },
    decorator: {
      rules: [{ required: true }],
    },
    field: 'legalName',
    input: {
      type: 'select',
      showSearch: true,
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
      label: '交易对手账号',
    },
    field: 'bankAccount',
    input: {
      type: 'input',
    },
    decorator: {
      rules: [{ required: true }],
    },
  },
  {
    control: {
      label: '交易对手账户名',
    },
    decorator: {
      rules: [{ required: true }],
    },
    field: 'bankAccountName',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '交易对手开户行',
    },
    decorator: {
      rules: [{ required: true }],
    },
    field: 'bankName',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '交易对手支付系统行号',
    },
    decorator: {
      rules: [{ required: true }],
    },
    field: 'paymentSystemCode',
    input: {
      type: 'input',
    },
  },
];
