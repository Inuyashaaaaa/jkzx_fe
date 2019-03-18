import { ILegType } from '@/constants/legColDefs';
import { ASSET_CLASS_MAP, LEG_TYPE_MAP } from '../common';
import {
  BarrierType,
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  HighBarrier,
  InitialSpot,
  LowBarrier,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  ParticipationRate,
  Payment,
  PaymentType,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const ConvexUnAnnual: ILegType = pipeLeg({
  name: '二元凸式 - 非年化',
  type: LEG_TYPE_MAP.CONVEX_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  columnDefs: [
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
    BarrierType,
    LowBarrier,
    HighBarrier,
    PaymentType,
    Payment,
    PremiumType,
    Premium,
  ],
});
