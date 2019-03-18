import { Icon } from 'antd';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import './StaticInput.less';

export default class StaticInput extends PureComponent {
  state = {
    hover: false,
  };

  onMouseEnter = () => {
    this.setState({
      hover: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      hover: false,
    });
  };

  render() {
    const { hover } = this.state;
    const {
      className,
      bordered,
      value,
      placeholder,
      hideEditIcon,
      onEditIconClick,
      iconType = 'edit',
      hoverIconType = 'edit',
      hoverAppealIcon = true,
    } = this.props;

    return (
      <div
        className={classNames('tongyu-input-static', 'ant-input-number', className, {
          'no-border': !bordered,
          'hover-appeal-icon': hoverAppealIcon,
        })}
      >
        <div className="ant-input-number-input-wrap">
          <input
            placeholder={value || placeholder}
            disabled
            type="text"
            className="ant-input-number-input"
          />
        </div>
        {!hideEditIcon && (
          <span
            onMouseLeave={this.onMouseLeave}
            onMouseEnter={this.onMouseEnter}
            className="tongyu-input-static-icon"
          >
            <Icon type={hover ? hoverIconType : iconType} onClick={onEditIconClick} />
          </span>
        )}
      </div>
    );
  }
}
