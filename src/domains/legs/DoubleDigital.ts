import _ from 'lodash';
import moment from 'moment';
import { getMoment, getCurDateMoment } from '@/tools';
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
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
  STRIKE_TYPES_MAP,
  PAYMENT_TYPE_MAP,
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
import { Direction } from '../../containers/legFields';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { IsAnnual } from '../../containers/legFields/IsAnnual';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { OptionType } from '../../containers/legFields/OptionType';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';

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
import { LowStrike } from '../../containers/legFields/LowStrike';
import { HighStrike } from '../../containers/legFields/HighStrike';
import { LowParticipationRate } from '../../containers/legFields/LowParticipationRate';
import { HighParticipationRate } from '../../containers/legFields/HighParticipationRate';
import { LowRebate } from '../../containers/legFields/LowRebate';
import { HighRebate } from '../../containers/legFields/HighRebate';
import { LowBarrier } from '../../containers/legFields/LowBarrier';
import { HighBarrier } from '../../containers/legFields/HighBarrier';
import { PaymentType } from '../../containers/legFields/PaymentType';
import { HighPayment } from '../../containers/legFields/HighPayment';
import { LowPayment } from '../../containers/legFields/LowPayment';
import { Unit } from '../../containers/legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../../containers/legFields/TradeNumber';

export const DoubleDigital: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.DOUBLE_DIGITAL],
  type: LEG_TYPE_MAP.DOUBLE_DIGITAL,
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
        OptionType,
        StrikeType,
        LowStrike,
        HighStrike,
        Term,
        NotionalAmount,
        ExpirationDate,
        ParticipationRate,
        PaymentType,
        LowPayment,
        HighPayment,
        TradeNumber,
        ...TOTAL_TRADESCOL_FIELDS,
        ...GENERAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        IsAnnual,
        Direction,
        EffectiveDate,
        ExpirationDate,
        FrontPremium,
        HighPayment,
        HighStrike,
        InitialSpot,
        LowPayment,
        LowStrike,
        MinimumPremium,
        NotionalAmount,
        NotionalAmountType,
        OptionType,
        ParticipationRate,
        PaymentType,
        Premium,
        PremiumType,
        SettlementDate,
        SpecifiedPrice,
        StrikeType,
        Term,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        Unit,
        DaysInYear,
        TradeNumber,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        IsAnnual,
        Direction,
        EffectiveDate,
        ExpirationDate,
        FrontPremium,
        HighPayment,
        HighStrike,
        InitialSpot,
        LowPayment,
        LowStrike,
        MinimumPremium,
        NotionalAmount,
        NotionalAmountType,
        OptionType,
        ParticipationRate,
        PaymentType,
        Premium,
        PremiumType,
        SettlementDate,
        SpecifiedPrice,
        StrikeType,
        Term,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        Unit,
        DaysInYear,
        TradeNumber,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    const curDateMoment = getCurDateMoment();
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EFFECTIVE_DATE]: curDateMoment.clone(),
      [LEG_FIELD.EXPIRATION_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PAYMENT_TYPE]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.MINIMUM_PREMIUM]: 0,
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

    nextPosition.productType = LEG_TYPE_MAP.DOUBLE_DIGITAL;
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

    nextPosition.asset.annualized = !!dataItem[LEG_FIELD.IS_ANNUAL];

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
  },
});
