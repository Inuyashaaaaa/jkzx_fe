import React, { PureComponent } from 'react';
import Exception from '@/lib/components/Exception';
import { Button } from 'antd';

class ErrorBoundary extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error, errorInfo) {
    this.setState({ error });
  }

  public render() {
    if (this.state.error) {
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

export default ErrorBoundary;
