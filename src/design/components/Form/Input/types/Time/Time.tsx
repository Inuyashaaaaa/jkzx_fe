import { TimePicker } from 'antd';
import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import { InputPolym } from '../../InputPolym';
import './index.less';
import { TimePicker2Props } from './types';

const { isMoment } = moment;

class TimePicker2 extends InputPolym<TimePicker2Props> {
  public hasDefaultOpend = false;

  public formatValue = value => {
    const format = this.getDefaultFormat();
    if ('formatValue' in this.props) {
      return this.props.formatValue(value);
    }
    if (isMoment(value)) {
      return value.format(format);
    }
    return value;
  };

  public parseValue = value => {
    const format = this.getDefaultFormat();

    if (value === undefined) return value;

    if (!isMoment(value)) {
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
      return this.props.format;
    }
    return 'HH:mm:ss';
  };

  public renderEditing(props, onChange) {
    const { defaultOpen, inputType, ...rest } = props;
    return (
      <TimePicker
        ref={$inputNode => {
          if (defaultOpen && !this.hasDefaultOpend) {
            setTimeout(() => {
              if ($inputNode) {
                try {
                  ($inputNode as any).timePickerRef.onVisibleChange(true);
                  this.hasDefaultOpend = true;
                } catch (error) {
                  console.warn(error);
                }
              }
            }, 0);
          }
        }}
        {...rest}
        onChange={onChange}
        format={this.getDefaultFormat()}
        value={rest.value}
        className={cn(`tongyu-time`, rest.className)}
        allowEmpty={false}
      />
    );
  }
}

export default TimePicker2;
