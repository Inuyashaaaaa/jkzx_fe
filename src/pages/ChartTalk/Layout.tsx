import React, { PureComponent, memo } from 'react';
import Header from './pages/InstrumentId/Header';
import styles from './Layout.less';

const Layout = memo(props => <div className={styles.wrap} {...props}></div>);

export default Layout;
