import { ASSET_CLASS_MAP, LEG_TYPE_MAP } from '../common';
import {
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  InitialSpot,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  ObservationType,
  OptionType,
  ParticipationRate,
  Payment,
  PaymentType,
  Premium,
  PremiumType,
  RebateType,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const DigitalLegAmericanUnAnnual = pipeLeg({
  name: '一触即付 - 非年化',
  type: LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  columnDefs: [
    Direction,
    OptionType,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    StrikeType,
    Strike,
    SpecifiedPrice,
    SettlementDate,
    ParticipationRate,
    NotionalAmountType,
    NotionalAmount,
    PaymentType,
    Payment,
    PremiumType,
    Premium,
    ExpirationDate,
    // ExpirationTime,
    EffectiveDate,
    ObservationType,
    RebateType,
  ],
});
