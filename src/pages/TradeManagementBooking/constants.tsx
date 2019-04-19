import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
    pinned: 'left',
  },
  {
    headerName: '交易编号',
    field: 'tradeId',
  },
  {
    headerName: '账户编号',
    field: 'accountId',
  },
  {
    headerName: '现金流',
    field: 'cashFlow',
  },
  {
    headerName: '期权费',
    field: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '生命周期事件',
    field: 'lcmEventType',
  },
  {
    headerName: '处理状态',
    field: 'processStatus',
    input: {
      formatValue: value => {
        if (value === 'PROCESSED') {
          return '已处理';
        }
        return '未处理';
      },
    },
  },
];

export const OUR_CREATE_FORM_CONTROLS: (entryMargin, entryPremium, entryCash) => IFormControl[] = (
  entryMargin,
  entryPremium,
  entryCash
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
  if (entryMargin) {
    extra.push(tradeId);
  }
  if (entryPremium) {
    extra.push(premiumlist);
  }
  if (entryCash) {
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
  },
];
