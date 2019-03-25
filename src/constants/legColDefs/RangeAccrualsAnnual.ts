import { DEFAULT_DAYS_IN_YEAR, DEFAULT_TERM, ILegType } from '@/constants/legColDefs';
import { convertObservetions } from '@/services/common';
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
  ObservationDates,
  ParticipationRate,
  Payment,
  PaymentType,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const RangeAccrualsAnnual: ILegType = pipeLeg({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL],
  type: LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,
  pricingColumnDefs: [],
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
    PaymentType,
    PremiumType,
    Premium,
    FrontPremium,
    MinimumPremium,
    Payment,
    BarrierType,
    HighBarrier,
    LowBarrier,
    ObservationDates,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
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

    nextPosition.productType = LEG_TYPE_MAP.RANGE_ACCRUALS;
    nextPosition.asset = _.omit(dataSourceItem, [
      ...LEG_INJECT_FIELDS,
      ...COMPUTED_FIELDS,
      LEG_FIELD.OBSERVATION_DATES,
    ]);

    nextPosition.asset.fixingObservations = dataSourceItem[LEG_FIELD.OBSERVATION_DATES].reduce(
      (result, item) => {
        result[item.day] = item.price || null;
        return result;
      },
      {}
    );

    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate && nextPosition.asset.effectiveDate.format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate && nextPosition.asset.expirationDate.format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate && nextPosition.asset.settlementDate.format('YYYY-MM-DD');

    nextPosition.asset.annualized = true;

    return nextPosition;
  },
  getPageData: (nextPageDataItem, position) => {
    const days = Object.keys(nextPageDataItem.fixingObservations);
    if (!days.length) return nextPageDataItem;
    nextPageDataItem[LEG_FIELD.OBSERVATION_DATES] = convertObservetions(nextPageDataItem);

    return nextPageDataItem;
  },
});
