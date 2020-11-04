import React, { memo } from 'react';
import styles from './Content.less';

const Content = memo(props => <div className={styles.wrap}>{props.children}</div>);

export default Content;
