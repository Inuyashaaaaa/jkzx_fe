import { InputNumber } from '@/containers';
import { IInputNumberProps } from '@/containers/Input/InputNumber';
import { IInputBaseProps } from '@/components/type';
import React, { memo } from 'react';
import { formatMoney, parseMoney, formatNumber } from '@/tools';
import _ from 'lodash';

export const UnitInputNumber = memo<
  IInputNumberProps &
    IInputBaseProps & {
      unit?: string;
    }
>(props => {
  const { unit = '', onChange = () => {}, precision = 4, ...rest } = props;

  if (props.editing) {
    return (
      <InputNumber
        {...rest}
        precision={precision}
        onChange={event => {
          if (event === '' || _.isNumber(event)) {
            onChange(event);
          }
        }}
      />
    );
  }

  if (props.value == null) {
    return null;
  }

  if (unit === '$' || unit === '¥') {
    return formatMoney(props.value, { unit, decimalPlaces: precision });
  }

  return `${formatNumber(props.value, precision)}${unit}`;
});
