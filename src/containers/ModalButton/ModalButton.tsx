import React, { PureComponent } from 'react';
import ModalButtonBase from './ModalButtonBase';
import { ModalButtonProps, ModalButtonState } from './types';

class ModalButton extends PureComponent<ModalButtonProps, ModalButtonState> {
  public static defaultProps = {
    modalProps: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
    };
  }

  public onClick = event => {
    this.switchVisible();
    if (this.props.onClick) {
      return (this.props as any).onClick(event);
    }
  };

  public switchVisible = () => {
    if (this.props.modalProps.visible == null) {
      this.setState({
        visible: !this.state.visible,
      });
    }
  };

  public switchConfirmLoading = (callback?) => {
    if (this.props.modalProps.confirmLoading == null) {
      this.setState(
        {
          confirmLoading: !this.state.confirmLoading,
        },
        callback
      );
    } else {
      callback();
    }
  };

  public onCancel = () => {
    this.switchVisible();
    if (typeof this.props.modalProps.onCancel === 'function') {
      return this.props.modalProps.onCancel();
    }
  };

  public onConfirm = () => {
    if (typeof this.props.modalProps.onOk !== 'function') {
      return this.switchVisible();
    }
    const result = this.props.modalProps.onOk();
    if (result instanceof Promise) {
      this.switchConfirmLoading(() => {
        result.then(
          callback => {
            this.switchConfirmLoading(() => {
              this.switchVisible();
              if (typeof callback === 'function') {
                callback(this);
              }
            });
          },
          () => {
            this.switchConfirmLoading(() => this.switchVisible());
          }
        );
      });
    } else {
      this.switchVisible();
    }
  };

  public render() {
    return (
      <ModalButtonBase
        {...this.props}
        onClick={this.onClick}
        modalProps={{
          confirmLoading: this.state.confirmLoading,
          visible: this.state.visible,
          ...this.props.modalProps,
          onOk: this.onConfirm,
          onCancel: this.onCancel,
        }}
      />
    );
  }
}

export default ModalButton;
