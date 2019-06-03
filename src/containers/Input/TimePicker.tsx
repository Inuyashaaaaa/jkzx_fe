import { TimePicker as AntdTimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/date-picker/interface';
import { omit } from 'lodash';
import moment, { isMoment } from 'moment';
import React from 'react';
import { InputBase } from '../../components/type';

export interface ITimePickerProps extends TimePickerProps {
  defaultOpen?: boolean;
}

class TimePicker extends InputBase<ITimePickerProps> {
  public static defaultProps = {
    format: 'HH:mm:ss',
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
    if (this.props.onChange) {
      this.props.onChange(date, dateString);
    }

    if (this.props.onValueChange) {
      this.props.onValueChange(date, dateString);
    }
  };

  public parse = () => {
    const { value } = this.props;
    if (!value) return value;
    return isMoment(value) ? value : moment(value, this.getFormat());
  };

  public getFormat = () => {
    const { format } = this.props;
    return format;
  };

  public renderEditing() {
    return (
      <AntdTimePicker
        {...omit(this.props, ['autoSelect', 'onValueChange', 'editing'])}
        value={this.props.value}
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

export default TimePicker;
