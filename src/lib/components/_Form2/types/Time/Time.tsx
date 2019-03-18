import { TimePicker } from 'antd';
import { TimePickerProps } from 'antd/lib/time-picker';
import cn from 'classnames';
import moment from 'moment';
import React from 'react';
import { InputCommonClass } from '../Input';
import './index.less';

const { isMoment } = moment;

export interface TimePicker2Props extends TimePickerProps {}

class TimePicker2 extends InputCommonClass<TimePicker2Props> {
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

  public renderChild(props, onChange) {
    const { defaultOpen, inputType, ...rest } = props;
    return (
      <TimePicker
        ref={$inputNode => {
          if (defaultOpen && !this.hasDefaultOpend) {
            setTimeout(() => {
              if ($inputNode) {
                try {
                  $inputNode.timePickerRef.onVisibleChange(true);
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
        className={cn(`tongyu-time2`, rest.className)}
        allowEmpty={false}
      />
    );
  }
}

export default TimePicker2;
