import BigNumber from 'bignumber.js';

export const countAvg = tableData => {
  return tableData
    .reduce((sum, next) => {
      return sum.plus(new BigNumber(next.weight || 0).multipliedBy(next.price || 0));
    }, new BigNumber(0))
    .toNumber();
};
