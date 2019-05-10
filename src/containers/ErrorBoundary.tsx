import React, { PureComponent } from 'react';
import Exception from '@/lib/components/Exception';
import { Button } from 'antd';
import withRouter from 'umi/withRouter';

class ErrorBoundary extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = { errorPathname: null };
  }

  public componentDidCatch(error, errorInfo) {
    this.setState({ errorPathname: this.props.location.pathname });
  }

  public render() {
    const { location } = this.props;

    if (this.state.errorPathname === location.pathname) {
      return (
        <Exception
          type="404"
          title="Oops..."
          desc={'抱歉，发生了未知错误'}
          backText={'刷新页面'}
          actions={
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
