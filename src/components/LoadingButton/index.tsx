import Button, { ButtonProps } from 'antd/lib/button';
import React, { PureComponent } from 'react';

export type LoadingButtonProps = ButtonProps & {
  onClick?: (params) => any | Promise<any>;
};

class LoadingButton extends PureComponent<LoadingButtonProps> {
  public state = {
    loading: false,
  };

  public onClick = params => {
    if (!this.props.onClick) {
      return;
    }
    this.setState({
      loading: true,
    });
    const result = this.props.onClick(params);
    result.then(cb => {
      this.setState(
        {
          loading: false,
        },
        () => cb && cb(this)
      );
    });
  };

  public render() {
    return <Button loading={this.state.loading} {...this.props} onClick={this.onClick} />;
  }
}

export default LoadingButton;
