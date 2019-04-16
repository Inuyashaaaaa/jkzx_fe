import { ASSET_CLASS_MAP, LEG_TYPE_MAP, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { ILeg } from '@/types/leg';
import { Direction } from '../legFields';
import { DaysInYear } from '../legFields/DaysInYear';
import { EffectiveDate } from '../legFields/EffectiveDate';
import { ExpirationDate } from '../legFields/ExpirationDate';
import { FrontPremium } from '../legFields/FrontPremium';
import { InitialSpot } from '../legFields/InitialSpot';
import { IsAnnual } from '../legFields/IsAnnual';
import { MinimumPremium } from '../legFields/MinimumPremium';
import { OptionType } from '../legFields/OptionType';
import { ParticipationRate } from '../legFields/ParticipationRate';
import { Premium } from '../legFields/Premium';
import { PremiumType } from '../legFields/PremiumType';
import { SettlementDate } from '../legFields/SettlementDate';
import { SpecifiedPrice } from '../legFields/SpecifiedPrice';
import { Strike } from '../legFields/Strike';
import { StrikeType } from '../legFields/StrikeType';
import { Term } from '../legFields/Term';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';
import { UnderlyerMultiplier } from '../legFields/UnderlyerMultiplier';

export const VanillaAmerican: ILeg = {
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.VANILLA_AMERICAN],
  type: LEG_TYPE_MAP.VANILLA_AMERICAN,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    return [
      Direction,
      OptionType,
      UnderlyerInstrumentId,
      UnderlyerMultiplier,
      InitialSpot,
      ParticipationRate,
      StrikeType,
      Strike,
      Term,
      IsAnnual,
      ExpirationDate,
      SpecifiedPrice,
      EffectiveDate,
      SettlementDate,
      DaysInYear,
      PremiumType,
      Premium,
      MinimumPremium,
      FrontPremium,
    ];
  },
  getDefaultData: env => {
    return {};
  },
  getPosition: () => {
    return {};
  },
  getPageData: () => {
    return {};
  },
};
