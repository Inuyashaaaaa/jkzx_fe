import { IFormControl } from '@/components/Form/types';
import {
  refSimilarAccountNameList,
  refSimilarBankAccountList,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';

export const searchFormControls: (legalNameList, markets) => IFormControl[] = (
  legalNameList,
  markets
) => {
  return [
    {
      control: {
        label: '交易对手',
      },
      field: 'legalName',
      input: {
        type: 'select',
        showSearch: true,
        placeholder: '请输入内容搜索',
        allowClear: true,
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
        label: '交易账号',
      },
      field: 'bankAccount',
      input: {
        type: 'select',
        showSearch: true,
        allowClear: true,
        placeholder: '请输入内容搜索',
        options: markets.length
          ? markets
          : async (value: string = '') => {
              const { data, error } = await refSimilarBankAccountList({
                similarBankAccount: value,
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
        label: '交易对手账户名',
      },
      field: 'bankAccountName',
      input: {
        type: 'select',
        showSearch: true,
        allowClear: true,
        showArrow: false,
        placeholder: '请输入内容搜索',
        options: async (value: string = '') => {
          const { data, error } = await refSimilarAccountNameList({
            similarAccountName: value,
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
};
