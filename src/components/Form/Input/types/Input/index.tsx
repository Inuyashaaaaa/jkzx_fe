import { Input } from 'antd';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import { Input2Props } from './types';

class Input2 extends InputPolym<Input2Props> {
  public formatValue = (value): string => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return value;
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event.target.value,
    };
  };

  public parseValue = value => {
    return value;
  };

  public renderEditing(props, onChange) {
    const { autoFocus, inputType, ...rest } = props;
    return (
      <Input
        ref={$inputNode => {
          if (autoFocus) {
            setTimeout(() => {
              if ($inputNode) {
                try {
                  $inputNode.focus();
                } catch (error) {
                  console.warn(error);
                }
              }
            }, 0);
          }
        }}
        {...rest}
        type={inputType}
        onChange={onChange}
      />
    );
  }
}

export default Input2;
