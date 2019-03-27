import _ from 'lodash';
import moment from 'moment';
import { DEFAULT_TERM } from '.';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../common';
import {
  Direction,
  EffectiveDate,
  ExpirationDate,
  HighStrike,
  InitialSpot,
  LowStrike,
  NotionalAmount,
  NotionalAmountType,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  PricingExpirationDate,
  PricingTerm,
  SettlementDate,
  SpecifiedPrice,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.VERTICAL_SPREAD_UNANNUAL],
  type: LEG_TYPE_MAP.VERTICAL_SPREAD_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  pricingColumnDefs: [
    Direction,
    NotionalAmountType,
    StrikeType,
    InitialSpot,
    UnderlyerMultiplier,
    UnderlyerInstrumentId,
    OptionType,
    LowStrike,
    HighStrike,
    PricingTerm,
    PricingExpirationDate,
    ParticipationRate,
    NotionalAmount,
  ],
  columnDefs: [
    Direction,
    OptionType,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    StrikeType,
    LowStrike,
    HighStrike,
    EffectiveDate,
    ExpirationDate,
    SpecifiedPrice,
    // expirationTime
    SettlementDate,
    ParticipationRate,
    NotionalAmountType,
    NotionalAmount,
    PremiumType,
    Premium,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      // expirationTime: '15:00:00',
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      ...(isPricing
        ? {
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
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

    nextPosition.productType = LEG_TYPE_MAP.VERTICAL_SPREAD;
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
    return nextDataSourceItem;
  },
});
