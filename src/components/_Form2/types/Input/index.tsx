import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { omit } from 'lodash';
import React from 'react';
import ShowInput, { FunctionShowInputProps } from '../subtypes/ShowInput';
import StaticInput, { StaticInputProps } from '../subtypes/StaticInput';

export type ISize = 'large' | 'default' | 'small';

export type IInputSubtypes = 'editing' | 'show' | 'static';

export interface InputGeneralProps {
  value?: any;
  onChange?(...params: any[]): any;
}

export interface InputCommonProps extends InputGeneralProps {
  subtype?: IInputSubtypes;
  className?: string;
  formatValue?: (value: any) => string | React.ReactNode;
  parseValue?(value: any): any;
  onChangeValue?(value: any): void;
  getValue?(...params: any[]): any;
  formatChangeEvent?(event: any): { origin: any; normal: any };
}

export interface Input2Props extends InputProps {
  inputType?: string;
}

export abstract class InputCommonClass<T, S = any> extends React.PureComponent<
  (FunctionShowInputProps | StaticInputProps | InputCommonProps) & T,
  S
> {
  public abstract formatValue(value: any): any;

  public abstract parseValue(value: any): any;

  public abstract formatChangeEvent(...params: any[]): { origin: any; normal: any };

  public abstract renderChild(
    omitedProps: any,
    onChange: (...params: any[]) => any
  ): React.ReactNode;

  public _getChangedValue = event => {
    if ('formatChangeEvent' in this.props) {
      return this.props.formatChangeEvent(event);
    }
    return this.formatChangeEvent(event);
  };

  public _formatValue = value => {
    if ('formatValue' in this.props) {
      return this.props.formatValue(value);
    }

    return this.formatValue(value);
  };

  public _onChange = event => {
    const { origin, normal } = this._getChangedValue(event);
    if ('onChange' in this.props) {
      this.props.onChange(origin);
    }
    if ('onChangeValue' in this.props) {
      this.props.onChangeValue(normal);
    }
  };

  public _parseValue = () => {
    if ('parseValue' in this.props) {
      return this.props.parseValue(this.props.value);
    }
    return this.parseValue(this.props.value);
  };

  public getChildProps = omitedProps => {
    if ('value' in this.props) {
      return { ...omitedProps, value: this._parseValue() };
    }
    return omitedProps;
  };

  public render() {
    const omitedProps = omit(this.props, ['formatValue', 'onChangeValue', 'subtype', 'getValue']);

    if ('subtype' in this.props) {
      const { subtype } = this.props;

      if (subtype === 'show') {
        return <ShowInput {...omitedProps} value={this._formatValue(this._parseValue())} />;
      }

      if (subtype === 'static') {
        return <StaticInput {...omitedProps} value={this._formatValue(this._parseValue())} />;
      }
    }

    return this.renderChild(this.getChildProps(omitedProps), this._onChange);
  }
}

// tslint:disable-next-line:max-classes-per-file
class Input2 extends InputCommonClass<Input2Props> {
  public formatValue = (value): string => {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    if (typeof value === 'number') {
      return String(value);
    }
    return value;
  };

  public formatChangeEvent = event => {
    return {
      origin: event,
      normal: event.target.value,
    };
  };

  public parseValue = value => {
    return value;
  };

  public renderChild(props, onChange) {
    const { autoFocus, inputType, ...rest } = props;
    return (
      <Input
        ref={$inputNode => {
          if (autoFocus) {
            setTimeout(() => {
              if ($inputNode) {
                try {
                  $inputNode.focus();
                } catch (error) {
                  console.warn(error);
                }
              }
            }, 0);
          }
        }}
        {...rest}
        type={inputType}
        onChange={onChange}
      />
    );
  }
}

export default Input2;
