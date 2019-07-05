import BigNumber from 'bignumber.js';
import { BIG_NUMBER_CONFIG } from '@/constants/common';

export const countGamaCash = (gamma, underlyerPrice) => {
  if (underlyerPrice === null) {
    return gamma;
  }
  return new BigNumber(gamma)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countDeltaCash = (delta, underlyerPrice) => {
  if (underlyerPrice === null) {
    return delta;
  }
  return new BigNumber(delta)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countRhoR = rhoR => {
  if (!rhoR) return 0;
  return new BigNumber(rhoR)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countPnlValue = pnlChange =>
  new BigNumber(pnlChange).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();

export const countDelta = (delta, multiplier) => {
  if (!multiplier) {
    return delta;
  }
  return new BigNumber(delta)
    .dividedBy(multiplier)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countGamma = (gamma, multiplier, underlyerPrice) => {
  if (!multiplier || !underlyerPrice) {
    return gamma;
  }
  return new BigNumber(gamma)
    .dividedBy(multiplier)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countVega = vega => {
  if (!vega) return 0;
  return new BigNumber(vega)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countTheta = theta => {
  if (!theta) return 0;
  return new BigNumber(theta)
    .dividedBy(365)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
};

export const countStdDelta = (delta, quantity) =>
  new BigNumber(delta)
    .dividedBy(new BigNumber(quantity).abs())
    .multipliedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();

export const countPricePer = (price, actualNotionalAmount) =>
  new BigNumber(price)
    .dividedBy(actualNotionalAmount)
    .multipliedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();

export const countPrice = price => {
  if (!price) return 0;
  return new BigNumber(price).decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES).toNumber();
};

export const countSpreadStdDelta = (delta1, delta2, quantity) => ({
  stdDelta1: countStdDelta(delta1, quantity),
  stdDelta2: countStdDelta(delta2, quantity),
});

export const countSpreadDelta = (delta1, delta2, multiplier) => ({
  delta1: countDelta(delta1, multiplier),
  delta2: countDelta(delta2, multiplier),
});

export const countSpreadDeltaCash = (delta1, delta2, underlyerPrice) => ({
  deltaCash1: countDeltaCash(delta1, underlyerPrice),
  deltaCash2: countDeltaCash(delta2, underlyerPrice),
});

export const countCrossGamma = (gamma1, gamma2, multiplier1, multiplier2, underlyerPrice) =>
  new BigNumber(gamma1)
    .dividedBy(multiplier1)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();

export const countSpreadGamma = (gamma1, gamma2, multiplier1, multiplier2, underlyerPrice) => ({
  gamma1: countGamma(gamma1, multiplier1, underlyerPrice),
  gamma2: countGamma(gamma2, multiplier2, underlyerPrice),
  crossGamma: countCrossGamma(gamma1, gamma2, multiplier1, multiplier2, underlyerPrice),
});

export const countCrossGammaCash = (gamma1, gamma2, underlyerPrice) =>
  new BigNumber(gamma1)
    .multipliedBy(underlyerPrice)
    .dividedBy(100)
    .multipliedBy(underlyerPrice)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();

export const countSpreadGammaCash = (gamma1, gamma2, underlyerPrice) => ({
  gammaCash1: countGamaCash(gamma1, underlyerPrice),
  gammaCash2: countGamaCash(gamma2, underlyerPrice),
  crossGammaCash: countCrossGammaCash(gamma1, gamma2, underlyerPrice),
});

export const countSpreadVega = (vega1, vega2) => ({
  vega1: countVega(vega1),
  vega2: countVega(vega2),
});

export const countSpreadCega = cega =>
  new BigNumber(cega)
    .div(100)
    .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
    .toNumber();
