import { Checkbox, Icon } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import cn from 'classnames';
import React from 'react';
import { InputCommonClass } from '../Input';
import './index.less';

export interface Checkbox2Props extends CheckboxProps {
  label?: string;
  emptyFormatWhenNullValue?: boolean;
}

class Checkbox2 extends InputCommonClass<Checkbox2Props> {
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

  public renderChild(props, onChange) {
    return (
      <Checkbox
        {...props}
        checked={props.value}
        className={cn(`tongyu-checkbox2`, props.className)}
        onChange={onChange}
      >
        {this.getLabel()}
      </Checkbox>
    );
  }
}

export default Checkbox2;
