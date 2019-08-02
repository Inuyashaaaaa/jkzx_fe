import React, { PureComponent, memo } from 'react';
import styles from './Content.less';
import InstrumentId from '../../pages/CenterUnderlying';
import Risk from '../../pages/CenterRisk';

const Content = memo(props => <div className={styles.wrap}>{props.children}</div>);

export default Content;
