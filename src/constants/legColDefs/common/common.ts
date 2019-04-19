import ObserveModalInput from '@/containers/ObserveModalInput';
import { IColDef } from '@/design/components/Table/types';
import {
  mktInstrumentInfo,
  mktInstrumentSearch,
  mktQuotesListPaged,
} from '@/services/market-data-service';
import { getMoment } from '@/utils';
import { ValidationRule } from 'antd/lib/form';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import {
  BIG_NUMBER_CONFIG,
  DOWN_OBSERVATION_OPTIONS,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_OPTIONS,
  FREQUENCY_TYPE_OPTIONS,
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_CURRENCY_USD_CONFIG,
  INPUT_NUMBER_DAYS_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  INPUT_NUMBER_PERCENTAGE_CONFIG,
  KNOCK_DIRECTION_MAP,
  KNOCK_DIRECTION_OPTIONS,
  LEG_ANNUALIZED_FIELD,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OBSERVATION_TYPE_OPTIONS,
  OPTION_TYPE_MAP,
  OPTION_TYPE_OPTIONS,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PREMIUM_TYPE_OPTIONS,
  PREMIUM_TYPE_ZHCN_MAP,
  REBATETYPE_TYPE_OPTIONS,
  REBATETYPE_UNIT_OPTIONS,
  RULES_REQUIRED,
  SPECIFIED_PRICE_MAP,
  SPECIFIED_PRICE_ZHCN_MAP,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
  UNIT_ENUM_MAP2,
  UNIT_ENUM_OPTIONS,
  UNIT_ENUM_OPTIONS2,
  UP_BARRIER_TYPE_MAP,
  UP_BARRIER_TYPE_OPTIONS,
} from '../../common';

export const OptionType: IColDef = {
  title: '类型',
  dataIndex: LEG_FIELD.OPTION_TYPE,
  editable: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return {
        type: 'select',
        defaultOpen: true,
        options: OPTION_TYPE_OPTIONS,
        prompt: '行权价>障碍价为看涨;行权价>障碍价为看跌',
      };
    }
    return {
      type: 'select',
      defaultOpen: true,
      options: OPTION_TYPE_OPTIONS,
    };
  },
  rules: RULES_REQUIRED,
  getValue: params => {
    if (
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return {
        depends: [LEG_FIELD.BARRIER, LEG_FIELD.STRIKE],
        value(record) {
          if (
            _.get(record, [LEG_FIELD.BARRIER, 'value']) !== undefined &&
            _.get(record, [LEG_FIELD.STRIKE, 'value']) !== undefined
          ) {
            if (
              _.get(record, [LEG_FIELD.BARRIER, 'value']) >
              _.get(record, [LEG_FIELD.STRIKE, 'value'])
            ) {
              return OPTION_TYPE_MAP.CALL;
            }
            return OPTION_TYPE_MAP.PUT;
          }
          return undefined;
        },
      };
    }
    return {
      depends: [],
      value(data) {
        return data[LEG_FIELD.OPTION_TYPE];
      },
    };
  },
};

export const NotionalLot: IColDef = {
  title: '手数',
  dataIndex: 'notionalLot',
  editable: true,
  input: INPUT_NUMBER_DIGITAL_CONFIG,
  rules: RULES_REQUIRED,
};

export const PremiumValue: IColDef = {
  title: '期权费',
  dataIndex: 'premiumValue',
  editable: true,
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  rules: RULES_REQUIRED,
};

export const ParticipationRate: IColDef = {
  title: '参与率',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const LowParticipationRate: IColDef = {
  title: '低参与率',
  dataIndex: LEG_FIELD.LOW_PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const HighParticipationRate: IColDef = {
  title: '高参与率',
  dataIndex: LEG_FIELD.HIGH_PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const ParticipationRate1: IColDef = {
  title: '参与率1',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE1,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: ([
    {
      message: '必须大于0',
      validator(rule, value, callback) {
        if (value < 0) {
          return callback(true);
        }
        callback();
      },
    },
  ] as ValidationRule[]).concat(RULES_REQUIRED),
};

export const ParticipationRate2: IColDef = {
  title: '参与率2',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE2,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: ([
    {
      message: '必须大于0',
      validator(rule, value, callback) {
        if (value < 0) {
          return callback(true);
        }
        callback();
      },
    },
  ] as ValidationRule[]).concat(RULES_REQUIRED),
};

export const SettlementDate: IColDef = {
  editable: true,
  title: '结算日期',
  dataIndex: LEG_FIELD.SETTLEMENT_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.EXPIRATION_DATE],
    value: record => {
      return getMoment(_.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value']));
    },
  },
};

export const UnderlyerInstrumentId: IColDef = {
  title: '标的物',
  dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
  editable: true,
  input: record => {
    return {
      placeholder: '请输入内容搜索',
      defaultOpen: true,
      type: 'select',
      showSearch: true,
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
      formatValue: val => val,
    };
  },
  rules: RULES_REQUIRED,
};

export const InitialSpot: IColDef = {
  editable: true,
  title: '期初价格',
  dataIndex: LEG_FIELD.INITIAL_SPOT,
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  getValue: {
    depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
    value: record => {
      return mktQuotesListPaged({
        instrumentIds: [_.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value'])],
      }).then(rsp => {
        if (rsp.error) return undefined;
        return new BigNumber(
          _.chain(rsp)
            .get('data.page[0]')
            .omitBy(_.isNull)
            .get('last', 1)
            .value()
        )
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
      });
    },
  },
  rules: RULES_REQUIRED,
};

export const LowStrike: IColDef = {
  editable: true,
  title: '低行权价',
  dataIndex: LEG_FIELD.LOW_STRIKE,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const HighStrike: IColDef = {
  editable: true,
  title: '高行权价',
  dataIndex: LEG_FIELD.HIGH_STRIKE,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Strike: IColDef = {
  editable: true,
  title: '行权价',
  dataIndex: LEG_FIELD.STRIKE,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.PERCENT) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_PERCENTAGE_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Strike1: IColDef = {
  editable: true,
  title: '行权价1',
  dataIndex: LEG_FIELD.STRIKE1,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.PERCENT) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_PERCENTAGE_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Strike2: IColDef = {
  editable: true,
  title: '行权价2',
  dataIndex: LEG_FIELD.STRIKE2,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.PERCENT) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_PERCENTAGE_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: record => {
    return {
      depends: [LEG_FIELD.STRIKE1],
      value: ([
        {
          message: '必须满足条件(行权价1 < 行权价2)',
          validator(rule, value, callback) {
            if (!(_.get(record, [LEG_FIELD.STRIKE1, 'value']) < value)) {
              return callback(true);
            }
            callback();
          },
        },
      ] as ValidationRule[]).concat(RULES_REQUIRED),
    };
  },
};

export const Strike3: IColDef = {
  editable: true,
  title: '行权价3',
  dataIndex: LEG_FIELD.STRIKE3,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.PERCENT) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_PERCENTAGE_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: record => {
    return {
      value: ([
        {
          message: '必须满足条件(行权价1 < 行权价2 < 行权价3)',
          validator(rule, value, callback) {
            if (
              !(
                _.get(record, [LEG_FIELD.STRIKE1, 'value']) <
                  _.get(record, [LEG_FIELD.STRIKE2, 'value']) &&
                _.get(record, [LEG_FIELD.STRIKE2, 'value']) < value
              )
            ) {
              return callback(true);
            }
            callback();
          },
        },
      ] as ValidationRule[]).concat(RULES_REQUIRED),
      depends: [LEG_FIELD.STRIKE1, LEG_FIELD.STRIKE2],
    };
  },
};

export const Strike4: IColDef = {
  editable: false,
  title: '行权价4',
  dataIndex: LEG_FIELD.STRIKE4,
  input: record => {
    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.STRIKE_TYPE, 'value']) === STRIKE_TYPES_MAP.PERCENT) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_PERCENTAGE_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
  getValue: {
    value(record) {
      const participationRate1 = _.get(record, [LEG_FIELD.PARTICIPATION_RATE1, 'value']);
      const participationRate2 = _.get(record, [LEG_FIELD.PARTICIPATION_RATE2, 'value']);
      const strike1 = _.get(record, [LEG_FIELD.STRIKE1, 'value']);
      const strike2 = _.get(record, [LEG_FIELD.STRIKE2, 'value']);
      const strike3 = _.get(record, [LEG_FIELD.STRIKE3, 'value']);

      if (participationRate1 && participationRate2 && strike1 && strike2 && strike3) {
        return new BigNumber(participationRate1)
          .dividedBy(participationRate2)
          .multipliedBy(new BigNumber(strike2).minus(strike1))
          .plus(strike3)
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
      }
      return undefined;
    },
    depends: [
      LEG_FIELD.PARTICIPATION_RATE1,
      LEG_FIELD.PARTICIPATION_RATE2,
      LEG_FIELD.STRIKE1,
      LEG_FIELD.STRIKE2,
      LEG_FIELD.STRIKE3,
    ],
  },
};

export const ExpirationDate: IColDef = {
  editable: true,
  title: '到期日',
  dataIndex: LEG_FIELD.EXPIRATION_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.TERM, LEG_FIELD.EFFECTIVE_DATE],
    value: record => {
      const effectiveDate = _.get(record, [LEG_FIELD.EFFECTIVE_DATE, 'value']);
      const term = _.get(record, [LEG_FIELD.TERM, 'value']);
      if (_.get(record, [LEG_FIELD.TERM, 'value']) !== undefined && effectiveDate !== undefined) {
        return getMoment(effectiveDate, true).add(term, 'days');
      }
      return _.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value']);
    },
  },
};

export const ExpirationTime: IColDef = {
  editable: true,
  title: '到期时间',
  dataIndex: 'expirationTime',
  // @todo input 增加依赖关系
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL
    ) {
      return {
        type: 'time',
        defaultOpen: true,
        exisable: !(
          _.get(record, [LEG_FIELD.SPECIFIED_PRICE, 'value']) === SPECIFIED_PRICE_MAP.CLOSE ||
          _.get(record, [LEG_FIELD.SPECIFIED_PRICE, 'value']) === SPECIFIED_PRICE_MAP.TWAP
        ),
      };
    }

    return {
      type: 'time',
      defaultOpen: true,
    };
  },
  rules: RULES_REQUIRED,
};

export const NumTradeDays: IColDef = {
  editable: true,
  title: '期限(交易日)',
  dataIndex: 'numTradeDays',
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const UnderlyerMultiplier: IColDef = {
  title: '合约乘数',
  dataIndex: LEG_FIELD.UNDERLYER_MULTIPLIER,
  input: INPUT_NUMBER_DIGITAL_CONFIG,
  getValue: {
    depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
    value: record => {
      return mktInstrumentInfo({
        instrumentId: _.get(record, [LEG_FIELD.UNDERLYER_INSTRUMENT_ID, 'value']),
      }).then(rsp => {
        if (rsp.error || undefined === rsp.data.instrumentInfo.multiplier) return 1;
        return new BigNumber(rsp.data.instrumentInfo.multiplier)
          .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
          .toNumber();
      });
    },
  },
  rules: RULES_REQUIRED,
};

export const Premium: IColDef = {
  editable: record => {
    if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.DIGITAL) {
      return false;
    }
    return true;
  },
  title: '实际期权费',
  dataIndex: LEG_FIELD.PREMIUM,
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        };
      }
      if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.USD) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
        };
      }
      if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.PERCENT) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_PERCENTAGE_CONFIG,
        };
      }
    }

    if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PREMIUM_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PREMIUM_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Direction: IColDef = {
  editable: true,
  title: '买卖方向',
  dataIndex: LEG_FIELD.DIRECTION,
  input: {
    type: 'select',
    defaultOpen: true,
    options: [
      {
        label: '买',
        value: 'BUYER',
      },
      {
        label: '卖',
        value: 'SELLER',
      },
    ],
  },
  rules: RULES_REQUIRED,
};

export const Barrier: IColDef = {
  editable: true,
  title: '障碍价',
  dataIndex: LEG_FIELD.BARRIER,
  input: record => {
    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.USD) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const UpBarrierType: IColDef = {
  editable: true,
  title: '敲出障碍价类型',
  dataIndex: LEG_FIELD.UP_BARRIER_TYPE,
  input: {
    type: 'select',
    options: UP_BARRIER_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const DownBarrierType: IColDef = {
  editable: true,
  title: '敲入障碍价类型',
  dataIndex: LEG_FIELD.DOWN_BARRIER_TYPE,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
    defaultOpen: true,
  },
  rules: RULES_REQUIRED,
};

export const DownBarrierOptionsStrikeType: IColDef = {
  editable: true,
  title: '敲入期权行权价类型',
  dataIndex: LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
    defaultOpen: true,
  },
};

export const DownBarrierOptionsStrike: IColDef = {
  editable: true,
  title: '敲入期权行权价',
  dataIndex: LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE,
  input: record => {
    if (
      _.get(record, [LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE, 'value']) === UNIT_ENUM_MAP2.CNY
    ) {
      return {
        depends: [LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const DownBarrierOptionsType: IColDef = {
  editable: true,
  title: '敲入期权类型',
  dataIndex: LEG_FIELD.DOWN_BARRIER_OPTIONS_TYPE,
  input: {
    type: 'select',
    options: OPTION_TYPE_OPTIONS,
    defaultOpen: true,
  },
};

export const UpBarrier: IColDef = {
  editable: true,
  title: '敲出障碍价',
  dataIndex: LEG_FIELD.UP_BARRIER,
  input: record => {
    if (_.get(record, [LEG_FIELD.UP_BARRIER_TYPE, 'value']) === UP_BARRIER_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.UP_BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    // if (_.get(record, [LEG_FIELD.UP_BARRIER_TYPE, 'value']) === UP_BARRIER_TYPE_MAP.PERCENT) {
    return {
      depends: [LEG_FIELD.UP_BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
    // }
  },
};

export const DownBarrier: IColDef = {
  editable: true,
  title: '敲入障碍价',
  dataIndex: LEG_FIELD.DOWN_BARRIER,
  input: record => {
    if (_.get(record, [LEG_FIELD.DOWN_BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP2.CNY) {
      return {
        depends: [LEG_FIELD.DOWN_BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.DOWN_BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const CouponEarnings: IColDef = {
  editable: true,
  title: '收益/coupon(%)',
  dataIndex: LEG_FIELD.COUPON_PAYMENT,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const Step: IColDef = {
  editable: true,
  title: '逐步调整步长(%)',
  dataIndex: LEG_FIELD.STEP,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const Coupon: IColDef = {
  editable: true,
  title: 'coupon障碍',
  dataIndex: LEG_FIELD.COUPON_BARRIER,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const ExpireNoBarrierPremiumType: IColDef = {
  editable: true,
  title: '到期未敲出收益类型',
  dataIndex: LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE,
  input: {
    type: 'select',
    options: EXPIRE_NO_BARRIER_PREMIUM_TYPE_OPTIONS,
  },
};

export const AutoCallStrikeUnit: IColDef = {
  editable: true,
  exsitable: record => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        _.get(record, [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE, 'value']) ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
        _.get(record, [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE, 'value']) ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT,
    };
  },
  title: '到期未敲出行权价类型',
  dataIndex: LEG_FIELD.AUTO_CALL_STRIKE_UNIT,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
  },
};

export const AutoCallStrike: IColDef = {
  editable: true,
  exsitable: record => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        _.get(record, [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE, 'value']) ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
        _.get(record, [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE, 'value']) ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT,
    };
  },
  title: '到期未敲出行权价格',
  dataIndex: LEG_FIELD.AUTO_CALL_STRIKE,
  input: record => {
    if (_.get(record, [LEG_FIELD.AUTO_CALL_STRIKE_UNIT, 'value']) === UNIT_ENUM_MAP2.CNY) {
      return {
        depends: [LEG_FIELD.AUTO_CALL_STRIKE_UNIT],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    // if (_.get(record, [LEG_FIELD.AUTO_CALL_STRIKE_UNIT, 'value']) === UNIT_ENUM_OPTIONS2.PERCENT) {
    return {
      depends: [LEG_FIELD.AUTO_CALL_STRIKE_UNIT],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
    // }
  },
};

export const ExpireNoBarrierPremium: IColDef = {
  editable: true,
  exsitable: record => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        _.get(record, [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE, 'value']) ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED,
    };
  },
  title: '到期未敲出固定收益',
  dataIndex: LEG_FIELD.EXPIRE_NOBARRIERPREMIUM,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const ExpireNoBarrierObserveDay: IColDef = {
  editable: true,
  title: '敲出/coupon观察日',
  dataIndex: LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY,
  input: record => {
    return {
      type: ObserveModalInput,
      record,
      direction: KNOCK_DIRECTION_MAP.UP,
    };
  },
  rules: RULES_REQUIRED,
};

export const InExpireNoBarrierObserveDay: IColDef = {
  editable: true,
  title: '敲入观察日',
  dataIndex: LEG_FIELD.IN_EXPIRE_NO_BARRIEROBSERVE_DAY,
  input: record => {
    return {
      type: ObserveModalInput,
      record,
      direction: KNOCK_DIRECTION_MAP.DOWN,
    };
  },
  rules: RULES_REQUIRED,
};

export const LowBarrier: IColDef = {
  editable: true,
  title: '低障碍价',
  dataIndex: LEG_FIELD.LOW_BARRIER,
  input: record => {
    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.USD) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const HighBarrier: IColDef = {
  editable: true,
  title: '高障碍价',
  dataIndex: LEG_FIELD.HIGH_BARRIER,
  input: record => {
    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (_.get(record, [LEG_FIELD.BARRIER_TYPE, 'value']) === UNIT_ENUM_MAP.USD) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const ObservationType: IColDef = {
  editable: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  title: '障碍观察类型',
  dataIndex: LEG_FIELD.OBSERVATION_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: OBSERVATION_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const BarrierType: IColDef = {
  editable: true,
  title: '障碍类型',
  dataIndex: LEG_FIELD.BARRIER_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: UNIT_ENUM_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const RebateLow: IColDef = {
  title: '低敲出补偿(¥)',
  editable: true,
  dataIndex: 'rebateLow',
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  rules: RULES_REQUIRED,
};

export const ObservationStep: IColDef = {
  title: '观察频率',
  dataIndex: LEG_FIELD.OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: FREQUENCY_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const UpObservationStep: IColDef = {
  title: '敲出观察频率',
  dataIndex: LEG_FIELD.UP_OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: _.reject(FREQUENCY_TYPE_OPTIONS, item => item.value === '1D'),
  },
  rules: RULES_REQUIRED,
};

export const DownObservationStep: IColDef = {
  title: '敲入观察频率',
  dataIndex: LEG_FIELD.DOWN_OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: DOWN_OBSERVATION_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const AlreadyBarrier: IColDef = {
  title: '已经敲入',
  dataIndex: LEG_FIELD.ALREADY_BARRIER,
  editable: true,
  input: {
    type: 'checkbox',
  },
  rules: RULES_REQUIRED,
};

export const DownBarrierDate: IColDef = {
  title: '敲入日期',
  dataIndex: LEG_FIELD.DOWN_BARRIER_DATE,
  editable: true,
  exsitable: record => {
    return {
      depends: [LEG_FIELD.ALREADY_BARRIER],
      value: !!_.get(record, [LEG_FIELD.ALREADY_BARRIER, 'value']),
    };
  },
  input: {
    type: 'date',
  },
};

export const ObserveStartDay: IColDef = {
  title: '观察起始日',
  dataIndex: LEG_FIELD.OBSERVE_START_DAY,
  editable: true,
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.EFFECTIVE_DATE],
    value: record => {
      if (_.get(record, [LEG_FIELD.EFFECTIVE_DATE, 'value']) !== undefined) {
        return _.get(record, [LEG_FIELD.EFFECTIVE_DATE, 'value']);
      }

      return _.get(record, [LEG_FIELD.OBSERVE_START_DAY, 'value']);
    },
  },
};

export const ObserveEndDay: IColDef = {
  title: '观察终止日',
  dataIndex: LEG_FIELD.OBSERVE_END_DAY,
  editable: true,
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.EXPIRATION_DATE],
    value: record => {
      if (_.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value']) !== undefined) {
        return _.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value']);
      }

      return _.get(record, [LEG_FIELD.OBSERVE_END_DAY, 'value']);
    },
  },
};

export const Holidays: IColDef = {
  title: '交易日历',
  dataIndex: 'holidays',
  editable: true,
  input: {
    mode: 'multiple',
    options: [
      {
        label: '1D',
        value: '1D',
      },
      {
        label: '1W',
        value: '1W',
      },
      {
        label: '1M',
        value: '1M',
      },
      {
        label: '3M',
        value: '3M',
      },
      {
        label: '6M',
        value: '6M',
      },
      {
        label: '1Y',
        value: '1Y',
      },
    ],
  },
  rules: RULES_REQUIRED,
};

export const ObservationDates: IColDef = {
  title: '观察日',
  editable: true,
  dataIndex: LEG_FIELD.OBSERVATION_DATES,
  input: record => ({
    type: ObserveModalInput,
    record,
  }),
  rules: RULES_REQUIRED,
};

export const PositionId: IColDef = {
  title: '持仓编号',
  editable: true,
  dataIndex: 'positionId',
  input: {
    type: 'input',
  },
  rules: RULES_REQUIRED,
};

export const Quantity: IColDef = {
  title: '交易数量',
  editable: true,
  dataIndex: 'quantity',
  input: {
    type: 'number',
  },
  rules: RULES_REQUIRED,
};

export const AssetClassOptions = [
  {
    label: '权益',
    value: 'EQUITY',
  },
  {
    label: '商品',
    value: 'COMMODITY',
  },
  {
    label: '利率',
    value: 'RATES',
  },
  {
    label: '外汇',
    value: 'FX',
  },
  {
    label: '信用',
    value: 'CREDIT',
  },
  {
    label: '其他',
    value: 'OTHER',
  },
];

export const AssetClass: IColDef = {
  title: '标的物类型',
  editable: true,
  dataIndex: 'assetClass',
  input: {
    type: 'select',
    defaultOpen: true,
    options: AssetClassOptions,
  },
  rules: RULES_REQUIRED,
};

export const EffectiveDate: IColDef = {
  title: '起始日',
  editable: true,
  dataIndex: LEG_FIELD.EFFECTIVE_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const PremiumPaymentDate: IColDef = {
  title: '期权费支付日',
  editable: true,
  dataIndex: 'premiumPaymentDate',
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const StrikeType: IColDef = {
  title: '行权价类型',
  editable: true,
  dataIndex: LEG_FIELD.STRIKE_TYPE,
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.EAGLE_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.EAGLE_UNANNUAL
    ) {
      return {
        defaultOpen: true,
        type: 'select',
        options: [
          {
            label: '人民币',
            value: STRIKE_TYPES_MAP.CNY,
          },
          {
            label: '百分比',
            value: STRIKE_TYPES_MAP.PERCENT,
          },
          {
            label: '美元',
            value: STRIKE_TYPES_MAP.USD,
          },
        ],
      };
    }

    return {
      defaultOpen: true,
      type: 'select',
      options: [
        {
          label: '人民币',
          value: STRIKE_TYPES_MAP.CNY,
        },
        {
          label: '百分比',
          value: STRIKE_TYPES_MAP.PERCENT,
        },
      ],
    };
  },
  rules: RULES_REQUIRED,
};

export const SpecifiedPrice: IColDef = {
  title: '结算方式',
  editable: true,
  dataIndex: LEG_FIELD.SPECIFIED_PRICE,
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.AUTOCALL_ANNUAL
    ) {
      return {
        defaultOpen: true,
        type: 'select',
        options: [
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.CLOSE,
            value: SPECIFIED_PRICE_MAP.CLOSE,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.TWAP,
            value: SPECIFIED_PRICE_MAP.TWAP,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.OPEN,
            value: SPECIFIED_PRICE_MAP.OPEN,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.OSP,
            value: SPECIFIED_PRICE_MAP.OSP,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.SPECIFIC_TIME,
            value: SPECIFIED_PRICE_MAP.SPECIFIC_TIME,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.XETRA,
            value: SPECIFIED_PRICE_MAP.XETRA,
          },
          {
            label: SPECIFIED_PRICE_ZHCN_MAP.DERIVATIVES_CLOSE,
            value: SPECIFIED_PRICE_MAP.DERIVATIVES_CLOSE,
          },
        ],
      };
    }
    return {
      defaultOpen: true,
      type: 'select',
      options: [
        {
          label: SPECIFIED_PRICE_ZHCN_MAP.CLOSE,
          value: SPECIFIED_PRICE_MAP.CLOSE,
        },
        {
          label: SPECIFIED_PRICE_ZHCN_MAP.TWAP,
          value: SPECIFIED_PRICE_MAP.TWAP,
        },
      ],
    };
  },
  rules: RULES_REQUIRED,
};

export const Term: IColDef = {
  title: '期限',
  editable: true,
  dataIndex: LEG_FIELD.TERM,
  input: INPUT_NUMBER_DAYS_CONFIG,
  rules: RULES_REQUIRED,
};

export const IsAnnualized: IColDef = {
  title: '是否年化',
  editable: true,
  dataIndex: 'isAnnualized',
  input: {
    type: 'checkbox',
    emptyFormatWhenNullValue: true,
  },
  rules: RULES_REQUIRED,
};

export const DaysInYear: IColDef = {
  title: '年度计息天数',
  editable: true,
  dataIndex: LEG_FIELD.DAYS_IN_YEAR,
  input: {
    type: 'number',
  },
  rules: RULES_REQUIRED,
};

export const NotionalAmount: IColDef = {
  editable: true,
  title: '名义本金',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
  input: record => {
    if (_.get(record, [LEG_FIELD.NOTIONAL_AMOUNT_TYPE, 'value']) === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.NOTIONAL_AMOUNT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }
    return {
      depends: [LEG_FIELD.NOTIONAL_AMOUNT_TYPE],
      value: INPUT_NUMBER_LOT_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const NotionalAmountType: IColDef = {
  editable: record => {
    if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return false;
    }
    return true;
  },
  title: '名义本金类型',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  input: {
    defaultOpen: true,
    type: 'select',
    options: [
      {
        label: '手数',
        value: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      },
      {
        label: '人民币',
        value: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      },
    ],
  },
  rules: RULES_REQUIRED,
  getValue: params => {
    if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return {
        depends: [],
        value(data) {
          return data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE];
        },
      };
    }
    return {
      depends: [LEG_FIELD.PREMIUM_TYPE],
      value(record) {
        if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.PERCENT) {
          return NOTIONAL_AMOUNT_TYPE_MAP.CNY;
        }
        return NOTIONAL_AMOUNT_TYPE_MAP.LOT;
      },
    };
  },
};

export const PremiumType: IColDef = {
  editable: true,
  title: '权利金类型',
  dataIndex: LEG_FIELD.PREMIUM_TYPE,
  input: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD], 'value') === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return {
        defaultOpen: true,
        type: 'select',
        options: PREMIUM_TYPE_OPTIONS,
      };
    }
    return {
      defaultOpen: true,
      type: 'select',
      options: [
        {
          label: PREMIUM_TYPE_ZHCN_MAP.PERCENT,
          value: PREMIUM_TYPE_MAP.PERCENT,
        },
        {
          label: PREMIUM_TYPE_ZHCN_MAP.CNY,
          value: PREMIUM_TYPE_MAP.CNY,
        },
      ],
    };
  },
  rules: RULES_REQUIRED,
};

export const FrontPremium: IColDef = {
  editable: true,
  // 权利金总和
  title: '合约期权费',
  dataIndex: LEG_FIELD.FRONT_PREMIUM,
  input: record => {
    if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PREMIUM_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PREMIUM_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.PREMIUM, LEG_FIELD.MINIMUM_PREMIUM],
    value: record => {
      if (
        _.get(record, [LEG_FIELD.PREMIUM, 'value']) === undefined &&
        _.get(record, [LEG_FIELD.MINIMUM_PREMIUM, 'value'])
      ) {
        return undefined;
      }
      return new BigNumber(_.get(record, [LEG_FIELD.PREMIUM, 'value']) || 0)
        .plus(_.get(record, [LEG_FIELD.MINIMUM_PREMIUM, 'value']) || 0)
        .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
        .toNumber();
    },
  },
};

export const MinimumPremium: IColDef = {
  editable: true,
  title: '保底收益',
  dataIndex: LEG_FIELD.MINIMUM_PREMIUM,
  input: record => {
    if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PREMIUM_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PREMIUM_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const CounterpartyCode: IColDef = {
  editable: true,
  title: '对手方',
  dataIndex: 'counterpartyCode',
  input: {
    ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  rules: RULES_REQUIRED,
};

export const PaymentType: IColDef = {
  editable: true,
  title: '行权支付类型',
  dataIndex: LEG_FIELD.PAYMENT_TYPE,
  input: {
    defaultOpen: true,
    type: 'select',
    options: [
      {
        value: PAYMENT_TYPE_MAP.PERCENT,
        label: '百分比',
      },
      {
        value: PAYMENT_TYPE_MAP.CNY,
        label: '人民币',
      },
    ],
  },
  rules: RULES_REQUIRED,
};

export const Payment: IColDef = {
  editable: true,
  title: '行权收益',
  dataIndex: LEG_FIELD.PAYMENT,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Payment1: IColDef = {
  editable: true,
  title: '行权收益1',
  dataIndex: LEG_FIELD.PAYMENT1,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const Payment2: IColDef = {
  editable: true,
  title: '行权收益2',
  dataIndex: LEG_FIELD.PAYMENT2,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: record => {
    return _.get(record, [LEG_FIELD.OPTION_TYPE, 'value']) === 'CALL'
      ? {
          depends: [LEG_FIELD.PAYMENT1],
          value: ([
            {
              message: '必须满足条件(行权收益1<行权收益2)',
              validator(rule, value, callback) {
                if (!(_.get(record, [LEG_FIELD.PAYMENT1, 'value']) < value)) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED),
        }
      : {
          depends: [LEG_FIELD.PAYMENT1],
          value: ([
            {
              message: '必须满足条件(行权收益1>行权收益2)',
              validator(rule, value, callback) {
                if (!(_.get(record, [LEG_FIELD.PAYMENT1, 'value']) > value)) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED),
        };
  },
};

export const Payment3: IColDef = {
  editable: true,
  title: '行权收益3',
  dataIndex: LEG_FIELD.PAYMENT3,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: record => {
    return _.get(record, [LEG_FIELD.OPTION_TYPE, 'value']) === 'CALL'
      ? {
          depends: [LEG_FIELD.PAYMENT1, LEG_FIELD.PAYMENT2],
          value: ([
            {
              message: '必须满足条件(行权收益1<行权收益2<行权收益3)',
              validator(rule, value, callback) {
                if (
                  !(
                    _.get(record, [LEG_FIELD.PAYMENT1, 'value']) <
                      _.get(record, [LEG_FIELD.PAYMENT2, 'value']) &&
                    _.get(record, [LEG_FIELD.PAYMENT2, 'value']) < value
                  )
                ) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED),
        }
      : {
          depends: [LEG_FIELD.PAYMENT1, LEG_FIELD.PAYMENT2],
          value: ([
            {
              message: '必须满足条件(行权收益1>行权收益2>行权收益3)',
              validator(rule, value, callback) {
                if (
                  !(
                    _.get(record, [LEG_FIELD.PAYMENT1, 'value']) >
                      _.get(record, [LEG_FIELD.PAYMENT2, 'value']) &&
                    _.get(record, [LEG_FIELD.PAYMENT2, 'value']) > value
                  )
                ) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED),
        };
  },
};

export const LowPayment: IColDef = {
  editable: true,
  title: '低行权收益',
  dataIndex: LEG_FIELD.LOW_PAYMENT,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const HighPayment: IColDef = {
  editable: true,
  title: '高行权收益',
  dataIndex: LEG_FIELD.HIGH_PAYMENT,
  input: record => {
    if (_.get(record, [LEG_FIELD.PAYMENT_TYPE, 'value']) === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.PAYMENT_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    return {
      depends: [LEG_FIELD.PAYMENT_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
  },
  rules: RULES_REQUIRED,
};

export const KnockDirection: IColDef = {
  editable: record => {
    if (
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  title: '敲出方向',
  dataIndex: LEG_FIELD.KNOCK_DIRECTION,
  input: {
    type: 'select',
    defaultOpen: true,
    options: KNOCK_DIRECTION_OPTIONS,
  },
  rules: RULES_REQUIRED,
  getValue: params => {
    if (
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      _.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return {
        depends: [LEG_FIELD.BARRIER, LEG_FIELD.STRIKE],
        value(data) {
          if (data[LEG_FIELD.BARRIER] !== undefined && data[LEG_FIELD.STRIKE] !== undefined) {
            if (data[LEG_FIELD.BARRIER] > data[LEG_FIELD.STRIKE]) {
              return KNOCK_DIRECTION_MAP.UP;
            }
            return KNOCK_DIRECTION_MAP.DOWN;
          }
          return undefined;
        },
      };
    }
    return {
      depends: [],
      value(data) {
        return data[LEG_FIELD.KNOCK_DIRECTION];
      },
    };
  },
};

export const RebateUnit: IColDef = {
  editable: true,
  title: '障碍补偿类型',
  dataIndex: LEG_FIELD.REBATE_UNIT,
  input: {
    type: 'select',
    defaultOpen: true,
    options: REBATETYPE_UNIT_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const PayOffType: IColDef = {
  editable: true,
  title: '收益单位',
  dataIndex: LEG_FIELD.PAY_OFF_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: UNIT_ENUM_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const PayOff: IColDef = {
  editable: true,
  title: '收益',
  dataIndex: LEG_FIELD.PAY_OFF,
  input: record => {
    if (_.get(record, [LEG_FIELD.REBATE_UNIT, 'value']) === UNIT_ENUM_MAP.CNY) {
      return INPUT_NUMBER_CURRENCY_CNY_CONFIG;
    }
    if (_.get(record, [LEG_FIELD.REBATE_UNIT, 'value']) === UNIT_ENUM_MAP.USD) {
      return INPUT_NUMBER_CURRENCY_USD_CONFIG;
    }
    return INPUT_NUMBER_PERCENTAGE_CONFIG;
  },
  rules: RULES_REQUIRED,
};

export const RebateType: IColDef = {
  editable: true,
  title: '补偿支付方式',
  dataIndex: LEG_FIELD.REBATE_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: REBATETYPE_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const Rebate: IColDef = {
  title: '敲出补偿',
  dataIndex: LEG_FIELD.REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const LowRebate: IColDef = {
  title: '低敲出补偿价',
  dataIndex: LEG_FIELD.LOW_REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const HighRebate: IColDef = {
  title: '高敲出补偿价',
  dataIndex: LEG_FIELD.HIGH_REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const PricingTerm = {
  ...Term,
  editable: record => {
    if (_.get(record, [LEG_ANNUALIZED_FIELD, 'value'])) {
      return true;
    }
    return false;
  },
  getValue: params => {
    if (_.get(record, [LEG_ANNUALIZED_FIELD, 'value'])) {
      return {
        depends: [],
        value(record) {
          return _.get(record, [Term.field, 'value']);
        },
      };
    }
    return {
      depends: [LEG_FIELD.EXPIRATION_DATE],
      value(record) {
        return (
          moment(_.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value'])).diff(moment(), 'days') + 1
        );
      },
    };
  },
};

export const PricingExpirationDate = {
  ...ExpirationDate,
  editable: record => {
    if (_.get(record, [LEG_ANNUALIZED_FIELD, 'value'])) {
      return false;
    }
    return true;
  },
  getValue: params => {
    if (_.get(record, [LEG_ANNUALIZED_FIELD, 'value'])) {
      return {
        depends: [LEG_FIELD.TERM],
        value(record) {
          return moment().add(_.get(record, [LEG_FIELD.TERM, 'value']), 'days');
        },
      };
    }
    return {
      depends: [],
      value(record) {
        return _.get(record, [LEG_FIELD.EXPIRATION_DATE, 'value']);
      },
    };
  },
};
