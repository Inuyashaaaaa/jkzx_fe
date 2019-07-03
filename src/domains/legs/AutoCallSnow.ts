import _ from 'lodash';
import moment from 'moment';
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
  GENERAL_COMPUTED_FIELDS,
  TOTAL_EDITING_FIELDS,
  TOTAL_TRADESCOL_FIELDS,
} from '@/constants/legs';
import { Form2 } from '@/containers';
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import { ILeg } from '@/types/leg';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
} from '../../constants/common';
import { Direction } from '../../containers/legFields';
import { AutoCallStrike } from '../../containers/legFields/AutoCallStrike';
import { AutoCallStrikeUnit } from '../../containers/legFields/AutoCallStrikeUnit';
import { CouponEarnings } from '../../containers/legFields/CouponEarnings';
import { DaysInYear } from '../../containers/legFields/DaysInYear';
import { EffectiveDate } from '../../containers/legFields/EffectiveDate';
import { ExpirationDate } from '../../containers/legFields/ExpirationDate';
import { ExpireNoBarrierObserveDay } from '../../containers/legFields/ExpireNoBarrierObserveDay';
import { ExpireNoBarrierPremium } from '../../containers/legFields/ExpireNoBarrierPremium';
import { ExpireNoBarrierPremiumType } from '../../containers/legFields/ExpireNoBarrierPremiumType';
import { FrontPremium } from '../../containers/legFields/FrontPremium';
import { InitialSpot } from '../../containers/legFields/InitialSpot';
import { KnockDirection } from '../../containers/legFields/KnockDirection';
import { MinimumPremium } from '../../containers/legFields/MinimumPremium';
import { NotionalAmount } from '../../containers/legFields/NotionalAmount';
import { NotionalAmountType } from '../../containers/legFields/NotionalAmountType';
import { ParticipationRate } from '../../containers/legFields/ParticipationRate';
import { Premium } from '../../containers/legFields/Premium';
import { PremiumType } from '../../containers/legFields/PremiumType';
import { SettlementDate } from '../../containers/legFields/SettlementDate';
import { SpecifiedPrice } from '../../containers/legFields/SpecifiedPrice';
import { Step } from '../../containers/legFields/Step';
import { Term } from '../../containers/legFields/Term';
import { UnderlyerInstrumentId } from '../../containers/legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../../containers/legFields/UnderlyerMultiplier';
import { UpBarrier } from '../../containers/legFields/UpBarrier';
import { UpBarrierType } from '../../containers/legFields/UpBarrierType';
import { UpObservationStep } from '../../containers/legFields/UpObservationStep';
import { commonLinkage } from '../common';
import { getMoment, getCurDateMoment } from '@/tools';
import { Unit } from '../../containers/legFields/Unit';
import { legPipeLine } from '../_utils';
import { TradeNumber } from '../../containers/legFields/TradeNumber';

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
        ...GENERAL_COMPUTED_FIELDS,
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
    const curDateMoment = getCurDateMoment();
    return Form2.createFields({
      // expirationTime: '15:00:00',
      [LEG_FIELD.IS_ANNUAL]: true,
      [LEG_FIELD.EFFECTIVE_DATE]: curDateMoment.clone(),
      [LEG_FIELD.NOTIONAL_AMOUNT_TYPE]: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      [LEG_FIELD.PREMIUM_TYPE]: PREMIUM_TYPE_MAP.PERCENT,
      [LEG_FIELD.TERM]: DEFAULT_TERM,
      [LEG_FIELD.DAYS_IN_YEAR]: DEFAULT_DAYS_IN_YEAR,
      [LEG_FIELD.PARTICIPATION_RATE]: 100,
      [LEG_FIELD.SPECIFIED_PRICE]: SPECIFIED_PRICE_MAP.CLOSE,
      [LEG_FIELD.UP_BARRIER_TYPE]: UP_BARRIER_TYPE_MAP.PERCENT,
      [LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]: EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED,
      [LEG_FIELD.EXPIRATION_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: curDateMoment.clone().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.AUTO_CALL_STRIKE_UNIT]: PAYMENT_TYPE_MAP.PERCENT,
      [LEG_FIELD.UP_OBSERVATION_STEP]: FREQUENCY_TYPE_MAP['1W'],
      [LEG_FIELD.STEP]: 0,
      [LEG_FIELD.MINIMUM_PREMIUM]: 0,
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
    // nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    if (
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
    ) {
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE_UNIT] = undefined;
      nextPosition.asset[LEG_FIELD.AUTO_CALL_STRIKE] = undefined;
    } else {
      nextPosition.asset[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM] = undefined;
    }

    nextPosition.asset.observationDates =
      dataItem[ExpireNoBarrierObserveDay.dataIndex] &&
      dataItem[ExpireNoBarrierObserveDay.dataIndex].map(item => item[OB_DAY_FIELD]);

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
  getPageData: (env: string, position: any) =>
    Form2.createFields({
      [ExpireNoBarrierObserveDay.dataIndex]: (position.asset.observationDates || []).map(item => ({
        [OB_DAY_FIELD]: item,
      })),
      [LEG_FIELD.UP_BARRIER]: position.asset.barrier,
      [LEG_FIELD.UP_BARRIER_TYPE]: position.asset.barrierType,
    }),
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
  },
});
