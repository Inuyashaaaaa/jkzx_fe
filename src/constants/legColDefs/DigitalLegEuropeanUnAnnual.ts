import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/global';
import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  OBSERVATION_TYPE_MAP,
  PAYMENT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../common';
import {
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  InitialSpot,
  NotionalAmount,
  NotionalAmountType,
  ObservationType,
  OptionType,
  ParticipationRate,
  Payment,
  PaymentType,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  RebateType,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const DigitalLegEuropeanUnAnnual = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL],
  type: LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,

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
          PricingTerm,
          PricingExpirationDate,
          Payment,
          ParticipationRate,
          NotionalAmount,
          ObservationType,
        ]
      : [
          Direction,
          OptionType,
          UnderlyerInstrumentId,
          UnderlyerMultiplier,
          InitialSpot,
          StrikeType,
          Strike,
          SpecifiedPrice,
          SettlementDate,
          ParticipationRate,
          NotionalAmountType,
          NotionalAmount,
          PaymentType,
          Payment,
          PremiumType,
          Premium,
          DaysInYear,
          ExpirationDate,
          // ExpirationTime,
          EffectiveDate,
          ObservationType,
          RebateType,
        ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.OBSERVATION_TYPE]: OBSERVATION_TYPE_MAP.TERMINAL,
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    const COMPUTED_FIELDS = [
      'numOfOptions',
      'strikePercent',
      'numOfUnderlyerContracts',
      'premiumPerUnit',
      'trigger',
      'notional',
      'premiumPercent',
    ];

    nextPosition.productType = LEG_TYPE_MAP.DIGITAL;
    nextPosition.asset = _.omit(dataSourceItem, [...LEG_INJECT_FIELDS, ...COMPUTED_FIELDS]);
    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate &&
      nextPosition.asset.effectiveDate.format('YYYY-MM-DDTHH:mm:ss');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.exerciseType = EXERCISETYPE_MAP.EUROPEAN;

    nextPosition.asset.annualized = false;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    nextDataSourceItem.strikePercentAndNumber = position.asset.strike;
    return nextDataSourceItem;
  },
});
