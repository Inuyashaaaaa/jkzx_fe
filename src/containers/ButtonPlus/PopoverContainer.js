import ModalPlus from '@/containers/_ModalPlus';
import { Popconfirm, Popover, Tooltip } from 'antd';
import jquery from 'jquery';
import React, { PureComponent } from 'react';

const popoverTypes = {
  popover: Popover,
  toolTip: Tooltip,
  popconfirm: Popconfirm,
  popModal: ModalPlus,
};

const POPOVER_ID = '_popoverId';

class PopoverContainer extends PureComponent {
  componentDidUpdate(prevProps) {
    const { visible, type } = this.props;
    if (type === 'popover' && !visible && prevProps.visible) {
      // debug - 当 popover 隐藏时候，清空未完成的 button 动画，避免输入表单时，无限触发 button animation
      setTimeout(() => {
        jquery('[ant-click-animating-without-extra-node=true]', `#${POPOVER_ID}`).removeAttr(
          'ant-click-animating-without-extra-node'
        );
      }, 0);
    }
  }

  render() {
    const { children, type, ...rest } = this.props;

    const Container = popoverTypes[type];

    if (!Container) {
      throw new Error(`ButtonPlus: popoverTypes ${type} is not defined!`);
    }

    return (
      <Container {...rest} id={POPOVER_ID}>
        {children}
      </Container>
    );
  }
}

export default PopoverContainer;
