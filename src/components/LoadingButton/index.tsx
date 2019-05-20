import StationalComponent from '@/components/StationalComponent';
import Button, { ButtonProps } from 'antd/lib/button';
import React from 'react';

export type LoadingButtonProps = ButtonProps & {
  onClick?: (params) => any | Promise<any>;
};

class LoadingButton extends StationalComponent<LoadingButtonProps, any> {
  public state = {
    loading: false,
  };

  public onClick = params => {
    if (!this.props.onClick) {
      return;
    }
    this.$setState({
      loading: true,
    });
    const result = this.props.onClick(params);
    if (result instanceof Promise) {
      result.then(this.handleResult);
    } else {
      this.handleResult(result);
    }
  };

  public handleResult = cb => {
    this.$setState(
      {
        loading: false,
      },
      () => cb && cb(this)
    );
  };

  public render() {
    return <Button loading={this.state.loading} {...this.props} onClick={this.onClick} />;
  }
}

export default LoadingButton;
