import { Input } from 'antd';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import { TextArea2Props } from './types';

const { TextArea } = Input;

class TextArea2 extends InputPolym<TextArea2Props> {
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
    return <TextArea {...props} onChange={onChange} />;
  }
}

export default TextArea2;
