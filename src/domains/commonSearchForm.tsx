import {
  ASSET_TYPE_OPTIONS,
  BOOK_NAME_FIELD,
  PRODUCTTYPE_OPTIONS,
  RULES_REQUIRED,
} from '@/constants/common';
import { DatePicker, Select } from '@/design/components';
import { mktInstrumentSearch } from '@/services/market-data-service';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import {
  trdBookListBySimilarBookName,
  trdPortfolioListBySimilarPortfolioName,
} from '@/services/trade-service';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const BookName = {
  title: '交易簿',
  dataIndex: BOOK_NAME_FIELD,
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
            options={async (value: string = '') => {
              const { data, error } = await trdBookListBySimilarBookName({
                similarBookName: value,
              });
              if (error) return [];
              return data
                .sort((a, b) => {
                  return a.localeCompare(b);
                })
                .map(item => ({
                  label: item,
                  value: item,
                }));
            }}
          />
        )}
      </FormItem>
    );
  },
};

export const LegalName = {
  title: '交易对手',
  dataIndex: 'partyName',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
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
          />
        )}
      </FormItem>
    );
  },
};

export const InstrumentId = {
  title: '标的物',
  dataIndex: 'underlyerInstrumentId',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
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
          />
        )}
      </FormItem>
    );
  },
};

export const ProductType = {
  title: '期权类型',
  dataIndex: 'productType',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
            options={PRODUCTTYPE_OPTIONS}
          />
        )}
      </FormItem>
    );
  },
};

export const ReportName = markets => {
  return {
    title: '报告名称',
    dataIndex: 'reportName',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: RULES_REQUIRED,
          })(
            <Select
              style={{ minWidth: 180 }}
              placeholder="请输入内容搜索"
              allowClear={true}
              // showSearch={true}
              fetchOptionsOnSearch={true}
              options={markets}
            />
          )}
        </FormItem>
      );
    },
  };
};

export const ValuationDate = {
  title: '报告日期',
  dataIndex: 'valuationDate',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<DatePicker editing={true} />)}
      </FormItem>
    );
  },
};

export const MasterAgreementId = {
  title: '主协议编码',
  dataIndex: 'masterAgreementId',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
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
          />
        )}
      </FormItem>
    );
  },
};

export const ClientName = {
  title: '交易对手',
  dataIndex: 'client',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
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
          />
        )}
      </FormItem>
    );
  },
};

export const AssetType = {
  title: '标的物类型',
  dataIndex: 'assetType',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            // showSearch={true}
            fetchOptionsOnSearch={true}
            options={ASSET_TYPE_OPTIONS}
          />
        )}
      </FormItem>
    );
  },
};

export const ClientNameFund = {
  title: '交易对手',
  dataIndex: 'clientName',
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear={true}
            showSearch={true}
            fetchOptionsOnSearch={true}
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
          />
        )}
      </FormItem>
    );
  },
};

export const PortfolioName = {
  title: '投资组合名称',
  dataIndex: 'portfolioName',
  render: (value, record, index, { form, editing }) => {
    return (
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
          />
        )}
      </FormItem>
    );
  },
};
