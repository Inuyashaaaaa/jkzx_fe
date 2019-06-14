import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import {
  ASSET_CLASS_MAP,
  FREQUENCY_TYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  OB_DAY_FIELD,
  OB_PRICE_FIELD,
  PAYMENT_TYPE_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  GENERAL_COMPUTED_FIELDS,
  LEG_ENV,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { getMoment } from '@/tools';
import { ILeg } from '@/types/leg';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
} from '../../constants/common';
import { Direction } from '../../containers/legFields';
import { BarrierType } from '../../containers/legFields/BarrierType';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { Earnings } from '../../containers/legFields/Earnings';
import { EarningsType } from '../../containers/legFields/EarningsType';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { HighBarrier } from '../../containers/legFields/HighBarrier';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { LowBarrier } from '../../containers/legFields/LowBarrier';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { ObservationDates } from '../../containers/legFields/ObservationDates';
import { ObservationStep } from '../../containers/legFields/ObservationStep';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { SpecifiedPrice } from '../../containers/legFields/SpecifiedPrice';
import { Term } from '../../containers/legFields/Term';
import { TradeNumber } from '../../containers/legFields/TradeNumber';
import { UnderlyerInstrumentId } from '../../containers/legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../../containers/legFields/UnderlyerMultiplier';
import { Unit } from '../../containers/legFields/Unit';
import { commonLinkage } from '../common';
import { legPipeLine } from '../_utils';

export const RangeAccruals: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.RANGE_ACCRUALS],
  type: LEG_TYPE_MAP.RANGE_ACCRUALS,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        InitialSpot,
        Term,
        DaysInYear,
        ParticipationRate,
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        EarningsType,
        Earnings,
        BarrierType,
        HighBarrier,
        LowBarrier,
        ObservationDates,
        ObservationStep,
        TradeNumber,
        ...TOTAL_TRADESCOL_FIELDS,
        ...GENERAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
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
        EarningsType,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        Earnings,
        BarrierType,
        HighBarrier,
        LowBarrier,
        ObservationDates,
        Unit,
        TradeNumber,
        // ObservationStep,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        IsAnnual,
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
        EarningsType,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        Earnings,
        BarrierType,
        HighBarrier,
        LowBarrier,
        ObservationDates,
        ObservationStep,
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
      // expirationTime: '15:00:00',
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [ObservationStep.dataIndex]: FREQUENCY_TYPE_MAP['1D'],
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
    });
  },
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};
    const COMPUTED_FIELDS = [
      ObservationStep.dataIndex,
      LEG_FIELD.OBSERVATION_DATES,
      LEG_FIELD.UNIT,
      LEG_FIELD.TRADE_NUMBER,
    ];

    nextPosition.productType = LEG_TYPE_MAP.RANGE_ACCRUALS;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
      ...COMPUTED_FIELDS,
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
      nextPosition.asset.fixingObservations = dataItem[LEG_FIELD.OBSERVATION_DATES].reduce(
        (result, item) => {
          result[item[OB_DAY_FIELD]] = item.price || null;
          return result;
        },
        {}
      );
    }

    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate &&
      getMoment(nextPosition.asset.effectiveDate).format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate &&
      getMoment(nextPosition.asset.expirationDate).format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate &&
      getMoment(nextPosition.asset.settlementDate).format('YYYY-MM-DD');

    nextPosition.asset.annualized = dataItem[LEG_FIELD.IS_ANNUAL] ? true : false;
    nextPosition.asset[LEG_FIELD.PAYMENT] = nextPosition.asset[LEG_FIELD.EARNINGS];
    nextPosition.asset[LEG_FIELD.PAYMENT_TYPE] = nextPosition.asset[LEG_FIELD.EARNINGS_TYPE];
    delete nextPosition.asset[LEG_FIELD.EARNINGS];
    delete nextPosition.asset[LEG_FIELD.EARNINGS_TYPE];

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    if (!position.asset.fixingObservations) return {};
    const days = Object.keys(position.asset.fixingObservations);
    if (!days.length) return {};

    const earnings = position.asset[LEG_FIELD.PAYMENT];
    const earningsType = position.asset[LEG_FIELD.PAYMENT_TYPE];
    delete position.asset[LEG_FIELD.PAYMENT];
    delete position.asset[LEG_FIELD.PAYMENT_TYPE];

    return Form2.createFields({
      [LEG_FIELD.EARNINGS]: earnings,
      [LEG_FIELD.EARNINGS_TYPE]: earningsType,
      [LEG_FIELD.OBSERVATION_DATES]: days.map(day => {
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
  },
});
