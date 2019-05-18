import React, { PureComponent } from 'react';
import Input from '../Input';

class InputState extends PureComponent<any, any> {
  public render() {
    return (
      <>
        <Input wrapperStyle={{ marginTop: 10 }} type="input" status="success" statusTip="success" />
        <Input wrapperStyle={{ marginTop: 10 }} type="input" status="error" statusTip="error" />
        <Input wrapperStyle={{ marginTop: 10 }} type="input" status="warning" statusTip="warning" />
        <Input wrapperStyle={{ marginTop: 10 }} type="input" status="info" statusTip="info" />
        <Input
          wrapperStyle={{ marginTop: 10 }}
          type="input"
          status="validating"
          statusTip="validating"
        />
      </>
    );
  }
}

export default {
  component: InputState,
  title: 'Input多状态',
};
