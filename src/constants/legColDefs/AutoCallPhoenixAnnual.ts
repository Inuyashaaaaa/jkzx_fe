import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  EXTRA_FIELDS,
  FREQUENCY_TYPE_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OB_DAY_FIELD,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  UNIT_ENUM_MAP2,
  UP_BARRIER_TYPE_MAP,
} from '../common';
import {
  AlreadyBarrier,
  Coupon,
  CouponEarnings,
  DaysInYear,
  Direction,
  DownBarrier,
  DownBarrierDate,
  DownBarrierOptionsStrike,
  DownBarrierOptionsStrikeType,
  DownBarrierOptionsType,
  DownBarrierType,
  DownObservationStep,
  EffectiveDate,
  ExpirationDate,
  ExpireNoBarrierObserveDay,
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
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
  UpBarrier,
  UpBarrierType,
  UpObservationStep,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from './index';

export const AutoCallPhoenixAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL],
  type: LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,

  getColumnDefs: (env = 'booking') =>
    env === 'pricing'
      ? [
          SpecifiedPrice,
          Direction,
          UnderlyerInstrumentId,
          UnderlyerMultiplier,
          InitialSpot,
          ParticipationRate,
          Coupon,
          NotionalAmountType,
          NotionalAmount,
          KnockDirection,
          UpBarrierType,
          UpBarrier,
          CouponEarnings,
          ExpireNoBarrierObserveDay,
          DownBarrierType,
          DownBarrierOptionsStrikeType,
          DownBarrierOptionsStrike,
          DownBarrierOptionsType,
          UpObservationStep,
          DownObservationStep,
          DownBarrier,
          DownBarrierOptionsStrike,
          PricingTerm,
          PricingExpirationDate,
        ]
      : [
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
          Coupon,
          MinimumPremium,
          FrontPremium,
          NotionalAmountType,
          NotionalAmount,
          KnockDirection,
          UpBarrierType,
          UpBarrier,
          CouponEarnings,
          ExpireNoBarrierObserveDay,
          DownBarrierType,
          DownBarrierOptionsStrikeType,
          DownBarrierOptionsStrike,
          DownBarrierOptionsType,
          UpObservationStep,
          DownObservationStep,
          AlreadyBarrier,
          DownBarrierDate,
          DownBarrier,
          DownBarrierOptionsStrike,
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
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.ALREADY_BARRIER]: false,
      [LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE]: UNIT_ENUM_MAP2.PERCENT,
      [DownBarrierType.field]: UNIT_ENUM_MAP2.PERCENT,
      [LEG_FIELD.UP_OBSERVATION_STEP]: FREQUENCY_TYPE_MAP['1W'],
      ...(isPricing
        ? {
            autoCallPaymentType: null,
            knockInDate: null,
          }
        : {}),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    nextPosition.productType = LEG_TYPE_MAP.AUTOCALL_PHOENIX;
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    nextPosition.asset = _.omit(dataSourceItem, [
      ...LEG_INJECT_FIELDS,
      ...EXTRA_FIELDS,
      LEG_FIELD.UP_BARRIER,
      LEG_FIELD.UP_BARRIER_TYPE,
      AlreadyBarrier.field,
      UpObservationStep.field,
    ]);

    if (dataSourceItem[AlreadyBarrier.field]) {
      nextPosition.asset[DownBarrierDate.field] = undefined;
    }

    nextPosition.asset.barrier = dataSourceItem[LEG_FIELD.UP_BARRIER];
    nextPosition.asset.barrierType = dataSourceItem[LEG_FIELD.UP_BARRIER_TYPE];
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');

    nextPosition.asset[LEG_FIELD.DOWN_BARRIER_DATE] =
      nextPosition.asset[LEG_FIELD.DOWN_BARRIER_DATE] &&
      nextPosition.asset[LEG_FIELD.DOWN_BARRIER_DATE].format('YYYY-MM-DD');

    nextPosition.asset.settlementDate = isPricing
      ? nextPosition.asset.expirationDate
      : nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.annualized = true;

    nextPosition.asset.fixingObservations = dataSourceItem[
      LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY
    ].reduce((result, item) => {
      result[item[OB_DAY_FIELD]] = item.price !== undefined ? item.price : null;
      return result;
    }, {});

    nextPosition.asset.knockInObservationDates = null;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    nextDataSourceItem[LEG_FIELD.UP_BARRIER] = position.asset.barrier;
    nextDataSourceItem[LEG_FIELD.UP_BARRIER_TYPE] = position.asset.barrierType;

    const data = position.asset.fixingObservations || [];

    nextDataSourceItem[LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY] = Object.keys(data).map(key => {
      return {
        [OB_DAY_FIELD]: key,
        price: data[key],
      };
    });

    const data2 = position.asset.knockInObservationDates || [];

    nextDataSourceItem[LEG_FIELD.IN_EXPIRE_NO_BARRIEROBSERVE_DAY] = data2.map(key => {
      return {
        [OB_DAY_FIELD]: key,
      };
    });

    return nextDataSourceItem;
  },
});
