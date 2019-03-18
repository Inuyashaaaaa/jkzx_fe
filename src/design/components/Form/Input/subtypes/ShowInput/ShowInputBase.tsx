import { Icon } from 'antd';
import classNames from 'classnames';
import React, { StatelessComponent } from 'react';
import './index.less';
import { ShowInputBaseProps } from './types';

const ShowInputBase: StatelessComponent<ShowInputBaseProps> = (props): JSX.Element => {
  const {
    size = 'default',
    icon,
    bordered = true,
    value,
    placeholder,
    onIconClick,
    iconVisible,
    className,
    onIconMouseEnter,
    onIconMouseLeave,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      className={classNames('tongyu-input-static', 'ant-input-number', className, {
        'no-border': !bordered,
      })}
    >
      <div className="ant-input-number-input-wrap">
        <input
          placeholder={value || placeholder}
          disabled={true}
          type="text"
          className="ant-input-number-input"
        />
      </div>
      {icon && (
        <span
          style={{
            display: iconVisible ? 'inline-block' : 'none',
          }}
          onMouseLeave={onIconMouseLeave}
          onMouseEnter={onIconMouseEnter}
          className="tongyu-input-static-icon"
        >
          <Icon type={icon} onClick={onIconClick} />
        </span>
      )}
    </div>
  );
};

export default ShowInputBase;
