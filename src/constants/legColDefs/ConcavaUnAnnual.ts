import { DEFAULT_TERM, ILegType } from '@/constants/legColDefs';
import _ from 'lodash';
import moment from 'moment';
import { DEFAULT_DAYS_IN_YEAR } from '.';
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
  UNIT_ENUM_MAP,
} from '../common';
import {
  BarrierType,
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  HighBarrier,
  InitialSpot,
  LowBarrier,
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

export const ConcavaUnAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.CONCAVA_UNANNUAL],
  type: LEG_TYPE_MAP.CONCAVA_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,

  getColumnDefs: (env = 'booking') =>
    env === 'pricing'
      ? [
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
        ]
      : [
          BarrierType,
          Direction,
          EffectiveDate,
          ExpirationDate,
          HighBarrier,
          InitialSpot,
          LowBarrier,
          NotionalAmount,
          NotionalAmountType,
          ParticipationRate,
          Payment,
          PaymentType,
          Premium,
          PremiumType,
          SettlementDate,
          SpecifiedPrice,
          UnderlyerInstrumentId,
          UnderlyerMultiplier,
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
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

    nextPosition.asset.annualized = false;
    nextPosition.asset.concavaed = true;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    return nextDataSourceItem;
  },
});
