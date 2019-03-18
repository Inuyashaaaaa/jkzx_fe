import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { PureStateComponent } from '@/lib/components/_Components';
import React from 'react';
import styles from './index.less';

class Component extends PureStateComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper>
        <div className={styles.main}>123</div>
      </PageHeaderWrapper>
    );
  }
}

export default Component;
