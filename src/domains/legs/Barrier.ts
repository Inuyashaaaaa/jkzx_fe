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
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  TOTAL_COMPUTED_FIELDS,
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
import { commonLinkage } from '../tools';
import { Rebate } from '../legFields/Rebate';
import { ObservationType } from '../legFields/ObservationType';
import { KnockDirection } from '../legFields/KnockDirection';
import { RebateUnit } from '../legFields/RebateUnit';
import { RebateType } from '../legFields/RebateType';
import { BarrierType } from '../legFields/BarrierType';
import { Barrier } from '../legFields/Barrier';
import BigNumber from 'bignumber.js';
import { Unit } from '../legFields/Unit';

export const BarrierLeg: ILeg = {
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.BARRIER],
  type: LEG_TYPE_MAP.BARRIER,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
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
        ...TOTAL_TRADESCOL_FIELDS,
        ...TOTAL_COMPUTED_FIELDS,
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
};
