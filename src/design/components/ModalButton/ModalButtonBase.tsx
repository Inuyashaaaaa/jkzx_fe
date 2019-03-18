import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { ModalButtonBaseProps } from './types';

class ModalButtonBase extends PureComponent<ModalButtonBaseProps> {
  public static defaultProps = {
    visible: false,
    confirmLoading: false,
  };

  public static defaultModalProps = {
    okText: '确认',
    cancelText: '取消',
  };

  public render() {
    const {
      onCancel,
      onConfirm,
      confirmLoading,
      content,
      visible,
      modalProps,
      children,
      ...buttonProps
    } = this.props;

    return (
      <>
        <Modal
          closable={false}
          visible={visible}
          onCancel={onCancel}
          onOk={onConfirm}
          confirmLoading={confirmLoading}
          {...{
            ...ModalButtonBase.defaultModalProps,
            ...modalProps,
          }}
        >
          {content}
        </Modal>
        {children && <Button {...buttonProps}>{children}</Button>}
      </>
    );
  }
}

export default ModalButtonBase;
