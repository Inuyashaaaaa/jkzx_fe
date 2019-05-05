import {
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/global';
import _ from 'lodash';
import moment from 'moment';
import { ASSET_CLASS_MAP, LEG_TYPE_MAP, LEG_TYPE_ZHCH_MAP } from '../common';
import {
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
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const DoubleNoTouchUnAnnual = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL],
  type: LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL,
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
          LowBarrier,
          HighBarrier,
          Payment,
          PaymentType,
          PricingTerm,
          PricingExpirationDate,
          NotionalAmount,
        ]
      : [
          Direction,
          UnderlyerMultiplier,
          UnderlyerInstrumentId,
          InitialSpot,
          SpecifiedPrice,
          SettlementDate,
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
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
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

    nextPosition.productType = LEG_TYPE_MAP.DOUBLE_NO_TOUCH;
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
    nextPosition.asset.touched = false;
    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    return nextDataSourceItem;
  },
});
