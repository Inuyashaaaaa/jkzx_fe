import { Col, Row } from 'antd';
import React, { memo } from 'react';
import styles from './index.less';
import Rollong from './Rollong';
import Vol from './Vol';

const VRchart = memo(props => (
  <>
    <Rollong></Rollong>
    <Vol></Vol>
  </>
));

export default VRchart;
