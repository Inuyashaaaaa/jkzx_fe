import Cascader, { CascaderProps } from 'antd/lib/cascader';
import cn from 'classnames';
import React from 'react';
import { InputCommonClass } from '../Input';
import './index.less';

export interface Cascader2Props extends CascaderProps {}

class Cascader2 extends InputCommonClass<Cascader2Props> {
  public formatValue = value => {
    return value.join(', ');
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public parseValue = value => {
    return value;
  };

  public renderChild(props, onChange) {
    return (
      <Cascader
        placeholder=""
        {...props}
        onChange={onChange}
        className={cn(`tongyu-cascader`, props.className)}
      />
    );
  }
}

export default Cascader2;
