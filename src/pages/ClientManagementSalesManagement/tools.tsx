import { IFormControl } from '@/containers/Form/types';
export const ADDRESS_CASCADER = 'ADDRESS_CASCADER';
import { CascaderOptionType } from 'antd/lib/cascader';

export const CREATE_FORM_CONTROLS: (
  branchSalesList: CascaderOptionType[]
) => IFormControl[] = branchSalesList => [
  {
    control: {
      label: '销售姓名',
    },
    field: 'salesName',
    decorator: {
      rules: [
        {
          required: true,
          message: '销售必填',
        },
      ],
    },
  },
  {
    control: {
      label: '分公司/营业部',
    },
    field: 'cascSubBranch',
    input: {
      type: 'cascader',
      options: branchSalesList,
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '分公司/营业部必填',
        },
      ],
    },
  },
];
