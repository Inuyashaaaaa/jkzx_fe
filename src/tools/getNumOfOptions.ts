import { LEG_FIELD } from '@/constants/common';
import BigNumber from 'bignumber.js';

export const getNumOfOptionsByNotionalAmount = (
  notionalAmount,
  initialSpot,
  underlyerMultipler
) => {
  const numOfOptions = new BigNumber(notionalAmount)
    .div(initialSpot)
    .div(underlyerMultipler)
    .toNumber();

  return numOfOptions;
};
