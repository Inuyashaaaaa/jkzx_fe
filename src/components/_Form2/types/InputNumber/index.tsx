import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import cn from 'classnames';
import numeral from 'numeral';
import React from 'react';
import { InputCommonClass } from '../Input';
import { FunctionShowInputProps } from '../subtypes/ShowInput';
import { StaticInputProps } from '../subtypes/StaticInput';
import './index.less';

export type AllInputNumer2Props =
  | InputNumber2Props
  | InputNumberProps
  | FunctionShowInputProps
  | StaticInputProps;

export interface InputNumber2Props extends InputNumberProps {
  // http://numeraljs.com/#use-it
  format: string;
}

class InputNumber2 extends InputCommonClass<AllInputNumer2Props> {
  public formatValue = value => {
    return this.formatter(value);
  };

  public parseValue = value => {
    return this.parser(value);
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public formatter = value => {
    if (value === undefined) return value;

    if ('format' in this.props) {
      if (this.props.format.indexOf('¥') !== -1) {
        const val = numeral(value).format(this.props.format.replace('¥', '$'));
        return val.replace('$', '¥');
      }

      return numeral(value).format(this.props.format);
    }

    return value;
  };

  public parser = value => {
    if (value === undefined) return value;

    if ('format' in this.props) {
      return numeral(value).value();
    }

    return value;
  };

  public renderChild(props, onChange) {
    const { autoFocus, className, ...rest } = props;
    return (
      <InputNumber
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
        // formatter={this.formatter}
        // parser={this.parser}
        onChange={onChange}
        className={cn(className, `tongyu-input-number2`)}
      />
    );
  }
}

export default InputNumber2;
