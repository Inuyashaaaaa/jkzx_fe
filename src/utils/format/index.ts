import numeral from 'numeral';
import _ from 'lodash';

export interface FormatProps {
  /**
   * @default info
   */
  value?: any;
  format?: string; // 格式化方式
  add?: number;
  difference?: number;
}

export const format = ({ value, ...resf }: FormatProps) => {
  const { format: formatMethod, add, difference } = resf;
  let num = 0;
  if (format) {
    num = numeral(value).format(formatMethod);
  }
  if (add) {
    num = numeral(value).add(add);
  }
  if (difference) {
    num = numeral(value).difference(difference);
  }
  if (!resf) {
    num = numeral(value).defaultFormat('0.0000');
  }
  return _.isObject(num) ? num.value() : num;
};

export const params: FormatProps = {};
