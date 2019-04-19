import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { PureComponent } from 'react';
import { ModalButtonBaseProps } from './types';

class ModalButtonBase extends PureComponent<ModalButtonBaseProps> {
  public static defaultModalProps = {
    okText: '确认',
    cancelText: '取消',
  };

  public render() {
    const { content, modalProps, children, text, ...props } = this.props;
    return (
      <>
        <Modal {...ModalButtonBase.defaultModalProps} children={content} {...modalProps} />
        {children &&
          (text ? (
            <a
              href="javascript:;"
              {...props as React.DetailedHTMLProps<
                React.AnchorHTMLAttributes<HTMLAnchorElement>,
                HTMLAnchorElement
              >}
            >
              {children}
            </a>
          ) : (
            <Button {...props as ButtonProps}>{children}</Button>
          ))}
      </>
    );
  }
}

export default ModalButtonBase;
