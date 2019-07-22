import { Layout, BackTop } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import { ContainerQuery } from 'react-container-query';
import DocumentTitle from 'react-document-title';
import Media from 'react-media';
import ErrorBoundary from '@/containers/ErrorBoundary';
import SiderMenu from '@/containers/SiderMenu';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

const logoPath = '/logo.svg';

// lazy load SettingDrawer

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = memoizeOne(menuData => {
  const routerMap = {};
  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
});

const matchParamsPath = memoizeOne((pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
});

const getPageTitle = memoizeOne((pathname, breadcrumbNameMap) => {
  const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);

  if (!currRouterData) {
    return '同余场外衍生品交易系统';
  }
  return `${currRouterData.label} - 同余场外衍生品交易系统`;
});

class BasicLayout extends React.PureComponent {
  public static getDerivedStateFromProps(props) {
    const {
      location: { pathname },
    } = props;
    const breadcrumbNameMap = getBreadcrumbNameMap(props.menuData);
    return {
      breadcrumbNameMap,
      pageTitle: getPageTitle(pathname, breadcrumbNameMap),
    };
  }

  public state = {
    pageTitle: '',
    // eslint-disable-next-line react/no-unused-state
    breadcrumbNameMap: {},
  };

  public componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/replenish',
    });
  }

  public componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
    const { location, dispatch } = this.props;

    const locationChanged = location !== preProps.location;
    if (locationChanged) {
      dispatch({
        type: 'preRouting/save',
        payload: preProps.location,
      });
    }
  }

  public getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.state.breadcrumbNameMap,
    };
  }

  public getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  public getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
      position: 'relative',
    };
  };

  public handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  public render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
    } = this.props;
    const isTop = PropsLayout === 'topmenu';
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logoPath}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logoPath}
            isMobile={isMobile}
            {...this.props}
          />
          <ErrorBoundary>
            <Content style={this.getContentStyle()}>{children}</Content>
          </ErrorBoundary>
          <Footer />
          <BackTop style={{ right: '10px', bottom: '10px' }} />
        </Layout>
      </Layout>
    );
    return (
      <DocumentTitle title={this.state.pageTitle}>
        <ContainerQuery query={query}>
          {params => (
            <Context.Provider value={this.getContext()}>
              <div className={classNames(params)}>{layout}</div>
            </Context.Provider>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
