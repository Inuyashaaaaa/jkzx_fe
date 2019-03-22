import _ from 'lodash';
import moment from 'moment';
import {
  ASSET_CLASS_MAP,
  FREQUENCY_TYPE_MAP,
  LEG_FIELD,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PRODUCT_TYPE_ZHCN_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../common';
import {
  Direction,
  EffectiveDate,
  ExpirationDate,
  Frequency,
  InitialSpot,
  NotionalAmount,
  NotionalAmountType,
  ObservationDates,
  ObserveEndDay,
  ObserveStartDay,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';
import { DEFAULT_TERM, ILegType } from './index';

export const AsiaUnAnnual: ILegType = pipeLeg({
  name: PRODUCT_TYPE_ZHCN_MAP[LEG_TYPE_MAP.ASIAN_UNANNUAL],
  type: LEG_TYPE_MAP.ASIAN_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  columnDefs: [
    Direction,
    OptionType,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    ParticipationRate,
    StrikeType,
    Strike,
    SpecifiedPrice,
    EffectiveDate,
    ExpirationDate,
    SettlementDate,
    PremiumType,
    Premium,
    NotionalAmountType,
    NotionalAmount,
    ObserveStartDay,
    ObserveEndDay,
    Frequency,
    ObservationDates,
  ],
  getDefault: (nextDataSourceItem, isPricing) => {
    return {
      ...nextDataSourceItem,
      [ParticipationRate.field]: 100,
      [StrikeType.field]: STRIKE_TYPES_MAP.PERCENT,
      [Strike.field]: 100,
      [SpecifiedPrice.field]: SPECIFIED_PRICE_MAP.CLOSE,
      [EffectiveDate.field]: moment(),
      [ExpirationDate.field]: moment(),
      [SettlementDate.field]: moment().add(DEFAULT_TERM, 'day'),
      [PremiumType.field]: PREMIUM_TYPE_MAP.PERCENT,
      [NotionalAmountType.field]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [ObserveStartDay.field]: moment(),
      [ObserveEndDay.field]: moment().add(DEFAULT_TERM, 'day'),
      [Frequency.field]: FREQUENCY_TYPE_MAP['1D'],
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
    };
  },
  getPosition: (nextPosition, dataSourceItem, tableDataSource, isPricing) => {
    nextPosition.productType = LEG_TYPE_MAP.ASIAN;
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    const DATE_FIELDS = [
      ObserveEndDay.field,
      ObserveEndDay.field,
      EffectiveDate.field,
      ExpirationDate.field,
      SettlementDate.field,
    ];

    dataSourceItem = _.mapValues(dataSourceItem, (val, key) => {
      if (DATE_FIELDS.indexOf(key) !== -1) {
        return moment.isMoment(val) ? val.format('YYYY-MM-DD') : val;
      }
      return val;
    });

    nextPosition.asset = _.omit(dataSourceItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.OBSERVE_START_DAY,
      LEG_FIELD.OBSERVE_END_DAY,
      LEG_FIELD.OBSERVATION_DATES,
    ]);

    nextPosition.asset.fixingWeights = dataSourceItem[LEG_FIELD.OBSERVATION_DATES].reduce(
      (result, item) => {
        result[item.day] = item.weight;
        return result;
      },
      {}
    );

    nextPosition.asset.fixingObservations = dataSourceItem[LEG_FIELD.OBSERVATION_DATES].reduce(
      (result, item) => {
        result[item.day] = item.price || null;
        return result;
      },
      {}
    );

    nextPosition.asset.settlementDate = isPricing
      ? nextPosition.asset.expirationDate
      : nextPosition.asset.settlementDate && nextPosition.asset.settlementDate;

    nextPosition.asset.annualized = false;

    return nextPosition;
  },
  getPageData: (nextDataSourceItem, position) => {
    const days = Object.keys(nextDataSourceItem.fixingWeights);
    if (!days.length) return nextDataSourceItem;
    nextDataSourceItem[LEG_FIELD.OBSERVE_START_DAY] = moment(days[0]);
    nextDataSourceItem[LEG_FIELD.OBSERVE_END_DAY] = moment(days[days.length - 1]);
    nextDataSourceItem[LEG_FIELD.OBSERVATION_DATES] = days.map(day => {
      return {
        day,
        weight: nextDataSourceItem.fixingWeights[day],
        price: nextDataSourceItem.fixingObservations[day],
      };
    });

    return nextDataSourceItem;
  },
});
