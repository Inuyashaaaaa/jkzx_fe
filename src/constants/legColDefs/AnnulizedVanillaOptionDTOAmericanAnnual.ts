import { ASSET_CLASS_MAP, LEG_TYPE_MAP } from '../common';
import {
  DaysInYear,
  Direction,
  EffectiveDate,
  ExpirationDate,
  FrontPremium,
  InitialSpot,
  MinimumPremium,
  NotionalAmount,
  NotionalAmountType,
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  Term,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';

export const AnnulizedVanillaOptionDTOAmericanAnnual = pipeLeg({
  name: '美式 - 年化',
  type: LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  isAnnualized: true,
  columnDefs: [
    Direction,
    OptionType,
    UnderlyerInstrumentId,
    UnderlyerMultiplier,
    InitialSpot,
    StrikeType,
    Strike,
    SpecifiedPrice,
    Term,
    EffectiveDate,
    ExpirationDate,
    SettlementDate,
    DaysInYear,
    ParticipationRate,
    NotionalAmountType,
    NotionalAmount,
    PremiumType,
    Premium,
    FrontPremium,
    MinimumPremium,
  ],
});
