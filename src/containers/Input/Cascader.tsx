import { Cascader as AntdCascader } from 'antd';
import { CascaderOptionType, CascaderProps } from 'antd/lib/cascader';
import { omit } from 'lodash';
import React from 'react';
import { InputBase } from '../../components/type';

export interface ICascaderProps extends CascaderProps {}

class Cascader extends InputBase<ICascaderProps> {
  public onChange = (value: string[], selectedOptions?: CascaderOptionType[]) => {
    if (this.props.onChange) {
      this.props.onChange(value, selectedOptions);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(value, selectedOptions);
    }
  };

  public renderEditing() {
    return (
      <AntdCascader
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        onChange={this.onChange}
      />
    );
  }

  public renderRendering() {
    const { value = [] } = this.props;
    return <span style={{ display: 'inline-block', width: '100%' }}>{value.join('/')}</span>;
  }
}

export default Cascader;
