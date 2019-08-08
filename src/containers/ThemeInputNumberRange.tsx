import React, { memo } from 'react';
import { Row, Col } from 'antd';
import ThemeInputNumber from './ThemeInputNumber';

const InputNumberRange = memo(props => {
  const { value = [], onChange } = props;

  const bindChangeHandle = type => val => {
    if (type === 'min') {
      if (onChange) {
        onChange([val, value[1]]);
      }
    }
    if (type === 'max') {
      if (onChange) {
        onChange([value[0], val]);
      }
    }
  };

  return (
    <Row type="flex" justify="space-between" align="middle" style={{ flexWrap: 'initial' }}>
      <Col>
        <ThemeInputNumber
          value={value[0]}
          style={{ flexGrow: 1, width: '85px' }}
          onChange={bindChangeHandle('min')}
        />
      </Col>
      <Col style={{ marginLeft: 10, marginRight: 10, color: 'white' }}>-</Col>
      <Col>
        <ThemeInputNumber
          value={value[1]}
          style={{ flexGrow: 1, width: '85px' }}
          onChange={bindChangeHandle('max')}
        />
      </Col>
    </Row>
  );
});

export default InputNumberRange;
