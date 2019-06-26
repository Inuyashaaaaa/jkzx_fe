import {
  bookId,
  portfolios,
  instrumentId,
  direction,
  openClose,
  dealPrice,
  dealAmount,
  dealTime,
  tradeId,
  tradeAccount,
  multiplier,
  netPosition,
  longPosition,
  shortPosition,
  totalBuy,
  historyBuyAmount,
  totalSell,
  historySellAmount,
  marketValue,
  totalPnl,
  portfolio,
} from './constants';

export function generateColumns(type) {
  if (type === 'flow') {
    return [
      bookId,
      portfolios,
      instrumentId,
      direction,
      openClose,
      dealPrice,
      dealAmount,
      dealTime,
      tradeId,
      tradeAccount,
      multiplier,
    ];
  }

  const baseColumns = [
    instrumentId,
    netPosition,
    longPosition,
    shortPosition,
    totalBuy,
    historyBuyAmount,
    totalSell,
    historySellAmount,
    marketValue,
    totalPnl,
  ];

  if (type === 'detail') {
    return [bookId, ...baseColumns];
  }

  if (type === 'portfolio') {
    return [portfolio, ...baseColumns];
  }

  return baseColumns;
}
