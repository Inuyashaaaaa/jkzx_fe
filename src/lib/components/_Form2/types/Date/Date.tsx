import { DatePicker } from 'antd';
import {
  DatePickerProps,
  MonthPickerProps,
  RangePickerProps,
  RangePickerValue,
  WeekPickerProps,
} from 'antd/lib/date-picker/interface';
import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import { InputCommonClass } from '../Input';
import './index.less';

const { isMoment } = moment;

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// omit [undefined, undefined]
export type RangePickerValueSafe =
  | [moment.Moment]
  | [undefined, moment.Moment]
  | [moment.Moment, moment.Moment];

export type AllDatePicker2Props =
  | DatePicker2Props
  | RangePickerProps
  | WeekPickerProps
  | MonthPickerProps;

export type IRangeOnChange = (dates: RangePickerValue, dateStrings: [string, string]) => void;

export type ISingleOnChange = (date: moment.Moment, dateString: string) => void;

export interface DatePicker2Props extends DatePickerProps {
  range?: 'week' | 'range' | 'month' | 'day';
  format?: string;
  className?: string;
}

class DatePicker2 extends InputCommonClass<AllDatePicker2Props> {
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
      origin: event,
      normal: event,
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

  public renderChild(props, onChange) {
    const { defaultOpen, ...rest } = props;

    const commonProps = {
      format: this.getDefaultFormat(),
      onChange,
      className: cn(`tongyu-date`, props.className),
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
