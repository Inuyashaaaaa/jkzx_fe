import { Cascader } from 'antd';
import cn from 'classnames';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { Cascader2Props } from './types';

class Cascader2 extends InputPolym<Cascader2Props> {
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

  public renderEditing(props, onChange) {
    return (
      <Cascader
        placeholder=""
        {...props}
        onChange={onChange}
        className={cn(`tongyu-cascaders`, props.className)}
      />
    );
  }
}

export default Cascader2;
