import { judagePromise } from '@/utils';
import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';
import { omit } from 'lodash';
import React, { PureComponent } from 'react';

type IModalButtonChildren = React.ReactElement<any>;

export interface IModalButtonProps {
  children: IModalButtonChildren;
  onModalOk?: () => boolean | Promise<any>;
  buttonText?: string | React.ReactNode;
  modalProps?: ModalProps;
  onSwitchModal?: (visible: boolean) => void | Promise<any>;
}

export type ModalButtonProps = IModalButtonProps | ButtonProps;

class ModalButton extends PureComponent<ModalButtonProps> {
  public $form = null;

  public state = {
    visible: false,
    loading: false,
  };

  public onOk = () => {
    const onOk = this.getOnOk();

    if (!onOk) return;
    this.setState({ loading: true });
    judagePromise(onOk(), result => {
      this.setState({ loading: false });
      if (!result) return;
      this.switchModal();
    });
  };

  public switchModal = () => {
    const nextVisible = !this.state.visible;

    const onSwitchModal = (this.props as IModalButtonProps).onSwitchModal;

    if (onSwitchModal) {
      return judagePromise(onSwitchModal(nextVisible), () => {
        this.setState({
          visible: nextVisible,
        });
      });
    }

    this.setState({
      visible: nextVisible,
    });
  };

  public getOnOk = () => {
    if ('onModalOk' in this.props) {
      return this.props.onModalOk;
    }
    return undefined;
  };

  public getModalProps = () => {
    if ('modalProps' in this.props) {
      return this.props.modalProps;
    }
    return {};
  };

  public getButtonText = () => {
    if ('buttonText' in this.props) {
      return this.props.buttonText;
    }
    return '新建';
  };

  public render() {
    const { children, ...rest } = this.props;
    return (
      <>
        <Modal
          closable={false}
          {...this.getModalProps()}
          visible={this.state.visible}
          onCancel={this.switchModal}
          onOk={this.onOk}
          confirmLoading={this.state.loading}
        >
          {React.Children.only(children)}
        </Modal>
        <Button
          type="primary"
          icon="file"
          {...omit(rest, ['modalProps', 'onModalOk', 'buttonText', 'onSwitchModal']) as ButtonProps}
          onClick={this.switchModal}
        >
          {this.getButtonText()}
        </Button>
      </>
    );
  }
}

export default ModalButton;
