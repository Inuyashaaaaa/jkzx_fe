import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import { IColumnDef } from '@/containers/Table/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import ValuationCellRenderer from './ValuationCellRenderer';
import { formatMoney } from '@/tools';

export const VALUATION_COL_DEFS = (uploading, unUploading) => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    checkboxSelection: true,
  },
  {
    title: 'SAC协议编号',
    dataIndex: 'masterAgreementId',
  },
  {
    title: '估值日',
    dataIndex: 'valuationDate',
  },
  {
    title: '估值',
    dataIndex: 'price',
    align: 'right',
    render: val => formatMoney(val),
  },
  {
    title: '交易邮箱',
    dataIndex: 'tradeEmail',
  },
  {
    title: '操作',
    render: (value, record, index) => {
      return (
        <ValuationCellRenderer params={record} uploading={uploading} unUploading={unUploading} />
      );
    },
  },
];

export const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易对手',
    },
    field: 'legalName',
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
];
