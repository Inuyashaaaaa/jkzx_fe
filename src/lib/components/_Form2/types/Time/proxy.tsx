import React, { PureComponent } from 'react';
import TimePicker2, { AllTimePicker2Props } from './Time';

class TimeProxy extends PureComponent<AllTimePicker2Props> {
  public state = {
    value: undefined,
  };

  public onChange = (value, str) => {
    if ('onChange' in this.props) {
      return this.props.onChange(value, str);
    }
    this.setState({ value });
  };

  public render() {
    return (
      <TimePicker2
        {...this.props}
        onChange={this.onChange}
        value={this.props.value || this.state.value}
      />
    );
  }
}

export default TimeProxy;
