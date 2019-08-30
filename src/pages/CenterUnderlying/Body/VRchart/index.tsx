import { Col, Row } from 'antd';
import React, { memo } from 'react';
import styles from './index.less';
import Rollong from './Rollong';
import Vol from './Vol';

const VRchart = memo(props => (
  <div style={{ border: '1px solid #05507b' }}>
    <Row type="flex" justify="space-between" className={styles.wrap}>
      <Col span={12}>
        <Rollong></Rollong>
      </Col>
      <div className={styles.split}></div>
      <Col span={12}>
        <Vol></Vol>
      </Col>
    </Row>
  </div>
));

export default VRchart;
