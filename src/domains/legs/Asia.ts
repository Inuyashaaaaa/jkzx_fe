import {
  ASSET_CLASS_MAP,
  FREQUENCY_TYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  OB_DAY_FIELD,
  OB_PRICE_FIELD,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  GENERAL_COMPUTED_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { getMoment } from '@/tools';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import { ILeg } from '@/types/leg';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../../constants/common';
import { Direction } from '../legFields';
import { DaysInYear } from '../legFields/DaysInYear';
import { EffectiveDate } from '../legFields/EffectiveDate';
import { ExpirationDate } from '../legFields/ExpirationDate';
import { FrontPremium } from '../legFields/FrontPremium';
import { InitialSpot } from '../legFields/InitialSpot';
import { IsAnnual } from '../legFields/IsAnnual';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { NotionalAmount } from '../legFields/NotionalAmount';
import { NotionalAmountType } from '../legFields/NotionalAmountType';
import { ObservationDates } from '../legFields/ObservationDates';
import { ObservationStep } from '../legFields/ObservationStep';
import { ObserveEndDay } from '../legFields/ObserveEndDay';
import { ObserveStartDay } from '../legFields/ObserveStartDay';
import { OptionType } from '../legFields/OptionType';
import { ParticipationRate } from '../legFields/ParticipationRate';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Strike } from '../legFields/Strike';
import { StrikeType } from '../legFields/StrikeType';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';
import { Unit } from '../legFields/Unit';
import { commonLinkage } from '../common';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../legFields/TradeNumber';

export const Asia: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.ASIAN],
  type: LEG_TYPE_MAP.ASIAN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        EffectiveDate,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
        StrikeType,
        Strike,
        Term,
        ExpirationDate,
        NotionalAmountType,
        NotionalAmount,
        ObservationStep,
        ObserveStartDay,
        ObserveEndDay,
        ObservationDates,
        TradeNumber,
        ...TOTAL_TRADESCOL_FIELDS,
        ...GENERAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
        StrikeType,
        Strike,
        SpecifiedPrice,
        Term,
        EffectiveDate,
        ExpirationDate,
        SettlementDate,
        DaysInYear,
        PremiumType,
        Premium,
        MinimumPremium,
        FrontPremium,
        NotionalAmountType,
        NotionalAmount,
        ObserveStartDay,
        ObserveEndDay,
        ObservationStep,
        ObservationDates,
        Unit,
        TradeNumber,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        IsAnnual,
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
        StrikeType,
        Strike,
        SpecifiedPrice,
        Term,
        EffectiveDate,
        ExpirationDate,
        SettlementDate,
        DaysInYear,
        PremiumType,
        Premium,
        MinimumPremium,
        FrontPremium,
        NotionalAmountType,
        NotionalAmount,
        ObserveStartDay,
        ObserveEndDay,
        ObservationStep,
        ObservationDates,
        Unit,
        TradeNumber,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [ParticipationRate.dataIndex]: 100,
      [StrikeType.dataIndex]: STRIKE_TYPES_MAP.PERCENT,
      [Strike.dataIndex]: 100,
      [SpecifiedPrice.dataIndex]: SPECIFIED_PRICE_MAP.CLOSE,
      [Term.dataIndex]: DEFAULT_TERM,
      [EffectiveDate.dataIndex]: moment(),
      [ExpirationDate.dataIndex]: moment(),
      [SettlementDate.dataIndex]: moment().add(DEFAULT_TERM, 'day'),
      [DaysInYear.dataIndex]: DEFAULT_DAYS_IN_YEAR,
      [PremiumType.dataIndex]: PREMIUM_TYPE_MAP.PERCENT,
      [NotionalAmountType.dataIndex]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [ObserveStartDay.dataIndex]: moment(),
      [ObserveEndDay.dataIndex]: moment().add(DEFAULT_TERM, 'day'),
      [ObservationStep.dataIndex]: FREQUENCY_TYPE_MAP['1D'],
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : null),
    });
  },
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};

    const DATE_FIELDS = [
      ObserveEndDay.dataIndex,
      ObserveEndDay.dataIndex,
      EffectiveDate.dataIndex,
      ExpirationDate.dataIndex,
      SettlementDate.dataIndex,
    ];

    dataItem = _.mapValues(dataItem, (val, key) => {
      if (DATE_FIELDS.indexOf(key) !== -1) {
        return moment.isMoment(val) ? val.format('YYYY-MM-DD') : val;
      }
      return val;
    });

    nextPosition.productType = LEG_TYPE_MAP.ASIAN;

    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
      LEG_FIELD.OBSERVE_START_DAY,
      LEG_FIELD.OBSERVE_END_DAY,
      LEG_FIELD.OBSERVATION_DATES,
      LEG_FIELD.UNIT,
      LEG_FIELD.TRADE_NUMBER,
      ...(dataItem[LEG_FIELD.IS_ANNUAL]
        ? []
        : [
            LEG_FIELD.TERM,
            LEG_FIELD.DAYS_IN_YEAR,
            MinimumPremium.dataIndex,
            FrontPremium.dataIndex,
          ]),
    ]);

    if (dataItem[LEG_FIELD.OBSERVATION_DATES]) {
      nextPosition.asset.fixingWeights = dataItem[LEG_FIELD.OBSERVATION_DATES].reduce(
        (result, item) => {
          result[getMoment(item[OB_DAY_FIELD]).format('YYYY-MM-DD')] = item.weight;
          return result;
        },
        {}
      );
    }

    if (dataItem[LEG_FIELD.OBSERVATION_DATES]) {
      nextPosition.asset.fixingObservations = dataItem[LEG_FIELD.OBSERVATION_DATES].reduce(
        (result, item) => {
          result[getMoment(item[OB_DAY_FIELD]).format('YYYY-MM-DD')] = item.price || null;
          return result;
        },
        {}
      );
    }

    nextPosition.asset.settlementDate =
      env === LEG_ENV.PRICING
        ? nextPosition.asset.expirationDate
        : nextPosition.asset.settlementDate;

    nextPosition.asset.annualized = dataItem[LEG_FIELD.IS_ANNUAL] ? true : false;

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    const days = Object.keys(position.asset.fixingWeights);
    if (!days.length) return {};

    const odays = Object.keys(position.asset.fixingObservations);

    return Form2.createFields({
      [LEG_FIELD.OBSERVE_START_DAY]: moment(days[0]),
      [LEG_FIELD.OBSERVE_END_DAY]: moment(days[days.length - 1]),
      [LEG_FIELD.OBSERVATION_DATES]: !odays.length
        ? []
        : days.map(day => {
            return {
              [OB_DAY_FIELD]: day,
              weight: position.asset.fixingWeights && position.asset.fixingWeights[day],
              [OB_PRICE_FIELD]:
                position.asset.fixingObservations && position.asset.fixingObservations[day],
            };
          }),
    });
  },
  onDataChange: (
    env: string,
    changeFieldsParams: ITableTriggerCellFieldsChangeParams,
    record: ITableData,
    tableData: ITableData[],
    setColLoading: (colId: string, loading: boolean) => void,
    setLoading: (rowId: string, colId: string, loading: boolean) => void,
    setColValue: (colId: string, newVal: IFormField) => void,
    setTableData: (newData: ITableData[]) => void
  ) => {
    commonLinkage(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData
    );
    const { changedFields } = changeFieldsParams;
    if (Form2.fieldValueIsChange(LEG_FIELD.EXPIRATION_DATE, changedFields)) {
      record[LEG_FIELD.OBSERVE_END_DAY] = Form2.createField(
        getMoment(Form2.getFieldValue(record[LEG_FIELD.EXPIRATION_DATE])).clone()
      );
    }

    if (Form2.fieldValueIsChange(LEG_FIELD.EFFECTIVE_DATE, changedFields)) {
      record[LEG_FIELD.OBSERVE_START_DAY] = Form2.createField(
        getMoment(Form2.getFieldValue(record[LEG_FIELD.EFFECTIVE_DATE])).clone()
      );
    }
  },
});
