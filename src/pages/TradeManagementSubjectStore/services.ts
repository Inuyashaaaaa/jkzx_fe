import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/lib/components/_Form2';
import { SourceTableState } from '@/lib/components/_SourceTable';
import { mktInstrumentSearch } from '@/services/market-data-service';

export const createFormControls: (event: SourceTableState) => IFormControl[] = event => {
  const multiplier = {
    dataIndex: 'multiplier',
    control: {
      label: '合约乘数',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  const name = {
    dataIndex: 'name',
    control: {
      label: '合约名称',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  const exchange = {
    dataIndex: 'exchange',
    control: {
      label: '交易所',
    },
    input: {
      type: 'select',
      options:
        event.createFormData.assetClass === 'EQUITY'
          ? [
              {
                label: '上交所',
                value: 'SSE',
              },
              {
                label: '深交所',
                value: 'SZSE',
              },
              {
                label: '中金所',
                value: 'CFFEX',
              },
            ]
          : [
              {
                label: '上期所',
                value: 'SHFE',
              },
              {
                label: '大商所',
                value: 'DCE',
              },
              {
                label: '郑商所',
                value: 'CZCE',
              },
              {
                label: '金交所',
                value: 'SGE',
              },
            ],
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  // 期货到期日
  const maturity = {
    dataIndex: 'maturity',
    control: {
      label: '期货到期日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  // 指数名称
  const indexName = {
    dataIndex: 'name',
    control: {
      label: '指数名称',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  function getInstrumenInfo() {
    if (
      event.createFormData.assetClass === 'COMMODITY' &&
      event.createFormData.instrumentType === 'SPOT'
    ) {
      return [multiplier, name, exchange];
    }

    if (
      event.createFormData.assetClass === 'COMMODITY' &&
      event.createFormData.instrumentType === 'FUTURES'
    ) {
      return [multiplier, name, exchange, maturity];
    }

    if (
      event.createFormData.assetClass === 'EQUITY' &&
      event.createFormData.instrumentType === 'STOCK'
    ) {
      return [multiplier, name, exchange];
    }

    if (
      event.createFormData.assetClass === 'EQUITY' &&
      event.createFormData.instrumentType === 'INDEX'
    ) {
      return [indexName, exchange];
    }

    if (
      event.createFormData.assetClass === 'EQUITY' &&
      event.createFormData.instrumentType === 'INDEX_FUTURES'
    ) {
      return [multiplier, name, exchange, maturity];
    }

    return [];
  }

  return ([
    {
      dataIndex: 'instrumentId',
      control: {
        label: '标的物代码',
      },
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      dataIndex: 'assetClass',
      control: {
        label: '资产类别',
      },
      input: {
        type: 'select',
        options: [
          {
            label: '商品',
            value: 'COMMODITY',
          },
          {
            label: '权益',
            value: 'EQUITY',
          },
        ],
      },
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
  ] as IFormControl[])
    .concat(
      event.createFormData.assetClass === 'EQUITY'
        ? [
            {
              dataIndex: 'instrumentType',
              control: {
                label: '合约类型',
              },
              input: {
                type: 'select',
                options: [
                  {
                    label: '股票',
                    value: 'STOCK',
                  },
                  {
                    label: '股指',
                    value: 'INDEX',
                  },
                  {
                    label: '股指期货',
                    value: 'INDEX_FUTURES',
                  },
                ],
              },
              options: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]
        : [
            {
              dataIndex: 'instrumentType',
              control: {
                label: '合约类型',
              },
              input: {
                type: 'select',
                options: [
                  {
                    label: '现货',
                    value: 'SPOT',
                  },
                  {
                    label: '期货',
                    value: 'FUTURES',
                  },
                ],
              },
              options: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]
    )
    .concat(getInstrumenInfo() as any);
};

export const editFormControls: (event: SourceTableState) => IFormControl[] = event => {
  const multiplier = {
    dataIndex: 'multiplier',
    control: {
      label: '合约乘数',
    },
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  const name = {
    dataIndex: 'name',
    control: {
      label: '合约名称',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  const exchange = {
    dataIndex: 'exchange',
    control: {
      label: '交易所',
    },
    input: {
      type: 'select',
      options:
        event.assetClass === 'EQUITY'
          ? [
              {
                label: '上交所',
                value: 'SSE',
              },
              {
                label: '深交所',
                value: 'SZSE',
              },
              {
                label: '中金所',
                value: 'CFFEX',
              },
            ]
          : [
              {
                label: '上期所',
                value: 'SHFE',
              },
              {
                label: '大商所',
                value: 'DCE',
              },
              {
                label: '郑商所',
                value: 'CZCE',
              },
              {
                label: '金交所',
                value: 'SGE',
              },
            ],
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  // 期货到期日
  const maturity = {
    dataIndex: 'maturity',
    control: {
      label: '期货到期日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  // 指数名称
  const indexName = {
    dataIndex: 'name',
    control: {
      label: '指数名称',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  };

  function getInstrumenInfo() {
    if (event.assetClass === 'COMMODITY' && event.instrumentType === 'SPOT') {
      return [multiplier, name, exchange];
    }

    if (event.assetClass === 'COMMODITY' && event.instrumentType === 'FUTURES') {
      return [multiplier, name, exchange, maturity];
    }

    if (event.assetClass === 'EQUITY' && event.instrumentType === 'STOCK') {
      return [multiplier, name, exchange];
    }

    if (event.assetClass === 'EQUITY' && event.instrumentType === 'INDEX') {
      return [indexName, exchange];
    }

    if (event.assetClass === 'EQUITY' && event.instrumentType === 'INDEX_FUTURES') {
      return [multiplier, name, exchange, maturity];
    }

    return [];
  }

  return ([
    {
      dataIndex: 'instrumentId',
      control: {
        label: '标的物代码',
      },
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
      input: {
        disabled: true,
      },
    },
    {
      dataIndex: 'assetClass',
      control: {
        label: '资产类别',
      },
      input: {
        type: 'select',
        disabled: true,
        options: [
          {
            label: '商品',
            value: 'COMMODITY',
          },
          {
            label: '权益',
            value: 'EQUITY',
          },
        ],
      },
      options: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
  ] as IFormControl[])
    .concat(
      event.assetClass === 'EQUITY'
        ? [
            {
              dataIndex: 'instrumentType',
              control: {
                label: '合约类型',
              },
              input: {
                type: 'select',
                options: [
                  {
                    label: '股票',
                    value: 'STOCK',
                  },
                  {
                    label: '股指',
                    value: 'INDEX',
                  },
                  {
                    label: '股指期货',
                    value: 'INDEX_FUTURES',
                  },
                ],
              },
              options: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]
        : [
            {
              dataIndex: 'instrumentType',
              control: {
                label: '合约类型',
              },
              input: {
                type: 'select',
                options: [
                  {
                    label: '现货',
                    value: 'SPOT',
                  },
                  {
                    label: '期货',
                    value: 'FUTURES',
                  },
                ],
              },
              options: {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            },
          ]
    )
    .concat(getInstrumenInfo() as any);
};

export const searchFormControls: (event: SourceTableState) => IFormControl[] = event => {
  return [
    {
      dataIndex: 'assetClass',
      control: {
        label: '资产类别',
      },
      input: {
        type: 'select',
        allowClear: true,
        options: [
          {
            label: '商品',
            value: 'COMMODITY',
          },
          {
            label: '权益',
            value: 'EQUITY',
          },
        ],
        disabled: event.searchFormData.instrumentIds
          ? event.searchFormData.instrumentIds.length
            ? true
            : false
          : false,
      },
    },
    {
      dataIndex: 'instrumentType',
      control: {
        label: '合约类型',
      },
      input: {
        type: 'select',
        allowClear: true,
        options:
          event.searchFormData.assetClass === 'EQUITY'
            ? [
                {
                  label: '股票',
                  value: 'STOCK',
                },
                {
                  label: '股指',
                  value: 'INDEX',
                },
                {
                  label: '股指期货',
                  value: 'INDEX_FUTURES',
                },
              ]
            : [
                {
                  label: '现货',
                  value: 'SPOT',
                },
                {
                  label: '期货',
                  value: 'FUTURES',
                },
              ],
        disabled: event.searchFormData.instrumentIds
          ? event.searchFormData.instrumentIds.length
            ? true
            : false
          : false,
      },
    },
    {
      dataIndex: 'instrumentIds',
      control: {
        label: '标的物列表',
      },
      input: {
        allowClear: true,
        autoClearSearchValue: true,
        type: 'select',
        mode: 'multiple',
        options: async (value: string) => {
          const { data, error } = await mktInstrumentSearch({
            instrumentIdPart: value,
          });
          if (error) return [];
          return data.map(item => ({
            label: item,
            value: item,
          }));
        },
        disabled: event.searchFormData.assetClass || event.searchFormData.instrumentType,
      },
    },
  ];
};
