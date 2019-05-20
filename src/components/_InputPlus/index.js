import StaticInput from '@/components/_InputPlus/StaticInput';
import { Input } from 'antd';
import classNames from 'classnames';
import { bool, func, string } from 'prop-types';
import React, { PureComponent } from 'react';
import './index.less';

class InputPlus extends PureComponent {
  static propTypes = {
    interactive: bool,
    size: string,
    bordered: bool,
    hideEditIcon: bool,
    onEditIconClick: func,
    getFormControlRef: func,
    placeholder: string,
  };

  static defaultProps = {
    interactive: true,
    size: 'default',
    bordered: true,
    hideEditIcon: false,
  };

  render() {
    const {
      getFormControlRef,
      value,
      onChange,
      className,
      interactive,
      bordered,
      hideEditIcon,
      onEditIconClick,
      iconType,
      hoverAppealIcon,
      hoverIconType,
      ...rest
    } = this.props;

    const { size, placeholder } = rest;

    return interactive ? (
      <Input
        {...rest}
        value={value}
        onChange={onChange}
        ref={getFormControlRef}
        className={classNames(`tongyu-input-plus`, className, size, {
          'no-border': !bordered,
        })}
      />
    ) : (
      <StaticInput
        hoverIconType={hoverIconType}
        iconType={iconType}
        hoverAppealIcon={hoverAppealIcon}
        bordered={bordered}
        size={size}
        className={className}
        value={value}
        placeholder={placeholder}
        onEditIconClick={onEditIconClick}
        hideEditIcon={hideEditIcon}
      />
    );
  }
}

export default InputPlus;
