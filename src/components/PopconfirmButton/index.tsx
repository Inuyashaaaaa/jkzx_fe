import { Popconfirm } from 'antd';
import Button, { ButtonProps } from 'antd/lib/button';
import React, { PureComponent } from 'react';

export type PopconfirmButtonProps = ButtonProps & {
  onConfirm?: (params) => any | Promise<any>;
};

class PopconfirmButton extends PureComponent<PopconfirmButtonProps> {
  public state = {
    loading: false,
  };

  public onConfirm = params => {
    if (!this.props.onConfirm) {
      return;
    }
    this.setState({
      loading: true,
    });
    const result = this.props.onConfirm(params);
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
    const { title, onConfirm, ...buttonProps } = this.props;
    return (
      <Popconfirm title="确认删除?" {...this.props} onConfirm={this.onConfirm}>
        <Button loading={this.state.loading} {...buttonProps} />
      </Popconfirm>
    );
  }
}

export default PopconfirmButton;
