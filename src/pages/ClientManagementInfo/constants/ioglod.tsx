import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  LCM_EVENT_TYPE_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/lib/components/_Table2';

export const MARGIN_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '最大保证金',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '最大保证金',
  },
  {
    control: {
      label: '追保保证金',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '追保保证金',
  },
  {
    control: {
      label: '最低保证金',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '最低保证金',
  },
];

export const CASH_FLOW_FORM_ONTROLS: IFormControl[] = [
  {
    control: {
      label: '现金流',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '现金流',
  },
  {
    control: {
      label: '交易ID',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '交易ID',
  },
  {
    field: '现金流事件',
    control: {
      label: ' 现金流事件',
    },
    input: {
      type: 'select',
      options: [
        {
          label: '交易开始',
          value: '交易开始',
        },
        {
          label: '交易结束',
          value: '交易结束',
        },
        {
          label: '生命周期现金流',
          value: '生命周期现金流',
        },
      ],
    },
  },
];

export const CREDIT_TO_CHANGE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '授信',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '授信',
  },
];

export const IO_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '出入金',
    },
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    field: '出入金',
  },
];

export const IOGLOD_COL_DEFS: IColumnDef[] = [
  {
    headerName: '客户',
    field: 'legalName',
    width: 150,
    // checkboxSelection: true,
    pinned: 'left',
  },
  {
    headerName: '账户编号',
    field: 'accountId',
    width: 150,
  },
  {
    headerName: '交易编号',
    field: 'tradeId',
    width: 150,
  },
  {
    headerName: '操作状态',
    field: 'status',
    width: 150,
    input: {
      formatValue: value => {
        if (value === 'NORMAL') {
          return '正常';
        }
        return '错误';
      },
    },
  },
  {
    headerName: '事件类型',
    field: 'event',
  },
  {
    headerName: '保证金变化',
    field: 'marginChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '现金变化',
    field: 'cashChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '存续期权利金变化',
    field: 'premiumChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '已用授信变化',
    field: 'creditUsedChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '负债变化',
    field: 'debtChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '出入金总额变化',
    field: 'netDepositChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '已实现盈亏变化',
    field: 'realizedPnLChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '授信总额变化',
    field: 'creditChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方授信总额变化',
    field: 'counterPartyCreditChange',
    width: 160,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方剩余授信余额变化',
    field: 'counterPartyCreditBalanceChange',
    width: 160,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方可用资金变化',
    field: 'counterPartyFundChange',
    width: 150,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '我方冻结保证金变化',
    field: 'counterPartyMarginChange',
    width: 160,
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  {
    headerName: '账户信息',
    field: 'information',
    width: 150,
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

export const OUR_CREATE_FORM_CONTROLS: (salesNameList) => IFormControl[] = salesNameList => [
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
      type: 'select',
      options: salesNameList,
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
      label: '金额',
    },
    field: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];

export const TOOUR_CREATE_FORM_CONTROLS: (salesNameList) => IFormControl[] = salesNameList => [
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
      type: 'select',
      options: salesNameList,
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

export const UNCREATE_TABLE_COL_DEFS: IColumnDef[] = [
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
    headerName: '生命周期事件',
    field: 'lcmEventType',
    input: {
      type: 'select',
      options: LCM_EVENT_TYPE_OPTIONS,
    },
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
