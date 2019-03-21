import StationalComponent from '@/design/components/StationalComponent';
import { Popconfirm } from 'antd';
import Button, { ButtonProps } from 'antd/lib/button';
import { PopconfirmProps } from 'antd/lib/popconfirm';
import React from 'react';

export type PopconfirmButtonProps = ButtonProps & {
  onConfirm?: (params) => any | Promise<any>;
  popconfirmProps?: PopconfirmProps;
  confirmTitle?: string;
};

class PopconfirmButton extends StationalComponent<PopconfirmButtonProps, any> {
  public state = {
    loading: false,
  };

  public onConfirm = params => {
    if (!this.props.onConfirm) {
      return;
    }
    this.$setState({
      loading: true,
    });
    const result = this.props.onConfirm(params);

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
    const { confirmTitle, onConfirm, popconfirmProps, ...buttonProps } = this.props;
    return (
      <Popconfirm title={confirmTitle} onConfirm={this.onConfirm} {...popconfirmProps}>
        <Button loading={this.state.loading} {...buttonProps} />
      </Popconfirm>
    );
  }
}

export default PopconfirmButton;
