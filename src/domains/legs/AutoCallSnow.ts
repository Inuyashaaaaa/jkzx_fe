import {
  ASSET_CLASS_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  FREQUENCY_TYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  OB_DAY_FIELD,
  PAYMENT_TYPE_MAP,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import {
  DEFAULT_DAYS_IN_YEAR,
  DEFAULT_TERM,
  TRADESCOLDEFS_LEG_FIELD_MAP,
} from '@/constants/global';
import {
  LEG_ENV,
  TOTAL_COMPUTED_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/containers/type';
import { ILeg } from '@/types/leg';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
} from '../../constants/common';
import { Direction } from '../legFields';
import { AutoCallStrike } from '../legFields/AutoCallStrike';
import { AutoCallStrikeUnit } from '../legFields/AutoCallStrikeUnit';
import { CouponEarnings } from '../legFields/CouponEarnings';
import { DaysInYear } from '../legFields/DaysInYear';
import { EffectiveDate } from '../legFields/EffectiveDate';
import { ExpirationDate } from '../legFields/ExpirationDate';
import { ExpireNoBarrierObserveDay } from '../legFields/ExpireNoBarrierObserveDay';
import { ExpireNoBarrierPremium } from '../legFields/ExpireNoBarrierPremium';
import { ExpireNoBarrierPremiumType } from '../legFields/ExpireNoBarrierPremiumType';
import { FrontPremium } from '../legFields/FrontPremium';
import { InitialSpot } from '../legFields/InitialSpot';
import { KnockDirection } from '../legFields/KnockDirection';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { NotionalAmount } from '../legFields/NotionalAmount';
import { NotionalAmountType } from '../legFields/NotionalAmountType';
import { ParticipationRate } from '../legFields/ParticipationRate';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Step } from '../legFields/Step';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';
import { UpBarrier } from '../legFields/UpBarrier';
import { UpBarrierType } from '../legFields/UpBarrierType';
import { UpObservationStep } from '../legFields/UpObservationStep';
import { commonLinkage } from '../common';
import { getMoment } from '@/tools';
import { Unit } from '../legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../legFields/TradeNumber';

export const AutoCallSnow: ILeg = legPipeLine({
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.AUTOCALL],
  type: LEG_TYPE_MAP.AUTOCALL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        Direction,
        UnderlyerInstrumentId,
        EffectiveDate,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
        Term,
        ExpirationDate,
        NotionalAmountType,
        NotionalAmount,
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        Step,
        CouponEarnings,
        ExpireNoBarrierPremiumType,
        ExpireNoBarrierPremium,
        AutoCallStrikeUnit,
        AutoCallStrike,
        ExpireNoBarrierObserveDay,
        UpObservationStep,
        TradeNumber,
        ...TOTAL_TRADESCOL_FIELDS,
        ...TOTAL_COMPUTED_FIELDS,
      ];
    }
    if (env === LEG_ENV.EDITING) {
      return [
        SpecifiedPrice,
        Direction,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
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
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        Step,
        CouponEarnings,
        ExpireNoBarrierPremiumType,
        ExpireNoBarrierPremium,
        AutoCallStrikeUnit,
        AutoCallStrike,
        ExpireNoBarrierObserveDay,
        UpObservationStep,
        Unit,
        TradeNumber,
        ...TOTAL_EDITING_FIELDS,
      ];
    }
    if (env === LEG_ENV.BOOKING) {
      return [
        SpecifiedPrice,
        Direction,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
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
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        Step,
        CouponEarnings,
        ExpireNoBarrierPremiumType,
        ExpireNoBarrierPremium,
        AutoCallStrikeUnit,
        AutoCallStrike,
        ExpireNoBarrierObserveDay,
        UpObservationStep,
        Unit,
        TradeNumber,
      ];
    }
    throw new Error('getColumns get unknow leg env!');
  },
  getDefaultData: env => {
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [LEG_FIELD.IS_ANNUAL]: true,
      [LEG_FIELD.EFFECTIVE_DATE]: moment(),
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.UP_BARRIER_TYPE]: UP_BARRIER_TYPE_MAP.PERCENT,
      [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]: EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED,
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.AUTO_CALL_STRIKE_UNIT]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.UP_OBSERVATION_STEP]: FREQUENCY_TYPE_MAP['1W'],
      [LEG_FIELD.STEP]: 0,
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
      LEG_FIELD.UP_BARRIER,
      LEG_FIELD.UP_BARRIER_TYPE,
      ExpireNoBarrierObserveDay.dataIndex,
      LEG_FIELD.IS_ANNUAL,
      LEG_FIELD.UNIT,
      LEG_FIELD.TRADE_NUMBER,
    ];

    nextPosition.productType = LEG_TYPE_MAP.AUTOCALL;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
      ...COMPUTED_FIELDS,
    ]);
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    if (
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
    ) {
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] = undefined;
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE] = undefined;
    } else {
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] = undefined;
    }

    nextPosition.asset.observationDates = dataItem[ExpireNoBarrierObserveDay.dataIndex].map(
      item => item[OB_DAY_FIELD]
    );

    nextPosition.asset.barrier = dataItem[LEG_FIELD.UP_BARRIER];
    nextPosition.asset.barrierType = dataItem[LEG_FIELD.UP_BARRIER_TYPE];

    nextPosition.asset.effectiveDate =
      nextPosition.asset.effectiveDate &&
      getMoment(nextPosition.asset.effectiveDate).format('YYYY-MM-DD');
    nextPosition.asset.expirationDate =
      nextPosition.asset.expirationDate &&
      getMoment(nextPosition.asset.expirationDate).format('YYYY-MM-DD');
    nextPosition.asset.settlementDate =
      nextPosition.asset.settlementDate &&
      getMoment(nextPosition.asset.settlementDate).format('YYYY-MM-DD');

    nextPosition.asset.settlementDate =
      env === LEG_ENV.PRICING
        ? nextPosition.asset.expirationDate
        : nextPosition.asset.settlementDate;

    nextPosition.asset.annualized = true;

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    return Form2.createFields({
      [ExpireNoBarrierObserveDay.dataIndex]: (position.asset.observationDates || []).map(item => ({
        [OB_DAY_FIELD]: item,
      })),
      [LEG_FIELD.UP_BARRIER]: position.asset.barrier,
      [LEG_FIELD.UP_BARRIER_TYPE]: position.asset.barrierType,
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
