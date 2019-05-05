import {
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '@/constants/common';

import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/global';
import _ from 'lodash';
import moment from 'moment';
import { ASSET_CLASS_MAP, LEG_TYPE_MAP, LEG_TYPE_ZHCH_MAP } from '../common';
import {
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  HighParticipationRate,
  HighStrike,
  InitialSpot,
  LowParticipationRate,
  LowStrike,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  StrikeType,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const StraddleAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.STRADDLE_ANNUAL],
  type: LEG_TYPE_MAP.STRADDLE_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,

  getColumnDefs: (env = 'booking') =>
    env === 'pricing'
      ? [
          Direction,
          SpecifiedPrice,
          UnderlyerInstrumentId,
          UnderlyerMultiplier,
          InitialSpot,
          EffectiveDate,
          PricingExpirationDate,
          PricingTerm,
          DaysInYear,
          NotionalAmountType,
          NotionalAmount,
          StrikeType,
          LowStrike,
          HighStrike,
          LowParticipationRate,
          HighParticipationRate,
          PremiumType,
        ]
      : [
          Direction,
          UnderlyerMultiplier,
          UnderlyerInstrumentId,
          InitialSpot,
          SpecifiedPrice,
          SettlementDate,
          Term,
          DaysInYear,
          NotionalAmount,
          NotionalAmountType,
          EffectiveDate,
          ExpirationDate,
          PremiumType,
          Premium,
          FrontPremium,
          MinimumPremium,
          StrikeType,
          LowStrike,
          HighStrike,
          LowParticipationRate,
          HighParticipationRate,
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [];

    nextPosition.productType = LEG_TYPE_MAP.STRADDLE;
    nextPosition.lcmEventType = 'OPEN';
    nextPosition.positionAccountCode = 'empty';
    nextPosition.positionAccountName = 'empty';
    nextPosition.counterPartyAccountCode = 'empty';
    nextPosition.counterPartyAccountName = 'empty';
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
