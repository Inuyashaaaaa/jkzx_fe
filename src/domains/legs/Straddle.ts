import { getMoment } from '@/tools';
import {
  ASSET_CLASS_MAP,
  EXERCISETYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  UNIT_ENUM_MAP,
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
import { StrikeType } from '../legFields/StrikeType';
import { LowStrike } from '../legFields/LowStrike';
import { HighStrike } from '../legFields/HighStrike';
import { PositionId } from '../legFields/infos/PositionId';
import { InitialSpot } from '../legFields/InitialSpot';
import { IsAnnual } from '../legFields/IsAnnual';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { NotionalAmount } from '../legFields/NotionalAmount';
import { NotionalAmountType } from '../legFields/NotionalAmountType';
import { LowParticipationRate } from '../legFields/LowParticipationRate';
import { HighParticipationRate } from '../legFields/HighParticipationRate';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Strike } from '../legFields/Strike';
import { HighBarrier } from '../legFields/HighBarrier';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';
import { commonLinkage } from '../common';
import { PaymentType } from '../legFields/PaymentType';
import { Payment } from '../legFields/Payment';
import { BarrierType } from '../legFields/BarrierType';
import { LowBarrier } from '../legFields/LowBarrier';
import { Unit } from '../legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../legFields/TradeNumber';

export const Straddle: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.STRADDLE],
  type: LEG_TYPE_MAP.STRADDLE,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        IsAnnual,
        Direction,
        SpecifiedPrice,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        EffectiveDate,
        ExpirationDate,
        Term,
        DaysInYear,
        NotionalAmountType,
        NotionalAmount,
        EffectiveDate,
        StrikeType,
        LowStrike,
        HighStrike,
        LowParticipationRate,
        HighParticipationRate,
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
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        StrikeType,
        LowStrike,
        HighStrike,
        LowParticipationRate,
        HighParticipationRate,
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
        NotionalAmount,
        NotionalAmountType,
        EffectiveDate,
        ExpirationDate,
        PremiumType,
        Premium,
        FrontPremium,
        MinimumPremium,
        StrikeType,
        LowStrike,
        HighStrike,
        LowParticipationRate,
        HighParticipationRate,
        Unit,
        TradeNumber,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    return Form2.createFields({
      [IsAnnual.dataIndex]: true,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.STRIKE_TYPE]: STRIKE_TYPES_MAP.PERCENT,
      [LEG_FIELD.LOW_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.HIGH_PARTICIPATION_RATE]: 100,
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      ...(env === LEG_ENV.PRICING
        ? {
            [TRADESCOLDEFS_LEG_FIELD_MAP.Q]: 0,
            [LEG_FIELD.TERM]: DEFAULT_TERM,
          }
        : undefined),
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
    });
  },
  getPosition: (env: string, dataItem: any, baseInfo: any) => {
    const nextPosition: any = {};
    const COMPUTED_FIELDS = [LEG_FIELD.UNIT, LEG_FIELD.TRADE_NUMBER];

    nextPosition.productType = LEG_TYPE_MAP.STRADDLE;
    nextPosition.lcmEventType = 'OPEN';
    nextPosition.positionAccountCode = 'empty';
    nextPosition.positionAccountName = 'empty';
    nextPosition.counterPartyAccountCode = 'empty';
    nextPosition.counterPartyAccountName = 'empty';
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
  },
});
