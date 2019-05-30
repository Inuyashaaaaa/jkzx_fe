import { ILeg } from '@/types/leg';
import { commonGetPosition, commonGetDefaultData } from './common';

export const legPipeLine = (leg: ILeg) => {
  return commonGetDefaultData(commonGetPosition(leg));
};
