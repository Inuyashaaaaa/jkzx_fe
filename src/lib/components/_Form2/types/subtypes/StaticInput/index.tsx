import { Row } from 'antd';
import React, { StatelessComponent, StyleHTMLAttributes } from 'react';

export interface StaticInputProps {
  value?: string | React.ReactNode;
  style?: StyleHTMLAttributes<any>;
  className?: string;
}

const StaticInput: StatelessComponent<StaticInputProps> = (props): JSX.Element => {
  const { value, className, style } = props;

  return (
    <Row className={className} style={style} align="middle" type="flex">
      {value}
    </Row>
  );
};

export default StaticInput;
