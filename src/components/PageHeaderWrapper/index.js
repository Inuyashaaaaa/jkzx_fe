import React from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import { Card } from 'antd';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';
import BackBtn from '@/components/BackBtn';

const PageHeaderWrapper = ({
  children,
  contentWidth,
  wrapperClassName,
  top,
  card = true,
  cardMinHeight = 720,
  back = false,
  ...restProps
}) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
            }
            return item.title;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>
          {card ? (
            <Card bordered={false} style={{ minHeight: cardMinHeight }} extra={back && <BackBtn />}>
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

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
