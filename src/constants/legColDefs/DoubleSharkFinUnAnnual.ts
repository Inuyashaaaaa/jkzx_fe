import _ from 'lodash';
import moment from 'moment';
import { DEFAULT_TERM } from '.';
import {
  ASSET_CLASS_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PRODUCT_TYPE_ZHCN_MAP,
  REBATETYPE_TYPE_MAP,
  REBATETYPE_UNIT_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
} from '../common';
import {
  BarrierType,
  Direction,
  EffectiveDate,
  ExpirationDate,
  HighBarrier,
  HighParticipationRate,
  HighRebate,
  HighStrike,
  InitialSpot,
  LowBarrier,
  LowParticipationRate,
  LowRebate,
  LowStrike,
  NotionalAmount,
  NotionalAmountType,
  ObservationType,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  RebateType,
  SettlementDate,
  SpecifiedPrice,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const DoubleSharkFinUnAnnual = pipeLeg({
  name: PRODUCT_TYPE_ZHCN_MAP[LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL],
  type: LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  pricingColumnDefs: [
    Direction,
    NotionalAmountType,
    InitialSpot,
    UnderlyerMultiplier,
    UnderlyerInstrumentId,
    StrikeType,
    LowStrike,
    HighStrike,
    PricingTerm,
    LowParticipationRate,
    HighParticipationRate,
    NotionalAmount,
    RebateType,
    LowRebate,
    HighRebate,
    BarrierType,
    LowBarrier,
    HighBarrier,
    ObservationType,
    PricingExpirationDate,
  ],
  columnDefs: [
    Direction,
    UnderlyerMultiplier,
    UnderlyerInstrumentId,
    InitialSpot,
    SpecifiedPrice,
    SettlementDate,
    LowParticipationRate,
    HighParticipationRate,
    NotionalAmount,
    NotionalAmountType,
    EffectiveDate,
    ExpirationDate,
    StrikeType,
    LowStrike,
    HighStrike,
    RebateType,
    LowRebate,
    HighRebate,
    BarrierType,
    LowBarrier,
    HighBarrier,
    PremiumType,
    Premium,
    ObservationType,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      ...(isPricing
        ? {}
        : {
            [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
          }),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [];

    nextPosition.productType = LEG_TYPE_MAP.DOUBLE_SHARK_FIN;
    nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.annualized = false;
    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    return nextDataSourceItem;
  },
});
