import BackBtn from '@/containers/BackBtn';
import MenuContext from '@/layouts/MenuContext';
import { urlToList } from '@/utils';
import { Card, PageHeader } from 'antd';
import { connect } from 'dva';
import React, { memo } from 'react';
import GridContent from './GridContent';
import styles from './index.less';
import Link from 'umi/link';
import _ from 'lodash';

const Page = ({
  children,
  wrapperClassName,
  top,
  card = true,
  cardMinHeight = 720,
  back = false,
  title,
  subTitle,
  backIcon,
  tags,
  extra,
  footer,
  onBack,
}) => {
  const itemRender = (route, params, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return !route.component || last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  };

  return (
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
      {top}
      <MenuContext.Consumer>
        {value => {
          const paths = urlToList(value.location.pathname);
          const routes = paths.map(p => value.breadcrumbNameMap[p]).filter(item => item != null);
          const breadcrumbRoutes = routes.map(item => {
            return {
              breadcrumbName: item.label,
              path: item.path,
              component: item.component,
            };
          });
          return (
            <PageHeader
              title={title || _.get(_.last(breadcrumbRoutes), 'breadcrumbName')}
              subTitle={subTitle}
              backIcon={backIcon}
              tags={tags}
              extra={extra || (back && <BackBtn />)}
              breadcrumb={{ routes: breadcrumbRoutes, itemRender }}
              footer={footer}
              onBack={onBack}
            />
          );
        }}
      </MenuContext.Consumer>
      {children ? (
        <div className={styles.content}>
          <GridContent>
            {card ? (
              <Card bordered={false} style={{ minHeight: cardMinHeight }}>
                {children}
              </Card>
            ) : (
              children
            )}
          </GridContent>
        </div>
      ) : null}
    </div>
  );
};

export default memo(
  connect(({ setting }) => ({
    contentWidth: setting.contentWidth,
  }))(Page)
);
