import { BIG_NUMBER_CONFIG } from '@/constants/common';
import BigNumber from 'bignumber.js';

export const countSpreadStdDelta = (delta1, delta2, quantity) => {
  return {
    stdDelta1: countStdDelta(delta1, quantity),
    stdDelta2: countStdDelta(delta2, quantity),
  };
};

export const countSpreadDelta = (delta1, delta2, multiplier) => {
  return {
    delta1: countDelta(delta1, multiplier),
    delta2: countDelta(delta2, multiplier),
  };
};

export const countSpreadDeltaCash = (delta1, delta2, underlyerPrice) => {
  return {
    deltaCash1: countDeltaCash(delta1, underlyerPrice),
    deltaCash2: countDeltaCash(delta2, underlyerPrice),
  };
};

export const countSpreadGamma = (gamma1, gamma2, multiplier1, multiplier2, underlyerPrice) => {
  return {
    gamma1: countGamma(gamma1, multiplier1, underlyerPrice),
    gamma2: countGamma(gamma2, multiplier2, underlyerPrice),
    crossGamma: countCrossGamma(gamma1, gamma2, multiplier1, multiplier2, underlyerPrice),
  };
};

export const countCrossGamma = (gamma1, gamma2, multiplier1, multiplier2, underlyerPrice) => {
  return new BigNumber(gamma1)
    .dividedBy(multiplier1)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countSpreadGammaCash = (gamma1, gamma2, underlyerPrice) => {
  return {
    gammaCash1: countGamaCash(gamma1, underlyerPrice),
    gammaCash2: countGamaCash(gamma2, underlyerPrice),
    crossGammaCash: countCrossGammaCash(gamma1, gamma2, underlyerPrice),
  };
};

export const countCrossGammaCash = (gamma1, gamma2, underlyerPrice) => {
  return new BigNumber(gamma1)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countSpreadVega = (vega1, vega2) => {
  return {
    vega1: countVega(vega1),
    vega2: countVega(vega2),
  };
};

export const countSpreadCega = cega => {
  return new BigNumber(cega)
    .div(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

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
