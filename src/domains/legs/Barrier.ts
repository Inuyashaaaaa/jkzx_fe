/*eslint-disable */
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import {
  ASSET_CLASS_MAP,
  BIG_NUMBER_CONFIG,
  KNOCK_DIRECTION_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  OBSERVATION_TYPE_MAP,
  OB_DAY_FIELD,
  OB_PRICE_FIELD,
  OPTION_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  REBATETYPE_UNIT_MAP,
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
import { ObservationDates } from '@/containers/legFields/ObservationDates';
import { ObservationStep } from '@/containers/legFields/ObservationStep';
import { BarrierShift } from '@/containers/legFields/Shifted';
import { getMoment, getCurDateMoment } from '@/tools';
import { computedShift } from '@/tools/leg';
import { ILeg } from '@/types/leg';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { evaluate } from 'mathjs';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
} from '../../constants/common';
import { Direction } from '../../containers/legFields';
import { Barrier } from '../../containers/legFields/Barrier';
import { BarrierType } from '../../containers/legFields/BarrierType';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { KnockDirection } from '../../containers/legFields/KnockDirection';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { ObservationType } from '../../containers/legFields/ObservationType';
import { OptionType } from '../../containers/legFields/OptionType';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';
import { Rebate } from '../../containers/legFields/Rebate';
import { RebateType } from '../../containers/legFields/RebateType';
import { RebateUnit } from '../../containers/legFields/RebateUnit';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { SpecifiedPrice } from '../../containers/legFields/SpecifiedPrice';
import { Strike } from '../../containers/legFields/Strike';
import { StrikeType } from '../../containers/legFields/StrikeType';
import { Term } from '../../containers/legFields/Term';
import { TradeNumber } from '../../containers/legFields/TradeNumber';
import { UnderlyerInstrumentId } from '../../containers/legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../../containers/legFields/UnderlyerMultiplier';
import { Unit } from '../../containers/legFields/Unit';
import { commonLinkage } from '../common';
import { legPipeLine } from '../_utils';

const asyncLinkageBarrierShift = (
  env,
  changeFieldsParams,
  record,
  tableData,
  setColLoading,
  setLoading,
  setColValue,
  setTableData,
) => {
  const { changedFields } = changeFieldsParams;

  if (Form2.getFieldValue(record[LEG_FIELD.OBSERVATION_TYPE]) === OBSERVATION_TYPE_MAP.DISCRETE) {
    if (
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.OBSERVATION_STEP, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.KNOCK_DIRECTION, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.VOL, changedFields)
    ) {
      const vol = Form2.getFieldValue(record[LEG_FIELD.VOL]);
      if (vol != null) {
        computedShift(record, evaluate(`${vol} / 100`));
      } else {
        computedShift(record, 0.2);
      }
    }
  }

  // 切换离散
  if (Form2.fieldValueIsChange(LEG_FIELD.OBSERVATION_TYPE, changedFields)) {
    if (Form2.getFieldValue(record[LEG_FIELD.OBSERVATION_TYPE]) === OBSERVATION_TYPE_MAP.DISCRETE) {
      computedShift(record);
    } else {
      record[LEG_FIELD.OBSERVATION_STEP] = undefined;
      record[LEG_FIELD.OBSERVATION_DATES] = undefined;
      record[LEG_FIELD.BARRIER_SHIFT] = undefined;
    }
  }
};

export const BarrierLeg: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.BARRIER],
  type: LEG_TYPE_MAP.BARRIER,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: (env, record) => {
    const getOthers = () => {
      const obType = Form2.getFieldValue(record[ObservationType.dataIndex]);

      if (obType === OBSERVATION_TYPE_MAP.DISCRETE) {
        return [ObservationStep, ObservationDates, BarrierShift];
      }

      return [];
    };
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
        ...getOthers(),
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
        ...getOthers(),
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
        ...getOthers(),
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    const curDateMoment = getCurDateMoment();
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EXPIRATION_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.EFFECTIVE_DATE]: curDateMoment.clone(),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.BARRIER_TYPE]: UNIT_ENUM_MAP.PERCENT,
      [LEG_FIELD.REBATE_UNIT]: REBATETYPE_UNIT_MAP.PERCENT,
      [LEG_FIELD.REBATE_TYPE]: REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY,
      [LEG_FIELD.STRIKE]: 100,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.MINIMUM_PREMIUM]: 0,
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
      'tradeNumber',
      'unit',
    ];

    nextPosition.productType = LEG_TYPE_MAP.BARRIER;
    nextPosition.asset = _.omit(dataItem, [
      LEG_FIELD.OBSERVATION_STEP,
      LEG_FIELD.OBSERVATION_DATES,
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

    if (dataItem[LEG_FIELD.OBSERVATION_TYPE] === OBSERVATION_TYPE_MAP.DISCRETE) {
      if (dataItem[LEG_FIELD.OBSERVATION_DATES]) {
        nextPosition.asset.fixingObservations = dataItem[LEG_FIELD.OBSERVATION_DATES].reduce(
          (result, item) => {
            result[item[OB_DAY_FIELD]] = item.price || null;
            return result;
          },
          {},
        );
      }
      if (dataItem[LEG_FIELD.OBSERVATION_STEP]) {
        nextPosition.asset[LEG_FIELD.UP_OBSERVATION_STEP] = dataItem[LEG_FIELD.OBSERVATION_STEP];
      }
    } else {
      nextPosition.asset[LEG_FIELD.BARRIER_SHIFT] = null;
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

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    if (!position.asset.fixingObservations) return {};
    const days = Object.keys(position.asset.fixingObservations);
    if (!days.length) return {};
    return Form2.createFields({
      fixingObservations: undefined,
      [LEG_FIELD.UP_OBSERVATION_STEP]: undefined,
      [LEG_FIELD.OBSERVATION_STEP]: position.asset[LEG_FIELD.UP_OBSERVATION_STEP],
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
    setTableData: (newData: ITableData[]) => void,
  ) => {
    commonLinkage(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData,
    );

    const { changedFields } = changeFieldsParams;

    asyncLinkageBarrierShift(
      env,
      changeFieldsParams,
      record,
      tableData,
      setColLoading,
      setLoading,
      setColValue,
      setTableData,
    );

    if (
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.BARRIER_TYPE, changedFields) ||
      Form2.fieldValueIsChange(LEG_FIELD.STRIKE_TYPE, changedFields)
    ) {
      let barrier = Form2.getFieldValue(record[LEG_FIELD.BARRIER]);
      let strike = Form2.getFieldValue(record[LEG_FIELD.STRIKE]);
      const initialSpot = Form2.getFieldValue(record[LEG_FIELD.INITIAL_SPOT]);
      if (barrier != null && strike != null) {
        if (Form2.getFieldValue(record[LEG_FIELD.BARRIER_TYPE]) === UNIT_ENUM_MAP.PERCENT) {
          barrier = new BigNumber(barrier)
            .multipliedBy(0.01)
            .multipliedBy(initialSpot)
            .toPrecision(BIG_NUMBER_CONFIG.DECIMAL_PLACES);
        }
        if (Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]) === UNIT_ENUM_MAP.PERCENT) {
          strike = new BigNumber(strike)
            .multipliedBy(0.01)
            .multipliedBy(initialSpot)
            .toPrecision(BIG_NUMBER_CONFIG.DECIMAL_PLACES);
        }
        record[LEG_FIELD.OPTION_TYPE] =
          barrier > strike
            ? Form2.createField(OPTION_TYPE_MAP.CALL)
            : Form2.createField(OPTION_TYPE_MAP.PUT);

        const prevKnockDirection = Form2.getFieldValue(record[LEG_FIELD.KNOCK_DIRECTION]);
        record[LEG_FIELD.KNOCK_DIRECTION] =
          barrier > strike
            ? Form2.createField(KNOCK_DIRECTION_MAP.UP)
            : Form2.createField(KNOCK_DIRECTION_MAP.DOWN);

        // 联动依赖联动
        if (prevKnockDirection !== Form2.getFieldValue(record[LEG_FIELD.KNOCK_DIRECTION])) {
          asyncLinkageBarrierShift(
            env,
            changeFieldsParams,
            record,
            tableData,
            setColLoading,
            setLoading,
            setColValue,
            setTableData,
          );
        }
      }
    }
  },
});
