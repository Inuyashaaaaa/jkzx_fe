import { ASSET_CLASS_MAP, LEG_TYPE_MAP, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { ILeg } from '@/types/leg';
import { Direction } from '../legFields';
import { OptionType } from '../legFields/OptionType';
import { UnderlyerInstrumentId } from '../legFields/UnderlyerInstrumentId';

export const VanillaAmerican: ILeg = {
  name: LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP.VERTICAL_SPREAD_ANNUAL],
  type: LEG_TYPE_MAP.VERTICAL_SPREAD_ANNUAL,
  assetClass: ASSET_CLASS_MAP.EQUITY,
  getColumns: env => {
    return [Direction, OptionType, UnderlyerInstrumentId];
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
