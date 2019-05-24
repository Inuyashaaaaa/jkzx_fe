import { Input as AntdInput } from 'antd';
import { InputProps } from 'antd/lib/input';
import { omit, trim } from 'lodash';
import React from 'react';
import { InputBase } from '../type';

export interface IInputProps extends InputProps {
  formatter?: (value) => any;
}

class Input extends InputBase<IInputProps> {
  public getRef = node => {
    if (this.props.autoSelect && node) {
      node.select();
    }
  };

  public onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.value);
    }
  };

  public renderEditing() {
    const { value } = this.props;
    return (
      <AntdInput
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        onChange={this.onChange}
        ref={this.getRef}
        onBlur={() => {
          const event = new Event(null);
          Object.defineProperty(event, 'target', {
            writable: false,
            value: { value: trim(value) },
          });
          this.onChange(event as any);
        }}
      />
    );
  }

  public renderRendering() {
    const { value, formatter } = this.props;
    return (
      <span style={{ display: 'inline-block', width: '100%' }}>
        {formatter ? formatter(value) : value}
      </span>
    );
  }
}

export default Input;
