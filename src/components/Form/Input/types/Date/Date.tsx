import { DatePicker } from 'antd';
import { WeekPickerProps } from 'antd/lib/date-picker/interface';
import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { AllDatePicker2Props, RangePickerValueSafe } from './types';

const { isMoment } = moment;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class DatePicker2 extends InputPolym<AllDatePicker2Props> {
  public hasDefaultOpend = false;
  public formatValue = (value): string => {
    const format = this.getDefaultFormat();

    if (value === undefined) return '';
    if (Array.isArray(value)) {
      return (value as RangePickerValueSafe)
        .map(item => {
          if (!item) return '-';
          if (isMoment(item)) {
            return item.format(format);
          }
          return item;
        })
        .join(' ~ ');
    }
    if (isMoment(value)) {
      return value.format(format);
    }
    return moment(value).format(format);
  };

  public parseValue = value => {
    const format = this.getDefaultFormat();

    if (value === undefined) return value;

    if (Array.isArray(value)) {
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

  public formatChangeEvent = event => {
    return {
      origin: event || undefined,
      normal: event || undefined,
    };
  };

  public getDefaultFormat = () => {
    if ('format' in this.props) {
      if (Array.isArray(this.props.format)) {
        return this.props.format.join(' ~ ');
      }
      return this.props.format;
    }

    if ('range' in this.props) {
      const { range } = this.props;

      if (range === 'week') {
        return 'YYYY-ww';
      }
      if (range === 'range') {
        return 'YYYY-MM-DD';
      }
      if (range === 'month') {
        return 'YYYY-MM';
      }
    }

    return 'YYYY-MM-DD';
  };

  public renderEditing(props, onChange) {
    const { defaultOpen, ...rest } = props;

    const commonProps = {
      format: this.getDefaultFormat(),
      onChange,
      className: cn(`tongyu-dates`, props.className),
      value: props.value,
      allowClear: false,
      ref: $inputNode => {
        if (defaultOpen && !this.hasDefaultOpend) {
          setTimeout(() => {
            if ($inputNode) {
              try {
                $inputNode.picker.handleOpenChange(true);
                this.hasDefaultOpend = true;
              } catch (error) {
                console.warn(error);
              }
            }
          }, 0);
        }
      },
    };

    if ('range' in props) {
      const { range } = props;

      if (range === 'week') {
        return (
          <WeekPicker
            {...rest as WeekPickerProps}
            {...commonProps}
            className={cn(commonProps.className, `week`)}
          />
        );
      }
      if (range === 'range') {
        return <RangePicker {...rest} {...commonProps} />;
      }
      if (range === 'month') {
        return <MonthPicker {...rest} {...commonProps} />;
      }
    }

    return <DatePicker {...rest} {...commonProps} />;
  }
}

export default DatePicker2;
