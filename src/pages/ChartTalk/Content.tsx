import React, { PureComponent, memo } from 'react';
import styles from './Content.less';
import InstrumentId from './pages/InstrumentId';

const Content = memo(props => (
  <div className={styles.wrap}>
    <InstrumentId></InstrumentId>
  </div>
));

export default Content;
