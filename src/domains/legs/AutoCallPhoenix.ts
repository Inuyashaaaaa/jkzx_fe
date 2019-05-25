import {
  ASSET_CLASS_MAP,
  FREQUENCY_TYPE_MAP,
  LEG_INJECT_FIELDS,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  OB_DAY_FIELD,
  UNIT_ENUM_MAP2,
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
import { IFormField, ITableData, ITableTriggerCellFieldsChangeParams } from '@/components/type';
import { ILeg } from '@/types/leg';
import { getMoment } from '@/tools';
import _ from 'lodash';
import moment from 'moment';
import {
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  SPECIFIED_PRICE_MAP,
} from '../../constants/common';
import { Direction } from '../legFields';
import { AlreadyBarrier } from '../legFields/AlreadyBarrier';
import { Coupon } from '../legFields/Coupon';
import { CouponEarnings } from '../legFields/CouponEarnings';
import { DaysInYear } from '../legFields/DaysInYear';
import { DownBarrier } from '../legFields/DownBarrier';
import { DownBarrierDate } from '../legFields/DownBarrierDate';
import { DownBarrierOptionsStrike } from '../legFields/DownBarrierOptionsStrike';
import { DownBarrierOptionsStrikeType } from '../legFields/DownBarrierOptionsStrikeType';
import { DownBarrierOptionsType } from '../legFields/DownBarrierOptionsType';
import { DownBarrierType } from '../legFields/DownBarrierType';
import { DownObservationStep } from '../legFields/DownObservationStep';
import { EffectiveDate } from '../legFields/EffectiveDate';
import { ExpirationDate } from '../legFields/ExpirationDate';
import { ExpireNoBarrierObserveDay } from '../legFields/ExpireNoBarrierObserveDay';
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
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';
import { Unit } from '../legFields/Unit';
import { UpBarrier } from '../legFields/UpBarrier';
import { UpBarrierType } from '../legFields/UpBarrierType';
import { UpObservationStep } from '../legFields/UpObservationStep';
import { commonLinkage } from '../tools';

export const AutoCallPhoenix: ILeg = {
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.AUTOCALL_PHOENIX],
  type: LEG_TYPE_MAP.AUTOCALL_PHOENIX,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    if (env === LEG_ENV.PRICING) {
      return [
        SpecifiedPrice,
        EffectiveDate,
        Direction,
        UnderlyerInstrumentId,
        UnderlyerMultiplier,
        InitialSpot,
        ParticipationRate,
        Coupon,
        NotionalAmountType,
        NotionalAmount,
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        CouponEarnings,
        ExpireNoBarrierObserveDay,
        DownBarrierType,
        DownBarrierOptionsStrikeType,
        DownBarrierOptionsStrike,
        DownBarrierOptionsType,
        UpObservationStep,
        DownObservationStep,
        DownBarrier,
        DownBarrierOptionsStrike,
        Term,
        ExpirationDate,
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
        Coupon,
        MinimumPremium,
        FrontPremium,
        NotionalAmountType,
        NotionalAmount,
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        CouponEarnings,
        ExpireNoBarrierObserveDay,
        DownBarrierType,
        DownBarrierOptionsStrikeType,
        DownBarrierOptionsStrike,
        DownBarrierOptionsType,
        UpObservationStep,
        DownObservationStep,
        AlreadyBarrier,
        DownBarrierDate,
        DownBarrier,
        DownBarrierOptionsStrike,
        Unit,
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
        Coupon,
        MinimumPremium,
        FrontPremium,
        NotionalAmountType,
        NotionalAmount,
        KnockDirection,
        UpBarrierType,
        UpBarrier,
        CouponEarnings,
        ExpireNoBarrierObserveDay,
        DownBarrierType,
        DownBarrierOptionsStrikeType,
        DownBarrierOptionsStrike,
        DownBarrierOptionsType,
        UpObservationStep,
        DownObservationStep,
        AlreadyBarrier,
        DownBarrierDate,
        DownBarrier,
        DownBarrierOptionsStrike,
        Unit,
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
      [LEG_FIELD.EXPIRATION_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.SETTLEMENT_DATE]: moment().add(DEFAULT_TERM, 'days'),
      [LEG_FIELD.ALREADY_BARRIER]: false,
      [LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE]: UNIT_ENUM_MAP2.PERCENT,
      [DownBarrierType.dataIndex]: UNIT_ENUM_MAP2.PERCENT,
      [LEG_FIELD.UP_OBSERVATION_STEP]: FREQUENCY_TYPE_MAP['1W'],
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
      AlreadyBarrier.dataIndex,
      LEG_FIELD.IS_ANNUAL,
      LEG_FIELD.UNIT,
    ];

    nextPosition.productType = LEG_TYPE_MAP.AUTOCALL_PHOENIX;
    nextPosition.asset = _.omit(dataItem, [
      ...LEG_INJECT_FIELDS,
      LEG_FIELD.IS_ANNUAL,
      ...COMPUTED_FIELDS,
    ]);
    nextPosition.assetClass = ASSET_CLASS_MAP.EQUITY;

    if (!dataItem[AlreadyBarrier.dataIndex]) {
      nextPosition.asset[DownBarrierDate.dataIndex] = undefined;
      nextPosition.lcmEventType = 'OPEN';
    } else {
      nextPosition.lcmEventType = 'KNOCK_IN';
    }

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

    nextPosition.asset[LEG_FIELD.DOWN_BARRIER_DATE] = getMoment(
      nextPosition.asset[LEG_FIELD.DOWN_BARRIER_DATE]
    ).format('YYYY-MM-DD');

    nextPosition.asset.settlementDate =
      env === LEG_ENV.PRICING
        ? nextPosition.asset.expirationDate
        : nextPosition.asset.settlementDate;

    nextPosition.asset.fixingObservations = dataItem[LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY].reduce(
      (result, item) => {
        result[item[OB_DAY_FIELD]] = item.price !== undefined ? item.price : null;
        return result;
      },
      {}
    );

    nextPosition.asset.annualized = true;

    return nextPosition;
  },
  getPageData: (env: string, position: any) => {
    const data = position.asset.fixingObservations || [];
    const data2 = position.asset.knockInObservationDates || [];
    const fields = Form2.createFields({
      [LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY]: Object.keys(data).map(key => ({
        [OB_DAY_FIELD]: key,
        price: data[key],
      })),
      [LEG_FIELD.IN_EXPIRE_NO_BARRIEROBSERVE_DAY]: data2.map(key => {
        return {
          [OB_DAY_FIELD]: key,
        };
      }),
      [LEG_FIELD.UP_BARRIER]: position.asset.barrier,
      [LEG_FIELD.UP_BARRIER_TYPE]: position.asset.barrierType,
      [LEG_FIELD.ALREADY_BARRIER]: position.lcmEventType === 'KNOCK_IN' ? true : false,
      // [AlreadyBarrier.dataIndex]: !!position.asset[DownBarrierDate.dataIndex],
    });
    return fields;
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
};
