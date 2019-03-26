import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/legColDefs';
import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PRODUCT_TYPE_ZHCN_MAP,
  SPECIFIED_PRICE_MAP,
  UNIT_ENUM_MAP,
} from '../common';
import {
  BarrierType,
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  HighBarrier,
  InitialSpot,
  LowBarrier,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  OptionType,
  ParticipationRate,
  Payment,
  PaymentType,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const ConcavaAnnual: ILegType = pipeLeg({
  name: PRODUCT_TYPE_ZHCN_MAP[LEG_TYPE_MAP.CONCAVA_ANNUAL],
  type: LEG_TYPE_MAP.CONCAVA_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,
  pricingColumnDefs: [
    Direction,
    NotionalAmountType,
    InitialSpot,
    UnderlyerMultiplier,
    UnderlyerInstrumentId,
    PricingTerm,
    PricingExpirationDate,
    ParticipationRate,
    NotionalAmount,
    Payment,
    PaymentType,
    BarrierType,
    LowBarrier,
    HighBarrier,
  ],
  columnDefs: [
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
    BarrierType,
    LowBarrier,
    HighBarrier,
    PaymentType,
    Payment,
    PremiumType,
    Premium,
    FrontPremium,
    MinimumPremium,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      ...(isPricing ? {} : {}),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [];

    nextPosition.productType = LEG_TYPE_MAP.CONCAVA;
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
    nextPosition.asset.concavaed = true;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    return nextDataSourceItem;
  },
});
