import React, { PureComponent } from 'react';
import DatePicker2, { AllDatePicker2Props, IRangeOnChange, ISingleOnChange } from './Date';

class DateProxy extends PureComponent<AllDatePicker2Props> {
  public state = {
    value: undefined,
  };

  public onChange = (value, str) => {
    if ('onChange' in this.props) {
      if (Array.isArray(value)) {
        return (this.props.onChange as IRangeOnChange)(value, str);
      }
      return (this.props.onChange as ISingleOnChange)(value, str);
    }
    this.setState({ value });
  };

  public getValue = () => {
    if ('value' in this.props) {
      return this.props.value;
    }
    return this.state.value;
  };

  public render() {
    return <DatePicker2 {...this.props} onChange={this.onChange} value={this.getValue()} />;
  }
}

export default DateProxy;
