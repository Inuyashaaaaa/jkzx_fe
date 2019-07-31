import { Col, Row } from 'antd';
import React, { memo } from 'react';
import styles from './index.less';
import Vol3d from './Vol3d';

const Shadow = memo(props => (
  <Row type="flex" justify="space-between" className={styles.wrap}>
    <Col span={12}>
      <Vol3d></Vol3d>
    </Col>
    <Col span={12}>
      <Vol3d></Vol3d>
    </Col>
  </Row>
));

export default Shadow;
