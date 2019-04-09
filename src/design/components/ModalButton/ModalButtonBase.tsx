import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { ModalButtonBaseProps } from './types';

class ModalButtonBase extends PureComponent<ModalButtonBaseProps> {
  public static defaultModalProps = {
    okText: '确认',
    cancelText: '取消',
  };

  public render() {
    const { content, modalProps, children, ...buttonProps } = this.props;
    return (
      <>
        <Modal {...ModalButtonBase.defaultModalProps} {...modalProps}>
          {content}
        </Modal>
        {children && <Button {...buttonProps}>{children}</Button>}
      </>
    );
  }
}

export default ModalButtonBase;
