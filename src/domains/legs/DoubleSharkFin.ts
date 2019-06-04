import { getMoment } from '@/tools';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  UNIT_ENUM_MAP,
  REBATETYPE_UNIT_MAP,
  REBATETYPE_TYPE_MAP,
  KNOCK_DIRECTION_MAP,
  OPTION_TYPE_MAP,
  OBSERVATION_TYPE_MAP,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  GENERAL_COMPUTED_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
  TOTAL_EDITING_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
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
import { AlUnwindNotionalAmount } from '../legFields/infos/AlUnwindNotionalAmount';
import { InitialNotionalAmount } from '../legFields/infos/InitialNotionalAmount';
import { LcmEventType } from '../legFields/infos/LcmEventType';
import { PositionId } from '../legFields/infos/PositionId';
import { InitialSpot } from '../legFields/InitialSpot';
import { IsAnnual } from '../legFields/IsAnnual';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { NotionalAmount } from '../legFields/NotionalAmount';
import { NotionalAmountType } from '../legFields/NotionalAmountType';
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
import { commonLinkage } from '../common';
import { Rebate } from '../legFields/Rebate';
import { ObservationType } from '../legFields/ObservationType';
import { KnockDirection } from '../legFields/KnockDirection';
import { RebateUnit } from '../legFields/RebateUnit';
import { RebateType } from '../legFields/RebateType';
import { BarrierType } from '../legFields/BarrierType';
import { Barrier } from '../legFields/Barrier';
import { LowStrike } from '../legFields/LowStrike';
import { HighStrike } from '../legFields/HighStrike';
import { LowParticipationRate } from '../legFields/LowParticipationRate';
import { HighParticipationRate } from '../legFields/HighParticipationRate';
import { LowRebate } from '../legFields/LowRebate';
import { HighRebate } from '../legFields/HighRebate';
import { LowBarrier } from '../legFields/LowBarrier';
import { HighBarrier } from '../legFields/HighBarrier';
import { Unit } from '../legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../legFields/TradeNumber';

export const DoubleSharkFin: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.DOUBLE_SHARK_FIN],
  type: LEG_TYPE_MAP.DOUBLE_SHARK_FIN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        NotionalAmountType,
        InitialSpot,
        UnderlyerMultiplier,
        EffectiveDate,
        UnderlyerInstrumentId,
        StrikeType,
        LowStrike,
        HighStrike,
        Term,
        LowParticipationRate,
        HighParticipationRate,
        NotionalAmount,
        RebateType,
        LowRebate,
        HighRebate,
        BarrierType,
        LowBarrier,
        HighBarrier,
        ObservationType,
        ExpirationDate,
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
        LowParticipationRate,
        HighParticipationRate,
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        StrikeType,
        LowStrike,
        HighStrike,
        RebateType,
        LowRebate,
        HighRebate,
        BarrierType,
        LowBarrier,
        HighBarrier,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        ObservationType,
        Unit,
        TradeNumber,
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
        LowParticipationRate,
        HighParticipationRate,
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        StrikeType,
        LowStrike,
        HighStrike,
        RebateType,
        LowRebate,
        HighRebate,
        BarrierType,
        LowBarrier,
        HighBarrier,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        ObservationType,
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
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
          }
        : {
            [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
          }),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    });
  },
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};
    const COMPUTED_FIELDS = [
      'numOfOptions',
      'strikePercent',
      'numOfUnderlyerContracts',
      'premiumPerUnit',
      'trigger',
      'notional',
      'premiumPercent',
      'unit',
      'tradeNumber',
    ];

    nextPosition.productType = LEG_TYPE_MAP.DOUBLE_SHARK_FIN;
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

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {},
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

    if (
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE, changedFields)
    ) {
      const barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
      const strike = Form2.getFieldValue(record[LEG_FIELD.STRIKE]);
      if (barrier != null && strike != null) {
        record[LEG_FIELD.KNOCK_DIRECTION] =
          barrier > strike
            ? Form2.createField(KNOCK_DIRECTION_MAP.UP)
            : Form2.createField(KNOCK_DIRECTION_MAP.DOWN);
      }
    }

    if (
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE, changedFields)
    ) {
      const barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
      const strike = Form2.getFieldValue(record[LEG_FIELD.STRIKE]);
      if (barrier != null && strike != null) {
        record[LEG_FIELD.OPTION_TYPE] =
          barrier > strike
            ? Form2.createField(OPTION_TYPE_MAP.CALL)
            : Form2.createField(OPTION_TYPE_MAP.PUT);
      }
    }

    if (Form2.fieldValueIsChange(LEG_FIELD.OBSERVATION_TYPE, changedFields)) {
      const observationType = Form2.getFieldValue(changedFields[LEG_FIELD.OBSERVATION_TYPE]);
      if (observationType === OBSERVATION_TYPE_MAP.TERMINAL) {
        record[LEG_FIELD.REBATE_TYPE] = Form2.createField(REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY);
      }
    }
  },
});
