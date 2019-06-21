import { IFormControl } from '@/containers/Form/types';
import {
  refSimilarAccountNameList,
  refSimilarBankAccountList,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import Operation from './Operation';

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

export const SEARCH_FORM_CONTROL: (legalNameList, markets) => IFormControl[] = (
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
