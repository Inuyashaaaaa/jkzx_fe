import AsiaObserveModalInput from '@/containers/AsiaObserveModalInput';
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
  headerName: '类型',
  field: LEG_FIELD.OPTION_TYPE,
  editable: params => {
    if (
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
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
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return {
        depends: [LEG_FIELD.BARRIER, LEG_FIELD.STRIKE],
        value(record) {
          if (record[LEG_FIELD.BARRIER] !== undefined && record[LEG_FIELD.STRIKE] !== undefined) {
            if (record[LEG_FIELD.BARRIER] > record[LEG_FIELD.STRIKE]) {
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
  headerName: '手数',
  field: 'notionalLot',
  editable: true,
  input: INPUT_NUMBER_DIGITAL_CONFIG,
  rules: RULES_REQUIRED,
};

export const PremiumValue: IColDef = {
  headerName: '期权费',
  field: 'premiumValue',
  editable: true,
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  rules: RULES_REQUIRED,
};

export const ParticipationRate: IColDef = {
  headerName: '参与率',
  field: LEG_FIELD.PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const LowParticipationRate: IColDef = {
  headerName: '低参与率',
  field: LEG_FIELD.LOW_PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const HighParticipationRate: IColDef = {
  headerName: '高参与率',
  field: LEG_FIELD.HIGH_PARTICIPATION_RATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const ParticipationRate1: IColDef = {
  headerName: '参与率1',
  field: LEG_FIELD.PARTICIPATION_RATE1,
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
  headerName: '参与率2',
  field: LEG_FIELD.PARTICIPATION_RATE2,
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
  headerName: '结算日期',
  field: LEG_FIELD.SETTLEMENT_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.EXPIRATION_DATE],
    value: record => {
      return getMoment(record[LEG_FIELD.EXPIRATION_DATE], true);
    },
  },
};

export const UnderlyerInstrumentId: IColDef = {
  headerName: '标的物',
  field: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
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
  headerName: '期初价格',
  field: LEG_FIELD.INITIAL_SPOT,
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  getValue: {
    depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
    value: record => {
      return mktQuotesListPaged({
        instrumentIds: [record[LEG_FIELD.UNDERLYER_INSTRUMENT_ID]],
      }).then(rsp => {
        if (rsp.error) return undefined;
        return rsp.data.page[0]
          ? new BigNumber(rsp.data.page[0].last)
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber()
          : 1;
      });
    },
  },
  rules: RULES_REQUIRED,
};

export const LowStrike: IColDef = {
  editable: true,
  headerName: '低行权价',
  field: LEG_FIELD.LOW_STRIKE,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  headerName: '高行权价',
  field: LEG_FIELD.HIGH_STRIKE,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  headerName: '行权价',
  field: LEG_FIELD.STRIKE,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
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
  headerName: '行权价1',
  field: LEG_FIELD.STRIKE1,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
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
  headerName: '行权价2',
  field: LEG_FIELD.STRIKE2,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
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
            if (!(record[LEG_FIELD.STRIKE1] < value)) {
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
  headerName: '行权价3',
  field: LEG_FIELD.STRIKE3,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
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
                record[LEG_FIELD.STRIKE1] < record[LEG_FIELD.STRIKE2] &&
                record[LEG_FIELD.STRIKE2] < value
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
  headerName: '行权价4',
  field: LEG_FIELD.STRIKE4,
  input: record => {
    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.CNY) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.USD) {
      return {
        depends: [LEG_FIELD.STRIKE_TYPE],
        value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
      };
    }

    if (record[LEG_FIELD.STRIKE_TYPE] === STRIKE_TYPES_MAP.PERCENT) {
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
      const participationRate1 = record[LEG_FIELD.PARTICIPATION_RATE1];
      const participationRate2 = record[LEG_FIELD.PARTICIPATION_RATE2];
      const strike1 = record[LEG_FIELD.STRIKE1];
      const strike2 = record[LEG_FIELD.STRIKE2];
      const strike3 = record[LEG_FIELD.STRIKE3];

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
  headerName: '到期日',
  field: LEG_FIELD.EXPIRATION_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.TERM, LEG_FIELD.EFFECTIVE_DATE],
    value: record => {
      const effectiveDate = record[LEG_FIELD.EFFECTIVE_DATE];
      const term = record[LEG_FIELD.TERM];
      if (record[LEG_FIELD.TERM] !== undefined && effectiveDate !== undefined) {
        return getMoment(effectiveDate, true).add(term, 'days');
      }
      return record[LEG_FIELD.EXPIRATION_DATE];
    },
  },
};

export const ExpirationTime: IColDef = {
  editable: true,
  headerName: '到期时间',
  field: 'expirationTime',
  // @todo input 增加依赖关系
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL
    ) {
      return {
        type: 'time',
        defaultOpen: true,
        exisable: !(
          record[LEG_FIELD.SPECIFIED_PRICE] === SPECIFIED_PRICE_MAP.CLOSE ||
          record[LEG_FIELD.SPECIFIED_PRICE] === SPECIFIED_PRICE_MAP.TWAP
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
  headerName: '期限(交易日)',
  field: 'numTradeDays',
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const UnderlyerMultiplier: IColDef = {
  headerName: '合约乘数',
  field: LEG_FIELD.UNDERLYER_MULTIPLIER,
  input: INPUT_NUMBER_DIGITAL_CONFIG,
  getValue: {
    depends: [LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
    value: record => {
      return mktInstrumentInfo({
        instrumentId: record[LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
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
  editable: params => {
    if (params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.DIGITAL) {
      return false;
    }
    return true;
  },
  headerName: '实际期权费',
  field: LEG_FIELD.PREMIUM,
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.CNY) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        };
      }
      if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.USD) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_CURRENCY_USD_CONFIG,
        };
      }
      if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.PERCENT) {
        return {
          depends: [LEG_FIELD.PREMIUM_TYPE],
          value: INPUT_NUMBER_PERCENTAGE_CONFIG,
        };
      }
    }

    if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.CNY) {
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
  headerName: '买卖方向',
  field: LEG_FIELD.DIRECTION,
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
  headerName: '障碍价',
  field: LEG_FIELD.BARRIER,
  input: record => {
    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.USD) {
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
  headerName: '敲出障碍价类型',
  field: LEG_FIELD.UP_BARRIER_TYPE,
  input: {
    type: 'select',
    options: UP_BARRIER_TYPE_OPTIONS,
  },
};

export const DownBarrierType: IColDef = {
  editable: true,
  headerName: '敲入障碍价类型',
  field: LEG_FIELD.DOWN_BARRIER_TYPE,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
  },
};

export const DownBarrierOptionsStrikeType: IColDef = {
  editable: true,
  headerName: '敲入期权行权价类型',
  field: LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
  },
};

export const DownBarrierOptionsStrike: IColDef = {
  editable: true,
  headerName: '敲入期权行权价',
  field: LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE,
  input: record => {
    if (record[LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE] === UNIT_ENUM_OPTIONS2.CNY) {
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
  headerName: '敲入期权类型',
  field: LEG_FIELD.DOWN_BARRIER_OPTIONS_TYPE,
  input: {
    type: 'select',
    options: OPTION_TYPE_OPTIONS,
  },
};

export const UpBarrier: IColDef = {
  editable: true,
  headerName: '敲出障碍价',
  field: LEG_FIELD.UP_BARRIER,
  input: record => {
    if (record[LEG_FIELD.UP_BARRIER_TYPE] === UP_BARRIER_TYPE_MAP.CNY) {
      return {
        depends: [LEG_FIELD.UP_BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    // if (record[LEG_FIELD.UP_BARRIER_TYPE] === UP_BARRIER_TYPE_MAP.PERCENT) {
    return {
      depends: [LEG_FIELD.UP_BARRIER_TYPE],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
    // }
  },
};

export const DownBarrier: IColDef = {
  editable: true,
  headerName: '敲入障碍价',
  field: LEG_FIELD.DOWN_BARRIER,
  input: record => {
    if (record[LEG_FIELD.DOWN_BARRIER_TYPE] === UNIT_ENUM_MAP2.CNY) {
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
};

export const CouponEarnings: IColDef = {
  editable: true,
  headerName: '收益/coupon(%)',
  field: LEG_FIELD.COUPON_PAYMENT,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const Step: IColDef = {
  editable: true,
  headerName: '逐步调整步长(%)',
  field: LEG_FIELD.STEP,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const Coupon: IColDef = {
  editable: true,
  headerName: 'coupon障碍',
  field: LEG_FIELD.STEP,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const ExpireNoBarrierPremiumType: IColDef = {
  editable: true,
  headerName: '到期未敲出收益类型',
  field: LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE,
  input: {
    type: 'select',
    options: EXPIRE_NO_BARRIER_PREMIUM_TYPE_OPTIONS,
  },
};

export const AutoCallStrikeUnit: IColDef = {
  editable: true,
  exsitable: params => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        params.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
        params.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT,
    };
  },
  headerName: '到期未敲出行权价格类型',
  field: LEG_FIELD.AUTO_CALL_STRIKE_UNIT,
  input: {
    type: 'select',
    options: UNIT_ENUM_OPTIONS2,
  },
};

export const AutoCallStrike: IColDef = {
  editable: true,
  exsitable: params => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        params.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
        params.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
          EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT,
    };
  },
  headerName: '到期未敲出行权价格',
  field: LEG_FIELD.AUTO_CALL_STRIKE,
  input: record => {
    if (record[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] === UNIT_ENUM_MAP2.CNY) {
      return {
        depends: [LEG_FIELD.AUTO_CALL_STRIKE_UNIT],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    // if (record[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] === UNIT_ENUM_OPTIONS2.PERCENT) {
    return {
      depends: [LEG_FIELD.AUTO_CALL_STRIKE_UNIT],
      value: INPUT_NUMBER_PERCENTAGE_CONFIG,
    };
    // }
  },
};

export const ExpireNoBarrierPremium: IColDef = {
  editable: true,
  exsitable: params => {
    return {
      depends: [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE],
      value:
        params.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED,
    };
  },
  headerName: '到期未敲出固定收益',
  field: LEG_FIELD.EXPIRE_NOBARRIERPREMIUM,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
};

export const ExpireNoBarrierObserveDay: IColDef = {
  editable: true,
  headerName: '敲出/coupon观察日',
  field: LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY,
  input: record => {
    return {
      type: ObserveModalInput,
      record,
    };
  },
};

export const LowBarrier: IColDef = {
  editable: true,
  headerName: '低障碍价',
  field: LEG_FIELD.LOW_BARRIER,
  input: record => {
    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.USD) {
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
  headerName: '高障碍价',
  field: LEG_FIELD.HIGH_BARRIER,
  input: record => {
    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.CNY) {
      return {
        depends: [LEG_FIELD.BARRIER_TYPE],
        value: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      };
    }

    if (record[LEG_FIELD.BARRIER_TYPE] === UNIT_ENUM_MAP.USD) {
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
  editable: params => {
    if (
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  headerName: '障碍观察类型',
  field: LEG_FIELD.OBSERVATION_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: OBSERVATION_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const BarrierType: IColDef = {
  editable: true,
  headerName: '障碍类型',
  field: LEG_FIELD.BARRIER_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: UNIT_ENUM_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const RebateLow: IColDef = {
  headerName: '低敲出补偿(¥)',
  editable: true,
  field: 'rebateLow',
  input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  rules: RULES_REQUIRED,
};

export const ObservationStep: IColDef = {
  headerName: '观察频率',
  field: LEG_FIELD.OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: FREQUENCY_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const UpObservationStep: IColDef = {
  headerName: '敲出观察频率',
  field: LEG_FIELD.UP_OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: FREQUENCY_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const DownObservationStep: IColDef = {
  headerName: '敲入观察频率',
  field: LEG_FIELD.DOWN_OBSERVATION_STEP,
  editable: true,
  input: {
    type: 'select',
    defaultOpen: true,
    options: DOWN_OBSERVATION_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const AlreadyBarrier: IColDef = {
  headerName: '敲入观察频率',
  field: LEG_FIELD.ALREADY_BARRIER,
  editable: true,
  input: {
    type: 'checkbox',
  },
  rules: RULES_REQUIRED,
};

export const DownBarrierDate: IColDef = {
  headerName: '敲入日期',
  field: LEG_FIELD.DOWN_BARRIER_DATE,
  editable: true,
  input: {
    type: 'date',
  },
  rules: RULES_REQUIRED,
};

export const ObserveStartDay: IColDef = {
  headerName: '观察起始日',
  field: LEG_FIELD.OBSERVE_START_DAY,
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
      if (
        record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_ANNUAL ||
        record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_UNANNUAL
      ) {
        const expirationDate = record[LEG_FIELD.EXPIRATION_DATE];
        if (record[LEG_FIELD.EXPIRATION_DATE] !== undefined) {
          return getMoment(expirationDate, true);
        }
        return record[LEG_FIELD.OBSERVE_START_DAY];
      }

      return {
        depends: [],
        value(data) {
          return data[LEG_FIELD.OBSERVE_START_DAY];
        },
      };
    },
  },
};

export const ObserveEndDay: IColDef = {
  headerName: '观察终止日',
  field: LEG_FIELD.OBSERVE_END_DAY,
  editable: true,
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
  getValue: {
    depends: [LEG_FIELD.SETTLEMENT_DATE],
    value: record => {
      if (
        record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_ANNUAL ||
        record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.ASIAN_UNANNUAL
      ) {
        const settlemenetDate = record[LEG_FIELD.SETTLEMENT_DATE];
        if (record[LEG_FIELD.SETTLEMENT_DATE] !== undefined) {
          return getMoment(settlemenetDate, true);
        }
        return record[LEG_FIELD.OBSERVE_END_DAY];
      }

      return {
        depends: [],
        value(data) {
          return data[LEG_FIELD.OBSERVE_END_DAY];
        },
      };
    },
  },
};

export const Holidays: IColDef = {
  headerName: '交易日历',
  field: 'holidays',
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
  headerName: '观察日',
  editable: true,
  field: LEG_FIELD.OBSERVATION_DATES,
  input: record => ({
    type: AsiaObserveModalInput,
    record,
  }),
  rules: RULES_REQUIRED,
};

export const PositionId: IColDef = {
  headerName: '持仓编号',
  editable: true,
  field: 'positionId',
  input: {
    type: 'input',
  },
  rules: RULES_REQUIRED,
};

export const Quantity: IColDef = {
  headerName: '交易数量',
  editable: true,
  field: 'quantity',
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
  headerName: '标的物类型',
  editable: true,
  field: 'assetClass',
  input: {
    type: 'select',
    defaultOpen: true,
    options: AssetClassOptions,
  },
  rules: RULES_REQUIRED,
};

export const EffectiveDate: IColDef = {
  headerName: '起始日',
  editable: true,
  field: LEG_FIELD.EFFECTIVE_DATE,
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const PremiumPaymentDate: IColDef = {
  headerName: '期权费支付日',
  editable: true,
  field: 'premiumPaymentDate',
  input: {
    type: 'date',
    defaultOpen: true,
    range: 'day',
  },
  rules: RULES_REQUIRED,
};

export const StrikeType: IColDef = {
  headerName: '行权价类型',
  editable: true,
  field: LEG_FIELD.STRIKE_TYPE,
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.EAGLE_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.EAGLE_UNANNUAL
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
  headerName: '结算方式',
  editable: true,
  field: LEG_FIELD.SPECIFIED_PRICE,
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL
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
  headerName: '期限',
  editable: true,
  field: LEG_FIELD.TERM,
  input: INPUT_NUMBER_DAYS_CONFIG,
  rules: RULES_REQUIRED,
};

export const IsAnnualized: IColDef = {
  headerName: '是否年化',
  editable: true,
  field: 'isAnnualized',
  input: {
    type: 'checkbox',
    emptyFormatWhenNullValue: true,
  },
  rules: RULES_REQUIRED,
};

export const DaysInYear: IColDef = {
  headerName: '年度计息天数',
  editable: true,
  field: LEG_FIELD.DAYS_IN_YEAR,
  input: {
    type: 'number',
  },
  rules: RULES_REQUIRED,
};

export const NotionalAmount: IColDef = {
  editable: true,
  headerName: '名义本金',
  field: LEG_FIELD.NOTIONAL_AMOUNT,
  input: record => {
    if (record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
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
  editable: params => {
    if (params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return false;
    }
    return true;
  },
  headerName: '名义本金类型',
  field: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
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
    if (params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
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
        if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.PERCENT) {
          return NOTIONAL_AMOUNT_TYPE_MAP.CNY;
        }
        return NOTIONAL_AMOUNT_TYPE_MAP.LOT;
      },
    };
  },
};

export const PremiumType: IColDef = {
  editable: true,
  headerName: '权利金类型',
  field: LEG_FIELD.PREMIUM_TYPE,
  input: record => {
    if (
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
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
  headerName: '合约期权费',
  field: LEG_FIELD.FRONT_PREMIUM,
  input: record => {
    if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.CNY) {
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
      if (record[LEG_FIELD.PREMIUM] === undefined && record[LEG_FIELD.MINIMUM_PREMIUM]) {
        return undefined;
      }
      return new BigNumber(record[LEG_FIELD.PREMIUM] || 0)
        .plus(record[LEG_FIELD.MINIMUM_PREMIUM] || 0)
        .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
        .toNumber();
    },
  },
};

export const MinimumPremium: IColDef = {
  editable: true,
  headerName: '保底收益',
  field: LEG_FIELD.MINIMUM_PREMIUM,
  input: record => {
    if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.CNY) {
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
  headerName: '对手方',
  field: 'counterpartyCode',
  input: {
    ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
  rules: RULES_REQUIRED,
};

export const PaymentType: IColDef = {
  editable: true,
  headerName: '行权支付类型',
  field: LEG_FIELD.PAYMENT_TYPE,
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
  headerName: '行权收益',
  field: LEG_FIELD.PAYMENT,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  headerName: '行权收益1',
  field: LEG_FIELD.PAYMENT1,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  headerName: '行权收益2',
  field: LEG_FIELD.PAYMENT2,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
    return record[LEG_FIELD.OPTION_TYPE] === 'CALL'
      ? {
          depends: [LEG_FIELD.PAYMENT1],
          value: ([
            {
              message: '必须满足条件(行权收益1<行权收益2)',
              validator(rule, value, callback) {
                if (!(record[LEG_FIELD.PAYMENT1] < value)) {
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
                if (!(record[LEG_FIELD.PAYMENT1] > value)) {
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
  headerName: '行权收益3',
  field: LEG_FIELD.PAYMENT3,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
    return record[LEG_FIELD.OPTION_TYPE] === 'CALL'
      ? {
          depends: [LEG_FIELD.PAYMENT1, LEG_FIELD.PAYMENT2],
          value: ([
            {
              message: '必须满足条件(行权收益1<行权收益2<行权收益3)',
              validator(rule, value, callback) {
                if (
                  !(
                    record[LEG_FIELD.PAYMENT1] < record[LEG_FIELD.PAYMENT2] &&
                    record[LEG_FIELD.PAYMENT2] < value
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
                    record[LEG_FIELD.PAYMENT1] > record[LEG_FIELD.PAYMENT2] &&
                    record[LEG_FIELD.PAYMENT2] > value
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
  headerName: '低行权收益',
  field: LEG_FIELD.LOW_PAYMENT,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  headerName: '高行权收益',
  field: LEG_FIELD.HIGH_PAYMENT,
  input: record => {
    if (record[LEG_FIELD.PAYMENT_TYPE] === STRIKE_TYPES_MAP.CNY) {
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
  editable: params => {
    if (
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
    ) {
      return false;
    }
    return true;
  },
  headerName: '敲出方向',
  field: LEG_FIELD.KNOCK_DIRECTION,
  input: {
    type: 'select',
    defaultOpen: true,
    options: KNOCK_DIRECTION_OPTIONS,
  },
  rules: RULES_REQUIRED,
  getValue: params => {
    if (
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
      params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
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
  headerName: '障碍补偿类型',
  field: LEG_FIELD.REBATE_UNIT,
  input: {
    type: 'select',
    defaultOpen: true,
    options: REBATETYPE_UNIT_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const PayOffType: IColDef = {
  editable: true,
  headerName: '收益单位',
  field: LEG_FIELD.PAY_OFF_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: UNIT_ENUM_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const PayOff: IColDef = {
  editable: true,
  headerName: '收益',
  field: LEG_FIELD.PAY_OFF,
  input: record => {
    if (record[LEG_FIELD.REBATE_UNIT] === UNIT_ENUM_MAP.CNY) {
      return INPUT_NUMBER_CURRENCY_CNY_CONFIG;
    }
    if (record[LEG_FIELD.REBATE_UNIT] === UNIT_ENUM_MAP.USD) {
      return INPUT_NUMBER_CURRENCY_USD_CONFIG;
    }
    return INPUT_NUMBER_PERCENTAGE_CONFIG;
  },
  rules: RULES_REQUIRED,
};

export const RebateType: IColDef = {
  editable: true,
  headerName: '补偿支付方式',
  field: LEG_FIELD.REBATE_TYPE,
  input: {
    type: 'select',
    defaultOpen: true,
    options: REBATETYPE_TYPE_OPTIONS,
  },
  rules: RULES_REQUIRED,
};

export const Rebate: IColDef = {
  headerName: '敲出补偿',
  field: LEG_FIELD.REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const LowRebate: IColDef = {
  headerName: '低敲出补偿价',
  field: LEG_FIELD.LOW_REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const HighRebate: IColDef = {
  headerName: '高敲出补偿价',
  field: LEG_FIELD.HIGH_REBATE,
  editable: true,
  input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  rules: RULES_REQUIRED,
};

export const PricingTerm = {
  ...Term,
  editable: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return true;
    }
    return false;
  },
  getValue: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return {
        depends: [],
        value(record) {
          return record[Term.field];
        },
      };
    }
    return {
      depends: [LEG_FIELD.EXPIRATION_DATE],
      value(record) {
        return moment(record[LEG_FIELD.EXPIRATION_DATE]).diff(moment(), 'days') + 1;
      },
    };
  },
};

export const PricingExpirationDate = {
  ...ExpirationDate,
  editable: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return false;
    }
    return true;
  },
  getValue: params => {
    if (params.data[LEG_ANNUALIZED_FIELD]) {
      return {
        depends: [LEG_FIELD.TERM],
        value(record) {
          return moment().add(record[LEG_FIELD.TERM], 'days');
        },
      };
    }
    return {
      depends: [],
      value(record) {
        return record[LEG_FIELD.EXPIRATION_DATE];
      },
    };
  },
};
