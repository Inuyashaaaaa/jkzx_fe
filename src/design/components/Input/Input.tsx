import { Input as AntdInput } from 'antd';
import { InputProps } from 'antd/lib/input';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../type';

export interface IInputProps extends InputProps {}

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
    return (
      <AntdInput {...omit(this.props, ['autoSelect'])} onChange={this.onChange} ref={this.getRef} />
    );
  }

  public renderRendering() {
    const { value } = this.props;
    return <span>{value}</span>;
  }
}

export default Input;
