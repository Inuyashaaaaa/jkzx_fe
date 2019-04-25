import { DatePicker as AntdDatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { omit } from 'lodash';
import moment, { isMoment } from 'moment';
import React from 'react';
import { InputBase } from '../type';

export interface IDatePickerProps extends DatePickerProps {
  defaultOpen?: boolean;
}

class DatePicker extends InputBase<IDatePickerProps> {
  public static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
  };

  public hasDefaultOpend = false;

  public getRef = node => {
    if (this.props.defaultOpen && !this.hasDefaultOpend && node && node.picker) {
      setTimeout(() => {
        try {
          node.picker.handleOpenChange(true);
          this.hasDefaultOpend = true;
        } catch (error) {
          console.warn(error);
        }
      });
    }
  };

  public onChange = (date: moment.Moment, dateString: string) => {
    const isM = isMoment(this.props.value);
    if (this.props.onChange) {
      this.props.onChange(isM ? date : dateString);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(isM ? date : dateString);
    }
  };

  public parse = () => {
    const { value } = this.props;
    if (!value) return value;
    return isMoment(value) ? value : moment(value, this.getFormat());
  };

  public getFormat = () => {
    const { format } = this.props;
    return Array.isArray(format) ? format[0] : format;
  };

  public renderEditing() {
    return (
      <AntdDatePicker
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        value={this.parse()}
        style={{
          width: '100%',
          ...this.props.style,
        }}
        onChange={this.onChange}
        ref={this.getRef}
      />
    );
  }

  public renderRendering() {
    const value = this.parse();
    return (
      <span style={{ display: 'inline-block', width: '100%' }}>
        {isMoment(value) ? value.format(this.getFormat()) : value}
      </span>
    );
  }
}

export default DatePicker;
