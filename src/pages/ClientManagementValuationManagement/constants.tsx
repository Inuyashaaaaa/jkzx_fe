import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import ValuationCellRenderer from './ValuationCellRenderer';

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
    input: {
      type: 'date',
    },
  },
  {
    title: '估值',
    dataIndex: 'price',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    title: '交易邮箱',
    dataIndex: 'tradeEmail',
    input: {
      type: 'email',
    },
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
