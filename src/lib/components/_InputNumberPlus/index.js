import StaticInput from '@/lib/components/_InputPlus/StaticInput';
import { InputNumber } from 'antd';
import classNames from 'classnames';
import { bool, func, oneOf, string } from 'prop-types';
import React, { PureComponent } from 'react';
import './index.less';

class InputNumberPlus extends PureComponent {
  static propTypes = {
    interactive: bool,
    size: string,
    bordered: bool,
    unit: oneOf(['¥', '%']),
    hideEditIcon: bool,
    onEditIconClick: func,
    placeholder: string,
  };

  static defaultProps = {
    interactive: true,
    size: 'default',
    bordered: true,
    hideEditIcon: false,
  };

  getFormatter = (unit, formatter) => {
    if (formatter) return formatter;
    if (unit === '¥') {
      return val => {
        return val ? `${unit} ${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
      };
    }
    if (unit === '%') {
      return val => (val ? `${val} %` : '');
    }
  };

  getParser = (unit, parser) => {
    if (parser) return parser;

    if (unit === '¥') {
      return val => {
        return val ? val.replace(new RegExp(`${unit}s?|(,*)`, 'g'), '') : '';
      };
    }
    if (unit === '%') {
      return val => (val ? val.replace(' %', '') : '');
    }
  };

  render() {
    const {
      getFormControlRef,
      value,
      onChange,
      interactive,
      bordered,
      className,
      unit,
      parser,
      formatter,
      hideEditIcon,
      onEditIconClick,
      placeholder,
      iconType,
      hoverAppealIcon,
      hoverIconType,
      ...rest
    } = this.props;
    const { size } = rest;

    const usefulFormatter = this.getFormatter(unit, formatter);

    const usefulParser = this.getParser(unit, parser);

    return interactive ? (
      <InputNumber
        {...rest}
        formatter={usefulFormatter}
        parser={usefulParser}
        value={value}
        onChange={onChange}
        ref={getFormControlRef}
        className={classNames(`tongyu-input-number-plus`, className, size, {
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
        value={usefulFormatter?.(value) || value}
        placeholder={placeholder}
        onEditIconClick={onEditIconClick}
        hideEditIcon={hideEditIcon}
      />
    );
  }
}

export default InputNumberPlus;
