import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import React from 'react';
import { InputCommonClass } from '../Input';

const { TextArea } = Input;

export interface TextArea2Props extends TextAreaProps {}

class TextArea2 extends InputCommonClass<TextArea2Props> {
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

  public renderChild(props, onChange) {
    return <TextArea {...props} onChange={onChange} />;
  }
}

export default TextArea2;
