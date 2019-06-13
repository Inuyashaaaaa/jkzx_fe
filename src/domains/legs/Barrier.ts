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
  BIG_NUMBER_CONFIG,
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
import { Direction } from '../../containers/legFields';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { AlUnwindNotionalAmount } from '../../containers/legFields/infos/AlUnwindNotionalAmount';
import { InitialNotionalAmount } from '../../containers/legFields/infos/InitialNotionalAmount';
import { LcmEventType } from '../../containers/legFields/infos/LcmEventType';
import { PositionId } from '../../containers/legFields/infos/PositionId';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { OptionType } from '../../containers/legFields/OptionType';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { SpecifiedPrice } from '../../containers/legFields/SpecifiedPrice';
import { Strike } from '../../containers/legFields/Strike';
import { StrikeType } from '../../containers/legFields/StrikeType';
import { Term } from '../../containers/legFields/Term';
import { UnderlyerInstrumentId } from '../../containers/legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../../containers/legFields/UnderlyerMultiplier';
import { commonLinkage } from '../common';
import { Rebate } from '../../containers/legFields/Rebate';
import { ObservationType } from '../../containers/legFields/ObservationType';
import { KnockDirection } from '../../containers/legFields/KnockDirection';
import { RebateUnit } from '../../containers/legFields/RebateUnit';
import { RebateType } from '../../containers/legFields/RebateType';
import { BarrierType } from '../../containers/legFields/BarrierType';
import { Barrier } from '../../containers/legFields/Barrier';
import BigNumber from 'bignumber.js';
import { Unit } from '../../containers/legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../../containers/legFields/TradeNumber';
import { AlreadyBarrier } from '@/containers/legFields/AlreadyBarrier';
import { ObservationStep } from '@/containers/legFields/ObservationStep';
import ObserveModalInput from '@/containers/ObserveModalInput';
import { ObservationDates } from '@/containers/legFields/ObservationDates';
import { Shifted } from '@/containers/legFields/Shifted';

export const BarrierLeg: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.BARRIER],
  type: LEG_TYPE_MAP.BARRIER,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: (env, record) => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        NotionalAmountType,
        InitialSpot,
        StrikeType,
        EffectiveDate,
        UnderlyerMultiplier,
        UnderlyerInstrumentId,
        OptionType,
        Strike,
        Barrier,
        Rebate,
        Term,
        ExpirationDate,
        ParticipationRate,
        NotionalAmount,
        ObservationType,
        KnockDirection,
        OptionType,
        RebateUnit,
        BarrierType,
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
        StrikeType,
        Strike,
        KnockDirection,
        SpecifiedPrice,
        Term,
        SettlementDate,
        DaysInYear,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        EffectiveDate,
        ExpirationDate,
        RebateUnit,
        RebateType,
        Rebate,
        BarrierType,
        Barrier,
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
      const obType = Form2.getFieldValue(record[ObservationType.dataIndex]);
      const others =
        obType === OBSERVATION_TYPE_MAP.DISCRETE
          ? [ObservationStep, ObservationDates, Shifted]
          : [];

      return [
        IsAnnual,
        Direction,
        OptionType,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        StrikeType,
        Strike,
        KnockDirection,
        SpecifiedPrice,
        Term,
        SettlementDate,
        DaysInYear,
        ParticipationRate,
        NotionalAmountType,
        NotionalAmount,
        EffectiveDate,
        ExpirationDate,
        RebateUnit,
        RebateType,
        Rebate,
        BarrierType,
        Barrier,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        ObservationType,
        Unit,
        TradeNumber,
        ...others,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
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

    nextPosition.productType = LEG_TYPE_MAP.BARRIER;
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

    if (Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields)) {
      const barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
      record[LEG_FIELD.SHIFTED] = Form2.createField(barrier);
    }

    if (
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER_TYPE, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE_TYPE, changedFields)
    ) {
      let barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
      let strike = Form2.getFieldValue(record[LEG_FIELD.STRIKE]);
      if (barrier != null && strike != null) {
        if (Form2.getFieldValue(record[LEG_FIELD.BARRIER_TYPE]) === UNIT_ENUM_MAP.PERCENT) {
          barrier = new BigNumber(barrier)
            .multipliedBy(0.01)
            .toPrecision(BIG_NUMBER_CONFIG.DECIMAL_PLACES);
        }
        if (Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]) === UNIT_ENUM_MAP.PERCENT) {
          strike = new BigNumber(strike)
            .multipliedBy(0.01)
            .toPrecision(BIG_NUMBER_CONFIG.DECIMAL_PLACES);
        }
        record[LEG_FIELD.OPTION_TYPE] =
          barrier > strike
            ? Form2.createField(OPTION_TYPE_MAP.CALL)
            : Form2.createField(OPTION_TYPE_MAP.PUT);

        record[LEG_FIELD.KNOCK_DIRECTION] =
          barrier > strike
            ? Form2.createField(KNOCK_DIRECTION_MAP.UP)
            : Form2.createField(KNOCK_DIRECTION_MAP.DOWN);
      }
    }
  },
});
