import { InputNumber } from '@/design/components';
import { IInputNumberProps } from '@/design/components/Input/InputNumber';
import { IInputBaseProps } from '@/design/components/type';
import React, { memo } from 'react';
import { formatMoney, parseMoney } from '@/tools';
import _ from 'lodash';

/**
 * 当用户输入非数值类型的值时，onChange 会进行拦截，formatter 也会对非法值类型进行判断，保证显示和当前 value 的一致性
 */
export const UnitInputNumber = memo<
  IInputNumberProps &
    IInputBaseProps & {
      unit?: string;
    }
>(({ unit = '¥', onChange, ...props }) => {
  let formatter;
  let parser;
  const options = undefined;

  if (unit === '$' || unit === '¥') {
    formatter = value => {
      if (value == null) return unit;

      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        return unit;
      }

      if (typeof value === 'string' && value.endsWith('.')) {
        return `${formatMoney(parsed, unit)}.`;
      }

      return formatMoney(value, unit);
    };
    parser = value => parseMoney(value, unit);
  } else {
    formatter = value => {
      return `${value}${unit}`;
    };
    parser = value => value.replace(unit, '');
  }

  const handleChange = value => {
    value = parseFloat(value);
    if (isNaN(value)) {
      return onChange();
    }
    onChange(value);
  };

  return (
    <InputNumber
      precision={4}
      {...props}
      {...options}
      formatter={formatter}
      parser={parser}
      onChange={handleChange}
    />
  );
});
