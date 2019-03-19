import React from 'react';
import StationalComponent from '../StationalComponent';
import ModalButtonBase from './ModalButtonBase';
import { ModalButtonProps, ModalButtonState } from './types';

class ModalButton extends StationalComponent<ModalButtonProps, ModalButtonState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }

  public onClick = event => {
    if (!this.props.onClick) {
      return this.$setState({
        visible: true,
      });
    }
    return (this.props as any).onClick(event);
  };

  public onCancel = () => {
    if (!this.props.onCancel) {
      return this.$setState({
        visible: false,
      });
    }
    return this.props.onCancel();
  };

  public onConfirm = () => {
    if (!this.props.onConfirm) {
      return this.$setState({
        visible: false,
      });
    }
    this.setState({
      confirmLoading: true,
    });
    const result = this.props.onConfirm();
    result.then(cb => {
      this.setState(
        {
          confirmLoading: false,
          visible: false,
        },
        () => cb && cb(this)
      );
    });
  };

  public render() {
    return (
      <ModalButtonBase
        {...this.props}
        {...this.getUsedState()}
        onClick={this.onClick}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
      />
    );
  }
}

export default ModalButton;
