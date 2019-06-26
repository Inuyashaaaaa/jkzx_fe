/** @namespace mathUtils */

import { create, all } from 'mathjs';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

const DEFAULT_DECIMAL_PLACES = 4;
const DEFAULT_ROUNDING_MODE = BigNumber.ROUND_HALF_UP;

const math = create(all, {
  number: 'BigNumber',
});

/**
 * 计算表达式的值
 * @memberof mathUtils
 * @param {string} expr 要计算的表达式
 * @returns {number}
 */
function eva(expr: string): number {
  return math.evaluate(expr).toNumber();
}

/**
 * 保留小数位有效数字
 * @memberof mathUtils
 * @param {number} num 要操作的数
 * @param {number} decimalPlaces 要保留的小数位数
 * @param {BigNumber.RoundingMode} roundingMode 可选，末位小数进位方式，默认四舍五入
 * @returns {number}
 */
function decimal(
  num: number,
  decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
  roundingMode: BigNumber.RoundingMode = DEFAULT_ROUNDING_MODE
): number {
  if (!_.isNumber(num)) return null;
  return new BigNumber(num).dp(decimalPlaces, roundingMode).toNumber();
}

/**
 * 返回百分比的形式
 * @memberof mathUtils
 * @param {number} num 要操作的数
 * @param {number} decimalPlaces 要保留的小数位数
 * @param {BigNumber.RoundingMode} roundingMode 可选，末位小数进位方式，默认四舍五入
 * @returns {string}
 */
function percent(
  num: number,
  decimalPlaces: number = DEFAULT_DECIMAL_PLACES,
  roundingMode: BigNumber.RoundingMode = DEFAULT_ROUNDING_MODE
): string {
  if (!_.isNumber(num)) return null;
  return math.evaluate(`${num} * 100`).toFixed(decimalPlaces, roundingMode) + '%';
}

/**
 * 添加前缀
 * @memberof mathUtils
 * @param {number} num 要操作的值
 * @param {string} prefix 要添加的前缀
 * @param {boolean} space 可选，是否在前缀后添加空格，默认不添加
 * @returns {string}
 */
function prefix(num: number, prefix: string, space: boolean = false): string {
  return prefix + (space ? ' ' : '') + num;
}

/**
 * 添加后缀
 * @memberof mathUtils
 * @param {number} num 要操作的值
 * @param {string} suffix 要添加的后缀
 * @param {boolean} space 可选，是否在后缀前添加空格，默认不添加
 * @returns {string}
 */
function suffix(num: number, suffix: string, space: boolean = false): string {
  return num + (space ? ' ' : '') + suffix;
}

interface NumFormatConfig {
  decimalPlaces?: number;
  percent?: boolean;
  roundingMode?: BigNumber.RoundingMode;
  prefix?: string;
  suffix?: string;
  space?: boolean;
}

/**
 * 根据给定的配置对象，格式化数值
 * @memberof mathUtils
 * @param {number} num 想要格式化的值
 * @param {NumFormatConfig} config 格式化配置对象
 * @param {number} config.decimalPlaces 小数位精度
 * @param {boolean} config.percent 是否以百分比形式展示
 * @param {string} config.prefix 前缀
 * @param {string} config.suffix 后缀
 * @param {boolean} config.space 数值与前后缀之间是否显示空格
 * @returns {number | string}
 */
function numFormat(num: number, config: NumFormatConfig) {
  if (!_.isNumber(num)) return null;

  const { decimalPlaces = DEFAULT_DECIMAL_PLACES, roundingMode = DEFAULT_ROUNDING_MODE } = config;

  const temp = { value: num };

  const transform = (condition, func, ...params) => {
    if (condition || condition === 0) {
      temp.value = params ? func(...params) : func();
    }
  };

  transform(decimalPlaces, decimal, temp.value, decimalPlaces, roundingMode);
  transform(config.percent, percent, temp.value);
  transform(config.suffix, suffix, temp.value, config.suffix, config.space);
  transform(config.prefix, prefix, temp.value, config.prefix, config.space);

  return temp.value;
}

export { decimal, eva, numFormat as format, percent, NumFormatConfig, prefix, suffix };
