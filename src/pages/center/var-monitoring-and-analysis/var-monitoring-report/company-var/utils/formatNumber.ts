/* eslint-disable no-underscore-dangle */


/**
 * 格式化整数  1000 -> 1,000
 * @param num
 */
function _formatInteger(num: number | string): string {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

/**
 * 获得小数点位置
 * @param num
 */
function _getDecimalPointPos(num: string): number {
  return num.indexOf(".")
}

/**
 * 格式化数字 1000.00 -> 1,000.00
 * @param num
 * @param precision 小数点精度 默认为2
 */
function formatNumber(_num: number, precision = 2) {
  const num = _num.toFixed(precision)
  const pos = _getDecimalPointPos(num)
  if (pos === -1) return _formatInteger(num)
  const prefix = num.slice(0, pos);
  const suffix = num.slice(pos)
  return _formatInteger(prefix) + suffix
}

export default formatNumber

