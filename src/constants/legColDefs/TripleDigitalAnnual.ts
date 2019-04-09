import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/legColDefs';
import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../common';
import {
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  InitialSpot,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  OptionType,
  ParticipationRate,
  Payment1,
  Payment2,
  Payment3,
  PaymentType,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  Strike1,
  Strike2,
  Strike3,
  StrikeType,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const TripleDigitalAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL],
  type: LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,

  getColumnDefs: (env = 'booking') =>
    env === 'pricing'
      ? [
          Direction,
          NotionalAmountType,
          InitialSpot,
          UnderlyerMultiplier,
          UnderlyerInstrumentId,
          OptionType,
          PricingTerm,
          PricingExpirationDate,
          ParticipationRate,
          NotionalAmount,
          StrikeType,
          Strike1,
          Strike2,
          Strike3,
          PaymentType,
          Payment1,
          Payment2,
          Payment3,
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
          ParticipationRate,
          NotionalAmount,
          NotionalAmountType,
          EffectiveDate,
          ExpirationDate,
          PaymentType,
          PremiumType,
          Premium,
          FrontPremium,
          MinimumPremium,
          OptionType,
          StrikeType,
          Strike1,
          Strike2,
          Strike3,
          Payment1,
          Payment2,
          Payment3,
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [StrikeType.field]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      ...(isPricing ? {} : {}),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [];

    nextPosition.productType = LEG_TYPE_MAP.TRIPLE_DIGITAL;
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
