import { Button, Input as AntInput } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { MouseEvent, MouseEventHandler, PureComponent } from 'react';
import InputNumber, { AllInputProps } from '../_Form2/Input';

export interface IInputButtonEvent extends MouseEvent {
  inputValue?: any;
}

export type IInputButtonOnClick = MouseEventHandler<IInputButtonEvent>;

export interface IInputButtonProps {
  input?: AllInputProps;
  onClick?: IInputButtonOnClick;
  disabled?: boolean;
}

export type InputButtonProps = ButtonProps & IInputButtonProps;

class InputButton extends PureComponent<InputButtonProps> {
  public static defaultProps = {
    input: {
      type: 'input',
    },
  };

  public state = {
    inputValue: undefined,
  };

  public onClick = event => {
    if (this.props.onClick) {
      this.props.onClick({ ...event, inputValue: this.state.inputValue });
    }
  };

  public onChangeValue = value => {
    this.setState({ inputValue: value });
  };

  public render() {
    const { children, style, input, disabled, ...restButtonProps } = this.props;
    return (
      <AntInput.Group compact={true}>
        <div style={{ display: 'flex' }}>
          <InputNumber
            {...input}
            disabled={disabled}
            value={this.state.inputValue}
            onChangeValue={this.onChangeValue}
          />
          <Button
            {...restButtonProps}
            disabled={disabled}
            style={{ ...style, marginLeft: -1 }}
            onClick={this.onClick}
          >
            {this.props.children}
          </Button>
        </div>
      </AntInput.Group>
    );
  }
}

export default InputButton;
