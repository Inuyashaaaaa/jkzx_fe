import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import {
  ASSET_TYPE_OPTIONS,
  BOOK_NAME_FIELD,
  PRODUCTTYPE_OPTIONS,
  RULES_REQUIRED,
} from '@/constants/common';
import { DatePicker, Select } from '@/containers';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import {
  trdBookListBySimilarBookName,
  trdPortfolioListBySimilarPortfolioName,
} from '@/services/trade-service';

export const BookName = {
  title: '交易簿',
  dataIndex: BOOK_NAME_FIELD,
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await trdBookListBySimilarBookName({
              similarBookName: value,
            });
            if (error) return [];
            return data
              .sort((a, b) => a.localeCompare(b))
              .map(item => ({
                label: item,
                value: item,
              }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const LegalName = {
  title: '交易对手',
  dataIndex: 'partyName',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await refSimilarLegalNameList({
              similarLegalName: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const InstrumentId = {
  title: '标的物',
  dataIndex: 'underlyerInstrumentId',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await mktInstrumentSearch({
              instrumentIdPart: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const BaseContract = {
  title: '标的物',
  dataIndex: 'baseContract',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await mktInstrumentSearch({
              instrumentIdPart: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const ProductType = {
  title: '期权类型',
  dataIndex: 'productType',
  render: (value, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          filterOption={(val, option) => _.get(option, 'props.children').indexOf(val) >= 0}
          options={PRODUCTTYPE_OPTIONS}
        />,
      )}
    </FormItem>
  ),
};

export const ReportName = markets => ({
  title: '报告名称',
  dataIndex: 'reportName',
  render: (value, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: RULES_REQUIRED,
      })(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          // showSearch={true}
          fetchOptionsOnSearch
          options={markets}
        />,
      )}
    </FormItem>
  ),
});

export const ValuationDate = {
  title: '报告日期',
  dataIndex: 'valuationDate',
  render: (value, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: RULES_REQUIRED,
      })(<DatePicker editing format="YYYY-MM-DD" />)}
    </FormItem>
  ),
};

export const MasterAgreementId = {
  title: '主协议编码',
  dataIndex: 'masterAgreementId',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await refMasterAgreementSearch({
              masterAgreementId: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const ClientName = {
  title: '交易对手',
  dataIndex: 'client',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await refSimilarLegalNameList({
              similarLegalName: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const AssetType = {
  title: '标的物类型',
  dataIndex: 'assetType',
  render: (value, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          // showSearch={true}
          fetchOptionsOnSearch
          options={ASSET_TYPE_OPTIONS}
        />,
      )}
    </FormItem>
  ),
};

export const ClientNameFund = {
  title: '交易对手',
  dataIndex: 'clientName',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (value: string = '') => {
            const { data, error } = await refSimilarLegalNameList({
              similarLegalName: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

export const PortfolioName = {
  title: '投资组合名称',
  dataIndex: 'portfolioName',
  render: (val, record, index, { form, editing }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          {...{
            editing,
            style: {
              minWidth: 180,
            },
            placeholder: '请输入内容搜索',
            allowClear: true,
            type: 'select',
            showSearch: true,
            fetchOptionsOnSearch: true,
            options: async (value: string) => {
              const { data, error } = await trdPortfolioListBySimilarPortfolioName({
                similarPortfolioName: value,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            },
          }}
        />,
      )}
    </FormItem>
  ),
};
