import StaticInput from '@/lib/components/_InputPlus/StaticInput';
import { TimePicker } from 'antd';
import classNames from 'classnames';
import moment, { isMoment } from 'moment';
import { bool, func, string } from 'prop-types';
import React, { PureComponent } from 'react';
import './index.less';

class TimePickerPlus extends PureComponent {
  static propTypes = {
    interactive: bool,
    size: string,
    bordered: bool,
    format: string,
    hideEditIcon: bool,
    onEditIconClick: func,
    placeholder: string,
  };

  static defaultProps = {
    interactive: true,
    size: 'default',
    bordered: true,
    format: 'HH:mm:ss',
    hideEditIcon: false,
  };

  convertToMoment = (value, format) => {
    if (value === undefined) return value;

    if (!isMoment(value)) {
      value = moment(value, format);
    }

    return value;
  };

  convertToString = (value, format) => {
    if (value === undefined) return value;
    if (isMoment(value)) {
      value = value.format(format);
    }
    return value;
  };

  render() {
    const {
      getFormControlRef,
      value,
      onChange,
      className,
      interactive,
      bordered,
      hideEditIcon,
      onEditIconClick,
      placeholder,
      iconType,
      hoverAppealIcon,
      hoverIconType,
      ...rest
    } = this.props;
    const { size, format } = rest;

    return interactive ? (
      <TimePicker
        {...rest}
        value={this.convertToMoment(value, format)}
        onChange={onChange}
        ref={getFormControlRef}
        className={classNames(`tongyu-time-plus`, className, size, {
          'no-border': !bordered,
        })}
      />
    ) : (
      <StaticInput
        hoverIconType={hoverIconType}
        iconType={iconType}
        hoverAppealIcon={hoverAppealIcon}
        bordered={bordered}
        size={size}
        className={className}
        value={this.convertToString(value, format)}
        placeholder={placeholder}
        onEditIconClick={onEditIconClick}
        hideEditIcon={hideEditIcon}
      />
    );
  }
}

export default TimePickerPlus;
