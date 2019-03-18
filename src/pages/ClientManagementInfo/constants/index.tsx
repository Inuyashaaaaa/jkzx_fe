import { INPUT_NUMBER_CURRENCY_CNY_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/lib/components/_Table2';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ADDRESS_CASCADER } from '.';
export * from './INSITUTIONS';
export * from './PRODUCTIONS';

export const DOC_FIELDS = [
  'riskSurveyDoc',
  'dueDiligenceDoc',
  'riskPreferenceDoc',
  'masterAgreementDoc',
  'supplementalAgreementDoc',
  'tradeAuthDoc',
  'complianceDoc',
  'riskRevelationDoc',
  'qualificationWarningDoc',
  'creditAgreement',
  'performanceGuaranteeDoc',
];

export const SEARCH_FORM_CONTROLS: (
  branchSalesList: CascaderOptionType[]
) => IFormControl[] = branchSalesList => [
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
    },
  },
  {
    control: {
      label: '分公司/营业部/销售',
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    },
    input: {
      type: 'cascader',
      options: branchSalesList,
    },
    field: ADDRESS_CASCADER,
  },
];

export const TABLE_COLUMN_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
    width: 150,
    pinned: 'left',
    checkboxSelection: true,
  },
  {
    headerName: '账户编号',
    field: 'accountId',
  },
  {
    headerName: '开户销售',
    field: 'salesName',
  },
  {
    headerName: '协议编号',
    field: 'masterAgreementId',
  },
  {
    headerName: '状态',
    field: 'normalStatus',
    input: {
      formatValue: value => {
        if (value) {
          return '正常';
        }
        return '错误';
      },
    },
  },
  {
    headerName: '账户信息',
    field: 'accountInformation',
  },
  {
    headerName: '保证金',
    field: 'margin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '现金余额',
    field: 'cash',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  // {
  //   headerName: '存续期权利金',
  //   field: 'premium',
  //   input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  // },
  {
    headerName: '已用授信额度',
    field: 'creditUsed',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '负债',
    field: 'debt',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '出入金总额',
    field: 'netDeposit',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '已实现盈亏',
    field: 'realizedPnL',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '授信总额',
    field: 'credit',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方授信总额',
    field: 'counterPartyCredit',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方剩余授信余额',
    field: 'counterPartyCreditBalance',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方可用资金',
    field: 'counterPartyFund',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方冻结保证金',
    field: 'counterPartyMargin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '创建时间',
    field: 'createdAt',
    width: 200,
    input: {
      type: 'date',
      range: 'day',
      format: 'YYYY-MM-DD h:mm:ss a',
    },
  },
  {
    headerName: '更新时间',
    field: 'updatedAt',
    width: 200,
    input: {
      type: 'date',
      range: 'day',
      format: 'YYYY-MM-DD h:mm:ss a',
    },
  },
];

// 机构户
export const INSTITUTION = 'INSTITUTION';

// 产品户
export const PRODUCT = 'PRODUCT';
