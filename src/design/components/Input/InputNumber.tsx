import { InputNumber as AntdInputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../type';

export interface IInputNumberProps extends InputNumberProps {}

class InputNumber extends InputBase<IInputNumberProps> {
  public onChange = (e: number | undefined) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(e);
    }
  };

  public getRef = node => {
    if (this.props.autoSelect && node) {
      node.inputNumberRef.input.select();
    }
  };

  public renderEditing() {
    return (
      <AntdInputNumber
        {...omit(this.props, ['autoSelect'])}
        onChange={this.onChange}
        ref={this.getRef}
      />
    );
  }

  public renderRendering() {
    const { value } = this.props;
    return <span>{value}</span>;
  }
}

export default InputNumber;
