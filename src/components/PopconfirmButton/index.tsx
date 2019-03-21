import { Omit } from '@/design/components/common/types';
import StationalComponent from '@/design/components/StationalComponent';
import { Popconfirm } from 'antd';
import Button, { ButtonProps } from 'antd/lib/button';
import { PopconfirmProps } from 'antd/lib/popconfirm';
import React from 'react';

export interface IPopconfirmProps extends Omit<PopconfirmProps, 'onConfirm'> {
  onConfirm?: (params) => any | Promise<any>;
}

export type PopconfirmButtonProps = ButtonProps & {
  popconfirmProps?: IPopconfirmProps;
};

class PopconfirmButton extends StationalComponent<PopconfirmButtonProps, any> {
  public state = {
    loading: false,
    popconfirmProps: {},
  };

  public onConfirm = params => {
    if (!this.props.popconfirmProps.onConfirm) {
      return;
    }
    this.$setState({
      loading: true,
    });
    const result = this.props.popconfirmProps.onConfirm(params);

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
    const { popconfirmProps, ...buttonProps } = this.props;
    return (
      <Popconfirm {...popconfirmProps}>
        <Button loading={this.state.loading} {...buttonProps} />
      </Popconfirm>
    );
  }
}

export default PopconfirmButton;
