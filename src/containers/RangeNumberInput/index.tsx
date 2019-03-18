import { InputPolym } from '@/design/components/Form/Input/InputPolym';
import { Col, InputNumber, Row } from 'antd';
import React from 'react';

class RangeNumberInput extends InputPolym<any> {
  public formatValue = (value): string => {
    return value ? value.join(' ~ ') : '';
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event,
    };
  };

  public parseValue = value => {
    return value;
  };

  public bindChangeHandle = type => val => {
    const value = this.props.value || [];
    if (type === 'min') {
      this._onChange([val, value[1]]);
    }
    if (type === 'max') {
      this._onChange([value[0], val]);
    }
  };

  public renderEditing(props) {
    const usedValue = props.value || [];
    return (
      <Row type="flex" justify="space-between" align="middle" style={{ flexWrap: 'initial' }}>
        <Col>
          <InputNumber
            value={usedValue[0]}
            style={{ flexGrow: 1, width: '100%' }}
            onChange={this.bindChangeHandle('min')}
          />
        </Col>
        <Col style={{ marginLeft: 10, marginRight: 10 }}>-</Col>
        <Col>
          <InputNumber
            value={usedValue[1]}
            style={{ flexGrow: 1, width: '100%' }}
            onChange={this.bindChangeHandle('max')}
          />
        </Col>
      </Row>
    );
  }
}

export default RangeNumberInput;
