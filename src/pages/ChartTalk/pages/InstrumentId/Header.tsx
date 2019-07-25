import React, { PureComponent, memo } from 'react';
import { Select, Row, Col } from 'antd';
import ThemeSelect from './containers/ThemeSelect';

const Header = memo(props => (
  <Row type="flex" justify="start">
    <Col>
      <ThemeSelect placeholder="标的物" style={{ minWidth: 200 }}>
        <Select.Option value="1">标的物1</Select.Option>
        <Select.Option value="2">标的物2</Select.Option>
      </ThemeSelect>
    </Col>
  </Row>
));

export default Header;
