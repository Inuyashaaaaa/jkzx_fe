import { ILeg } from '@/types/leg';
import { commonGetPosition } from './common';

export const legPipeLine = (leg: ILeg) => {
  return commonGetPosition(leg);
};
