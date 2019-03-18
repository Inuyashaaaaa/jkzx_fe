import { BIG_NUMBER_CONFIG } from '@/constants/common';
import BigNumber from 'bignumber.js';

export const countGamaCash = (gamma, underlyerPrice) => {
  return new BigNumber(gamma)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countDeltaCash = (delta, underlyerPrice) => {
  return new BigNumber(delta)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countRhoR = rhoR => {
  return new BigNumber(rhoR)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};
