import PopoverContainer from '@/components/ButtonPlus/PopoverContainer';
import InputControl from '@/components/_InputControl';
import Loading from '@/components/_Loading';
import { Button, Dropdown, Icon, Input } from 'antd';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import './index.less';
import { ButtonPlus as types } from './types';

const InputGroup = Input.Group;

class ButtonPlus extends PureComponent {
  static propTypes = types;

  static defaultProps = {};

  state = {
    beforeFormControlValue: undefined,
    afterFormControlValue: undefined,
  };

  getProxyState = () => {
    const { state, props } = this;
    return {
      beforeFormControlValue: props.addonBeforeFormControl?.value || state.beforeFormControlValue,
      afterFormControlValue: props.addonAfterFormControl?.value || state.afterFormControlValue,
    };
  };

  handleButtonClick = nativeEvent => {
    const { beforeFormControlValue, afterFormControlValue } = this.getProxyState();
    const { name, onClick } = this.props;

    onClick?.({
      name,
      nativeEvent,
      beforeFormControlValue,
      afterFormControlValue,
    });
  };

  handleBeforeFormChange = event => {
    const { addonBeforeFormControl } = this.props;
    const { value } = event;

    addonBeforeFormControl?.onChange?.(value);

    addonBeforeFormControl?.value ||
      this.setState({
        beforeFormControlValue: value,
      });
  };

  handleAfterFormChange = event => {
    const { addonAfterFormControl } = this.props;
    const { value } = event;

    addonAfterFormControl?.onChange?.(value);

    addonAfterFormControl?.value ||
      this.setState({
        afterFormControlValue: value,
      });
  };

  getInputGroup = ({ button, after, before }) => {
    return (
      <InputGroup compact style={{ width: '100%' }}>
        <div style={{ display: 'flex' }}>
          {before}
          {button}
          {after}
        </div>
      </InputGroup>
    );
  };

  getButtonDropMenu = () => {
    const {
      text,
      name,
      dropMenu,
      addonBeforeFormControl,
      addonAfterFormControl,
      onClick,
      ...buttonProps
    } = this.props;

    const { loading, disabled } = buttonProps;

    if (text) {
      return loading ? (
        <Loading />
      ) : (
        <span
          className={classNames('tongyu-button-plus-text', {
            disabled,
          })}
          onClick={this.handleButtonClick}
        >
          {name}
        </span>
      );
    }

    if (dropMenu) {
      return (
        <Dropdown overlay={dropMenu}>
          <Button {...buttonProps} onClick={this.handleButtonClick}>
            {name}
            <Icon type="down" />
          </Button>
        </Dropdown>
      );
    }

    return (
      <Button {...buttonProps} onClick={this.handleButtonClick}>
        {name}
      </Button>
    );
  };

  getButtonPopover = () => {
    const { popover } = this.props;

    if (popover) {
      return (
        <PopoverContainer trigger={['click']} {...popover}>
          {this.getButtonDropMenu()}
        </PopoverContainer>
      );
    }

    return this.getButtonDropMenu();
  };

  getButton = () => {
    const { beforeFormControlValue, afterFormControlValue } = this.state;
    const { addonBeforeFormControl, addonAfterFormControl } = this.props;

    if (addonBeforeFormControl || addonAfterFormControl) {
      return this.getInputGroup({
        button: this.getButtonPopover(),
        before: addonBeforeFormControl && (
          <InputControl
            value={beforeFormControlValue}
            {...addonBeforeFormControl}
            style={{ borderRight: 'none' }}
            onChangePlus={this.handleBeforeFormChange}
          />
        ),
        after: addonAfterFormControl && (
          <InputControl
            value={afterFormControlValue}
            {...addonAfterFormControl}
            style={{ borderLeft: 'none' }}
            onChangePlus={this.handleAfterFormChange}
          />
        ),
      });
    }

    return this.getButtonPopover();
  };

  render() {
    return <div className="tongyu-button-plus">{this.getButton()}</div>;
  }
}

export default ButtonPlus;
