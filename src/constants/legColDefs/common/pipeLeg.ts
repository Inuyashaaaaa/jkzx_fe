import { ILegType } from '..';
import { orderLeg } from './order';

export function pipeLeg(leg: ILegType) {
  const next = orderLeg(leg);
  return next;
}
