import { InputNumber } from '@/containers';
import { IInputNumberProps } from '@/containers/Input/InputNumber';
import { IInputBaseProps } from '@/components/type';
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
  const getFormat = (): {
    formatter?: (value: number | string | undefined) => string;
    parser?: (displayValue: string | undefined) => number;
  } => {
    if (unit === '$' || unit === '¥') {
      return {
        formatter: value => {
          if (value == null) return unit;

          const parsed = parseFloat(String(value));
          if (isNaN(parsed)) {
            return unit;
          }

          if (typeof value === 'string' && value.endsWith('.')) {
            return `${formatMoney(parsed, { unit, decimalPlaces: null })}.`;
          }

          // @todo
          return formatMoney(value, { unit, decimalPlaces: null }) as string;
        },
        parser: value => parseMoney(value, unit),
      };
    } else {
      return {
        formatter: value => {
          return `${value}${unit}`;
        },
        parser: value => parseFloat(value.replace(unit, '')),
      };
    }
  };

  const handleChange = value => {
    value = parseFloat(value);
    if (isNaN(value)) {
      return onChange();
    }
    onChange(value);
  };

  return <InputNumber precision={4} {...props} {...getFormat()} onChange={handleChange} />;
});
