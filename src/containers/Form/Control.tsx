import { Form } from 'antd';
import React, { FunctionComponent } from 'react';
import { IControlProps } from './types';

const { Item: FormItem } = Form;

const Control: FunctionComponent<IControlProps> = (props): JSX.Element => {
  return <FormItem {...props} />;
};

export default Control;
