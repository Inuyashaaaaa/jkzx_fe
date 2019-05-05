import {
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  REBATETYPE_UNIT_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/global';
import _ from 'lodash';
import moment from 'moment';
import { ASSET_CLASS_MAP, LEG_TYPE_MAP, LEG_TYPE_ZHCH_MAP } from '../common';
import {
  Barrier,
  BarrierType,
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  InitialSpot,
  KnockDirection,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  ObservationType,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  Rebate,
  RebateType,
  RebateUnit,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const BarrierAnnual = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.BARRIER_ANNUAL],
  type: LEG_TYPE_MAP.BARRIER_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,

  getColumnDefs: (env = 'booking') =>
    env === 'pricing'
      ? [
          Direction,
          NotionalAmountType,
          InitialSpot,
          StrikeType,
          UnderlyerMultiplier,
          UnderlyerInstrumentId,
          OptionType,
          Strike,
          Barrier,
          Rebate,
          PricingTerm,
          PricingExpirationDate,
          ParticipationRate,
          NotionalAmount,
          ObservationType,
          KnockDirection,
          OptionType,
        ]
      : [
          Direction,
          OptionType,
          UnderlyerInstrumentId,
          UnderlyerMultiplier,
          InitialSpot,
          StrikeType,
          Strike,
          KnockDirection,
          SpecifiedPrice,
          Term,
          SettlementDate,
          DaysInYear,
          ParticipationRate,
          NotionalAmountType,
          NotionalAmount,
          EffectiveDate,
          ExpirationDate,
          RebateUnit,
          RebateType,
          Rebate,
          BarrierType,
          Barrier,
          PremiumType,
          Premium,
          FrontPremium,
          MinimumPremium,
          ObservationType,
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [];

    nextPosition.productType = LEG_TYPE_MAP.BARRIER;
    nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.annualized = true;
    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    return nextDataSourceItem;
  },
});
