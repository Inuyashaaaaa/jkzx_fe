import React, { PureComponent } from 'react';
import { Modal } from 'antd';

class ModalPlus extends PureComponent {
  state = {
    visible: false,
  };

  proxyBubbleClick = onClick => (...args) => {
    if ('visible' in this.props) return;
    this.switchVisible();
    onClick?.(...args);
  };

  getUsedState = () => {
    return {
      ...this.state,
      ...this.props,
    };
  };

  handleCancel = e => {
    const { onCancel } = this.props;
    if ('visible' in this.props === false) {
      this.switchVisible();
    }
    onCancel?.(e);
  };

  switchVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const { children, content, ...rest } = this.getUsedState();

    const fillModal = (
      <Modal {...rest} onCancel={this.handleCancel}>
        {content}
      </Modal>
    );

    return children ? (
      <>
        {React.cloneElement(React.Children.only(children), {
          onClick: this.proxyBubbleClick(children.props.onClick),
        })}
        {fillModal}
      </>
    ) : (
      fillModal
    );
  }
}

export default ModalPlus;
