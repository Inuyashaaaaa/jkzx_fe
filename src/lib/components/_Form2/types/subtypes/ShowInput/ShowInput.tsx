import { Icon } from 'antd';
import classNames from 'classnames';
import React, { MouseEventHandler, StatelessComponent } from 'react';
import { ISize } from '../../Input';

export interface ShowInputProps {
  size?: ISize;
  bordered?: boolean;
  value?: string;
  placeholder?: string;
  className?: string;
  icon?: string;
  iconVisible?: boolean;
  onIconClick?: () => void;
  onIconMouseEnter?: MouseEventHandler;
  onIconMouseLeave?: MouseEventHandler;
}

const ShowInput: StatelessComponent<ShowInputProps> = (props): JSX.Element => {
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

export default ShowInput;
