import GlobalFooter from '@/containers/GlobalFooter';
import SelectLang from '@/containers/SelectLang';
import { Icon } from 'antd';
import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import styles from './UserLayout.less';

const logoPath = '/logo.svg';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 同余科技 version {require('@/defaultSettings').version}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  public render() {
    const { children } = this.props;
    return (
      <DocumentTitle title={'欢迎登录 - 同余场外衍生品交易系统'}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logoPath} />
                  <span className={styles.title}>场外衍生品交易管理系统</span>
                </Link>
              </div>
              <div className={styles.desc} />
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
