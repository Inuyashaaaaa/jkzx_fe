import { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
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
    options: {
      rules: [{ required: true }],
    },
    dataIndex: 'legalName',
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
    dataIndex: 'bankAccount',
    input: {
      type: 'input',
    },
    options: {
      rules: [{ required: true }],
    },
  },
  {
    control: {
      label: '交易对手账户名',
    },
    options: {
      rules: [{ required: true }],
    },
    dataIndex: 'bankAccountName',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '交易对手开户行',
    },
    options: {
      rules: [{ required: true }],
    },
    dataIndex: 'bankName',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '交易对手支付系统行号',
    },
    options: {
      rules: [{ required: true }],
    },
    dataIndex: 'paymentSystemCode',
    input: {
      type: 'input',
    },
  },
];
