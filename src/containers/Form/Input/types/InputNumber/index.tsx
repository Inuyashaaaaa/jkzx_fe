import { InputNumber } from 'antd';
import cn from 'classnames';
import numeral from 'numeral';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { InputNumber2Props } from './types';

class InputNumber2 extends InputPolym<InputNumber2Props> {
  public formatValue = value => {
    if (value === undefined) return value;

    if ('format' in this.props) {
      return numeral(value).format(this.props.format);
    }

    return value;
  };

  public parseValue = value => {
    if (value === undefined) return value;

    if ('format' in this.props) {
      return numeral(value).value();
    }

    return value;
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public renderEditing(props, onChange) {
    const { autoFocus, className, style, ...rest } = props;
    return (
      <InputNumber
        style={{
          minWidth: 180,
          ...style,
        }}
        {...rest}
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
        onChange={onChange}
        className={cn(className, `tongyu-input-number`)}
      />
    );
  }
}

export default InputNumber2;
