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
  OptionType,
  ParticipationRate,
  Premium,
  PremiumType,
  SettlementDate,
  SpecifiedPrice,
  Strike,
  StrikeType,
  UnderlyerInstrumentId,
  UnderlyerMultiplier,
} from './common/common';
import { pipeLeg } from './common/pipeLeg';
import { setRuleLeg } from './rules';

export const AnnulizedVanillaOptionDTOEuropeanUnAnnual = pipeLeg({
  name: '欧式 - 非年化',
  type: LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL,
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
    EffectiveDate,
    ExpirationDate,
    SettlementDate,
    ParticipationRate,
    NotionalAmountType,
    NotionalAmount,
    PremiumType,
    Premium,
  ],
});
