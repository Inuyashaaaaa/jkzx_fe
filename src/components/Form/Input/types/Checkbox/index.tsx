import { Checkbox } from 'antd';
import cn from 'classnames';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { Checkbox2Props } from './types';

class Checkbox2 extends InputPolym<Checkbox2Props> {
  public formatValue = value => {
    if (value) {
      return '是';
    }
    return this.props.emptyFormatWhenNullValue ? '' : '否';
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event.target.checked,
    };
  };

  public parseValue = value => {
    if (value === 'true') return true;

    if (value === 'false') return false;

    return value;
  };

  public getLabel = () => {
    if ('label' in this.props) {
      return this.props.label;
    }
    return '';
  };

  public renderEditing(props, onChange) {
    return (
      <Checkbox
        {...props}
        checked={props.value}
        className={cn(`tongyu-checkbox`, props.className)}
        onChange={onChange}
      >
        {this.getLabel()}
      </Checkbox>
    );
  }
}

export default Checkbox2;
