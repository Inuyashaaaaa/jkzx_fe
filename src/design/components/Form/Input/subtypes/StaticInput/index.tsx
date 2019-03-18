import { Row } from 'antd';
import React, { StatelessComponent } from 'react';
import { StaticInputProps } from './types';

const StaticInput: StatelessComponent<StaticInputProps> = (props): JSX.Element => {
  const { value, className, style } = props;

  return (
    <Row className={className} style={style} align="middle" type="flex">
      {value}
    </Row>
  );
};

export default StaticInput;
