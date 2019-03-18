import { ASSET_CLASS_MAP, LEG_TYPE_MAP } from '../common';
import {
  Direction,
  EffectiveDate,
  ExpirationDate,
  HighStrike,
  InitialSpot,
  LowStrike,
  NotionalAmount,
  NotionalAmountType,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const AnnualizedVerticalSpreadOptionDTOEuropeanUnAnnual = pipeLeg({
  name: '欧式价差 - 非年化',
  type: LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_UNANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: false,
  columnDefs: [
    Direction,
    OptionType,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    StrikeType,
    LowStrike,
    HighStrike,
    EffectiveDate,
    ExpirationDate,
    SpecifiedPrice,
    // expirationTime
    SettlementDate,
    ParticipationRate,
    NotionalAmountType,
    NotionalAmount,
    PremiumType,
    Premium,
  ],
});
