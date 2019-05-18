import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/components/Form/types';
import { refSimilarLegalNameList } from '@/services/reference-data-service';

export const OUR_CREATE_FORM_CONTROLS: (margin, premium, cash) => IFormControl[] = (
  margin,
  premium,
  cash
) => {
  const tradeId = {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易ID',
    },
    field: 'tradeId',
    input: {
      disabled: true,
    },
  };
  const premiumlist = {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '期权费',
    },
    field: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  };

  const cashFlow = {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '金额',
    },
    field: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  };

  const extra = [];
  if (margin) {
    extra.push(tradeId);
  }
  if (premium) {
    extra.push(premiumlist);
  }
  if (cash) {
    extra.push(cashFlow);
  }

  return ([
    {
      decorator: {
        rules: [
          {
            required: true,
          },
        ],
      },
      control: {
        label: '客户名称',
      },
      field: 'legalName',
      input: {
        disabled: true,
        type: 'select',
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
      decorator: {
        rules: [
          {
            required: true,
          },
        ],
      },
      control: {
        label: '资金类型',
      },
      input: {
        showSearch: true,
        type: 'select',
        options: [
          {
            label: '期权费扣除',
            value: '期权费扣除',
          },
          {
            label: '期权费收入',
            value: '期权费收入',
          },
          {
            label: '平仓金额扣除',
            value: '平仓金额扣除',
          },
          {
            label: '平仓金额收入',
            value: '平仓金额收入',
          },
          {
            label: '结算金额扣除',
            value: '结算金额扣除',
          },
          {
            label: '结算金额收入',
            value: '结算金额收入',
          },
          {
            label: '授信扣除',
            value: '授信扣除',
          },
          {
            label: '授信恢复',
            value: '授信恢复',
          },
          {
            label: '保证金冻结',
            value: '保证金冻结',
          },
          {
            label: '保证金释放',
            value: '保证金释放',
          },
        ],
      },
      field: 'cashType',
    },
  ] as IFormControl[]).concat(extra);
};
export const TOOUR_CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易对手',
    },
    field: 'legalName',
    input: {
      type: 'select',
      showSearch: true,
      disabled: true,
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
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '交易ID',
    },
    field: 'tradeId',
    input: {
      disabled: true,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '可用资金变化',
    },
    field: 'counterPartyFundChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '剩余授信总额变化',
    },
    field: 'counterPartyCreditBalanceChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '授信总额变化',
    },
    field: 'counterPartyCreditChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '冻结保证金变化',
    },
    field: 'counterPartyMarginChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
