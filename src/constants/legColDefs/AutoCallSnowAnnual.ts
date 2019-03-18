import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  EXTRA_FIELDS,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PRODUCT_TYPE_ZHCN_MAP,
} from '../common';
import {
  AutoCallStrike,
  AutoCallStrikeUnit,
  CouponEarnings,
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  ExpireNoBarrierObserveDay,
  ExpireNoBarrierPremium,
  ExpireNoBarrierPremiumType,
  FrontPremium,
  InitialSpot,
  KnockDirection,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  ParticipationRate,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Step,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
  UpBarrier,
  UpBarrierType,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM } from './index';

export const AutoCallSnowAnnual = pipeLeg({
  name: PRODUCT_TYPE_ZHCN_MAP[LEG_TYPE_MAP.AUTO_CALL_SNOW_ANNUAL],
  type: LEG_TYPE_MAP.AUTO_CALL_SNOW_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,
  columnDefs: [
    SpecifiedPrice,
    Direction,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    ParticipationRate,
    Term,
    EffectiveDate,
    ExpirationDate,
    SettlementDate,
    DaysInYear,
    PremiumType,
    Premium,
    MinimumPremium,
    FrontPremium,
    NotionalAmountType,
    NotionalAmount,
    KnockDirection,
    UpBarrierType,
    UpBarrier,
    Step,
    CouponEarnings,
    ExpireNoBarrierPremiumType,
    ExpireNoBarrierPremium,
    AutoCallStrikeUnit,
    AutoCallStrike,
    ExpireNoBarrierObserveDay,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
    };
  },
  getPosition: (nextPosition, dataSourceItem) => {
    nextPosition.productType = LEG_TYPE_MAP.AUTO_CALL_SNOW;
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    nextPosition.asset = _.omit(dataSourceItem, [
      ...LEG_INJECT_FIELDS,
      ...EXTRA_FIELDS,
      LEG_FIELD.UP_BARRIER,
      LEG_FIELD.UP_BARRIER_TYPE,
    ]);

    nextPosition.asset.barrier = dataSourceItem[LEG_FIELD.UP_BARRIER];
    nextPosition.asset.barrierType = dataSourceItem[LEG_FIELD.UP_BARRIER_TYPE];
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');
    nextPosition.asset.annualized = true;

    return nextPosition;
  },
});
