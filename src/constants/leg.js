/* eslint-disable camelcase */

// children 字段可以指定分类，不用指定 dataIndex
//  children: [
//   {
//     name: 'Aa',
//     dataIndex: 'd2',
//   },
//   {
//     name: 'Ab',
//     dataIndex: 'd3',
//   },
// ],

const transactionPriceTypes = {
  name: '交易定价 - 额外腿',
  type: '交易定价 - 额外腿',
  columns: [
    {
      name: '波动率(%)',
      dataIndex: 'vol',
      type: 'input',
    },
    {
      name: '无风率利率(%)',
      dataIndex: 'r',
      type: 'input',
    },
    {
      name: '分红/融券利率(%)',
      dataIndex: 'q',
      type: 'input',
    },
    {
      name: '单位DELTA',
      dataIndex: 'unitDelta',
      type: 'input',
    },
    {
      name: '单位AMMA',
      dataIndex: 'unitGamma',
      type: 'input',
    },
    {
      name: '单位VEGA',
      dataIndex: 'unitVega',
      type: 'input',
    },
    {
      name: '单位THETA',
      dataIndex: 'unitTheta',
      type: 'input',
    },
    {
      name: '单位RHO',
      dataIndex: 'unitRho',
      type: 'input',
    },
    {
      name: 'DELTA',
      dataIndex: 'delta',
      type: 'input',
    },
    {
      name: 'DELTA CASH',
      dataIndex: 'deltaCash',
      type: 'input',
    },
    {
      name: 'GAMMA CASH',
      dataIndex: 'gammaCash',
      type: 'input',
    },
    {
      name: 'VEGA',
      dataIndex: 'vega',
      type: 'input',
    },
    {
      name: 'THETA',
      dataIndex: 'theta',
      type: 'input',
    },
    {
      name: 'RHO',
      dataIndex: 'rho',
      type: 'input',
    },
  ],
};

const equityEuroVanillaTypes = {
  name: '欧式 - 非年化',
  type: '欧式 - 非年化',
  columns: [
    {
      name: '类型',
      dataIndex: 'option_type',
      // defaultValue: 'call',
      type: 'select',
      options: [
        {
          name: '看涨',
          value: 'call',
        },
        {
          name: '看跌',
          value: 'put',
        },
      ],
    },
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '行权价(¥)',
      dataIndex: 'strike',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '行权价(%)',
      dataIndex: 'strike_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'strike',
        'initial_spot',
        rowData => {
          const { strike, initial_spot } = rowData;
          if (strike && initial_spot) {
            return ((strike / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },

    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      // co2untValue: [
      //   'notional',
      //   'initial_spot',
      //   'multiplier',
      //   rowData => {
      //     const { notional, initial_spot, multiplier } = rowData;
      //     if (initial_spot && notional && multiplier) {
      //       return (notional / initial_spot / multiplier).toFixed(2);
      //     }
      //     return '';
      //   },
      // ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
  ],
};

const europeanUpDifferenceTypes = {
  name: '欧式看涨价差 - 非年化',
  type: '欧式看涨价差 - 非年化',
  columns: [
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '低价相关',
      children: [
        {
          name: '低行权价(¥)',
          dataIndex: 'strike_low',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '低行权价(%)',
          dataIndex: 'strike_low_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_low',
            'initial_spot',
            rowData => {
              const { strike_low, initial_spot } = rowData;
              if (strike_low && initial_spot) {
                return ((strike_low / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
      ],
    },
    {
      name: '高价相关',
      children: [
        {
          name: '高行权价(¥)',
          dataIndex: 'strike_high',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '高行权价(%)',
          dataIndex: 'strike_high_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_high',
            'initial_spot',
            rowData => {
              const { strike_high, initial_spot } = rowData;
              if (strike_high && initial_spot) {
                return ((strike_high / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },

    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
  ],
};

const europeanDownDifferenceTypes = {
  name: '欧式看跌价差 - 非年化',
  type: '欧式看跌价差 - 非年化',
  columns: [
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '低价相关',
      children: [
        {
          name: '低行权价(¥)',
          dataIndex: 'strike_low',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '低行权价(%)',
          dataIndex: 'strike_low_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_low',
            'initial_spot',
            rowData => {
              const { strike_low, initial_spot } = rowData;
              if (strike_low && initial_spot) {
                return ((strike_low / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
      ],
    },
    {
      name: '高价相关',
      children: [
        {
          name: '高行权价(¥)',
          dataIndex: 'strike_high',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '高行权价(%)',
          dataIndex: 'strike_high_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_high',
            'initial_spot',
            rowData => {
              const { strike_high, initial_spot } = rowData;
              if (strike_high && initial_spot) {
                return ((strike_high / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },

    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
  ],
};

const barriersToKnockOutTypes = {
  name: '障碍敲出 - 非年化',
  type: '障碍敲出 - 非年化',
  columns: [
    {
      name: '类型',
      dataIndex: 'option_type',
      // defaultValue: 'call',
      type: 'select',
      options: [
        {
          name: '看涨',
          value: 'call',
        },
        {
          name: '看跌',
          value: 'put',
        },
      ],
    },
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '行权价(¥)',
      dataIndex: 'strike',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '行权价(%)',
      dataIndex: 'strike_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'strike',
        'initial_spot',
        rowData => {
          const { strike, initial_spot } = rowData;
          if (strike && initial_spot) {
            return ((strike / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '障碍价(¥)',
      dataIndex: 'barrier',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '障碍价(%)',
      dataIndex: 'barrier_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'barrier',
        'initial_spot',
        rowData => {
          const { barrier, initial_spot } = rowData;
          if (barrier && initial_spot) {
            return ((barrier / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '敲出方向',
      dataIndex: 'barrier_direction',
      type: 'select',
      // defaultValue: 'up_and_out',
      options: [
        {
          name: '向上敲出',
          value: 'up_and_out',
        },
        {
          name: '向下敲出',
          value: 'down_and_out',
        },
      ],
    },
    {
      name: '敲出补偿(¥)',
      dataIndex: 'rebate',
      unit: '¥',
      type: 'number',
      precision: 2,
    },
    {
      name: '敲出补偿支付时间',
      dataIndex: 'rebate_type',
      type: 'select',
      // defaultValue: 'pay_at_expiry',
      options: [
        {
          name: '到期支付',
          value: 'pay_at_expiry',
        },
        {
          name: '敲出即付',
          value: 'pay_when_hit',
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      // readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
  ],
};

const doubleSharkTypes = {
  name: '双鲨 - 非年化',
  type: '双鲨 - 非年化',
  columns: [
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '低价相关',
      children: [
        {
          name: '低行权价(¥)',
          dataIndex: 'strike_low',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '低行权价(%)',
          dataIndex: 'strike_low_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_low',
            'initial_spot',
            rowData => {
              const { strike_low, initial_spot } = rowData;
              if (strike_low && initial_spot) {
                return ((strike_low / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
        {
          name: '低障碍价(¥)',
          dataIndex: 'barrier_low',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '低障碍价(%)',
          dataIndex: 'barrier_low_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'barrier_low',
            'initial_spot',
            rowData => {
              const { barrier_low, initial_spot } = rowData;
              if (barrier_low && initial_spot) {
                return ((barrier_low / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
        {
          name: '低敲出补偿(¥)',
          dataIndex: 'rebate_low',
          unit: '¥',
          type: 'number',
          precision: 2,
        },
      ],
    },
    {
      name: '高价相关',
      children: [
        {
          name: '高行权价(¥)',
          dataIndex: 'strike_high',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '高行权价(%)',
          dataIndex: 'strike_high_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'strike_high',
            'initial_spot',
            rowData => {
              const { strike_high, initial_spot } = rowData;
              if (strike_high && initial_spot) {
                return ((strike_high / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
        {
          name: '高障碍价(¥)',
          dataIndex: 'barrier_high',
          unit: '¥',
          type: 'number',
          precision: 2,
          min: 0,
        },
        {
          name: '高障碍价(%)',
          dataIndex: 'barrier_high_percent',
          unit: '%',
          type: 'number',
          precision: 2,
          readonly: true,
          countValue: [
            'barrier_high',
            'initial_spot',
            rowData => {
              const { barrier_high, initial_spot } = rowData;
              if (barrier_high && initial_spot) {
                return ((barrier_high / initial_spot) * 100).toFixed(2);
              }
              return '';
            },
          ],
        },
        {
          name: '高敲出补偿(¥)',
          dataIndex: 'rebate_high',
          unit: '¥',
          type: 'number',
          precision: 2,
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
  ],
};

const yaShiTypes = {
  name: '亚式',
  type: '亚式',
  columns: [
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '低行权价(¥)',
      dataIndex: 'strike_low',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '低行权价(%)',
      dataIndex: 'strike_low_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'strike_low',
        'initial_spot',
        rowData => {
          const { strike_low, initial_spot } = rowData;
          if (strike_low && initial_spot) {
            return ((strike_low / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '观察频率',
      dataIndex: 'frequency',
      options: [
        {
          name: '1D',
          value: '1D',
        },
        {
          name: '1W',
          value: '1W',
        },
        {
          name: '1M',
          value: '1M',
        },
        {
          name: '3M',
          value: '3M',
        },
        {
          name: '6M',
          value: '6M',
        },
        {
          name: '1Y',
          value: '1Y',
        },
      ],
    },
    {
      name: '交易日历',
      dataIndex: 'holidays',
      mode: 'multiple',
      options: [
        {
          name: '1D',
          value: '1D',
        },
        {
          name: '1W',
          value: '1W',
        },
        {
          name: '1M',
          value: '1M',
        },
        {
          name: '3M',
          value: '3M',
        },
        {
          name: '6M',
          value: '6M',
        },
        {
          name: '1Y',
          value: '1Y',
        },
      ],
    },
    {
      name: '观察日',
      dataIndex: 'observation_dates',
      type: 'ToolEditor',
      format: 'YYYY-MM-DD',
      countValue() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
              {
                value: '2018-08-10',
                key: '0',
              },
              {
                value: '2018-08-11',
                key: '2',
              },
            ]);
          }, 3000);
        });
      },
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },

    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(每份期权)',
      dataIndex: 'premium_per_unit',
      unit: '￥',
      type: 'number',
      precision: 2,
    },
  ],
};

const autoAllTypes = {
  name: 'Autocall',
  type: 'Autocall',
  columns: [
    {
      name: '方向',
      dataIndex: 'direction',
      type: 'select',
      // defaultValue: 'buy',
      options: [
        {
          name: '买',
          value: 'buy',
        },
        {
          name: '卖',
          value: 'sell',
        },
      ],
    },
    {
      name: '标的物',
      dataIndex: 'instrument_id',
      type: 'select',
      // defaultValue: '0',
      options: [
        {
          name: '601398.SH',
          value: '0',
        },
        {
          name: '601398.SHSS',
          value: '1',
        },
      ],
    },
    {
      name: '期初价格(¥)',
      dataIndex: 'initial_spot',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '到期日',
      dataIndex: 'expiration_date',
      type: 'date',
      format: 'YYYY-MM-DD',
    },
    {
      name: '到期时间',
      dataIndex: 'expiration_time',
      // defaultValue: '15:00:00',
      type: 'time',
      format: 'HH:mm:ss',
    },
    {
      name: '观察频率',
      dataIndex: 'frequency',
      options: [
        {
          name: '1D',
          value: '1D',
        },
        {
          name: '1W',
          value: '1W',
        },
        {
          name: '1M',
          value: '1M',
        },
        {
          name: '3M',
          value: '3M',
        },
        {
          name: '6M',
          value: '6M',
        },
        {
          name: '1Y',
          value: '1Y',
        },
      ],
    },
    {
      name: '交易日历',
      dataIndex: 'holidays',
      mode: 'multiple',
      type: 'select',
      options: [
        {
          name: '1D',
          value: '1D',
        },
        {
          name: '1W',
          value: '1W',
        },
        {
          name: '1M',
          value: '1M',
        },
        {
          name: '3M',
          value: '3M',
        },
        {
          name: '6M',
          value: '6M',
        },
        {
          name: '1Y',
          value: '1Y',
        },
      ],
    },
    {
      name: '观察日',
      dataIndex: 'observation_dates',
      type: 'ToolEditor',
      format: 'YYYY-MM-DD',
      countValue() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
              {
                value: '2018-08-10',
                key: '0',
              },
              {
                value: '2018-08-11',
                key: '2',
              },
            ]);
          }, 3000);
        });
      },
    },
    {
      name: '敲出收益率(%)',
      dataIndex: 'coupon',
      type: 'number',
      precision: 2,
      unit: '%',
    },
    {
      name: 'Coupon障碍(￥)',
      dataIndex: 'coupon_barrier',
      type: 'number',
      precision: 2,
      unit: '￥',
    },
    {
      name: 'Coupon障碍(%)',
      dataIndex: 'coupon_barrier_percent',
      type: 'number',
      precision: 2,
      unit: '%',
      readonly: true,
      countValue: [
        'coupon_barrier',
        'initial_spot',
        data => {
          const { coupon_barrier, initial_spot } = data;
          if (initial_spot && coupon_barrier) {
            return ((coupon_barrier / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '敲出障碍(￥)',
      dataIndex: 'out_barrier',
      type: 'number',
      precision: 2,
      unit: '￥',
    },
    {
      name: '敲出障碍(%)',
      dataIndex: 'out_barrier_percent',
      type: 'number',
      precision: 2,
      unit: '%',
      readonly: true,
      countValue: [
        'out_barrier',
        'initial_spot',
        data => {
          const { out_barrier, initial_spot } = data;
          if (initial_spot && out_barrier) {
            return ((out_barrier / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '敲入障碍(￥)',
      dataIndex: 'in_barrier',
      type: 'number',
      precision: 2,
      unit: '￥',
    },
    {
      name: '敲入障碍(%)',
      dataIndex: 'in_barrier_percent',
      type: 'number',
      precision: 2,
      unit: '%',
      readonly: true,
      countValue: [
        'in_barrier',
        'initial_spot',
        data => {
          const { in_barrier, initial_spot } = data;
          if (initial_spot && in_barrier) {
            return ((in_barrier / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '行权价(¥)',
      dataIndex: 'strike',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '行权价(%)',
      dataIndex: 'strike_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'strike',
        'initial_spot',
        rowData => {
          const { strike, initial_spot } = rowData;
          if (strike && initial_spot) {
            return ((strike / initial_spot) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: 'Snowball',
      dataIndex: 'snowball',
    },
    {
      name: '期限(交易日)',
      dataIndex: 'num_trade_days',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '合约乘数',
      dataIndex: 'multiplier',
      readonly: true,
      // defaultValue: '5',
    },
    {
      name: '名义本金(¥)',
      dataIndex: 'notional',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },

    {
      name: '期权数量',
      dataIndex: 'num_of_options',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        rowData => {
          const { notional, initial_spot } = rowData;
          if (initial_spot && notional) {
            return (notional / initial_spot).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '标的物数量(手)',
      dataIndex: 'num_of_underlyer_contracts',
      readonly: true,
      countValue: [
        'notional',
        'initial_spot',
        'multiplier',
        rowData => {
          const { notional, initial_spot, multiplier } = rowData;
          if (initial_spot && notional && multiplier) {
            return (notional / initial_spot / multiplier).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(¥)',
      dataIndex: 'premium',
      unit: '¥',
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      name: '期权费(%)',
      dataIndex: 'premium_percent',
      unit: '%',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'notional',
        rowData => {
          const { premium, notional } = rowData;
          if (premium && notional) {
            return ((premium / notional) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
    {
      name: '期权费(每份期权)',
      dataIndex: 'premium_per_unit',
      unit: '￥',
      type: 'number',
      precision: 2,
      readonly: true,
      countValue: [
        'premium',
        'num_of_options',
        data => {
          const { premium, num_of_options } = data;
          if (premium && num_of_options) {
            return ((premium / num_of_options) * 100).toFixed(2);
          }
          return '';
        },
      ],
    },
  ],
};

const unwindTypes = {
  name: '平仓',
  type: '平仓',
  columns: [
    {
      name: '平仓数量',
      dataIndex: '平仓数量',
    },
    {
      name: '平仓金额',
      dataIndex: '平仓金额',
    },
    {
      name: 'close_perminum_unit',
      dataIndex: 'close_perminum_unit',
    },
    {
      name: 'close_perminum_pct',
      dataIndex: 'close_perminum_pct',
    },
    {
      name: 'close_spot_price',
      dataIndex: 'close_spot_price',
    },
    {
      name: 'excise_premium',
      dataIndex: 'excise_premium',
    },
    {
      name: 'excise_underlying_spot',
      dataIndex: 'excise_underlying_spot',
    },
  ],
};

const allLeg = [
  equityEuroVanillaTypes,
  doubleSharkTypes,
  barriersToKnockOutTypes,
  europeanUpDifferenceTypes,
  europeanDownDifferenceTypes,
  yaShiTypes,
  autoAllTypes,
  transactionPriceTypes,
];

export {
  allLeg,
  transactionPriceTypes,
  equityEuroVanillaTypes,
  doubleSharkTypes,
  barriersToKnockOutTypes,
  europeanUpDifferenceTypes,
  europeanDownDifferenceTypes,
  yaShiTypes,
  autoAllTypes,
  unwindTypes,
};
