import { InputNumber } from '@/design/components';
import { IInputNumberProps } from '@/design/components/Input/InputNumber';
import { IInputBaseProps } from '@/design/components/type';
import React, { memo } from 'react';

export const UnitInputNumber = memo<
  IInputNumberProps &
    IInputBaseProps & {
      unit?: '%' | '$' | '¥' | '天' | string;
    }
>(({ unit = '¥', ...props }) => {
  let formatter;
  let parser;
  const options = undefined;

  if (unit === '%' || unit === '天') {
    formatter = value => {
      return `${value}${unit}`;
    };
    parser = value => value.replace(unit, '');
  } else {
    formatter = value => `${unit} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    parser = value => (value != null ? value : '').replace(new RegExp(`${unit}\s?|(,*)`, 'g'), '');
  }

  return (
    <InputNumber precision={4} {...props} {...options} formatter={formatter} parser={parser} />
  );
});
