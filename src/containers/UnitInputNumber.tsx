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
>(({ unit = '¥', ...props }) => {
  let formatter;
  let parser;
  const options = undefined;

  if (unit === '$' || unit === '¥') {
    formatter = value => formatMoney(value, unit);
    parser = value => parseMoney(value, unit);
  } else {
    formatter = value => {
      return `${value}${unit}`;
    };
    parser = value => value.replace(unit, '');
  }

  return (
    <InputNumber precision={4} {...props} {...options} formatter={formatter} parser={parser} />
  );
});
