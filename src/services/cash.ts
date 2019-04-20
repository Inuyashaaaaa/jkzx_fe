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

export const countPnlValue = pnlChange => {
  return new BigNumber(pnlChange).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
};

export const countDelta = (delta, multiplier) => {
  return new BigNumber(delta)
    .dividedBy(multiplier)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countGamma = (gamma, multiplier, underlyerPrice) => {
  return new BigNumber(gamma)
    .dividedBy(multiplier)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countVega = vega => {
  return new BigNumber(vega)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countTheta = theta => {
  return new BigNumber(theta)
    .dividedBy(365)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countStdDelta = (delta, quantity) => {
  return new BigNumber(delta)
    .dividedBy(new BigNumber(quantity).abs())
    .multipliedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countPricePer = (price, actualNotionalAmount) => {
  return new BigNumber(price)
    .dividedBy(actualNotionalAmount)
    .multipliedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countPrice = price => {
  return new BigNumber(price).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
};
