import { formatNumber } from '@/tools';
import { InputNumber as AntdInputNumber } from 'antd';
import { InputNumberProps } from 'antd/lib/input-number';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../../components/type';

export interface IInputNumberProps extends InputNumberProps {}

class InputNumber extends InputBase<IInputNumberProps> {
  public static defaultProps = {
    scale: 1,
  };

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
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        onChange={this.onChange}
        style={{
          width: '100%',
          ...this.props.style,
        }}
        ref={this.getRef}
      />
    );
  }

  public sliceValue = () => {
    const { value, precision } = this.props;
    return precision != null ? formatNumber(value, precision) : value;
  };

  public renderRendering() {
    const { value, formatter, style } = this.props;

    return (
      <span
        style={{
          width: '100%',
          display: 'inline-block',
          ...style,
        }}
      >
        {formatter && value != null ? formatter(value) : this.sliceValue()}
      </span>
    );
  }
}

export default InputNumber;
