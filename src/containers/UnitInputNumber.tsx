import { InputNumber } from '@/design/components';
import { IInputNumberProps } from '@/design/components/Input/InputNumber';
import { IInputBaseProps } from '@/design/components/type';
import React, { memo } from 'react';
import { formatMoney, parseMoney } from '@/tools';

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
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        return '0';
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
      return onChange(0);
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
