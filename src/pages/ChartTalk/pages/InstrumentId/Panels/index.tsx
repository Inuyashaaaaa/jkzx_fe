import { Col, Row } from 'antd';
import React, { memo } from 'react';
import MiniCard from '../containers/MiniCard';

// eslint-disable-next-line
const imgPath = require('../assets/1.png');
// eslint-disable-next-line
const imgPath2 = require('../assets/2.png');

const Panels = memo(props => (
  <Row type="flex" justify="start" gutter={20}>
    <Col>
      <MiniCard title="历史波动率" active imageUrls={[imgPath, imgPath2]}></MiniCard>
    </Col>
    {/* <Col>
      <MiniCard title="隐含波动率"></MiniCard>
    </Col> */}
  </Row>
));

export default Panels;
