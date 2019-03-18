import StaticInput from '@/lib/components/_InputPlus/StaticInput';
import { DatePicker } from 'antd';
import classNames from 'classnames';
import moment, { isMoment } from 'moment';
import { array, bool, func, instanceOf as instance, oneOf, oneOfType, string } from 'prop-types';
import React, { PureComponent } from 'react';
import './index.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class DatePickerPlus extends PureComponent {
  static propTypes = {
    value: oneOfType([string, instance(moment), array]),
    range: oneOf(['week', 'range', 'month', 'day']),
    allowClear: bool,
    interactive: bool,
    size: string,
    bordered: bool,
    hideEditIcon: bool,
    onEditIconClick: func,
    placeholder: string,
  };

  static defaultProps = {
    range: 'day',
    allowClear: false,
    interactive: true,
    size: 'default',
    bordered: true,
    hideEditIcon: false,
  };

  static dateTypes = {
    week: WeekPicker,
    range: RangePicker,
    month: MonthPicker,
    day: DatePicker,
  };

  handleChange = (date, dateString) => {
    const { onChange } = this.props;
    onChange?.(dateString, date);
  };

  convertToMoment = (value, format, range) => {
    if (value === undefined) return value;

    if (range === 'range') {
      value = value.map(item => {
        if (!isMoment(item)) {
          return moment(item, format);
        }
        return item;
      });
    } else if (!isMoment(value)) {
      value = moment(value, format);
    }

    return value;
  };

  convertToString = (value, format, range) => {
    if (value === undefined) return value;
    if (range === 'range') {
      value = value
        .map(item => {
          if (isMoment(item)) {
            return item.format(format);
          }
          return item;
        })
        .join(' ~ ');
    } else if (isMoment(value)) {
      value = value.format(format);
    }
    return value;
  };

  getDefaultFormat = range => {
    if (range === 'week') {
      return 'YYYY-ww';
    }
    if (range === 'range') {
      return 'YYYY-MM-DD';
    }
    if (range === 'month') {
      return 'YYYY-MM';
    }
    if (range === 'day') {
      return 'YYYY-MM-DD';
    }
  };

  render() {
    const {
      getFormControlRef,
      range,
      value,
      interactive,
      className,
      bordered,
      hideEditIcon,
      onEditIconClick,
      placeholder,
      iconType,
      hoverAppealIcon,
      hoverIconType,
      ...rest
    } = this.props;
    const { format, size } = rest;

    const defaultFormat = format || this.getDefaultFormat(range);
    const convertedValue = this.convertToMoment(value, defaultFormat, range);

    return interactive ? (
      React.createElement(DatePickerPlus.dateTypes[range], {
        ...rest,
        ref: getFormControlRef,
        value: convertedValue,
        onChange: this.handleChange,
        className: classNames(`tongyu-date-plus`, className, size, {
          'no-border': !bordered,
        }),
      })
    ) : (
      <StaticInput
        hoverIconType={hoverIconType}
        iconType={iconType}
        hoverAppealIcon={hoverAppealIcon}
        bordered={bordered}
        size={size}
        className={className}
        value={this.convertToString(value, defaultFormat, range)}
        placeholder={placeholder}
        onEditIconClick={onEditIconClick}
        hideEditIcon={hideEditIcon}
      />
    );
  }
}

export default DatePickerPlus;
