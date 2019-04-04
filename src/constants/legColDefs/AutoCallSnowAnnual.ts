import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  EXTRA_FIELDS,
  FREQUENCY_TYPE_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OB_DAY_FIELD,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  UP_BARRIER_TYPE_MAP,
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
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  Step,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
  UpBarrier,
  UpBarrierType,
  UpObservationStep,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from './index';

export const AutoCallSnowAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.AUTOCALL_ANNUAL],
  type: LEG_TYPE_MAP.AUTOCALL_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,
  pricingColumnDefs: [
    Direction,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    ParticipationRate,
    PricingTerm,
    PricingExpirationDate,
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
    UpObservationStep,
  ],
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
    UpObservationStep,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.UP_BARRIER_TYPE]: UP_BARRIER_TYPE_MAP.PERCENT,
      [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]: EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.AUTO_CALL_STRIKE_UNIT]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.UP_OBSERVATION_STEP]: FREQUENCY_TYPE_MAP['1W'],
      [Step.field]: 0,
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    nextPosition.productType = LEG_TYPE_MAP.AUTOCALL;
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    nextPosition.asset = _.omit(dataSourceItem, [
      ...LEG_INJECT_FIELDS,
      ...EXTRA_FIELDS,
      LEG_FIELD.UP_BARRIER,
      LEG_FIELD.UP_BARRIER_TYPE,
      UpObservationStep.field,
      ExpireNoBarrierObserveDay.field,
    ]);

    if (
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
    ) {
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] = undefined;
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE] = undefined;
    } else {
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] = undefined;
    }

    nextPosition.asset.observationDates = dataSourceItem[ExpireNoBarrierObserveDay.field].map(
      item => item[OB_DAY_FIELD]
    );

    nextPosition.asset.barrier = dataSourceItem[LEG_FIELD.UP_BARRIER];
    nextPosition.asset.barrierType = dataSourceItem[LEG_FIELD.UP_BARRIER_TYPE];
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');

    nextPosition.asset.settlementDate = isPricing
      ? nextPosition.asset.expirationDate
      : nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.annualized = true;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    nextDataSourceItem[LEG_FIELD.UP_BARRIER] = position.asset.barrier;
    nextDataSourceItem[LEG_FIELD.UP_BARRIER_TYPE] = position.asset.barrierType;
    return nextDataSourceItem;
  },
});
